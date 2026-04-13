'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/js'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

interface PaymentFormProps {
  orderId: string
  amount: number
  onPaymentSuccess?: () => void
}

export function PaymentForm({
  orderId,
  amount,
  onPaymentSuccess,
}: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInitializePayment = async () => {
    setIsLoading(true)

    try {
      const response = await apiClient.post('/api/payments/intent', {
        orderId,
      })

      setClientSecret(response.data.clientSecret)
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to initialize payment'
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (!clientSecret) {
    return (
      <Button
        onClick={handleInitializePayment}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Initializing...' : 'Pay Now'}
      </Button>
    )
  }

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret }}
    >
      <EmbeddedCheckout onComplete={onPaymentSuccess} />
    </EmbeddedCheckoutProvider>
  )
}
