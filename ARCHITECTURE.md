# Project Architecture & Additional Components

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / User                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                   React Application                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Router DOM                         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │  Login   │  │Dashboard │  │ NotFound │          │  │
│  │  │   Page   │  │   Page   │  │   Page   │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   Components Layer                     │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │  Navbar  │  │AssetGrid │  │ Payment  │          │  │
│  │  │          │  │AssetCard │  │  Modal   │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Hooks Layer                         │  │
│  │  ┌──────────────────┐  ┌────────────────────┐        │  │
│  │  │  usePayment      │  │   useAssets        │        │  │
│  │  │  (Transactions)  │  │   (Data Mgmt)      │        │  │
│  │  └──────────────────┘  └────────────────────┘        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  Services Layer                        │  │
│  │  ┌──────────────────┐  ┌────────────────────┐        │  │
│  │  │ Assets Service   │  │   Sui Service      │        │  │
│  │  │ (Mock Data)      │  │   (Blockchain)     │        │  │
│  │  └──────────────────┘  └────────────────────┘        │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              @mysten/dapp-kit Providers                      │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │QueryClient   │  │SuiClient     │  │WalletProvider   │  │
│  │Provider      │  │Provider      │  │                 │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                   Sui Blockchain                             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Wallet     │  │ Transaction  │  │   RPC Nodes     │  │
│  │ Integration  │  │  Processing  │  │   (Devnet)      │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📄 Additional Component Examples

### NotFound.tsx (404 Page)

```typescript
// src/pages/NotFound.tsx
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-brand-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Home className="size-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft className="size-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Footer.tsx

```typescript
// src/components/layout/Footer.tsx
import { Github, Twitter, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Sui Content Hub
            </h3>
            <p className="text-gray-600 text-sm">
              Decentralized content platform built on Sui blockchain.
              Access premium content with cryptocurrency payments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="https://docs.sui.io" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-600 text-sm transition-colors">
                  Sui Documentation
                </a>
              </li>
              <li>
                <a href="https://suiscan.xyz/devnet/home" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-600 text-sm transition-colors">
                  Sui Explorer
                </a>
              </li>
              <li>
                <a href="https://discord.gg/sui" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-600 text-sm transition-colors">
                  Join Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Connect
            </h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-brand-600 transition-colors">
                <Github className="size-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-brand-600 transition-colors">
                <Twitter className="size-6" />
              </a>
              <a href="https://discord.gg/sui" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-600 transition-colors">
                <MessageCircle className="size-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Sui Content Hub. Built with{' '}
            <span className="text-red-500">♥</span> on Sui Blockchain.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

### PremiumBadge.tsx

```typescript
// src/components/content/PremiumBadge.tsx
import { Crown, Lock, CheckCircle } from 'lucide-react'

interface PremiumBadgeProps {
  status: 'locked' | 'unlocked' | 'free'
  price?: number
}

export default function PremiumBadge({ status, price }: PremiumBadgeProps) {
  if (status === 'free') {
    return (
      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
        Free
      </span>
    )
  }

  if (status === 'unlocked') {
    return (
      <span className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
        <CheckCircle className="size-4" />
        Unlocked
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1 bg-premium-500 text-white px-3 py-1 rounded-full text-sm font-medium">
        <Lock className="size-4" />
        Premium
      </span>
      {price && (
        <span className="font-semibold text-brand-600">
          {(price / 1000000000).toFixed(2)} SUI
        </span>
      )}
    </div>
  )
}
```

### LoadingSpinner.tsx

```typescript
// src/components/common/LoadingSpinner.tsx
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-8',
    lg: 'size-12'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-brand-600`} />
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  )
}
```

## 🔄 Data Flow Diagram

```
User Action (Click "Purchase")
        |
        ▼
PaymentModal Opens
        |
        ▼
usePayment Hook
        |
        ▼
Transaction Created
        |
        ├─► Split Coins (Gas)
        ├─► Transfer to Recipient
        └─► Sign & Execute
        |
        ▼
Sui Blockchain
        |
        ▼
Transaction Confirmed
        |
        ▼
Update Local State
        |
        ▼
Unlock Content Access
        |
        ▼
User Can View Premium Content
```

## 🎨 Component Hierarchy

```
App
├── Router
│   ├── Route: / (Login)
│   │   └── Login Page
│   │       ├── Hero Section
│   │       ├── ConnectButton
│   │       └── Features Grid
│   │
│   ├── Route: /dashboard (Protected)
│   │   └── Dashboard Page
│   │       ├── Navbar
│   │       │   ├── Logo
│   │       │   ├── WalletInfo
│   │       │   └── DisconnectButton
│   │       │
│   │       ├── Welcome Section
│   │       ├── Filter Tabs
│   │       └── AssetGrid
│   │           └── AssetCard (x10)
│   │               ├── Image
│   │               ├── PremiumBadge
│   │               ├── Title & Description
│   │               ├── Author & Price
│   │               └── Action Button
│   │                   └── PaymentModal (if premium)
│   │                       ├── Asset Info
│   │                       ├── Price Display
│   │                       └── Confirm/Cancel
│   │
│   └── Route: * (404)
│       └── NotFound Page
│
└── Providers
    ├── QueryClientProvider
    ├── SuiClientProvider
    └── WalletProvider
```

## 🔐 Security Considerations

### Current Implementation
- ✅ Client-side wallet authentication
- ✅ Transaction signing via wallet
- ✅ Payment verification on-chain
- ⚠️ Mock content encryption
- ⚠️ No persistent storage

### Future Production Requirements
1. **Content Encryption**
   - Integrate Seal API for real encryption
   - Store encrypted content off-chain (IPFS/Walrus)
   - Implement access control smart contracts

2. **Backend Service**
   - Track user purchases
   - Verify on-chain transactions
   - Manage content delivery

3. **Smart Contract**
   - Access control logic
   - Payment processing
   - Subscription management

4. **Additional Features**
   - Rate limiting
   - Anti-fraud measures
   - Refund mechanisms

## 📊 State Management

```typescript
// Global State (via Providers)
{
  wallet: {
    address: string | null,
    balance: bigint,
    isConnected: boolean
  },
  network: 'devnet' | 'testnet' | 'mainnet',
  suiClient: SuiClient
}

// Component State (useState)
{
  purchasedAssets: string[],  // Asset IDs
  filter: 'all' | 'free' | 'premium',
  isProcessing: boolean,
  paymentStatus: 'idle' | 'success' | 'error'
}

// Server State (React Query)
{
  balance: useQuery('balance'),
  transactions: useQuery('transactions'),
  // Future: user purchases, content metadata
}
```

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- Hook functionality
- Service methods
- Utility functions

### Integration Tests
- Wallet connection flow
- Payment processing
- Content access logic
- Routing navigation

### E2E Tests
- Complete user journey
- Multi-wallet support
- Transaction verification
- Error handling

## 🚀 Performance Optimizations

1. **Code Splitting**
```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))
```

2. **Image Optimization**
```typescript
// Use WebP format
// Implement lazy loading
// Add loading skeletons
```

3. **Caching Strategy**
```typescript
// Cache asset data
// Cache user purchases
// Stale-while-revalidate
```

4. **Bundle Size**
- Tree shaking
- Remove unused dependencies
- Dynamic imports

## 📱 Responsive Design

The app is built mobile-first with these breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

All components use Tailwind's responsive utilities.

## 🌐 Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ 16.4+
- Mobile Safari: ✅ iOS 16.4+
- Chrome Android: ✅ Latest

## 🔧 Development Tips

1. **Use React DevTools**
2. **Enable source maps**
3. **Monitor bundle size**
4. **Test on different networks**
5. **Use TypeScript strict mode**
6. **Follow React best practices**

---

This completes the architectural overview and additional components for your Sui Content Hub application!
