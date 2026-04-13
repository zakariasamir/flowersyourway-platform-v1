'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import { Eye, EyeOff, Flower2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back! 🌸')
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-hero-gradient bg-floral-pattern">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10" />
        <img
          src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&h=1000&fit=crop"
          alt="Beautiful flowers"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative text-center px-12 space-y-6 z-10">
          <div className="text-5xl mb-4">🌸</div>
          <h2 className="font-serif text-4xl font-bold text-foreground">
            Welcome Back
          </h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Sign in to continue shopping and track your orders
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6 animate-fade-in-up">
          {/* Mobile logo */}
          <div className="text-center lg:hidden">
            <Link href="/customer" className="inline-flex items-center gap-2">
              <span className="text-3xl">🌸</span>
              <span className="font-serif text-2xl font-bold text-gradient">
                Petal & Bloom
              </span>
            </Link>
          </div>

          <Card className="border-border/50 shadow-xl shadow-primary/5">
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-1.5 mb-6">
                <h1 className="font-serif text-2xl font-bold">Sign In</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials to access your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Email
                  </label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="rounded-xl border-border/60"
                  />
                </div>
                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="rounded-xl border-border/60 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full shadow-lg shadow-primary/20 gap-2"
                  size="lg"
                  disabled={isLoading}
                  id="login-submit"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </Button>
              </form>

              {/* Demo credentials */}
              <div className="mt-5 p-3 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">
                  Demo accounts:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground/70">Customer</p>
                    <p>customer@flowers.com</p>
                    <p>customer123</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground/70">Admin</p>
                    <p>admin@flowers.com</p>
                    <p>admin123</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/register"
                  className="text-primary font-medium hover:underline"
                >
                  Create one
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
