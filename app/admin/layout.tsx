import type { Metadata } from 'next'
import { AdminNav } from '@/components/admin/admin-nav'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Petal & Bloom',
  description: 'Administrator dashboard for managing the flower store',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 bg-background overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
