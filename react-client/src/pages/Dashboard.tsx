import { useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { Sparkles, Lock, Globe, Plus, Upload, X, Loader2, CheckCircle, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { useMarketplace } from '../hooks/useMarketplace'
import { useCreateTier } from '../hooks/useCreateTier'
import { usePurchaseSubscription } from '../hooks/useSubscription'
import { useContentUpload } from '../hooks/useContentUpload'
import { useUserSubscriptions } from '../hooks/useUserSubscriptions'
import type { Tier } from '../hooks/useMarketplace'

type Tab = 'marketplace' | 'creator'

export default function Dashboard() {
  const currentAccount = useCurrentAccount()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('marketplace')
  const [showCreateTierModal, setShowCreateTierModal] = useState(false)
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)

  const { data: allTiers = [], isLoading } = useMarketplace()
  const { data: subscriptions = [] } = useUserSubscriptions()

  const myTiers = allTiers.filter(t => t.creator === currentAccount?.address)

  // Check if user has active subscription to a tier
  const hasActiveSubscription = (tierId: string) => {
    return subscriptions.some(sub => sub.tierId === tierId && !sub.isExpired)
  }

  // Filter marketplace: only show tiers from other users that current user hasn't purchased
  const marketplaceTiers = allTiers.filter(t =>
    t.creator !== currentAccount?.address && !hasActiveSubscription(t.id)
  )

  const handleSubscribe = (tier: Tier) => {
    setSelectedTier(tier)
    setShowSubscribeModal(true)
  }

  const handleUploadContent = (tier: Tier) => {
    setSelectedTier(tier)
    setShowUploadModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-black">
          <TabButton
            active={activeTab === 'marketplace'}
            onClick={() => setActiveTab('marketplace')}
            label="Marketplace"
          />
          <TabButton
            active={activeTab === 'creator'}
            onClick={() => setActiveTab('creator')}
            label="Creator Dashboard"
          />
        </div>

        {/* Header - Only show for creator dashboard */}
        {activeTab === 'creator' && (
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">My Creations</h1>
            <p className="text-gray-600">Manage your subscription tiers and content</p>
          </div>
        )}

        {/* Content */}
        {activeTab === 'marketplace' && (
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-brand-600" />
              </div>
            ) : marketplaceTiers.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Globe className="size-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-tight">No content available</h3>
                <p className="text-gray-600 mb-6">There are no new tiers to explore right now. Check back later or create your own!</p>
                <button
                  onClick={() => setActiveTab('creator')}
                  className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors"
                >
                  <Plus className="size-4" />
                  Become a Creator
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketplaceTiers.map(tier => (
                  <TierCard
                    key={tier.id}
                    tier={tier}
                    onSubscribe={() => handleSubscribe(tier)}
                    onViewContent={() => navigate(`/tier/${tier.id}`)}
                    isOwned={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'creator' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">My Content Tiers</h2>
                <p className="text-sm text-gray-600">Manage your subscription offerings</p>
              </div>
              <button
                onClick={() => setShowCreateTierModal(true)}
                className="inline-flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors"
              >
                <Plus className="size-4" /> Create Tier
              </button>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-brand-600" />
              </div>
            ) : myTiers.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Sparkles className="size-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start creating content</h3>
                <p className="text-gray-600 mb-6">Create your first subscription tier and start sharing exclusive content with your audience.</p>
                <button
                  onClick={() => setShowCreateTierModal(true)}
                  className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors"
                >
                  <Plus className="size-4" />
                  Create Your First Tier
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTiers.map(tier => (
                  <CreatorTierCard
                    key={tier.id}
                    tier={tier}
                    onUpload={() => handleUploadContent(tier)}
                    onViewContent={() => navigate(`/tier/${tier.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreateTierModal && <CreateTierModal onClose={() => setShowCreateTierModal(false)} />}
      {showSubscribeModal && selectedTier && (
        <SubscribeModal tier={selectedTier} onClose={() => setShowSubscribeModal(false)} />
      )}
      {showUploadModal && selectedTier && (
        <UploadContentModal tier={selectedTier} onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  )
}

function TabButton({ active, onClick, label }: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-black text-sm uppercase tracking-tight transition-all border-2 border-black ${
        active
          ? 'bg-brand-600 text-white shadow-brutal'
          : 'bg-white text-gray-900 hover-brutal'
      }`}
    >
      {label}
    </button>
  )
}

function TierCard({ tier, onSubscribe }: {
  tier: Tier
  onSubscribe: () => void
  onViewContent: () => void
  isOwned: boolean
}) {
  const priceInSui = (Number(tier.price) / 1_000_000_000).toFixed(2)

  return (
    <div className="bg-white border-brutal shadow-brutal p-6 hover-brutal transition-all">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{tier.name}</h3>
        <div className="text-2xl font-black text-brand-600">{priceInSui} <span className="text-xs text-gray-500 font-bold">SUI</span></div>
      </div>
      <p className="text-sm text-gray-700 font-medium mb-4 line-clamp-2">{tier.description}</p>

      <div className="space-y-2 mb-4 py-4 border-t-2 border-b-2 border-black">
        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
          <Lock className="size-4" />
          <span>{tier.contentIds.length} exclusive items</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
          <Globe className="size-4" />
          <span>{tier.subscriberCount} subscribers</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
          <CheckCircle className="size-4" />
          <span>{tier.durationDays} days access</span>
        </div>
      </div>

      <button
        onClick={onSubscribe}
        className="w-full bg-brand-600 text-white px-4 py-3 border-brutal-sm shadow-brutal font-black uppercase text-sm hover-brutal"
      >
        Subscribe Now
      </button>
    </div>
  )
}

function CreatorTierCard({ tier, onUpload, onViewContent }: {
  tier: Tier
  onUpload: () => void
  onViewContent: () => void
}) {
  const priceInSui = (Number(tier.price) / 1_000_000_000).toFixed(2)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
          <p className="text-sm text-gray-500">{priceInSui} SUI / {tier.durationDays} days</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          tier.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {tier.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tier.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-b border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{tier.subscriberCount}</div>
          <div className="text-xs text-gray-500">Subscribers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{tier.contentIds.length}</div>
          <div className="text-xs text-gray-500">Content Items</div>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={onUpload}
          className="w-full bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
        >
          <Upload className="size-4" /> Upload Content
        </button>
        {tier.contentIds.length > 0 && (
          <button
            onClick={onViewContent}
            className="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="size-4" /> Manage Content
          </button>
        )}
      </div>
    </div>
  )
}

function CreateTierModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')

  const { mutateAsync: createTier, isPending } = useCreateTier()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createTier({
        name,
        description,
        priceInSui: Number(price),
        durationDays: Number(duration)
      })
      onClose()
    } catch (error) {
      console.error('Failed to create tier:', error)
      alert(`Failed to create tier: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Tier</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="size-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tier Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="e.g., Premium Access"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Describe what subscribers will get..."
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (SUI)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="30"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? <Loader2 className="size-5 animate-spin" /> : null}
            {isPending ? 'Creating...' : 'Create Tier'}
          </button>
        </form>
      </div>
    </div>
  )
}

function SubscribeModal({ tier, onClose }: { tier: Tier; onClose: () => void }) {
  const { mutateAsync: subscribe, isPending } = usePurchaseSubscription()
  const priceInSui = (Number(tier.price) / 1_000_000_000).toFixed(2)

  const handleSubscribe = async () => {
    try {
      await subscribe({
        tierId: tier.id,
        priceInMist: tier.price
      })
      onClose()
    } catch (error) {
      console.error('Failed to subscribe:', error)
      alert(`Failed to subscribe: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-brutal shadow-brutal-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase">Subscribe</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X className="size-6" />
          </button>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-black text-gray-900 mb-2">{tier.name}</h3>
          <p className="text-sm text-gray-600 font-medium mb-4">{tier.description}</p>
          <div className="bg-gray-50 border-brutal-sm p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">Price:</span>
              <span className="font-black text-gray-900">{priceInSui} SUI</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">Duration:</span>
              <span className="font-black text-gray-900">{tier.durationDays} days</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleSubscribe}
          disabled={isPending}
          className="w-full bg-brand-600 text-white px-4 py-3 border-brutal-sm shadow-brutal-sm hover-brutal font-black uppercase flex items-center justify-center gap-2"
        >
          {isPending ? <Loader2 className="size-5 animate-spin" /> : null}
          {isPending ? 'Subscribing...' : `Subscribe for ${priceInSui} SUI`}
        </button>
      </div>
    </div>
  )
}

function UploadContentModal({ tier, onClose }: { tier: Tier; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState({ stage: '', percent: 0 })

  const { mutateAsync: uploadContent, isPending } = useContentUpload()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      await uploadContent({
        tierId: tier.id,
        title,
        description,
        file,
        onProgress: (stage, percent) => setProgress({ stage, percent })
      })
      onClose()
    } catch (error) {
      console.error('Failed to upload content:', error)
      alert(`Failed to upload content: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-brutal shadow-brutal-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase">Upload Content</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X className="size-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-700 uppercase mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border-brutal-sm font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-700 uppercase mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border-brutal-sm font-medium"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-700 uppercase mb-2">File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border-brutal-sm font-medium"
              required
            />
          </div>
          {isPending && (
            <div className="bg-gray-50 border-brutal-sm p-4">
              <div className="text-xs font-black text-gray-700 uppercase mb-2">{progress.stage}</div>
              <div className="w-full bg-gray-300 border-2 border-black h-4">
                <div
                  className="bg-brand-600 h-full transition-all"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand-600 text-white px-4 py-3 border-brutal-sm shadow-brutal-sm hover-brutal font-black uppercase flex items-center justify-center gap-2"
          >
            {isPending ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
            {isPending ? 'Uploading...' : 'Upload Content'}
          </button>
        </form>
      </div>
    </div>
  )
}
