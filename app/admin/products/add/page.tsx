'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { LuArrowLeft as ArrowLeft, LuUpload as Upload, LuLoader as Loader2, LuSave as Save } from "react-icons/lu";
import Link from 'next/link'

interface Category {
  _id: string
  name: string
}

export default function AddProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stock: '',
    sku: '',
  })
  const [images, setImages] = useState<File[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get('/api/categories')
        setCategories(res.data.data || [])
      } catch (err) {
        toast.error('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      
      const submitData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value as string)
      })
      images.forEach(image => {
        submitData.append('images', image)
      })

      await apiClient.post('/api/products', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Product created successfully')
      router.push('/admin/products')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold">Add Product</h1>
          <p className="text-muted-foreground mt-1">Create a new product for your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic details about your product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name *</label>
                  <Input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Dozen Red Roses" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    required 
                    placeholder="Describe the product..." 
                    className="min-h-[120px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SKU *</label>
                    <Input 
                      name="sku" 
                      value={formData.sku} 
                      onChange={handleChange} 
                      required 
                      placeholder="e.g. ROSE-RED-12" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category *</label>
                    <select 
                      name="categoryId" 
                      value={formData.categoryId} 
                      onChange={handleChange as any} 
                      required 
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="" disabled>Select category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price (MAD) *</label>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleChange} 
                      required 
                      placeholder="e.g. 49.99" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stock *</label>
                    <Input 
                      type="number" 
                      min="0" 
                      name="stock" 
                      value={formData.stock} 
                      onChange={handleChange} 
                      required 
                      placeholder="e.g. 100" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Provide image URLs (one per line).</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input 
                    type="file"
                    name="images" 
                    onChange={handleImageChange} 
                    required 
                    multiple
                    accept="image/*"
                  />
                  {images.length > 0 && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Selected {images.length} file(s).
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">You can select multiple images. The first one will be used as the primary image.</p>
                </div>
              </CardContent>
            </Card>

            <div className="sticky top-20 mt-6">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
