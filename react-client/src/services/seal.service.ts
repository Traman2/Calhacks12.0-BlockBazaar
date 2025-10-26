/**
 * Seal Encryption Service
 * Handles encryption and decryption of content using Seal
 * Simplified implementation using AES-GCM (browser crypto API)
 */

interface EncryptResult {
  encryptedData: Blob;
  policyId: string;
}

export class SealService {
  /**
   * Encrypt content for a specific tier
   *
   * In production, this would use Seal SDK with threshold encryption.
   * For MVP, we use browser crypto API with a policy-based key derivation.
   */
  async encrypt(
    content: Blob,
    tierId: string,
    creatorAddress: string
  ): Promise<EncryptResult> {
    try {
      console.log('Encrypting content with Seal');

      // Generate policy ID
      const policyId = `seal_policy_${tierId}_${creatorAddress.slice(0, 8)}`;

      // Derive encryption key from policy ID
      const encoder = new TextEncoder();
      const policyData = encoder.encode(policyId);
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        policyData,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('sui-marketplace-salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );

      // Encrypt content
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const contentBuffer = await content.arrayBuffer();

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        contentBuffer
      );

      // Combine IV + encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encrypted), iv.length);

      console.log('Content encrypted successfully');

      return {
        encryptedData: new Blob([combined]),
        policyId
      };
    } catch (error) {
      console.error('Seal encryption error:', error);
      throw error;
    }
  }

  /**
   * Decrypt content if user has access
   *
   * In production, this would verify subscription on-chain via Seal.
   * For MVP, we derive the key from policy ID.
   */
  async decrypt(
    encryptedData: Blob,
    policyId: string
  ): Promise<Blob> {
    try {
      console.log('Decrypting content with Seal');

      // Derive decryption key
      const encoder = new TextEncoder();
      const policyData = encoder.encode(policyId);
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        policyData,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('sui-marketplace-salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );

      // Extract IV and encrypted data
      const buffer = await encryptedData.arrayBuffer();
      const combined = new Uint8Array(buffer);
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      // Decrypt
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      console.log('Content decrypted successfully');

      return new Blob([decrypted]);
    } catch (error) {
      console.error('Seal decryption error:', error);
      throw error;
    }
  }
}
