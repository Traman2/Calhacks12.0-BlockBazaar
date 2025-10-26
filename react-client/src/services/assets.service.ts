import type { Asset } from '../types'

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
