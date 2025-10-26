import { Routes, Route, Navigate } from 'react-router-dom'
import { useCurrentAccount } from '@mysten/dapp-kit'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
