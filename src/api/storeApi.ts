import type {
  CartQuoteResponse,
  MenuResponse,
  OrderStatusResponse,
  ProductExtraGroupDto,
} from '@/types/store'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3010'

export const getApiUrl = () => API_URL

const DEFAULT_TIMEOUT_MS = 8000

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export type CartLineExtra = { optionId: number; quantity: number }

export type CartQuoteItemPayload = {
  productId: number
  quantity: number
  extras: CartLineExtra[]
}

export type CreateOrderPayload = {
  items: CartQuoteItemPayload[]
  customer: { name: string; phone: string; address: string }
  paymentMethod: string
  note?: string
  storeBrand: string
}

export type CreateOrderResponse = { id: number }

export async function fetchMenu(): Promise<MenuResponse> {
  const res = await fetchWithTimeout(`${API_URL}/api/v1/store/menu`)
  if (!res.ok) throw new Error('menu')
  return (await res.json()) as MenuResponse
}

export async function fetchProductExtras(
  productId: number,
): Promise<ProductExtraGroupDto[]> {
  const res = await fetchWithTimeout(
    `${API_URL}/api/v1/store/products/${productId}/extras`,
  )
  if (!res.ok) return []
  const json = (await res.json()) as unknown
  return Array.isArray(json) ? json : []
}

export async function postStoreQuote(
  items: CartQuoteItemPayload[],
): Promise<CartQuoteResponse> {
  const res = await fetchWithTimeout(`${API_URL}/api/v1/store/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
  if (!res.ok) throw new Error('quote')
  return (await res.json()) as CartQuoteResponse
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<CreateOrderResponse> {
  const res = await fetchWithTimeout(`${API_URL}/api/v1/store/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('order')
  return (await res.json()) as CreateOrderResponse
}

export async function fetchOrderStatus(
  orderId: number,
): Promise<OrderStatusResponse> {
  const res = await fetchWithTimeout(
    `${API_URL}/api/v1/store/orders/${orderId}/status`,
  )
  if (!res.ok) throw new Error('status')
  return (await res.json()) as OrderStatusResponse
}
