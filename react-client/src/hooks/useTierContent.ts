import { useQuery } from '@tanstack/react-query';
import { useSuiClient } from '@mysten/dapp-kit';

export interface TierContent {
  id: string;
  tierId: string;
  creator: string;
  title: string;
  description: string;
  walrusBlobId: string;
  sealPolicyId: string;
  contentType: string;
  sizeBytes: number;
  createdAt: number;
}

/**
 * Hook to fetch all content for a specific tier
 */
export function useTierContent(tierId?: string) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ['tier-content', tierId],
    queryFn: async (): Promise<TierContent[]> => {
      if (!tierId) return [];

      const packageId = import.meta.env.VITE_MARKETPLACE_PACKAGE_ID;

      if (!packageId) {
        console.error('VITE_MARKETPLACE_PACKAGE_ID not set');
        return [];
      }

      try {
        // Query all Content objects for this tier
        const result = await client.queryEvents({
          query: {
            MoveEventType: `${packageId}::content_registry::Content`
          }
        });

        // In production, we'd query Content objects by tier_id
        // For now, we'll get all shared Content objects and filter

        // This is a workaround - ideally we'd have a better indexing solution
        // For MVP, we can fetch objects by searching for Content objects

        // Return empty for now - will be populated when content is registered
        return [];
      } catch (error) {
        console.error('Error fetching tier content:', error);
        return [];
      }
    },
    enabled: !!tierId,
    refetchInterval: 10000
  });
}

/**
 * Hook to get content by its object ID
 */
export function useContent(contentId?: string) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ['content', contentId],
    queryFn: async (): Promise<TierContent | null> => {
      if (!contentId) return null;

      try {
        const obj = await client.getObject({
          id: contentId,
          options: { showContent: true }
        });

        if (!obj.data?.content || obj.data.content.dataType !== 'moveObject') {
          return null;
        }

        const f = obj.data.content.fields as Record<string, unknown>;

        return {
          id: obj.data.objectId,
          tierId: String(f.tier_id || ''),
          creator: String(f.creator || ''),
          title: String(f.title || ''),
          description: String(f.description || ''),
          walrusBlobId: String(f.walrus_blob_id || ''),
          sealPolicyId: String(f.seal_policy_id || ''),
          contentType: String(f.content_type || ''),
          sizeBytes: Number(f.size_bytes || 0),
          createdAt: Number(f.created_at || Date.now())
        };
      } catch (error) {
        console.error('Error fetching content:', error);
        return null;
      }
    },
    enabled: !!contentId
  });
}
