import type { Metadata } from 'next'
import { AdminNav } from '@/components/admin/admin-nav'
import { AdminGuard } from '@/components/admin/admin-guard'

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
    <AdminGuard>
      <div className="flex flex-col lg:flex-row min-h-screen bg-background">
        <AdminNav />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminGuard>
  )
}
