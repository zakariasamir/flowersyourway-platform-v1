'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import {
  User,
  Package,
  MapPin,
  LogOut,
  ShoppingBag,
  Clock,
  Check,
  ChevronRight,
} from 'lucide-react'

interface Order {
  _id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
  items: Array<{ productName: string; quantity: number; price: number; image: string }>
}

export default function AccountPage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/api/orders')
      setOrders(response.data.data)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setIsLoadingOrders(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await apiClient.put('/api/customers/profile', {
        firstName,
        lastName,
        phone,
      })
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
          <div className="animate-shimmer h-8 rounded w-48" />
          <div className="animate-shimmer h-64 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <User className="w-7 h-7 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-3">
            Sign in Required
          </h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your account
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold">
              My Account
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.firstName}!
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/5"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6 animate-fade-in-up">
          <TabsList className="bg-muted/60 p-1 rounded-full">
            <TabsTrigger
              value="profile"
              className="rounded-full gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-full gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <Package className="w-4 h-4" />
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        First Name
                      </label>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isSaving}
                        className="rounded-xl border-border/60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Last Name
                      </label>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isSaving}
                        className="rounded-xl border-border/60"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Email
                    </label>
                    <Input
                      value={user.email}
                      disabled
                      className="rounded-xl bg-muted/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Phone
                    </label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      disabled={isSaving}
                      className="rounded-xl border-border/60"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-full px-8"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-shimmer h-24 rounded-xl"
                      />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="font-serif font-semibold mb-1">
                      No orders yet
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start shopping to see your orders here
                    </p>
                    <Link href="/customer/products">
                      <Button className="rounded-full" size="sm">
                        Browse Flowers
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">
                              {order.orderNumber}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString(
                                  'en-US',
                                  {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                          <span className="price-badge text-sm text-primary">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
