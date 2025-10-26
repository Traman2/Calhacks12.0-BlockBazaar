import { useState } from 'react'
import { CheckCircle, Crown } from 'lucide-react'
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
      <div className="bg-white border-brutal shadow-brutal hover-brutal transition-all">
        {/* Image */}
        <div className="relative h-48 border-b-3 border-black overflow-hidden">
          <img
            src={asset.imageUrl}
            alt={asset.title}
            className="w-full h-full object-cover"
          />
          {asset.isPremium && (
            <div className="absolute top-3 right-3">
              {hasAccess ? (
                <div className="bg-green-400 border-brutal-sm px-3 py-1 shadow-brutal-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="size-4 text-gray-900" />
                    <span className="text-xs font-black text-gray-900 uppercase">Unlocked</span>
                  </div>
                </div>
              ) : (
                <div className="bg-premium-400 border-brutal-sm px-3 py-1 shadow-brutal-sm">
                  <div className="flex items-center gap-1">
                    <Crown className="size-4 text-gray-900" />
                    <span className="text-xs font-black text-gray-900 uppercase">Premium</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-tight">
            {asset.title}
          </h3>
          <p className="text-sm text-gray-700 mb-4 line-clamp-2 font-medium">
            {asset.description}
          </p>

          {/* Metadata Box */}
          <div className="bg-gray-100 border-brutal-sm p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 font-bold uppercase">
                {asset.author}
              </span>
              {asset.isPremium && asset.price && (
                <div className="bg-brand-600 border-2 border-black px-2 py-1">
                  <span className="text-sm font-black text-white">
                    {(asset.price / 1000000000).toFixed(2)} SUI
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleViewContent}
            className={`w-full py-3 border-brutal-sm font-black uppercase text-sm shadow-brutal-sm hover-brutal transition-all ${
              asset.isPremium && !hasAccess
                ? 'bg-premium-400 text-gray-900'
                : 'bg-brand-600 text-white'
            }`}
          >
            {asset.isPremium && !hasAccess ? '🔒 Purchase Access' : '📖 View Content'}
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-brutal shadow-brutal-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="border-b-3 border-black bg-brand-600 p-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            {asset.title}
          </h2>
        </div>
        <div className="p-8">
          <div className="bg-gray-50 border-brutal-sm p-6 mb-6">
            <p className="text-base text-gray-900 font-medium leading-relaxed">{asset.content}</p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-4 border-brutal-sm font-black uppercase text-sm shadow-brutal-sm hover-brutal transition-all"
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  )
}
