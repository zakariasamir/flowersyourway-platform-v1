'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useCart } from '@/lib/cart-context'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
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
  icon: string
}

export default function ShopPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const { addItem } = useCart()

  useEffect(() => {
    apiClient.get('/api/categories').then((res) => {
      setCategories(res.data.data)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (category) params.append('category', category)
        params.append('sortBy', sortBy)
        params.append('order', order)
        params.append('page', page.toString())
        params.append('limit', '12')

        const response = await apiClient.get(`/api/products?${params.toString()}`)
        setProducts(response.data.data)
        setTotalPages(response.data.pagination.pages)
        setTotal(response.data.pagination.total)
      } catch (error) {
        toast.error('Failed to load products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [search, category, sortBy, order, page])

  const handleAddToCart = async (product: Product) => {
    await addItem({
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || '',
    })
    toast.success(`${product.name} added to cart`)
  }

  const sortOptions = [
    { label: 'Newest', sortBy: 'createdAt', order: 'desc' },
    { label: 'Price: Low → High', sortBy: 'price', order: 'asc' },
    { label: 'Price: High → Low', sortBy: 'price', order: 'desc' },
    { label: 'Top Rated', sortBy: 'rating', order: 'desc' },
    { label: 'Most Popular', sortBy: 'reviewCount', order: 'desc' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-hero-gradient bg-floral-pattern border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            {category ? category : 'Our Collection'}
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            {category
              ? `Browse our beautiful ${category.toLowerCase()} collection`
              : 'Discover our full range of fresh, hand-crafted floral arrangements'}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search flowers..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10 rounded-full border-border/60 bg-card"
              id="search-input"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-1.5 flex-wrap">
              {sortOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setSortBy(opt.sortBy)
                    setOrder(opt.order)
                    setPage(1)
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    sortBy === opt.sortBy && order === opt.order
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => {
              setCategory('')
              setPage(1)
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              !category
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card border border-border/60 text-muted-foreground hover:border-primary/30 hover:text-primary'
            }`}
          >
            All Flowers
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                setCategory(cat.name)
                setPage(1)
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                category === cat.name
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card border border-border/60 text-muted-foreground hover:border-primary/30 hover:text-primary'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Active filter badge */}
        {(search || category) && (
          <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <span>{total} result{total !== 1 ? 's' : ''}</span>
            {category && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-medium">
                {category}
                <button onClick={() => setCategory('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-medium">
                &quot;{search}&quot;
                <button onClick={() => setSearch('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="animate-shimmer aspect-[4/3]" />
                <CardContent className="p-5 space-y-3">
                  <div className="animate-shimmer h-4 rounded w-3/4" />
                  <div className="animate-shimmer h-3 rounded w-full" />
                  <div className="animate-shimmer h-6 rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌿</div>
            <h3 className="font-serif text-xl font-semibold mb-2">
              No flowers found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                setSearch('')
                setCategory('')
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
              {products.map((product) => (
                <Card
                  key={product._id}
                  className="overflow-hidden hover-lift border-border/50 hover:border-primary/20 transition-all duration-300 group"
                >
                  <Link href={`/customer/products/${product._id}`}>
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
                      {product.stock < 5 && product.stock > 0 && (
                        <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          Only {product.stock} left
                        </div>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-5">
                    <p className="text-xs text-primary/70 font-medium mb-1 uppercase tracking-wider">
                      {product.category}
                    </p>
                    <div className="flex items-center gap-1 mb-1.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <Link href={`/customer/products/${product._id}`}>
                      <h3 className="font-serif font-semibold text-base mb-1 hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
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
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all h-9 w-9 p-0"
                        onClick={(e) => {
                          e.preventDefault()
                          handleAddToCart(product)
                        }}
                        title="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                          page === pageNum
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
