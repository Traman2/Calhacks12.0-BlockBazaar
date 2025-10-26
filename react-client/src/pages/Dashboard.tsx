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
  const otherTiers = allTiers.filter(t => t.creator !== currentAccount?.address)

  // Check if user has active subscription to a tier
  const hasActiveSubscription = (tierId: string) => {
    return subscriptions.some(sub => sub.tierId === tierId && !sub.isExpired)
  }

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

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-white border-brutal shadow-brutal-lg p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                Marketplace
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
            label="Total Tiers"
            value={allTiers.length}
            color="bg-blue-400"
          />
          <StatCard
            icon={<Sparkles className="size-6" />}
            label="My Tiers"
            value={myTiers.length}
            color="bg-green-400"
          />
          <StatCard
            icon={<Lock className="size-6" />}
            label="Available"
            value={otherTiers.length}
            color="bg-premium-400"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
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

        {/* Content */}
        {activeTab === 'marketplace' && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase">Available Subscription Tiers</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-8 animate-spin text-brand-600" />
              </div>
            ) : otherTiers.length === 0 ? (
              <div className="bg-white border-brutal shadow-brutal p-8 text-center">
                <p className="text-gray-600 font-medium">No tiers available yet. Create your own!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherTiers.map(tier => (
                  <TierCard
                    key={tier.id}
                    tier={tier}
                    onSubscribe={() => handleSubscribe(tier)}
                    onViewContent={() => navigate(`/tier/${tier.id}`)}
                    isOwned={hasActiveSubscription(tier.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'creator' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-gray-900 uppercase">My Subscription Tiers</h2>
              <button
                onClick={() => setShowCreateTierModal(true)}
                className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 border-brutal-sm shadow-brutal-sm hover-brutal font-black uppercase text-sm"
              >
                <Plus className="size-4" /> Create Tier
              </button>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-8 animate-spin text-brand-600" />
              </div>
            ) : myTiers.length === 0 ? (
              <div className="bg-white border-brutal shadow-brutal p-8 text-center">
                <p className="text-gray-600 font-medium mb-4">You haven't created any tiers yet.</p>
                <button
                  onClick={() => setShowCreateTierModal(true)}
                  className="bg-brand-600 text-white px-6 py-3 border-brutal-sm shadow-brutal-sm hover-brutal font-black uppercase text-sm"
                >
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

function TabButton({ active, onClick, label }: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 border-brutal-sm font-black uppercase text-sm shadow-brutal-sm hover-brutal transition-all ${
        active ? 'bg-brand-600 text-white' : 'bg-white text-gray-900'
      }`}
    >
      {label}
    </button>
  )
}

function TierCard({ tier, onSubscribe, onViewContent, isOwned }: {
  tier: Tier
  onSubscribe: () => void
  onViewContent: () => void
  isOwned: boolean
}) {
  const priceInSui = (Number(tier.price) / 1_000_000_000).toFixed(2)

  return (
    <div className={`border-brutal shadow-brutal p-6 hover-brutal transition-all ${
      isOwned ? 'bg-green-50 border-green-500' : 'bg-white'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-black text-gray-900 uppercase">{tier.name}</h3>
        {isOwned && (
          <div className="flex items-center gap-1 bg-green-400 border-brutal-sm px-2 py-1">
            <CheckCircle className="size-4" />
            <span className="text-xs font-black uppercase">Owned</span>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 font-medium mb-4">{tier.description}</p>
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Price:</span>
          <span className="font-black text-gray-900">{priceInSui} SUI</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Duration:</span>
          <span className="font-black text-gray-900">{tier.durationDays} days</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Subscribers:</span>
          <span className="font-black text-gray-900">{tier.subscriberCount}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Content:</span>
          <span className="font-black text-gray-900">{tier.contentIds.length} items</span>
        </div>
      </div>
      <div className="space-y-2">
        {isOwned ? (
          <button
            onClick={onViewContent}
            className="w-full bg-blue-400 text-gray-900 px-4 py-2 border-brutal-sm shadow-brutal-sm hover-brutal font-black uppercase text-sm flex items-center justify-center gap-2"
          >
            <Eye className="size-4" />
            View Content
          </button>
        ) : (
          <button
            onClick={onSubscribe}
            className="w-full bg-brand-600 text-white px-4 py-2 border-brutal-sm shadow-brutal-sm hover-brutal font-black uppercase text-sm"
          >
            Subscribe
          </button>
        )}
      </div>
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
    <div className="bg-white border-brutal shadow-brutal p-6">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-black text-gray-900 uppercase">{tier.name}</h3>
        <div className={`px-2 py-1 border-brutal-sm text-xs font-black uppercase ${
          tier.isActive ? 'bg-green-400' : 'bg-gray-400'
        }`}>
          {tier.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>
      <p className="text-sm text-gray-600 font-medium mb-4">{tier.description}</p>
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Price:</span>
          <span className="font-black text-gray-900">{priceInSui} SUI</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Subscribers:</span>
          <span className="font-black text-gray-900">{tier.subscriberCount}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Content:</span>
          <span className="font-black text-gray-900">{tier.contentIds.length} items</span>
        </div>
      </div>
      <div className="space-y-2">
        <button
          onClick={onUpload}
          className="w-full bg-blue-400 text-gray-900 px-4 py-2 border-brutal-sm shadow-brutal-sm hover-brutal font-black uppercase text-sm flex items-center justify-center gap-2"
        >
          <Upload className="size-4" /> Upload Content
        </button>
        {tier.contentIds.length > 0 && (
          <button
            onClick={onViewContent}
            className="w-full bg-green-400 text-gray-900 px-4 py-2 border-brutal-sm shadow-brutal-sm hover-brutal font-black uppercase text-sm flex items-center justify-center gap-2"
          >
            <Eye className="size-4" /> View Content
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
      <div className="bg-white border-brutal shadow-brutal-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase">Create Tier</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X className="size-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-700 uppercase mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <label className="block text-xs font-black text-gray-700 uppercase mb-2">Price (SUI)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border-brutal-sm font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-700 uppercase mb-2">Duration (days)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 border-brutal-sm font-medium"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand-600 text-white px-4 py-3 border-brutal-sm shadow-brutal-sm hover-brutal font-black uppercase flex items-center justify-center gap-2"
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
