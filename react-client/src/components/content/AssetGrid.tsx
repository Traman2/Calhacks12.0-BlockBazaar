import AssetCard from './AssetCard'
import type { Asset } from '../../types'

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
          hasAccess={!asset.isPremium || purchasedAssets.includes(asset.id)}
          onPurchaseSuccess={onPurchaseSuccess}
        />
      ))}
    </div>
  )
}
