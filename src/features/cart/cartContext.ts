import { createContext, useContext } from 'react'

export type CartContextValue = { slugs: string[]; add: (slug: string) => void; remove: (slug: string) => void }
export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart requiere CartProvider')
  return context
}
