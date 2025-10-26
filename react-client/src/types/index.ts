export interface Asset {
  id: string
  title: string
  description: string
  imageUrl: string
  isPremium: boolean
  price?: number // in MIST (1 SUI = 1,000,000,000 MIST)
  content: string
  createdAt: Date
  author: string
}

export interface PaymentResult {
  success: boolean
  digest?: string
  error?: string
}

export interface WalletState {
  address: string | null
  balance: bigint
  isConnected: boolean
}
