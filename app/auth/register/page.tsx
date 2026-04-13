'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()

  const passwordChecks = [
    { label: 'At least 6 characters', valid: password.length >= 6 },
    { label: 'Passwords match', valid: password === confirmPassword && confirmPassword.length > 0 },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      await register(firstName, lastName, email, password)
      toast.success('Account created! Welcome to Petal & Bloom 🌸')
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-hero-gradient bg-floral-pattern">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/10" />
        <img
          src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&h=1000&fit=crop"
          alt="Beautiful wildflowers"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative text-center px-12 space-y-6 z-10">
          <div className="text-5xl mb-4">💐</div>
          <h2 className="font-serif text-4xl font-bold text-foreground">
            Join Our Garden
          </h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Create an account to enjoy exclusive deals, track orders, and save your favorites
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
                <h1 className="font-serif text-2xl font-bold">
                  Create Account
                </h1>
                <p className="text-sm text-muted-foreground">
                  Sign up to start your flower shopping journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="reg-firstName"
                      className="block text-sm font-medium mb-1.5"
                    >
                      First Name
                    </label>
                    <Input
                      id="reg-firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={isLoading}
                      className="rounded-xl border-border/60"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="reg-lastName"
                      className="block text-sm font-medium mb-1.5"
                    >
                      Last Name
                    </label>
                    <Input
                      id="reg-lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      disabled={isLoading}
                      className="rounded-xl border-border/60"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Email
                  </label>
                  <Input
                    id="reg-email"
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
                    htmlFor="reg-password"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
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
                <div>
                  <label
                    htmlFor="reg-confirm"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="rounded-xl border-border/60"
                  />
                </div>

                {/* Password strength indicators */}
                {password.length > 0 && (
                  <div className="space-y-1.5">
                    {passwordChecks.map((check) => (
                      <div
                        key={check.label}
                        className={`flex items-center gap-2 text-xs ${
                          check.valid
                            ? 'text-green-600'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 ${
                            check.valid ? 'opacity-100' : 'opacity-30'
                          }`}
                        />
                        {check.label}
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-full shadow-lg shadow-primary/20 gap-2"
                  size="lg"
                  disabled={isLoading}
                  id="register-submit"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
