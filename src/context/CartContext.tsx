import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Pizza } from '@/data/pizzas'

export interface CartItem {
  pizza: Pizza
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (pizza: Pizza) => void
  removeItem: (pizzaId: string) => void
  updateQuantity: (pizzaId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((pizza: Pizza) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.pizza.id === pizza.id)
      if (existing) {
        return prev.map((item) =>
          item.pizza.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { pizza, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((pizzaId: string) => {
    setItems((prev) => prev.filter((item) => item.pizza.id !== pizzaId))
  }, [])

  const updateQuantity = useCallback((pizzaId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.pizza.id !== pizzaId))
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.pizza.id === pizzaId ? { ...item, quantity } : item))
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.pizza.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
