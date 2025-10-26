import { useCurrentAccount } from '@mysten/dapp-kit'
import { CheckCircle, Clock, Loader2, Calendar, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { useUserSubscriptions } from '../hooks/useUserSubscriptions'
import { useMarketplace } from '../hooks/useMarketplace'

export default function MySubscriptions() {
  const currentAccount = useCurrentAccount()
  const navigate = useNavigate()
  const { data: subscriptions = [], isLoading: subsLoading } = useUserSubscriptions()
  const { data: allTiers = [], isLoading: tiersLoading } = useMarketplace()

  const isLoading = subsLoading || tiersLoading

  // Map subscriptions to their tier data
  const subscriptionDetails = subscriptions.map(sub => {
    const tier = allTiers.find(t => t.id === sub.tierId)
    return { subscription: sub, tier }
  }).filter(item => item.tier) // Only show subscriptions with valid tier data

  const activeSubscriptions = subscriptionDetails.filter(item => !item.subscription.isExpired)
  const expiredSubscriptions = subscriptionDetails.filter(item => item.subscription.isExpired)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white border-brutal shadow-brutal-lg p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                My Subscriptions
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                Connected: <code className="bg-gray-900 text-white px-2 py-1 font-mono text-xs font-bold border-2 border-black">
                  {currentAccount?.address.slice(0, 6)}...{currentAccount?.address.slice(-4)}
                </code>
              </p>
            </div>
            <div className="bg-green-400 border-brutal-sm p-3 shadow-brutal-sm">
              <CheckCircle className="size-6 text-gray-900" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            icon={<CheckCircle className="size-6" />}
            label="Active Subscriptions"
            value={activeSubscriptions.length}
            color="bg-green-400"
          />
          <StatCard
            icon={<Clock className="size-6" />}
            label="Expired Subscriptions"
            value={expiredSubscriptions.length}
            color="bg-gray-400"
          />
        </div>

        {/* Active Subscriptions */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tight">Active Subscriptions</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-brand-600" />
            </div>
          ) : activeSubscriptions.length === 0 ? (
            <div className="bg-white border-brutal shadow-brutal p-8 text-center">
              <p className="text-gray-600 font-medium">You don't have any active subscriptions yet.</p>
              <a
                href="/dashboard"
                className="inline-block mt-4 bg-brand-600 text-white px-6 py-3 border-brutal-sm shadow-brutal-sm hover-brutal font-black uppercase text-sm"
              >
                Browse Marketplace
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSubscriptions.map(({ subscription, tier }) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  tier={tier!}
                  isActive={true}
                  onViewContent={() => navigate(`/tier/${subscription.tierId}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Expired Subscriptions */}
        {expiredSubscriptions.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tight">Expired Subscriptions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiredSubscriptions.map(({ subscription, tier }) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  tier={tier!}
                  isActive={false}
                  onViewContent={() => navigate(`/tier/${subscription.tierId}`)}
                />
              ))}
            </div>
          </div>
        )}
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

function SubscriptionCard({ subscription, tier, isActive, onViewContent }: {
  subscription: { id: string; tierId: string; expiresAt: number }
  tier: { name: string; description: string; price: string; durationDays: number; contentIds: string[] }
  isActive: boolean
  onViewContent: () => void
}) {
  const priceInSui = (Number(tier.price) / 1_000_000_000).toFixed(2)
  const expiryDate = new Date(subscription.expiresAt)
  const daysRemaining = Math.max(0, Math.ceil((subscription.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)))

  return (
    <div className={`border-brutal shadow-brutal p-6 transition-all ${
      isActive ? 'bg-green-50 border-green-500' : 'bg-gray-50'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-black text-gray-900 uppercase">{tier.name}</h3>
        <div className={`px-2 py-1 border-brutal-sm text-xs font-black uppercase ${
          isActive ? 'bg-green-400' : 'bg-gray-400'
        }`}>
          {isActive ? 'Active' : 'Expired'}
        </div>
      </div>
      <p className="text-sm text-gray-600 font-medium mb-4">{tier.description}</p>
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Price Paid:</span>
          <span className="font-black text-gray-900">{priceInSui} SUI</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Duration:</span>
          <span className="font-black text-gray-900">{tier.durationDays} days</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Content Access:</span>
          <span className="font-black text-gray-900">{tier.contentIds.length} items</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Expires:</span>
          <span className="font-black text-gray-900">{expiryDate.toLocaleDateString()}</span>
        </div>
        {isActive && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t-2 border-gray-300">
            <Calendar className="size-4 text-green-600" />
            <span className="text-xs font-black text-green-600 uppercase">
              {daysRemaining} days remaining
            </span>
          </div>
        )}
      </div>
      {isActive && (
        <button
          onClick={onViewContent}
          className="w-full bg-blue-400 text-gray-900 px-4 py-2 border-brutal-sm shadow-brutal-sm hover-brutal font-black uppercase text-sm flex items-center justify-center gap-2"
        >
          <Eye className="size-4" />
          View Content
        </button>
      )}
    </div>
  )
}
