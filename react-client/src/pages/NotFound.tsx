import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-black text-brand-600 mb-4">404</h1>
          <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
            Page Not Found
          </h2>
          <p className="text-gray-600 font-medium">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3 border-brutal-sm shadow-brutal-sm hover-brutal font-black uppercase text-sm"
          >
            <Home className="size-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-gray-200 text-gray-900 px-6 py-3 border-brutal-sm shadow-brutal-sm hover-brutal font-black uppercase text-sm"
          >
            <ArrowLeft className="size-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
