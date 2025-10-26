import { Routes, Route, Navigate } from 'react-router-dom'
import { useCurrentAccount } from '@mysten/dapp-kit'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MySubscriptions from './pages/MySubscriptions'
import Profile from './pages/Profile'
import TierContent from './pages/TierContent'
import NotFound from './pages/NotFound'

function App() {
  const currentAccount = useCurrentAccount()

  return (
    <Routes>
      <Route
        path="/"
        element={
          currentAccount ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/dashboard"
        element={
          currentAccount ? <Dashboard /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/subscriptions"
        element={
          currentAccount ? <MySubscriptions /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/profile"
        element={
          currentAccount ? <Profile /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/tier/:tierId"
        element={
          currentAccount ? <TierContent /> : <Navigate to="/" replace />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
