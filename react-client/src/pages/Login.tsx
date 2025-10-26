import { ConnectButton } from '@mysten/dapp-kit'
import { Lock, Upload, Download, Store } from 'lucide-react'

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b-4 border-black">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-brand-600 border-brutal-sm p-2 shadow-brutal-sm">
              <Store className="size-6 text-white" />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">
              Block Bazaar
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="bg-brand-600 border-brutal shadow-brutal-xl p-12 mb-8">
              <h1 className="text-5xl font-black text-white mb-4 uppercase tracking-tight">
                Decentralized Content<br />Subscription Platform
              </h1>
              <p className="text-lg text-white font-bold mb-8 opacity-90 max-w-2xl mx-auto">
                Create subscription tiers, upload encrypted content to Walrus storage, and monetize your work on the Sui blockchain
              </p>

              <div className="inline-block bg-white border-brutal-sm shadow-brutal-lg">
                <ConnectButton/>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <FeatureCard
              icon={<Upload className="size-10" />}
              title="Create & Monetize"
              description="Set up subscription tiers and upload content encrypted with SEAL. Set your own prices in SUI."
              color="bg-blue-400"
            />
            <FeatureCard
              icon={<Lock className="size-10" />}
              title="Encrypted Storage"
              description="All content stored on Walrus decentralized storage with SEAL encryption for maximum privacy."
              color="bg-premium-400"
            />
            <FeatureCard
              icon={<Download className="size-10" />}
              title="Subscribe & Access"
              description="Subscribe to creators using SUI tokens and instantly access their exclusive encrypted content."
              color="bg-green-400"
            />
          </div>

          {/* How It Works */}
          <div className="bg-white border-brutal shadow-brutal-lg p-8">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6">
              How It Works
            </h2>
            <div className="space-y-4">
              <Step
                number="1"
                title="Connect Your Sui Wallet"
                description="Authenticate with your Sui wallet to get started"
              />
              <Step
                number="2"
                title="For Creators: Upload Content"
                description="Create subscription tiers, upload files that are automatically encrypted with SEAL and stored on Walrus"
              />
              <Step
                number="3"
                title="For Subscribers: Browse & Subscribe"
                description="Discover creators, subscribe with SUI tokens, and get instant access to decrypt and view content"
              />
              <Step
                number="4"
                title="Fully Decentralized"
                description="Everything on Sui blockchain + Walrus storage. No centralized servers, complete ownership."
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

function Step({ number, title, description }: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 border-brutal-sm">
      <div className="bg-brand-600 border-2 border-black p-3 shadow-brutal-sm shrink-0">
        <span className="text-2xl font-black text-white">{number}</span>
      </div>
      <div>
        <h4 className="font-black text-gray-900 uppercase text-sm tracking-tight mb-1">{title}</h4>
        <p className="text-sm text-gray-600 font-medium">{description}</p>
      </div>
    </div>
  )
}
