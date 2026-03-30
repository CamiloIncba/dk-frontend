import { createContext } from 'react'
import type { CartLine } from './cartLine'

export type CartContextValue = {
  lines: CartLine[]
  addLine: (
    line: Omit<CartLine, 'key' | 'quantity'> & { quantity?: number },
  ) => void
  setQty: (key: string, quantity: number) => void
  removeLine: (key: string) => void
  clear: () => void
  subtotal: number
  itemCount: number
  cartSheetOpen: boolean
  setCartSheetOpen: (open: boolean) => void
}

export const CartContext = createContext<CartContextValue | null>(null)
