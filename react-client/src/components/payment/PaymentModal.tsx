import { useState } from 'react'
import { AlertCircle, CheckCircle, Loader2, CreditCard } from 'lucide-react'
import { usePayment } from '../../hooks/usePayment'
import type { Asset } from '../../types'

interface PaymentModalProps {
  asset: Asset
  onClose: () => void
  onSuccess: () => void
}

// Replace with your actual recipient address
const RECIPIENT_ADDRESS = '0x742d35cc6634c0532925a3b844bc9c7eb6fb48c7e0b6d2a0e6e9d89c3c4b4a5b'

export default function PaymentModal({ asset, onClose, onSuccess }: PaymentModalProps) {
  const { processPayment, isProcessing } = usePayment()
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handlePayment = async () => {
    if (!asset.price) return

    const result = await processPayment(RECIPIENT_ADDRESS, asset.price)

    if (result.success) {
      setPaymentStatus('success')
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } else {
      setPaymentStatus('error')
      setErrorMessage(result.error || 'Payment failed')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-brutal shadow-brutal-xl max-w-md w-full">
        {paymentStatus === 'idle' && (
          <>
            {/* Header */}
            <div className="border-b-3 border-black bg-premium-400 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white border-brutal-sm p-2 shadow-brutal-sm">
                  <CreditCard className="size-6 text-gray-900" />
                </div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                  Purchase Content
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Important Note */}
              <div className="bg-blue-50 border-brutal-sm p-3 mb-4">
                <p className="text-xs font-bold text-blue-900 uppercase">
                  ⓘ Your wallet will open to approve this SUI token payment
                </p>
              </div>

              <div className="bg-gray-50 border-brutal-sm p-4 mb-6">
                <h3 className="font-black text-gray-900 mb-2 uppercase text-sm tracking-tight">
                  {asset.title}
                </h3>
                <p className="text-sm text-gray-700 mb-4 font-medium">{asset.description}</p>

                <div className="flex justify-between items-center pt-3 border-t-2 border-black">
                  <span className="text-xs text-gray-600 font-bold uppercase">Pay with SUI:</span>
                  <div className="bg-brand-600 border-2 border-black px-3 py-2">
                    <span className="text-xl font-black text-white">
                      {asset.price && (asset.price / 1000000000).toFixed(2)} SUI
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 bg-white border-brutal-sm py-3 font-black uppercase text-sm shadow-brutal-sm hover-brutal transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 bg-brand-600 text-white border-brutal-sm py-3 font-black uppercase text-sm shadow-brutal-sm hover-brutal transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Processing
                    </>
                  ) : (
                    '💳 Pay with SUI'
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {paymentStatus === 'success' && (
          <div className="p-8 text-center">
            <div className="bg-green-400 border-brutal shadow-brutal p-6 mb-6">
              <CheckCircle className="size-16 text-gray-900 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                Payment Success!
              </h2>
              <p className="text-sm text-gray-900 font-bold">
                Content unlocked successfully
              </p>
            </div>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="p-8 text-center">
            <div className="bg-red-400 border-brutal shadow-brutal p-6 mb-6">
              <AlertCircle className="size-16 text-gray-900 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                Payment Failed
              </h2>
              <p className="text-sm text-gray-900 font-bold mb-6">{errorMessage}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-gray-900 text-white py-4 border-brutal-sm font-black uppercase text-sm shadow-brutal-sm hover-brutal transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
