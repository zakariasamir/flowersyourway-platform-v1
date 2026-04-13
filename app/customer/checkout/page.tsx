'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Shield,
  ChevronRight,
  Package,
  Check,
} from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { items, subtotal, tax, shippingCost, total, clearCart, itemCount } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState(1)

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  })

  const [useSameAsShipping, setUseSameAsShipping] = useState(true)
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-3">
            Sign in to Checkout
          </h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to your account to complete your purchase
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="rounded-full px-8">
              Sign In
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Package className="w-7 h-7 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-3">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-6">
            Add some beautiful flowers before checking out
          </p>
          <Link href="/customer/products">
            <Button size="lg" className="rounded-full px-8">
              Browse Flowers
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleShippingChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handlePlaceOrder = async () => {
    // Validate shipping
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      toast.error('Please fill in all shipping address fields')
      setStep(1)
      return
    }

    setIsProcessing(true)
    try {
      const finalBillingAddress = useSameAsShipping ? shippingAddress : billingAddress

      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress,
        billingAddress: finalBillingAddress,
        shippingCost: 10,
      }

      const response = await apiClient.post('/api/orders', orderData)
      await clearCart()

      toast.success('Order placed successfully! 🎉', {
        description: `Order #${response.data.data.orderNumber}`,
      })
      router.push('/customer/account')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setIsProcessing(false)
    }
  }

  const AddressField = ({
    label,
    value,
    field,
    onChange,
  }: {
    label: string
    value: string
    field: string
    onChange: (field: string, value: string) => void
  }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-foreground/80">
        {label}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="rounded-xl border-border/60 bg-card"
        required
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/customer/cart">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="font-serif text-3xl font-bold">Checkout</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {['Shipping', 'Review & Pay'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => setStep(i + 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step === i + 1
                    ? 'bg-primary text-primary-foreground'
                    : step > i + 1
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > i + 1 ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                )}
                {label}
              </button>
              {i < 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in-up">
          {/* Form */}
          <div className="lg:col-span-3 space-y-6">
            {step === 1 && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AddressField
                    label="Street Address"
                    value={shippingAddress.street}
                    field="street"
                    onChange={handleShippingChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <AddressField
                      label="City"
                      value={shippingAddress.city}
                      field="city"
                      onChange={handleShippingChange}
                    />
                    <AddressField
                      label="State / Province"
                      value={shippingAddress.state}
                      field="state"
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <AddressField
                      label="Postal Code"
                      value={shippingAddress.postalCode}
                      field="postalCode"
                      onChange={handleShippingChange}
                    />
                    <AddressField
                      label="Country"
                      value={shippingAddress.country}
                      field="country"
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useSameAsShipping}
                        onChange={(e) => setUseSameAsShipping(e.target.checked)}
                        className="rounded border-border accent-primary"
                      />
                      <span className="text-sm">
                        Billing address same as shipping
                      </span>
                    </label>
                  </div>

                  <Button
                    className="w-full rounded-full gap-2"
                    size="lg"
                    onClick={() => setStep(2)}
                  >
                    Continue to Review
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <>
                {/* Shipping summary */}
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="font-serif text-base flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Shipping to
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStep(1)}
                        className="text-xs"
                      >
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {shippingAddress.street}, {shippingAddress.city},{' '}
                      {shippingAddress.state} {shippingAddress.postalCode},{' '}
                      {shippingAddress.country}
                    </p>
                  </CardContent>
                </Card>

                {/* Order items */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      Order Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-3 py-2"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={item.image || '/placeholder.jpg'}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Button
                  className="w-full rounded-full shadow-lg shadow-primary/20 gap-2"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  id="place-order-button"
                >
                  <CreditCard className="w-5 h-5" />
                  {isProcessing ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
                </Button>
              </>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24 border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-lg">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-muted-foreground"
                    >
                      <span className="truncate mr-2">
                        {item.productName} × {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/50 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-2">
                  <Shield className="w-3.5 h-3.5" />
                  Secure checkout
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
