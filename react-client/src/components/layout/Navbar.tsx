import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { Store, CheckCircle, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const currentAccount = useCurrentAccount()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-brand-600 rounded-lg p-2">
              <Store className="size-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                Block Bazaar
              </h1>
              <p className="text-xs text-gray-500">Decentralized Content Platform</p>
            </div>
          </Link>

          {/* Center Navigation */}
          {currentAccount && (
            <div className="flex items-center gap-1">
              <NavLink
                to="/dashboard"
                icon={<Store className="size-4" />}
                label="Browse"
                isActive={isActive('/dashboard')}
              />
              <NavLink
                to="/subscriptions"
                icon={<CheckCircle className="size-4" />}
                label="My Content"
                isActive={isActive('/subscriptions')}
              />
              <NavLink
                to="/profile"
                icon={<User className="size-4" />}
                label="Profile"
                isActive={isActive('/profile')}
              />
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {currentAccount ? (
              <>

                {/* Connect Button in nav style */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <ConnectButton />
                </div>
              </>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <ConnectButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, icon, label, isActive }: {
  to: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
        isActive
          ? 'bg-brand-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  )
}
