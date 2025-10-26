import { useQuery } from '@tanstack/react-query';
import { useSuiClient } from '@mysten/dapp-kit';

export interface Tier {
  id: string;
  creator: string;
  name: string;
  description: string;
  price: string; // in MIST
  durationDays: number;
  subscriberCount: number;
  contentIds: string[];
  isActive: boolean;
  createdAt: number;
}

/**
 * Hook to fetch all tiers from marketplace
 */
export function useMarketplace() {
  const client = useSuiClient();

  return useQuery({
    queryKey: ['marketplace', 'all-tiers'],
    queryFn: async (): Promise<Tier[]> => {
      const marketplaceId = import.meta.env.VITE_MARKETPLACE_OBJECT_ID;

      if (!marketplaceId) {
        console.error('VITE_MARKETPLACE_OBJECT_ID not set');
        return [];
      }

      try {
        // Get marketplace object
        const marketplace = await client.getObject({
          id: marketplaceId,
          options: { showContent: true }
        });

        if (!marketplace.data?.content || marketplace.data.content.dataType !== 'moveObject') {
          return [];
        }

        const fields = marketplace.data.content.fields as { tier_ids?: string[] };
        const tierIds = fields.tier_ids || [];

        if (tierIds.length === 0) {
          return [];
        }

        // Fetch all tiers
        const tiers = await Promise.all(
          tierIds.map(async (id) => {
            try {
              const obj = await client.getObject({
                id,
                options: { showContent: true }
              });

              if (!obj.data?.content || obj.data.content.dataType !== 'moveObject') {
                return null;
              }

              const f = obj.data.content.fields as Record<string, unknown>;

              return {
                id: obj.data.objectId,
                creator: String(f.creator || ''),
                name: String(f.name || ''),
                description: String(f.description || ''),
                price: String(f.price || '0'),
                durationDays: Number(f.duration_days || 0),
                subscriberCount: Number(f.subscriber_count || 0),
                contentIds: (f.content_ids as string[]) || [],
                isActive: f.is_active !== false,
                createdAt: Number(f.created_at || Date.now())
              };
            } catch {
              return null;
            }
          })
        );

        return tiers.filter((t): t is Tier => t !== null);
      } catch (error) {
        console.error('Error fetching marketplace:', error);
        return [];
      }
    },
    refetchInterval: 10000,
    staleTime: 5000
  });
}

/**
 * Hook to fetch a single tier by ID
 */
export function useTier(tierId?: string) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ['tier', tierId],
    queryFn: async (): Promise<Tier | null> => {
      if (!tierId) return null;

      try {
        const obj = await client.getObject({
          id: tierId,
          options: { showContent: true }
        });

        if (!obj.data?.content || obj.data.content.dataType !== 'moveObject') {
          return null;
        }

        const f = obj.data.content.fields as Record<string, unknown>;

        return {
          id: obj.data.objectId,
          creator: String(f.creator || ''),
          name: String(f.name || ''),
          description: String(f.description || ''),
          price: String(f.price || '0'),
          durationDays: Number(f.duration_days || 0),
          subscriberCount: Number(f.subscriber_count || 0),
          contentIds: (f.content_ids as string[]) || [],
          isActive: f.is_active !== false,
          createdAt: Number(f.created_at || Date.now())
        };
      } catch (error) {
        console.error('Error fetching tier:', error);
        return null;
      }
    },
    enabled: !!tierId
  });
}

/**
 * Hook to fetch tiers created by a specific address
 */
export function useCreatorTiers(creatorAddress?: string) {
  const { data: allTiers, isLoading } = useMarketplace();

  return useQuery({
    queryKey: ['creator-tiers', creatorAddress],
    queryFn: async () => {
      if (!creatorAddress || !allTiers) return [];
      return allTiers.filter(tier => tier.creator === creatorAddress);
    },
    enabled: !!creatorAddress && !isLoading
  });
}
