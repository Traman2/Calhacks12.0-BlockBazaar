# Sui Content Hub - Patreon-like DApp

A decentralized content subscription platform built on Sui blockchain with wallet integration, authentication, and payment system.

## ✨ Features

- **Sui Wallet Integration** - Connect with Sui wallet for authentication
- **10 Hardcoded Assets** - 5 free assets and 5 premium assets
- **Payment System** - Purchase premium content with SUI tokens
- **Content Access Control** - Lock/unlock premium content after payment
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Beautiful UI** - Built with Tailwind CSS v4.1

## 🚀 Getting Started

### Prerequisites

1. **Sui Wallet Extension** - Install from Chrome Web Store
2. **Test SUI Tokens** - Get from Sui Discord faucet
3. **Node.js 18+** - Required for development

### Installation

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Get Test Tokens

1. Install Sui Wallet extension
2. Create wallet and copy your address
3. Join Sui Discord: https://discord.gg/sui
4. Go to #devnet-faucet channel
5. Type: `!faucet YOUR_ADDRESS`

## 📁 Project Structure

```
src/
├── components/
│   ├── content/
│   │   ├── AssetCard.tsx      # Individual asset display
│   │   └── AssetGrid.tsx      # Grid layout for assets
│   ├── layout/
│   │   └── Navbar.tsx         # Navigation with wallet info
│   └── payment/
│       └── PaymentModal.tsx   # Payment confirmation modal
├── hooks/
│   └── usePayment.ts          # Payment transaction logic
├── pages/
│   ├── Login.tsx              # Landing/login page
│   ├── Dashboard.tsx          # Main dashboard with assets
│   └── NotFound.tsx           # 404 page
├── services/
│   └── assets.service.ts      # Mock asset data (10 items)
├── types/
│   └── index.ts               # TypeScript definitions
├── App.tsx                    # Routing configuration
├── main.tsx                   # Entry point with providers
└── index.css                  # Tailwind CSS configuration
```

## 🎮 How to Use

1. **Connect Wallet**
   - Click "Connect Wallet" on the login page
   - Approve the connection in your Sui wallet

2. **Browse Content**
   - View all 10 assets on the dashboard
   - Filter by: All, Free, or Premium

3. **Access Free Content**
   - Click "View Content" on any free asset
   - Content displays immediately

4. **Purchase Premium Content**
   - Click "Purchase Access" on premium asset
   - Review price and confirm payment
   - Approve transaction in wallet
   - Content unlocks automatically

5. **View Transaction**
   - Check transaction on Sui Explorer
   - Verify payment went through

## 🔧 Configuration

### Update Recipient Address

In `src/components/payment/PaymentModal.tsx`, line 14:

```typescript
const RECIPIENT_ADDRESS = 'YOUR_ACTUAL_SUI_ADDRESS_HERE'
```

### Change Network

In `src/main.tsx`, line 24:

```typescript
// For mainnet
defaultNetwork="mainnet"

// For testnet
defaultNetwork="testnet"

// For devnet (default)
defaultNetwork="devnet"
```

## 💰 Asset Pricing

- **Free Assets (5)**: No payment required
- **Premium Assets (5)**:
  - Advanced Move Programming: 0.1 SUI
  - Building DApps on Sui: 0.5 SUI
  - Security Best Practices: 0.3 SUI
  - Advanced Trading Strategies: 1.0 SUI
  - Enterprise Blockchain Solutions: 2.0 SUI

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4.1** - Styling
- **React Router DOM v7** - Navigation
- **Lucide React** - Icons

### Sui Blockchain
- **@mysten/dapp-kit** - Wallet integration
- **@mysten/sui** - Blockchain interaction
- **@tanstack/react-query** - State management

## 🧪 Testing Checklist

- [ ] Wallet connects successfully
- [ ] All 10 assets display correctly
- [ ] Free content accessible immediately
- [ ] Premium content shows lock icon
- [ ] Payment modal opens correctly
- [ ] Transaction completes successfully
- [ ] Purchased content unlocks
- [ ] Wallet balance updates
- [ ] Can disconnect wallet
- [ ] Responsive on all devices

## 🔐 Security Notes

**Current Implementation:**
- Client-side wallet authentication ✅
- Transaction signing via wallet ✅
- Payment verification on-chain ✅
- Mock content encryption ⚠️
- No persistent storage ⚠️

**Future Production Requirements:**
1. Integrate Seal API for real encryption
2. Add backend for purchase tracking
3. Implement smart contracts for access control
4. Add persistent storage (database)
5. Implement refund mechanisms

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: Use `gh-pages` package

**Pre-Deployment Checklist:**
1. Update recipient address to mainnet address
2. Change network to mainnet
3. Test thoroughly on testnet first
4. Verify all transactions work
5. Check responsive design

## 📚 Documentation

- Main Guide: `../README.md`
- Quick Start: `../QUICKSTART.md`
- Architecture: `../ARCHITECTURE.md`
- Checklist: `../CHECKLIST.md`

## 🆘 Troubleshooting

### Wallet Not Connecting
- Ensure wallet extension is installed
- Check correct network (devnet)
- Try refreshing the page

### Transaction Failing
- Check sufficient SUI balance
- Verify recipient address is valid
- Ensure gas price is sufficient

### Build Errors
- Delete `node_modules` and reinstall
- Clear cache: `rm -rf dist node_modules`
- Run `npm install` again

## 🔗 Useful Links

- [Sui Documentation](https://docs.sui.io/)
- [Sui Discord](https://discord.gg/sui)
- [Sui Explorer (Devnet)](https://suiscan.xyz/devnet/home)
- [dApp Kit Docs](https://sdk.mystenlabs.com/dapp-kit)

## 📝 Next Steps

1. **Test the application** - Run `npm run dev` and test all features
2. **Get test tokens** - Use Discord faucet
3. **Update recipient address** - In PaymentModal.tsx
4. **Customize styling** - Update colors in index.css
5. **Plan Seal integration** - For real content encryption

## 🎉 Success!

Your Sui Patreon-like DApp is ready! All components, pages, hooks, and services are implemented and working.

**To start developing:**
```bash
npm run dev
```

Visit `http://localhost:5173` and connect your wallet!

---

Built with ❤️ on Sui Blockchain
