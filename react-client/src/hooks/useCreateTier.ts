import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

interface CreateTierParams {
  name: string;
  description: string;
  priceInSui: number; // Will be converted to MIST
  durationDays: number;
}

export function useCreateTier() {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const client = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateTierParams) => {
      if (!account) {
        throw new Error('No wallet connected');
      }

      const packageId = import.meta.env.VITE_MARKETPLACE_PACKAGE_ID;
      const marketplaceId = import.meta.env.VITE_MARKETPLACE_OBJECT_ID;

      if (!packageId || !marketplaceId) {
        throw new Error('Missing environment variables');
      }

      // Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
      const priceInMist = Math.floor(params.priceInSui * 1_000_000_000);

      console.log('Creating tier:', {
        name: params.name,
        priceInSui: params.priceInSui,
        priceInMist,
        durationDays: params.durationDays
      });

      const tx = new Transaction();

      // Encode strings as bytes for Move
      const nameBytes = Array.from(new TextEncoder().encode(params.name));
      const descBytes = Array.from(new TextEncoder().encode(params.description));

      tx.moveCall({
        target: `${packageId}::subscription_tier::create_tier`,
        arguments: [
          tx.object(marketplaceId),
          tx.pure.vector('u8', nameBytes),
          tx.pure.vector('u8', descBytes),
          tx.pure.u64(priceInMist),
          tx.pure.u64(params.durationDays),
          tx.object('0x6') // Clock object
        ]
      });

      const result = await signAndExecute({ transaction: tx });

      console.log('Transaction submitted:', result.digest);

      await client.waitForTransaction({
        digest: result.digest,
        options: { showEffects: true }
      });

      console.log('Tier created successfully!');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
      queryClient.invalidateQueries({ queryKey: ['creator-tiers'] });
    }
  });
}
