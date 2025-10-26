import { useState } from 'react'
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import type { PaymentResult } from '../types'

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction()
  const suiClient = useSuiClient()
  const currentAccount = useCurrentAccount()

  const processPayment = async (
    recipientAddress: string,
    amount: number // in MIST
  ): Promise<PaymentResult> => {
    setIsProcessing(true)

    try {
      if (!currentAccount) {
        throw new Error('No wallet connected')
      }

      // Create transaction
      const tx = new Transaction()

      // Set the sender explicitly
      tx.setSender(currentAccount.address)

      // Get user's SUI coins to check balance first
      const coins = await suiClient.getCoins({
        owner: currentAccount.address,
        coinType: '0x2::sui::SUI',
      })

      if (coins.data.length === 0) {
        throw new Error('No SUI coins found in your wallet. Please get test SUI from the faucet.')
      }

      // Calculate total balance
      const totalBalance = coins.data.reduce((acc, coin) => acc + BigInt(coin.balance), BigInt(0))

      if (totalBalance < BigInt(amount)) {
        throw new Error(`Insufficient SUI balance. You need ${(amount / 1000000000).toFixed(2)} SUI`)
      }

      // Create a coin with the exact amount needed
      // This will merge and split coins automatically if needed
      const [paymentCoin] = tx.splitCoins(tx.gas, [amount])

      // Transfer the payment coin to recipient
      tx.transferObjects([paymentCoin], recipientAddress)

      // Execute transaction - THIS WILL OPEN YOUR WALLET
      console.log('Opening wallet for approval...')
      const result = await signAndExecute({
        transaction: tx,
      })

      console.log('Transaction submitted:', result.digest)

      // Wait for transaction to be confirmed
      await suiClient.waitForTransaction({
        digest: result.digest,
      })

      console.log('Transaction confirmed!')
      setIsProcessing(false)

      return {
        success: true,
        digest: result.digest,
      }
    } catch (error) {
      setIsProcessing(false)
      console.error('Payment failed:', error)

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed. Please try again.',
      }
    }
  }

  return {
    processPayment,
    isProcessing,
  }
}
