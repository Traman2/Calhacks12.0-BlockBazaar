# Sui Patreon-Like DApp - Implementation Guide

A decentralized content subscription platform built on Sui blockchain with wallet integration, authentication, and payment system. Users can view free content and pay with SUI coins to access premium encrypted content (future integration with Seal API).

## 🎯 Project Overview

This starter implementation focuses on:
- Sui wallet integration (@mysten/dapp-kit)
- Authentication using wallet connection
- Payment system for premium content access
- 10 hardcoded assets (5 free, 5 premium)
- React Router DOM for navigation
- Tailwind CSS v4.1 for styling
- Component-based architecture

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Basic understanding of React and TypeScript
- Sui wallet extension installed (Sui Wallet, Suiet, or Ethos)
- Sui testnet/devnet account with test SUI tokens

## 🚀 Getting Started

### Step 1: Create React Project

```bash
# Using Vite (recommended)
npm create vite@latest sui-patreon-app -- --template react-ts
cd sui-patreon-app

# Or use the Sui scaffold
pnpm create @mysten/dapp --template react-client-dapp
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install @mysten/dapp-kit @mysten/sui @tanstack/react-query

# Routing
npm install react-router-dom

# Tailwind CSS v4.1
npm install tailwindcss@latest @tailwindcss/vite

# Optional: Icons
npm install lucide-react
```

### Step 3: Configure Tailwind CSS v4.1

Create `src/index.css`:

```css
@import "tailwindcss";

@theme {
  /* Custom fonts */
  --font-sans: "Inter", sans-serif;
  
  /* Custom colors for your brand */
  --color-brand-50: oklch(0.98 0.02 250);
  --color-brand-100: oklch(0.95 0.05 250);
  --color-brand-500: oklch(0.6 0.2 250);
  --color-brand-600: oklch(0.5 0.22 250);
  --color-brand-700: oklch(0.4 0.24 250);
  
  /* Premium content accent */
  --color-premium-400: oklch(0.75 0.18 60);
  --color-premium-500: oklch(0.65 0.2 60);
}

/* Base styles */
@layer base {
  * {
    @apply border-gray-200;
  }
  
  body {
    @apply bg-white text-gray-900 antialiased;
  }
}
```

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

## 🏗️ Project Structure

```
src/
├── main.tsx                 # Entry point with providers
├── App.tsx                  # Main app component with routing
├── index.css               # Tailwind CSS configuration
├── pages/
│   ├── Login.tsx           # Login/landing page
│   ├── Dashboard.tsx       # Main dashboard with assets
│   └── NotFound.tsx        # 404 page
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Navigation bar with wallet connect
│   │   └── Footer.tsx      # Footer component
│   ├── wallet/
│   │   ├── ConnectButton.tsx    # Custom wallet connect button
│   │   └── WalletInfo.tsx       # Display wallet info
│   ├── content/
│   │   ├── AssetCard.tsx        # Individual asset card
│   │   ├── AssetGrid.tsx        # Grid of assets
│   │   └── PremiumBadge.tsx     # Premium indicator
│   └── payment/
│       ├── PaymentModal.tsx     # Payment confirmation modal
│       └── PaymentButton.tsx    # Trigger payment
├── hooks/
│   ├── usePayment.ts       # Payment transaction hook
│   └── useAssets.ts        # Asset management hook
├── services/
│   ├── sui.service.ts      # Sui blockchain interactions
│   └── assets.service.ts   # Asset data management
├── types/
│   └── index.ts            # TypeScript type definitions
└── config/
    └── sui.config.ts       # Sui network configuration
```

## 📝 Implementation Steps

### 1. Configure Sui Providers (src/main.tsx)

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import '@mysten/dapp-kit/dist/index.css'
import './index.css'
import App from './App'

// Create React Query client
const queryClient = new QueryClient()

// Configure Sui networks
const networks = {
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="devnet">
        <WalletProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
```

### 2. Setup Routing (src/App.tsx)

```typescript
import { Routes, Route, Navigate } from 'react-router-dom'
import { useCurrentAccount } from '@mysten/dapp-kit'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

function App() {
  const currentAccount = useCurrentAccount()

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          currentAccount ? <Navigate to="/dashboard" replace /> : <Login />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          currentAccount ? <Dashboard /> : <Navigate to="/" replace />
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
```

### 3. Type Definitions (src/types/index.ts)

```typescript
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
```

### 4. Asset Service (src/services/assets.service.ts)

```typescript
import { Asset } from '../types'

// Hardcoded assets (5 free, 5 premium)
export const MOCK_ASSETS: Asset[] = [
  // Free Assets
  {
    id: '1',
    title: 'Introduction to Sui Blockchain',
    description: 'Learn the basics of Sui blockchain technology',
    imageUrl: 'https://picsum.photos/seed/sui1/400/300',
    isPremium: false,
    content: 'This is free content about Sui blockchain fundamentals...',
    createdAt: new Date('2024-01-01'),
    author: 'Sui Foundation'
  },
  {
    id: '2',
    title: 'Getting Started with Move',
    description: 'Basic Move programming concepts',
    imageUrl: 'https://picsum.photos/seed/sui2/400/300',
    isPremium: false,
    content: 'Free tutorial on Move programming language...',
    createdAt: new Date('2024-01-05'),
    author: 'Move Developers'
  },
  {
    id: '3',
    title: 'Wallet Setup Guide',
    description: 'How to set up your Sui wallet',
    imageUrl: 'https://picsum.photos/seed/sui3/400/300',
    isPremium: false,
    content: 'Step-by-step guide to setting up Sui wallet...',
    createdAt: new Date('2024-01-10'),
    author: 'Community'
  },
  {
    id: '4',
    title: 'NFT Basics on Sui',
    description: 'Understanding NFTs on Sui',
    imageUrl: 'https://picsum.photos/seed/sui4/400/300',
    isPremium: false,
    content: 'Free introduction to NFTs on Sui blockchain...',
    createdAt: new Date('2024-01-15'),
    author: 'NFT Guild'
  },
  {
    id: '5',
    title: 'DeFi Overview',
    description: 'Introduction to DeFi on Sui',
    imageUrl: 'https://picsum.photos/seed/sui5/400/300',
    isPremium: false,
    content: 'Learn about DeFi protocols on Sui...',
    createdAt: new Date('2024-01-20'),
    author: 'DeFi Community'
  },
  
  // Premium Assets
  {
    id: '6',
    title: 'Advanced Move Programming',
    description: 'Master Move smart contracts',
    imageUrl: 'https://picsum.photos/seed/sui6/400/300',
    isPremium: true,
    price: 100000000, // 0.1 SUI
    content: '[ENCRYPTED] Advanced Move programming techniques...',
    createdAt: new Date('2024-02-01'),
    author: 'Expert Developer'
  },
  {
    id: '7',
    title: 'Building DApps on Sui',
    description: 'Complete DApp development course',
    imageUrl: 'https://picsum.photos/seed/sui7/400/300',
    isPremium: true,
    price: 500000000, // 0.5 SUI
    content: '[ENCRYPTED] Full-stack DApp development...',
    createdAt: new Date('2024-02-05'),
    author: 'Blockchain Architect'
  },
  {
    id: '8',
    title: 'Security Best Practices',
    description: 'Secure your Sui applications',
    imageUrl: 'https://picsum.photos/seed/sui8/400/300',
    isPremium: true,
    price: 300000000, // 0.3 SUI
    content: '[ENCRYPTED] Security auditing and best practices...',
    createdAt: new Date('2024-02-10'),
    author: 'Security Expert'
  },
  {
    id: '9',
    title: 'Advanced Trading Strategies',
    description: 'Professional trading on Sui DEXs',
    imageUrl: 'https://picsum.photos/seed/sui9/400/300',
    isPremium: true,
    price: 1000000000, // 1 SUI
    content: '[ENCRYPTED] Advanced trading strategies and analysis...',
    createdAt: new Date('2024-02-15'),
    author: 'Trading Pro'
  },
  {
    id: '10',
    title: 'Enterprise Blockchain Solutions',
    description: 'Implement Sui in enterprise',
    imageUrl: 'https://picsum.photos/seed/sui10/400/300',
    isPremium: true,
    price: 2000000000, // 2 SUI
    content: '[ENCRYPTED] Enterprise-grade blockchain solutions...',
    createdAt: new Date('2024-02-20'),
    author: 'Enterprise Consultant'
  }
]

export class AssetsService {
  static getAllAssets(): Asset[] {
    return MOCK_ASSETS
  }

  static getFreeAssets(): Asset[] {
    return MOCK_ASSETS.filter(asset => !asset.isPremium)
  }

  static getPremiumAssets(): Asset[] {
    return MOCK_ASSETS.filter(asset => asset.isPremium)
  }

  static getAssetById(id: string): Asset | undefined {
    return MOCK_ASSETS.find(asset => asset.id === id)
  }

  // Simulate checking if user has access to premium content
  static hasAccess(assetId: string, purchasedAssets: string[]): boolean {
    const asset = this.getAssetById(assetId)
    if (!asset) return false
    if (!asset.isPremium) return true
    return purchasedAssets.includes(assetId)
  }
}
```

### 5. Payment Hook (src/hooks/usePayment.ts)

```typescript
import { useState } from 'react'
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import type { PaymentResult } from '../types'

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction()
  const suiClient = useSuiClient()

  const processPayment = async (
    recipientAddress: string,
    amount: number // in MIST
  ): Promise<PaymentResult> => {
    setIsProcessing(true)
    
    try {
      // Create transaction
      const tx = new Transaction()
      
      // Split coins from gas for payment
      const [coin] = tx.splitCoins(tx.gas, [amount])
      
      // Transfer to recipient
      tx.transferObjects([coin], recipientAddress)
      
      // Execute transaction
      const result = await signAndExecute({
        transaction: tx,
      })

      // Wait for transaction to be confirmed
      await suiClient.waitForTransaction({
        digest: result.digest,
      })

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
        error: error instanceof Error ? error.message : 'Payment failed',
      }
    }
  }

  return {
    processPayment,
    isProcessing,
  }
}
```

### 6. Login Page (src/pages/Login.tsx)

```typescript
import { ConnectButton } from '@mysten/dapp-kit'
import { Lock, Wallet, Shield } from 'lucide-react'

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-premium-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Welcome to Sui Content Hub
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Access premium content using SUI blockchain technology
            </p>
            
            <div className="flex justify-center">
              <ConnectButton className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors" />
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <FeatureCard
              icon={<Wallet className="size-12 text-brand-600" />}
              title="Connect Wallet"
              description="Use your Sui wallet to authenticate and make payments"
            />
            <FeatureCard
              icon={<Lock className="size-12 text-premium-500" />}
              title="Premium Content"
              description="Access exclusive encrypted content with SUI tokens"
            />
            <FeatureCard
              icon={<Shield className="size-12 text-green-600" />}
              title="Secure & Decentralized"
              description="Built on Sui blockchain for maximum security"
            />
          </div>

          {/* Sample Content Preview */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What's Available
            </h2>
            <div className="space-y-4">
              <ContentItem title="5 Free Resources" description="Learn blockchain basics" />
              <ContentItem title="5 Premium Courses" description="Advanced tutorials and guides" isPremium />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function ContentItem({ title, description, isPremium = false }: {
  title: string
  description: string
  isPremium?: boolean
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      {isPremium && (
        <span className="bg-premium-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Premium
        </span>
      )}
    </div>
  )
}
```

### 7. Dashboard Page (src/pages/Dashboard.tsx)

```typescript
import { useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import Navbar from '../components/layout/Navbar'
import AssetGrid from '../components/content/AssetGrid'
import { AssetsService } from '../services/assets.service'

export default function Dashboard() {
  const currentAccount = useCurrentAccount()
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all')
  const [purchasedAssets, setPurchasedAssets] = useState<string[]>([])

  const assets = {
    all: AssetsService.getAllAssets(),
    free: AssetsService.getFreeAssets(),
    premium: AssetsService.getPremiumAssets(),
  }[filter]

  const handlePurchaseSuccess = (assetId: string) => {
    setPurchasedAssets(prev => [...prev, assetId])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Address: <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              {currentAccount?.address.slice(0, 6)}...{currentAccount?.address.slice(-4)}
            </code>
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label="All Content"
            count={assets.length}
          />
          <FilterButton
            active={filter === 'free'}
            onClick={() => setFilter('free')}
            label="Free"
            count={AssetsService.getFreeAssets().length}
          />
          <FilterButton
            active={filter === 'premium'}
            onClick={() => setFilter('premium')}
            label="Premium"
            count={AssetsService.getPremiumAssets().length}
          />
        </div>

        {/* Assets Grid */}
        <AssetGrid 
          assets={assets} 
          purchasedAssets={purchasedAssets}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      </main>
    </div>
  )
}

function FilterButton({ 
  active, 
  onClick, 
  label, 
  count 
}: { 
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
        active
          ? 'bg-brand-600 text-white'
          : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label} ({count})
    </button>
  )
}
```

### 8. Asset Card Component (src/components/content/AssetCard.tsx)

```typescript
import { useState } from 'react'
import { Lock, CheckCircle } from 'lucide-react'
import type { Asset } from '../../types'
import PaymentModal from '../payment/PaymentModal'

interface AssetCardProps {
  asset: Asset
  hasAccess: boolean
  onPurchaseSuccess: (assetId: string) => void
}

export default function AssetCard({ asset, hasAccess, onPurchaseSuccess }: AssetCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const handleViewContent = () => {
    if (asset.isPremium && !hasAccess) {
      setShowPaymentModal(true)
    } else {
      setShowContent(true)
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={asset.imageUrl}
            alt={asset.title}
            className="w-full h-full object-cover"
          />
          {asset.isPremium && (
            <div className="absolute top-4 right-4">
              {hasAccess ? (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <CheckCircle className="size-4" />
                  Unlocked
                </span>
              ) : (
                <span className="bg-premium-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Lock className="size-4" />
                  Premium
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {asset.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {asset.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              by {asset.author}
            </span>
            {asset.isPremium && asset.price && (
              <span className="font-semibold text-brand-600">
                {(asset.price / 1000000000).toFixed(2)} SUI
              </span>
            )}
          </div>

          <button
            onClick={handleViewContent}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              asset.isPremium && !hasAccess
                ? 'bg-premium-500 hover:bg-premium-600 text-white'
                : 'bg-brand-600 hover:bg-brand-700 text-white'
            }`}
          >
            {asset.isPremium && !hasAccess ? 'Purchase Access' : 'View Content'}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          asset={asset}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            onPurchaseSuccess(asset.id)
            setShowPaymentModal(false)
            setShowContent(true)
          }}
        />
      )}

      {/* Content Modal */}
      {showContent && (
        <ContentModal
          asset={asset}
          onClose={() => setShowContent(false)}
        />
      )}
    </>
  )
}

function ContentModal({ asset, onClose }: { asset: Asset; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {asset.title}
          </h2>
          <div className="prose max-w-none">
            <p>{asset.content}</p>
          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
```

### 9. Payment Modal (src/components/payment/PaymentModal.tsx)

```typescript
import { useState } from 'react'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { usePayment } from '../../hooks/usePayment'
import type { Asset } from '../../types'

interface PaymentModalProps {
  asset: Asset
  onClose: () => void
  onSuccess: () => void
}

// Replace with your actual recipient address
const RECIPIENT_ADDRESS = '0x742d35cc6634c0532925a3b844bc9c7eb6fb48c7e0b6d2a0e6e9d89c3c4b4a5b'

export default function PaymentModal({ asset, onClose, onSuccess }: PaymentModalProps) {
  const { processPayment, isProcessing } = usePayment()
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handlePayment = async () => {
    if (!asset.price) return

    const result = await processPayment(RECIPIENT_ADDRESS, asset.price)

    if (result.success) {
      setPaymentStatus('success')
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } else {
      setPaymentStatus('error')
      setErrorMessage(result.error || 'Payment failed')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8">
        {paymentStatus === 'idle' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Purchase Premium Content
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{asset.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{asset.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Price:</span>
                <span className="text-2xl font-bold text-brand-600">
                  {asset.price && (asset.price / 1000000000).toFixed(2)} SUI
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Payment'
                )}
              </button>
            </div>
          </>
        )}

        {paymentStatus === 'success' && (
          <div className="text-center">
            <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">
              You now have access to this premium content.
            </p>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="text-center">
            <AlertCircle className="size-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <button
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
```

### 10. Navbar Component (src/components/layout/Navbar.tsx)

```typescript
import { ConnectButton, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit'
import { LogOut } from 'lucide-react'

export default function Navbar() {
  const currentAccount = useCurrentAccount()
  const { mutate: disconnect } = useDisconnectWallet()

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-brand-600">
              Sui Content Hub
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {currentAccount ? (
              <>
                <div className="text-sm text-gray-600">
                  {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
                </div>
                <button
                  onClick={() => disconnect()}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <LogOut className="size-4" />
                  Disconnect
                </button>
              </>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
```

### 11. Asset Grid Component (src/components/content/AssetGrid.tsx)

```typescript
import AssetCard from './AssetCard'
import type { Asset } from '../../types'
import { AssetsService } from '../../services/assets.service'

interface AssetGridProps {
  assets: Asset[]
  purchasedAssets: string[]
  onPurchaseSuccess: (assetId: string) => void
}

export default function AssetGrid({ assets, purchasedAssets, onPurchaseSuccess }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No assets found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map(asset => (
        <AssetCard
          key={asset.id}
          asset={asset}
          hasAccess={AssetsService.hasAccess(asset.id, purchasedAssets)}
          onPurchaseSuccess={onPurchaseSuccess}
        />
      ))}
    </div>
  )
}
```

## 🔧 Configuration

### Update Recipient Address

In `src/components/payment/PaymentModal.tsx`, replace the `RECIPIENT_ADDRESS` with your actual Sui address:

```typescript
const RECIPIENT_ADDRESS = 'YOUR_SUI_ADDRESS_HERE'
```

### Network Configuration

To switch networks, update `src/main.tsx`:

```typescript
// For mainnet
defaultNetwork="mainnet"

// For testnet
defaultNetwork="testnet"

// For devnet (recommended for development)
defaultNetwork="devnet"
```

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

### Get Test SUI Tokens

1. Visit [Sui Devnet Faucet](https://discord.gg/sui)
2. Go to #devnet-faucet channel
3. Use command: `!faucet YOUR_WALLET_ADDRESS`

### Test Flow

1. **Connect Wallet**: Click "Connect Wallet" and approve connection
2. **Browse Content**: View all 10 assets (5 free, 5 premium)
3. **Access Free Content**: Click any free asset to view immediately
4. **Purchase Premium**: Click premium asset → Confirm payment → View content
5. **Check Transaction**: View transaction on [Sui Explorer](https://suiscan.xyz/devnet/home)

## 📊 Current Implementation Status

✅ **Completed:**
- Sui wallet integration (@mysten/dapp-kit)
- Wallet-based authentication
- Payment system for premium content
- 10 hardcoded assets (5 free, 5 premium)
- React Router DOM navigation
- Tailwind CSS v4.1 styling
- Responsive component design
- Transaction handling

🚧 **Future Enhancements:**
- Seal API integration for actual content encryption
- Persistent storage (localStorage/backend)
- User purchase history
- Content creator dashboard
- Subscription management
- Advanced filtering and search
- Social features (comments, likes)

## 🔐 Future: Seal API Integration

When ready to implement Seal encryption:

### 1. Install Seal SDK

```bash
npm install @mysten/seal
```

### 2. Encrypt Content

```typescript
import { SealClient } from '@mysten/seal'

const sealClient = new SealClient({
  proverUrl: 'https://prover.mystenlabs.com/v1'
})

// Encrypt content
const encrypted = await sealClient.encrypt({
  data: contentBuffer,
  policyId: 'YOUR_POLICY_ID'
})
```

### 3. Create Access Policy

```move
// In your Move smart contract
public fun create_access_policy(
    payment_receipt: &PaymentReceipt,
    ctx: &mut TxContext
): AccessToken {
    // Verify payment and create access token
    AccessToken {
        id: object::new(ctx),
        asset_id: payment_receipt.asset_id,
        owner: tx_context::sender(ctx),
        expires_at: /* timestamp */
    }
}
```

### 4. Decrypt on Client

```typescript
// Decrypt when user has access
const decrypted = await sealClient.decrypt({
  encryptedData: encrypted,
  accessToken: userAccessToken
})
```

## 🛠️ Troubleshooting

### Wallet Not Connecting
- Ensure wallet extension is installed
- Check if you're on the correct network
- Try refreshing the page

### Transaction Failing
- Check wallet has sufficient SUI balance
- Verify recipient address is correct
- Ensure gas price is sufficient

### Styling Issues
- Clear browser cache
- Check Tailwind CSS v4.1 is properly installed
- Verify `@import "tailwindcss"` in index.css

## 📚 Additional Resources

- [Sui Documentation](https://docs.sui.io/)
- [dApp Kit Documentation](https://sdk.mystenlabs.com/dapp-kit)
- [Seal Documentation](https://seal.mystenlabs.com/)
- [Tailwind CSS v4.1](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

## 🤝 Support

For questions or issues:
- [Sui Discord](https://discord.gg/sui)
- [Sui GitHub](https://github.com/MystenLabs/sui)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/sui)

## 📝 License

MIT License - feel free to use this code for your project!

---

**Note**: This implementation provides a solid foundation for a Patreon-like dApp on Sui. The current version uses simulated encrypted content (`[ENCRYPTED]` prefix). For production, integrate the Seal API for actual encryption and implement proper backend storage for user purchases and access control.
