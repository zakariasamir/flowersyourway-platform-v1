'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import apiClient from '@/lib/api-client'

export interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  items: CartItem[]
  isLoading: boolean
  addItem: (item: CartItem) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  subtotal: number
  tax: number
  shippingCost: number
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'shopping-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  // Load cart from localStorage on mount (works for guests too)
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEY)
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch {
        // ignore parse errors
      }
    }
    setIsLoading(false)
  }, [])

  // Sync to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isLoading])

  // Sync with server cart when user logs in
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      syncWithServer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const syncWithServer = async () => {
    try {
      // Push local items to server
      for (const item of items) {
        await apiClient.post('/api/cart', {
          productId: item.productId,
          quantity: item.quantity,
        }).catch(() => {})
      }
      // Fetch merged server cart
      const res = await apiClient.get('/api/cart')
      if (res.data.success) {
        setItems(res.data.data.items)
      }
    } catch {
      // Fallback to local cart if server unreachable
    }
  }

  const addItem = useCallback(async (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId)
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })

    if (isAuthenticated) {
      try {
        await apiClient.post('/api/cart', {
          productId: item.productId,
          quantity: item.quantity,
        })
      } catch {
        // Already updated locally
      }
    }
  }, [isAuthenticated])

  const removeItem = useCallback(async (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))

    if (isAuthenticated) {
      try {
        await apiClient.delete(`/api/cart/${productId}`)
      } catch {
        // Already updated locally
      }
    }
  }, [isAuthenticated])

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId)
      return
    }

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )

    if (isAuthenticated) {
      try {
        await apiClient.put(`/api/cart/${productId}`, { quantity })
      } catch {
        // Already updated locally
      }
    }
  }, [isAuthenticated, removeItem])

  const clearCart = useCallback(async () => {
    setItems([])

    if (isAuthenticated) {
      try {
        await apiClient.delete('/api/cart')
      } catch {
        // Already cleared locally
      }
    }
  }, [isAuthenticated])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const shippingCost = items.length > 0 ? 10 : 0
  const total = subtotal + tax + shippingCost

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        tax,
        shippingCost,
        total,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
