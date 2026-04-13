'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import { Mail, Phone, Search, Users, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

interface Customer {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  createdAt: string
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        params.append('page', page.toString())
        params.append('limit', '20')

        const response = await apiClient.get(`/api/customers?${params.toString()}`)
        setCustomers(response.data.data)
        setTotalPages(response.data.pagination.pages)
      } catch {
        toast.error('Failed to load customers')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCustomers()
  }, [search, page])

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground mt-1">View and manage customers</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="pl-10 rounded-xl border-border/60"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="animate-shimmer h-36 rounded-xl" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-serif font-semibold">No customers found</p>
          <p className="text-sm text-muted-foreground">Try a different search term</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {customers.map((customer) => (
              <Card key={customer._id} className="border-border/50 hover-lift transition-all">
                <CardContent className="p-5">
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {customer.firstName[0]}{customer.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {customer.firstName} {customer.lastName}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Joined {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
