'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Home,
  LogOut,
  Flower2,
} from 'lucide-react'

export function AdminNav() {
  const { logout } = useAuth()
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/customers', label: 'Customers', icon: Users },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="w-64 bg-card border-r border-border/50 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-xl">🌸</span>
          <div>
            <h2 className="font-serif text-lg font-bold text-gradient">
              Petal & Bloom
            </h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={active ? 'default' : 'ghost'}
                className={`w-full justify-start gap-2.5 rounded-xl h-10 ${
                  active
                    ? 'shadow-sm shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </div>

      {/* Bottom actions */}
      <div className="p-3 border-t border-border/50 space-y-1">
        <Link href="/customer">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2.5 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <Home className="w-4 h-4" />
            View Store
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2.5 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/5"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </nav>
  )
}
