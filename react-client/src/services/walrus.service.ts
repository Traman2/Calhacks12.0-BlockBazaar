/**
 * Walrus Storage Service
 * Handles uploading and downloading blobs to/from Walrus decentralized storage
 *
 * API Endpoints:
 * - Publisher (Store): PUT /v1/blobs
 * - Aggregator (Read): GET /v1/blobs/<blob-id>
 *
 * Testnet URLs:
 * - Publisher: https://publisher.walrus-testnet.walrus.space
 * - Aggregator: https://aggregator.walrus-testnet.walrus.space
 *
 * Documentation: https://docs.wal.app/usage/web-api.html
 */

interface WalrusUploadResult {
  blobId: string;
  size: number;
}

export class WalrusService {
  private publisherUrl: string;
  private aggregatorUrl: string;

  constructor() {
    this.publisherUrl = import.meta.env.VITE_WALRUS_PUBLISHER_URL || 'https://publisher.walrus-testnet.walrus.space';
    this.aggregatorUrl = import.meta.env.VITE_WALRUS_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space';
  }

  /**
   * Upload a file to Walrus storage
   * Note: Most testnet publishers limit uploads to 10 MiB by default
   */
  async upload(file: Blob): Promise<WalrusUploadResult> {
    try {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      console.log('Uploading to Walrus:', {
        size: file.size,
        sizeMB: `${sizeMB} MB`,
        type: file.type,
        publisher: this.publisherUrl
      });

      // Check file size (10 MiB = 10,485,760 bytes)
      if (file.size > 10 * 1024 * 1024) {
        console.warn('⚠️  File size exceeds 10 MiB. Most testnet publishers may reject this upload.');
      }

      const response = await fetch(`${this.publisherUrl}/v1/blobs`, {
        method: 'PUT',
        body: file
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        console.error('Walrus upload error response:', errorText);
        throw new Error(`Walrus upload failed (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log('Walrus response:', JSON.stringify(result, null, 2));

      // Extract blob ID from response
      // Response format can be:
      // { newlyCreated: { blobObject: { blobId: "..." } } }
      // or
      // { alreadyCertified: { blobId: "..." } }
      const blobId = result.newlyCreated?.blobObject?.blobId ||
                     result.alreadyCertified?.blobId;

      if (!blobId) {
        console.error('Unexpected Walrus response format:', result);
        throw new Error('No blob ID in Walrus response');
      }

      console.log('✓ Walrus upload successful! Blob ID:', blobId);

      return {
        blobId,
        size: file.size
      };
    } catch (error) {
      console.error('Walrus upload error:', error);
      throw error;
    }
  }

  /**
   * Download a file from Walrus storage
   */
  async download(blobId: string): Promise<Blob> {
    try {
      console.log('Downloading from Walrus:', {
        blobId,
        aggregator: this.aggregatorUrl
      });

      const response = await fetch(`${this.aggregatorUrl}/v1/blobs/${blobId}`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        console.error('Walrus download error response:', errorText);
        throw new Error(`Walrus download failed (${response.status}): ${errorText}`);
      }

      const blob = await response.blob();
      console.log('Walrus download successful:', {
        size: blob.size,
        type: blob.type
      });

      return blob;
    } catch (error) {
      console.error('Walrus download error:', error);
      throw error;
    }
  }

  /**
   * Check if a blob exists
   */
  async exists(blobId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.aggregatorUrl}/v1/blobs/${blobId}`, {
        method: 'HEAD'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
