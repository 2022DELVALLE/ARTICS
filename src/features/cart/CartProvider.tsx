import { useEffect, useState, type ReactNode } from 'react'
import { z } from 'zod'
import { courseRepository } from '../courses/courseRepository'
import { CartContext } from './cartContext'

const storageKey = 'artics-demo-cart'

function readCart(): string[] {
  try {
    const parsed = z.array(z.string()).safeParse(JSON.parse(localStorage.getItem(storageKey) ?? '[]'))
    return parsed.success ? [...new Set(parsed.data)].filter((slug) => courseRepository.findBySlug(slug)) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>(readCart)
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(slugs)), [slugs])

  const add = (slug: string) => setSlugs((current) => current.includes(slug) ? current : [...current, slug])
  const remove = (slug: string) => setSlugs((current) => current.filter((item) => item !== slug))

  return <CartContext.Provider value={{ slugs, add, remove }}>{children}</CartContext.Provider>
}

