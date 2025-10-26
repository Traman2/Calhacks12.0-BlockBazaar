import { ConnectButton, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit'
import { LogOut, Wallet } from 'lucide-react'

export default function Navbar() {
  const currentAccount = useCurrentAccount()
  const { mutate: disconnect } = useDisconnectWallet()

  return (
    <nav className="bg-white border-b-4 border-black">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="bg-brand-600 border-brutal-sm p-2 shadow-brutal-sm">
              <Wallet className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                Sui Content Hub
              </h1>
              <p className="text-xs text-gray-600 font-medium">Decentralized Platform</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {currentAccount ? (
              <>
                {/* Wallet Address Box */}
                <div className="hidden md:flex items-center gap-2 bg-gray-100 border-brutal-sm px-4 py-2 shadow-brutal-sm">
                  <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono font-bold text-gray-900">
                    {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
                  </span>
                </div>

                {/* Disconnect Button */}
                <button
                  onClick={() => disconnect()}
                  className="flex items-center gap-2 bg-white border-brutal-sm px-4 py-2 font-bold text-gray-900 shadow-brutal-sm hover-brutal transition-all"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Disconnect</span>
                </button>
              </>
            ) : (
              <div className="border-brutal-sm shadow-brutal-sm">
                <ConnectButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
