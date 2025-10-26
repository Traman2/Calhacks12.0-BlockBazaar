import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { User, Wallet, CheckCircle, Sparkles, TrendingUp, Calendar } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import { useUserSubscriptions } from '../hooks/useUserSubscriptions'
import { useMarketplace } from '../hooks/useMarketplace'

export default function Profile() {
  const currentAccount = useCurrentAccount()
  const { data: subscriptions = [] } = useUserSubscriptions()
  const { data: allTiers = [] } = useMarketplace()

  // Get SUI balance
  const { data: balance } = useSuiClientQuery('getBalance', {
    owner: currentAccount?.address || '',
    coinType: '0x2::sui::SUI'
  }, {
    enabled: !!currentAccount
  })

  // Calculate stats
  const myCreatedTiers = allTiers.filter(t => t.creator === currentAccount?.address)
  const activeSubscriptions = subscriptions.filter(sub => !sub.isExpired)
  const totalSubscribers = myCreatedTiers.reduce((sum, tier) => sum + tier.subscriberCount, 0)
  const totalRevenue = myCreatedTiers.reduce((sum, tier) => {
    return sum + (Number(tier.price) * tier.subscriberCount)
  }, 0)
  const totalContentCreated = myCreatedTiers.reduce((sum, tier) => sum + tier.contentIds.length, 0)

  const suiBalance = balance ? (Number(balance.totalBalance) / 1_000_000_000).toFixed(4) : '0.0000'
  const revenueInSui = (totalRevenue / 1_000_000_000).toFixed(2)

  const accountAge = currentAccount ? calculateAccountAge(currentAccount.address) : 'N/A'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white border-brutal shadow-brutal-lg p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="bg-brand-600 border-brutal-sm p-6 shadow-brutal-sm">
              <User className="size-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                My Profile
              </h1>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">Wallet Address:</span>
                  <code className="bg-gray-900 text-white px-3 py-1 font-mono text-xs font-bold border-2 border-black">
                    {currentAccount?.address.slice(0, 8)}...{currentAccount?.address.slice(-8)}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">Balance:</span>
                  <span className="text-lg font-black text-gray-900">{suiBalance} SUI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<CheckCircle className="size-6" />}
            label="Active Subscriptions"
            value={activeSubscriptions.length.toString()}
            color="bg-green-400"
            subtext="Currently subscribed"
          />
          <StatCard
            icon={<Sparkles className="size-6" />}
            label="Tiers Created"
            value={myCreatedTiers.length.toString()}
            color="bg-blue-400"
            subtext="Content packages"
          />
          <StatCard
            icon={<Wallet className="size-6" />}
            label="SUI Balance"
            value={`${suiBalance} SUI`}
            color="bg-premium-400"
            subtext="Available funds"
          />
        </div>

        {/* Creator Stats (only show if user has created tiers) */}
        {myCreatedTiers.length > 0 && (
          <div className="bg-white border-brutal shadow-brutal-lg p-6 mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase">Creator Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <CreatorStatCard
                icon={<User className="size-5" />}
                label="Total Subscribers"
                value={totalSubscribers}
                color="bg-green-400"
              />
              <CreatorStatCard
                icon={<TrendingUp className="size-5" />}
                label="Total Revenue"
                value={`${revenueInSui} SUI`}
                color="bg-blue-400"
              />
              <CreatorStatCard
                icon={<Sparkles className="size-5" />}
                label="Content Items"
                value={totalContentCreated}
                color="bg-premium-400"
              />
              <CreatorStatCard
                icon={<CheckCircle className="size-5" />}
                label="Active Tiers"
                value={myCreatedTiers.filter(t => t.isActive).length}
                color="bg-brand-600"
              />
            </div>
          </div>
        )}

        {/* Activity Summary */}
        <div className="bg-white border-brutal shadow-brutal-lg p-6">
          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase">Activity Summary</h2>
          <div className="space-y-4">
            <ActivityItem
              icon={<Calendar className="size-5" />}
              label="Account Created"
              value={accountAge}
            />
            <ActivityItem
              icon={<CheckCircle className="size-5" />}
              label="Total Subscriptions"
              value={`${subscriptions.length} (${activeSubscriptions.length} active)`}
            />
            <ActivityItem
              icon={<Sparkles className="size-5" />}
              label="Total Tiers Created"
              value={myCreatedTiers.length.toString()}
            />
            {myCreatedTiers.length > 0 && (
              <ActivityItem
                icon={<TrendingUp className="size-5" />}
                label="Average Tier Price"
                value={`${calculateAverageTierPrice(myCreatedTiers)} SUI`}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, label, value, color, subtext }: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
  subtext: string
}) {
  return (
    <div className="bg-white border-brutal shadow-brutal p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`${color} border-brutal-sm p-2 shadow-brutal-sm`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-2xl font-black text-gray-900">{value}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 font-medium">{subtext}</p>
    </div>
  )
}

function CreatorStatCard({ icon, label, value, color }: {
  icon: React.ReactNode
  label: string
  value: number | string
  color: string
}) {
  return (
    <div className="bg-gray-50 border-brutal-sm shadow-brutal-sm p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`${color} border-2 border-black p-1.5`}>
          {icon}
        </div>
        <p className="text-xs font-bold text-gray-600 uppercase">{label}</p>
      </div>
      <p className="text-xl font-black text-gray-900">{value}</p>
    </div>
  )
}

function ActivityItem({ icon, label, value }: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 border-brutal-sm">
      <div className="bg-gray-900 border-2 border-black p-2">
        <div className="text-white">{icon}</div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-600 uppercase">{label}</p>
        <p className="text-base font-black text-gray-900">{value}</p>
      </div>
    </div>
  )
}

function calculateAccountAge(address: string): string {
  // This is a placeholder - in reality you'd track account creation time
  // For now, we'll just return a generic message
  return 'Recent'
}

function calculateAverageTierPrice(tiers: Array<{ price: string }>): string {
  if (tiers.length === 0) return '0.00'
  const total = tiers.reduce((sum, tier) => sum + Number(tier.price), 0)
  const average = total / tiers.length / 1_000_000_000
  return average.toFixed(2)
}
