import { useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { Sparkles, Lock, Globe } from 'lucide-react'
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

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-white border-brutal shadow-brutal-lg p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                Connected: <code className="bg-gray-900 text-white px-2 py-1 font-mono text-xs font-bold border-2 border-black">
                  {currentAccount?.address.slice(0, 6)}...{currentAccount?.address.slice(-4)}
                </code>
              </p>
            </div>
            <div className="bg-brand-600 border-brutal-sm p-3 shadow-brutal-sm">
              <Sparkles className="size-6 text-white" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Globe className="size-6" />}
            label="Total Assets"
            value={AssetsService.getAllAssets().length}
            color="bg-blue-400"
          />
          <StatCard
            icon={<Sparkles className="size-6" />}
            label="Free Content"
            value={AssetsService.getFreeAssets().length}
            color="bg-green-400"
          />
          <StatCard
            icon={<Lock className="size-6" />}
            label="Premium"
            value={AssetsService.getPremiumAssets().length}
            color="bg-premium-400"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label="All Content"
            count={AssetsService.getAllAssets().length}
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

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-white border-brutal shadow-brutal p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`${color} border-brutal-sm p-2 shadow-brutal-sm`}>
          {icon}
        </div>
        <span className="text-3xl font-black text-gray-900">{value}</span>
      </div>
      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">{label}</p>
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
      className={`px-5 py-3 border-brutal-sm font-black uppercase text-sm shadow-brutal-sm hover-brutal transition-all ${
        active
          ? 'bg-brand-600 text-white'
          : 'bg-white text-gray-900'
      }`}
    >
      {label} <span className="opacity-70">({count})</span>
    </button>
  )
}
