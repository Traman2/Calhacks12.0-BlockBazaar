import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { WalrusService } from '../services/walrus.service';
import { SealService } from '../services/seal.service';

interface UploadContentParams {
  tierId: string;
  title: string;
  description: string;
  file: File;
  onProgress?: (stage: string, progress: number) => void;
}

export function useContentUpload() {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const client = useSuiClient();
  const queryClient = useQueryClient();

  const walrus = new WalrusService();
  const seal = new SealService();

  return useMutation({
    mutationFn: async (params: UploadContentParams) => {
      if (!account) {
        throw new Error('No wallet connected');
      }

      const packageId = import.meta.env.VITE_MARKETPLACE_PACKAGE_ID;
      const marketplaceId = import.meta.env.VITE_MARKETPLACE_OBJECT_ID;

      if (!packageId || !marketplaceId) {
        throw new Error('Missing environment variables');
      }

      try {
        console.log('Starting content upload for tier:', params.tierId);

        // Step 1: Encrypt with Seal
        params.onProgress?.('Encrypting with Seal...', 20);
        const { encryptedData, policyId } = await seal.encrypt(
          params.file,
          params.tierId,
          account.address
        );
        console.log('✓ Content encrypted with policy:', policyId);

        // Step 2: Upload to Walrus
        params.onProgress?.('Uploading to Walrus decentralized storage...', 50);
        const { blobId, size } = await walrus.upload(encryptedData);
        console.log('✓ Content uploaded to Walrus, blob ID:', blobId);

        // Step 3: Register on blockchain
        params.onProgress?.('Registering content on Sui blockchain...', 80);

        const tx = new Transaction();

        const titleBytes = Array.from(new TextEncoder().encode(params.title));
        const descBytes = Array.from(new TextEncoder().encode(params.description));
        const blobIdBytes = Array.from(new TextEncoder().encode(blobId));
        const policyIdBytes = Array.from(new TextEncoder().encode(policyId));
        const contentTypeBytes = Array.from(new TextEncoder().encode(params.file.type));

        tx.moveCall({
          target: `${packageId}::content_registry::register_content`,
          arguments: [
            tx.object(params.tierId), // Tier object (shared)
            tx.pure.vector('u8', titleBytes),
            tx.pure.vector('u8', descBytes),
            tx.pure.vector('u8', blobIdBytes),
            tx.pure.vector('u8', policyIdBytes),
            tx.pure.vector('u8', contentTypeBytes),
            tx.pure.u64(size),
            tx.object('0x6') // Clock
          ]
        });

        const result = await signAndExecute({ transaction: tx });
        console.log('Transaction submitted:', result.digest);

        const txResult = await client.waitForTransaction({
          digest: result.digest,
          options: { showEffects: true, showObjectChanges: true }
        });

        console.log('Transaction effects:', txResult.effects);
        console.log('Transaction status:', txResult.effects?.status);

        // Check if transaction succeeded
        if (txResult.effects?.status?.status !== 'success') {
          const error = txResult.effects?.status?.error || 'Unknown error';
          console.error('Transaction failed:', error);
          throw new Error(`Blockchain registration failed: ${error}`);
        }

        console.log('Object changes:', txResult.objectChanges);

        params.onProgress?.('Complete', 100);

        console.log('✓ Content uploaded and linked to tier successfully!');

        return {
          blobId,
          policyId,
          txDigest: result.digest
        };
      } catch (error) {
        console.error('Content upload error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tier'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
    }
  });
}
