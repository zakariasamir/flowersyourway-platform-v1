'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useCart } from '@/lib/cart-context'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import {
  ShoppingBag,
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Heart,
  Share2,
  Check,
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
  sku: string
  rating: number
  reviewCount: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const res = await apiClient.get(`/api/products/${params.id}`)
        setProduct(res.data.data)

        // Fetch related products from same category
        const relRes = await apiClient.get(
          `/api/products?category=${res.data.data.category}&limit=4`
        )
        setRelatedProducts(
          relRes.data.data.filter((p: Product) => p._id !== params.id)
        )
      } catch {
        toast.error('Product not found')
        router.push('/customer/products')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [params.id, router])

  const handleAddToCart = async () => {
    if (!product) return
    await addItem({
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity,
      image: product.images[0] || '',
    })
    toast.success(`${product.name} added to cart`, {
      description: `Quantity: ${quantity}`,
      action: {
        label: 'View Cart',
        onClick: () => router.push('/customer/cart'),
      },
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="animate-shimmer aspect-square rounded-2xl" />
            <div className="space-y-4">
              <div className="animate-shimmer h-4 rounded w-1/4" />
              <div className="animate-shimmer h-8 rounded w-3/4" />
              <div className="animate-shimmer h-4 rounded w-full" />
              <div className="animate-shimmer h-4 rounded w-2/3" />
              <div className="animate-shimmer h-10 rounded w-1/3 mt-4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/customer" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/customer/products" className="hover:text-primary transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/customer/products?category=${product.category}`}
            className="hover:text-primary transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-fade-in-up">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-square shadow-lg">
              <img
                src={product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="eager"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1.5 rounded-full">
                  {discount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-primary font-medium uppercase tracking-wider mb-1">
                {product.category}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-muted text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="price-badge text-3xl text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Save ${(product.originalPrice! - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              {product.stock > 5 ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">In Stock</span>
                </>
              ) : product.stock > 0 ? (
                <>
                  <Check className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-500">
                    Only {product.stock} left
                  </span>
                </>
              ) : (
                <span className="text-sm font-medium text-destructive">
                  Out of Stock
                </span>
              )}
              <span className="text-xs text-muted-foreground">· SKU: {product.sku}</span>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center border border-border rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button
                size="lg"
                className="rounded-full flex-1 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 gap-2"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                id="add-to-cart-button"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart — ${(product.price * quantity).toFixed(2)}
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
              {[
                { icon: Truck, label: 'Free Delivery', desc: 'Over $75' },
                { icon: Shield, label: 'Fresh Guarantee', desc: '7 days' },
                { icon: RotateCcw, label: 'Easy Returns', desc: '30 days' },
              ].map((benefit) => (
                <div
                  key={benefit.label}
                  className="text-center p-3 rounded-xl bg-muted/50"
                >
                  <benefit.icon className="w-5 h-5 mx-auto mb-1.5 text-primary" />
                  <p className="text-xs font-semibold">{benefit.label}</p>
                  <p className="text-[10px] text-muted-foreground">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {relatedProducts.slice(0, 3).map((rp) => (
                <Card
                  key={rp._id}
                  className="overflow-hidden hover-lift border-border/50 hover:border-primary/20 transition-all duration-300 group"
                >
                  <Link href={`/customer/products/${rp._id}`}>
                    <div className="product-image-wrapper aspect-[4/3]">
                      <img
                        src={rp.images[0] || '/placeholder.jpg'}
                        alt={rp.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </Link>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">{rp.rating}</span>
                    </div>
                    <Link href={`/customer/products/${rp._id}`}>
                      <h3 className="font-serif font-semibold hover:text-primary transition-colors line-clamp-1">
                        {rp.name}
                      </h3>
                    </Link>
                    <p className="price-badge text-primary mt-1">
                      ${rp.price.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
