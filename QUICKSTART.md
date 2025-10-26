# Quick Start Guide - Essential Files

This document contains the essential configuration files you need to copy-paste to get started quickly.

## 📦 package.json

```json
{
  "name": "sui-patreon-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mysten/dapp-kit": "^0.14.28",
    "@mysten/sui": "^1.15.0",
    "@tanstack/react-query": "^5.62.3",
    "lucide-react": "^0.469.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.1.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.10",
    "@types/react": "^18.3.17",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.1.10",
    "typescript": "~5.6.2",
    "vite": "^6.0.7"
  }
}
```

## ⚙️ vite.config.ts

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

## 🎨 src/index.css

```css
@import "tailwindcss";

@theme {
  /* Custom fonts */
  --font-sans: "Inter", system-ui, sans-serif;
  
  /* Brand colors */
  --color-brand-50: oklch(0.98 0.02 250);
  --color-brand-100: oklch(0.95 0.05 250);
  --color-brand-200: oklch(0.92 0.08 250);
  --color-brand-300: oklch(0.85 0.12 250);
  --color-brand-400: oklch(0.75 0.16 250);
  --color-brand-500: oklch(0.6 0.2 250);
  --color-brand-600: oklch(0.5 0.22 250);
  --color-brand-700: oklch(0.4 0.24 250);
  --color-brand-800: oklch(0.3 0.26 250);
  --color-brand-900: oklch(0.2 0.28 250);
  
  /* Premium colors */
  --color-premium-50: oklch(0.98 0.02 60);
  --color-premium-100: oklch(0.95 0.05 60);
  --color-premium-400: oklch(0.75 0.18 60);
  --color-premium-500: oklch(0.65 0.2 60);
  --color-premium-600: oklch(0.55 0.22 60);
}

@layer base {
  * {
    @apply border-gray-200;
  }
  
  body {
    @apply bg-white text-gray-900 antialiased;
  }
  
  button {
    @apply focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2;
  }
}

@layer utilities {
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

## 📱 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

## 🌐 index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sui Content Hub - Decentralized Content Platform</title>
    
    <!-- Inter font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## 🔧 Environment Variables (.env.example)

```env
# Sui Network Configuration
VITE_SUI_NETWORK=devnet
VITE_RECIPIENT_ADDRESS=0x742d35cc6634c0532925a3b844bc9c7eb6fb48c7e0b6d2a0e6e9d89c3c4b4a5b

# Optional: Seal Configuration (for future use)
VITE_SEAL_PROVER_URL=https://prover.mystenlabs.com/v1
```

## 📋 Installation Commands

```bash
# Create project
npm create vite@latest sui-patreon-app -- --template react-ts
cd sui-patreon-app

# Install dependencies
npm install @mysten/dapp-kit @mysten/sui @tanstack/react-query
npm install react-router-dom
npm install lucide-react
npm install -D tailwindcss@latest @tailwindcss/vite

# Start development
npm run dev
```

## 🗂️ Directory Structure to Create

```
src/
├── components/
│   ├── content/
│   │   ├── AssetCard.tsx
│   │   ├── AssetGrid.tsx
│   │   └── PremiumBadge.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── payment/
│       ├── PaymentModal.tsx
│       └── PaymentButton.tsx
├── hooks/
│   ├── usePayment.ts
│   └── useAssets.ts
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   └── NotFound.tsx
├── services/
│   ├── assets.service.ts
│   └── sui.service.ts
├── types/
│   └── index.ts
├── config/
│   └── sui.config.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🎯 Step-by-Step Setup

### 1. Create and Setup Project
```bash
npm create vite@latest sui-patreon-app -- --template react-ts
cd sui-patreon-app
npm install
```

### 2. Install All Dependencies
```bash
npm install @mysten/dapp-kit @mysten/sui @tanstack/react-query react-router-dom lucide-react
npm install -D tailwindcss@latest @tailwindcss/vite
```

### 3. Copy Configuration Files
- Copy `vite.config.ts` content above
- Copy `src/index.css` content above
- Copy `tsconfig.json` content above
- Update `index.html` with Inter font

### 4. Create Directory Structure
```bash
mkdir -p src/{components/{content,layout,payment},hooks,pages,services,types,config}
```

### 5. Copy Main Files
Start with these core files from the README:
1. `src/main.tsx` - Entry point with providers
2. `src/App.tsx` - Routing setup
3. `src/types/index.ts` - Type definitions
4. `src/services/assets.service.ts` - Mock data

### 6. Create Pages
Then create the pages:
1. `src/pages/Login.tsx`
2. `src/pages/Dashboard.tsx`
3. `src/pages/NotFound.tsx` (simple 404 page)

### 7. Build Components
Create components in this order:
1. `src/components/layout/Navbar.tsx`
2. `src/hooks/usePayment.ts`
3. `src/components/payment/PaymentModal.tsx`
4. `src/components/content/AssetCard.tsx`
5. `src/components/content/AssetGrid.tsx`

### 8. Get Test Tokens
1. Install Sui Wallet extension
2. Create wallet and copy address
3. Join Sui Discord: https://discord.gg/sui
4. Go to #devnet-faucet channel
5. Type: `!faucet YOUR_ADDRESS`

### 9. Update Recipient Address
In `src/components/payment/PaymentModal.tsx`:
```typescript
const RECIPIENT_ADDRESS = 'YOUR_ACTUAL_SUI_ADDRESS'
```

### 10. Run Application
```bash
npm run dev
```

Visit `http://localhost:5173` and test!

## 🔍 Testing Checklist

- [ ] Wallet connects successfully
- [ ] Can see all 10 assets (5 free, 5 premium)
- [ ] Can view free content immediately
- [ ] Premium content shows lock icon
- [ ] Payment modal opens for premium content
- [ ] Transaction succeeds and content unlocks
- [ ] Can view purchased premium content
- [ ] Wallet balance updates after payment
- [ ] Can disconnect wallet
- [ ] Routing works (login/dashboard)

## 🐛 Common Issues

### "Wallet not detected"
```bash
# Solution: Install Sui Wallet extension
# Chrome: https://chrome.google.com/webstore/detail/sui-wallet/
```

### "Insufficient gas"
```bash
# Solution: Get more test SUI from faucet
# Discord: #devnet-faucet channel
```

### "Transaction failed"
```typescript
// Solution: Check recipient address is valid Sui address
// Format: 0x + 64 hex characters
```

### Tailwind not working
```bash
# Solution: Ensure Vite plugin is configured
npm install -D @tailwindcss/vite

# Then add to vite.config.ts:
import tailwindcss from '@tailwindcss/vite'
plugins: [react(), tailwindcss()]
```

## 📚 Next Steps

After basic setup:
1. Test all features thoroughly
2. Customize styling and branding
3. Add error handling and loading states
4. Implement localStorage for purchases
5. Plan Seal API integration
6. Add backend for persistence
7. Deploy to production

## 🚀 Deployment

### Build for production
```bash
npm run build
```

### Deploy options
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: Use `gh-pages` package

Make sure to:
1. Update recipient address to mainnet address
2. Change network to mainnet in `src/main.tsx`
3. Test thoroughly on testnet first
4. Add proper error handling

---

**Ready to start?** Follow the step-by-step setup and refer to the full README for detailed component implementations!
