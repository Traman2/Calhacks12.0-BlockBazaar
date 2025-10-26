import { useQuery } from '@tanstack/react-query';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';

export interface UserSubscription {
  id: string;
  tierId: string;
  subscriber: string;
  expiresAt: number;
  isExpired: boolean;
}

/**
 * Hook to fetch all subscriptions owned by the current user
 */
export function useUserSubscriptions() {
  const client = useSuiClient();
  const account = useCurrentAccount();

  return useQuery({
    queryKey: ['user-subscriptions', account?.address],
    queryFn: async (): Promise<UserSubscription[]> => {
      if (!account) {
        return [];
      }

      const packageId = import.meta.env.VITE_MARKETPLACE_PACKAGE_ID;

      if (!packageId) {
        console.error('VITE_MARKETPLACE_PACKAGE_ID not set');
        return [];
      }

      try {
        // Get all objects owned by the user
        const objects = await client.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: `${packageId}::subscription_tier::Subscription`
          },
          options: {
            showContent: true,
            showType: true
          }
        });

        const subscriptions: UserSubscription[] = [];
        const now = Date.now();

        for (const obj of objects.data) {
          if (
            obj.data?.content &&
            obj.data.content.dataType === 'moveObject'
          ) {
            const fields = obj.data.content.fields as Record<string, unknown>;

            subscriptions.push({
              id: obj.data.objectId,
              tierId: String(fields.tier_id || ''),
              subscriber: String(fields.subscriber || ''),
              expiresAt: Number(fields.expires_at || 0),
              isExpired: Number(fields.expires_at || 0) < now
            });
          }
        }

        return subscriptions;
      } catch (error) {
        console.error('Error fetching user subscriptions:', error);
        return [];
      }
    },
    enabled: !!account,
    refetchInterval: 10000,
    staleTime: 5000
  });
}

/**
 * Hook to check if user has an active subscription to a specific tier
 */
export function useHasActiveSubscription(tierId?: string) {
  const { data: subscriptions = [] } = useUserSubscriptions();

  if (!tierId) return false;

  return subscriptions.some(
    sub => sub.tierId === tierId && !sub.isExpired
  );
}
