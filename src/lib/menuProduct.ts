import type { Product } from '@/types/store'

export type MenuPizza = {
  id: number
  name: string
  price: string
  description: string | null
  ingredients: string[]
  seasonal: boolean
  image: string | null
}

const SEASONAL_NAMES = new Set(['Leonera'])

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

const PIZZA_IMAGES: Record<string, string> = {
  Enoki: `${BASE}/images/pizzas/enoki.png`,
  Leonera: `${BASE}/images/pizzas/leonera.png`,
  Porcina: `${BASE}/images/pizzas/porcina.png`,
  Carnita: `${BASE}/images/pizzas/carnita.png`,
  Veggie: `${BASE}/images/pizzas/veggie.png`,
  Napolitana: `${BASE}/images/pizzas/napolitana.png`,
}

export function ingredientLines(
  description: string | null | undefined,
): string[] {
  if (!description?.trim()) return []
  return description
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function productToMenuPizza(p: Product): MenuPizza {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    description: p.description ?? null,
    ingredients: ingredientLines(p.description),
    seasonal: SEASONAL_NAMES.has(p.name),
    image: p.imageUrl ?? PIZZA_IMAGES[p.name] ?? null,
  }
}
