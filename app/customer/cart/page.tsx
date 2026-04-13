'use client'

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Truck,
  Shield,
  Tag,
} from 'lucide-react'

export default function CartPage() {
  const {
    items,
    isLoading,
    removeItem,
    updateQuantity,
    subtotal,
    tax,
    shippingCost,
    total,
    itemCount,
  } = useCart()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="animate-shimmer h-8 rounded w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-shimmer h-28 rounded-xl" />
              ))}
            </div>
            <div className="animate-shimmer h-64 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">
          Shopping Cart
        </h1>
        <p className="text-muted-foreground mb-8">
          {itemCount > 0
            ? `${itemCount} item${itemCount > 1 ? 's' : ''} in your cart`
            : 'Your cart is empty'}
        </p>

        {items.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-semibold mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any flowers yet. Browse our
              collection and find something beautiful!
            </p>
            <Link href="/customer/products">
              <Button size="lg" className="rounded-full px-8 gap-2">
                <ShoppingBag className="w-4 h-4" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card
                  key={item.productId}
                  className="border-border/50 overflow-hidden hover:border-primary/10 transition-colors"
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex gap-4">
                      <Link href={`/customer/products/${item.productId}`}>
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                          <img
                            src={item.image || '/placeholder.jpg'}
                            alt={item.productName}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <Link href={`/customer/products/${item.productId}`}>
                            <h3 className="font-serif font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-1">
                              {item.productName}
                            </h3>
                          </Link>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          ${item.price.toFixed(2)} each
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-border rounded-full overflow-hidden">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="price-badge text-base text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Link href="/customer/products" className="inline-block">
                <Button
                  variant="ghost"
                  className="gap-2 text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24 border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="font-serif text-xl">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Subtotal ({itemCount} items)
                      </span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shippingCost === 0
                          ? 'Free'
                          : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    {subtotal >= 75 && (
                      <div className="flex items-center gap-1.5 text-green-600 text-xs bg-green-50 px-3 py-1.5 rounded-lg">
                        <Truck className="w-3.5 h-3.5" />
                        You qualify for free shipping!
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border/50 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Link href="/customer/checkout" className="block">
                    <Button
                      className="w-full rounded-full shadow-lg shadow-primary/20 gap-2"
                      size="lg"
                      id="checkout-button"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <Shield className="w-3.5 h-3.5" />
                    Secure checkout powered by Stripe
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
