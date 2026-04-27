"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  price_offer?: number | null
  quantity: number
  image: string
  slug: string
  variant?: string
  sku?: string
  variant_id?: string | null
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      // Create a unique identifier combining id and variant
      const itemKey = item.variant ? `${item.id}-${item.variant}` : item.id
      const existingItem = prevItems.find((i) => {
        const existingKey = i.variant ? `${i.id}-${i.variant}` : i.id
        return existingKey === itemKey
      })

      if (existingItem) {
        return prevItems.map((i) => {
          const currentKey = i.variant ? `${i.id}-${i.variant}` : i.id
          return currentKey === itemKey ? { ...i, quantity: i.quantity + item.quantity } : i
        })
      }
      return [...prevItems, item]
    })
  }

  const removeItem = (itemKey: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => {
        const currentKey = item.variant ? `${item.id}-${item.variant}` : item.id
        return currentKey !== itemKey
      }),
    )
  }

  const updateQuantity = (itemKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemKey)
      return
    }
    setItems((prevItems) =>
      prevItems.map((item) => {
        const currentKey = item.variant ? `${item.id}-${item.variant}` : item.id
        return currentKey === itemKey ? { ...item, quantity } : item
      }),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
