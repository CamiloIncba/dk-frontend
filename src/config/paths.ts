export const paths = {
  home: '/',
  checkout: '/checkout',
  track: '/seguimiento',
  trackOrder: (orderId: number | string) => `/seguimiento/${orderId}`,
  product: (productId: number | string) => `/producto/${productId}`,
} as const

/** Para <Link>: vuelve a la home con ancla a la carta (respeta `basename`). */
export const menuLinkTo = { pathname: '/' as const, hash: '#menu' as const }
