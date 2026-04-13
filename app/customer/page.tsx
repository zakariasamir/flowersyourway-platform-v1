'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useCart } from '@/lib/cart-context'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import {
  ShoppingBag,
  Truck,
  Heart,
  Star,
  ArrowRight,
  Sparkles,
  Gift,
  Clock,
} from 'lucide-react'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  images: string[]
  stock: number
  rating: number
  reviewCount: number
}

interface Category {
  _id: string
  name: string
  slug: string
  description: string
  icon: string
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          apiClient.get('/api/products?limit=8&sortBy=rating&order=desc'),
          apiClient.get('/api/categories'),
        ])
        setFeaturedProducts(productsRes.data.data)
        setCategories(categoriesRes.data.data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAddToCart = async (product: Product) => {
    await addItem({
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || '',
    })
    toast.success(`${product.name} added to cart`, {
      description: 'View your cart to checkout',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden bg-hero-gradient bg-floral-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Fresh Flowers Daily
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Beautiful Blooms
                <br />
                <span className="text-gradient">for Every Moment</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Hand-crafted arrangements made with love. From romantic roses to
                cheerful sunflowers, find the perfect flowers to brighten any
                occasion.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/customer/products">
                  <Button
                    size="lg"
                    className="rounded-full px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                  >
                    Shop Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/customer/products?category=Bouquets">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 border-primary/30 hover:bg-primary/5"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Gift Bouquets
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg ml-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
                <img
                  src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&h=600&fit=crop"
                  alt="Beautiful flower bouquet"
                  className="relative rounded-3xl object-cover w-full h-full shadow-2xl"
                  loading="eager"
                />
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-5 py-3 shadow-xl animate-fade-in-up"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Free Delivery</p>
                      <p className="text-xs text-muted-foreground">
                        On orders over $75
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TRUST BADGES ==================== */}
      <section className="border-b border-border/50 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, label: 'Free Shipping', desc: 'Orders over $75' },
              { icon: Heart, label: 'Fresh Guarantee', desc: '7-day freshness' },
              { icon: Clock, label: 'Same Day Delivery', desc: 'Order by 2pm' },
              { icon: Gift, label: 'Gift Wrapping', desc: 'Complimentary' },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-3 px-3 py-2"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{badge.label}</p>
                  <p className="text-xs text-muted-foreground">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CATEGORIES ==================== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Browse our curated collection of premium flowers
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-shimmer rounded-2xl h-32"
                  />
                ))
              : categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/customer/products?category=${cat.name}`}
                  >
                    <Card className="hover-lift cursor-pointer border-border/50 hover:border-primary/30 transition-all duration-300 group h-full">
                      <CardContent className="p-5 text-center flex flex-col items-center justify-center gap-2">
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          {cat.icon}
                        </span>
                        <h3 className="font-serif font-semibold text-sm">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {cat.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="py-16 sm:py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-2">
                Featured Flowers
              </h2>
              <p className="text-muted-foreground">
                Our most popular and highest-rated arrangements
              </p>
            </div>
            <Link href="/customer/products">
              <Button
                variant="outline"
                className="rounded-full border-primary/30 hover:bg-primary/5"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="animate-shimmer h-56" />
                    <CardContent className="p-5 space-y-3">
                      <div className="animate-shimmer h-5 rounded w-3/4" />
                      <div className="animate-shimmer h-4 rounded w-full" />
                      <div className="animate-shimmer h-8 rounded w-1/3" />
                    </CardContent>
                  </Card>
                ))
              : featuredProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="overflow-hidden hover-lift border-border/50 hover:border-primary/20 transition-all duration-300 group"
                  >
                    <div className="product-image-wrapper aspect-[4/3]">
                      <img
                        src={product.images[0] || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {product.originalPrice && (
                        <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                          {Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                              100
                          )}
                          % OFF
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleAddToCart(product)
                        }}
                        className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        title="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium">
                          {product.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviewCount})
                        </span>
                      </div>
                      <Link href={`/customer/products/${product._id}`}>
                        <h3 className="font-serif font-semibold text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="price-badge text-lg text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA BANNER ==================== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/90 to-primary/70 p-8 sm:p-12 lg:p-16">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=1200&h=400&fit=crop')] opacity-10 bg-cover bg-center" />
            <div className="relative text-center space-y-5 max-w-2xl mx-auto">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Make Someone's Day Special
              </h2>
              <p className="text-white/80 text-lg">
                Order by 2pm for same-day delivery. Every arrangement is crafted
                with fresh, seasonal blooms.
              </p>
              <Link href="/customer/products">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full px-10 shadow-lg mt-2"
                >
                  Order Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
