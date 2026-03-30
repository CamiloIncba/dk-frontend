export type ErrorCtx = 'menu' | 'checkout' | 'status' | 'quote'

export function getFriendlyError(context: ErrorCtx, err: unknown): string {
  if (err instanceof Error && err.name === 'AbortError') {
    return 'La solicitud tardó demasiado. Revisá tu conexión e intentá de nuevo.'
  }
  if (err instanceof TypeError) {
    return 'No pudimos conectar con el servidor. Verificá tu conexión y que VITE_API_URL apunte al backend DK (puerto 3010 por defecto).'
  }
  if (context === 'status') {
    return 'No se pudo actualizar el estado del pedido.'
  }
  if (context === 'quote') {
    return 'No pudimos validar el total con el servidor. Podés intentar confirmar igual o volver al carrito.'
  }
  return 'No se pudo procesar tu pedido. Intentá de nuevo.'
}
