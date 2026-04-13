'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import { Plus, Trash2, Edit, Search, Package, ChevronLeft, ChevronRight } from 'lucide-react'

interface Product {
  _id: string
  name: string
  price: number
  category: string
  stock: number
  sku: string
  images: string[]
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        params.append('page', page.toString())
        params.append('limit', '20')

        const response = await apiClient.get(`/api/products?${params.toString()}`)
        setProducts(response.data.data)
        setTotalPages(response.data.pagination.pages)
      } catch {
        toast.error('Failed to load products')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [search, page])

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await apiClient.delete(`/api/products/${productId}`)
      setProducts((prev) => prev.filter((p) => p._id !== productId))
      toast.success('Product deleted successfully')
    } catch {
      toast.error('Failed to delete product')
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your flower inventory</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="pl-10 rounded-xl border-border/60"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="animate-shimmer h-16 rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-serif font-semibold">No products found</p>
          <p className="text-sm text-muted-foreground">Try a different search term</p>
        </div>
      ) : (
        <>
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border/50">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Product</th>
                      <th className="px-5 py-3 text-left font-semibold text-muted-foreground">SKU</th>
                      <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Category</th>
                      <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Price</th>
                      <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Stock</th>
                      <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <img
                                src={product.images?.[0] || '/placeholder.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{product.sku}</td>
                        <td className="px-5 py-3">
                          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-semibold">${product.price.toFixed(2)}</td>
                        <td className="px-5 py-3">
                          <span className={`font-medium ${product.stock < 5 ? 'text-amber-600' : 'text-green-600'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 rounded-lg"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <Button variant="outline" size="icon" className="rounded-full" disabled={page === 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <Button variant="outline" size="icon" className="rounded-full" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
