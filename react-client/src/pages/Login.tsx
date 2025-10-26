import { ConnectButton } from '@mysten/dapp-kit'
import { Lock, Wallet, Shield, Zap, Crown } from 'lucide-react'

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b-4 border-black">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-brand-600 border-brutal-sm p-2 shadow-brutal-sm">
              <Wallet className="size-6 text-white" />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">
              Sui Content Hub
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="bg-brand-600 border-brutal shadow-brutal-xl p-12 mb-8">
              <h1 className="text-6xl font-black text-white mb-6 uppercase tracking-tighter">
                Decentralized<br />Content Platform
              </h1>
              <p className="text-xl text-white font-bold mb-8 opacity-90">
                Access premium content using SUI blockchain technology
              </p>

              <div className="inline-block border-brutal-sm shadow-brutal-lg">
                <ConnectButton />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <FeatureCard
              icon={<Wallet className="size-10" />}
              title="Connect Wallet"
              description="Use your Sui wallet to authenticate and make payments"
              color="bg-blue-400"
            />
            <FeatureCard
              icon={<Lock className="size-10" />}
              title="Premium Content"
              description="Access exclusive encrypted content with SUI tokens"
              color="bg-premium-400"
            />
            <FeatureCard
              icon={<Shield className="size-10" />}
              title="Secure & Decentralized"
              description="Built on Sui blockchain for maximum security"
              color="bg-green-400"
            />
          </div>

          {/* Content Preview */}
          <div className="bg-white border-brutal shadow-brutal-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-600 border-brutal-sm p-2 shadow-brutal-sm">
                <Zap className="size-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                What's Available
              </h2>
            </div>
            <div className="space-y-3">
              <ContentItem
                title="5 Free Resources"
                description="Learn blockchain basics"
                icon={<Wallet className="size-5" />}
              />
              <ContentItem
                title="5 Premium Courses"
                description="Advanced tutorials and guides"
                icon={<Crown className="size-5" />}
                isPremium
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  return (
    <div className="bg-white border-brutal shadow-brutal hover-brutal transition-all p-6">
      <div className={`${color} border-brutal-sm p-3 inline-block shadow-brutal-sm mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-gray-700 font-medium leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function ContentItem({ title, description, icon, isPremium = false }: {
  title: string
  description: string
  icon: React.ReactNode
  isPremium?: boolean
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border-brutal-sm">
      <div className="flex items-center gap-3">
        <div className={`${isPremium ? 'bg-premium-400' : 'bg-blue-400'} border-2 border-black p-2`}>
          {icon}
        </div>
        <div>
          <h4 className="font-black text-gray-900 uppercase text-sm tracking-tight">{title}</h4>
          <p className="text-xs text-gray-600 font-medium">{description}</p>
        </div>
      </div>
      {isPremium && (
        <div className="bg-premium-400 border-brutal-sm px-3 py-1 shadow-brutal-sm">
          <span className="text-xs font-black text-gray-900 uppercase">Premium</span>
        </div>
      )}
    </div>
  )
}
