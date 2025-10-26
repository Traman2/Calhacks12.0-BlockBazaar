import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

interface PurchaseParams {
  tierId: string;
  priceInMist: string;
}

export function usePurchaseSubscription() {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const client = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: PurchaseParams) => {
      if (!account) {
        throw new Error('No wallet connected');
      }

      const packageId = import.meta.env.VITE_MARKETPLACE_PACKAGE_ID;
      const marketplaceId = import.meta.env.VITE_MARKETPLACE_OBJECT_ID;

      if (!packageId || !marketplaceId) {
        throw new Error('Missing environment variables');
      }

      console.log('Purchasing subscription:', {
        tierId: params.tierId,
        price: params.priceInMist,
        priceInSui: Number(params.priceInMist) / 1_000_000_000
      });

      const tx = new Transaction();

      // Split coins for payment
      const [paymentCoin] = tx.splitCoins(tx.gas, [params.priceInMist]);

      tx.moveCall({
        target: `${packageId}::subscription_tier::purchase_subscription`,
        arguments: [
          tx.object(marketplaceId),
          tx.pure.id(params.tierId),
          paymentCoin,
          tx.object('0x6') // Clock
        ]
      });

      const result = await signAndExecute({ transaction: tx });

      console.log('Transaction submitted:', result.digest);

      await client.waitForTransaction({
        digest: result.digest,
        options: { showEffects: true }
      });

      console.log('Subscription purchased!');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
      queryClient.invalidateQueries({ queryKey: ['tier'] });
    }
  });
}
