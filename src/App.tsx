import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { CartProvider } from '@/cart/CartProvider'
import MainLayout from '@/layout/MainLayout'
import HomePage from '@/pages/HomePage'
import ProductPage from '@/pages/ProductPage'
import CheckoutPage from '@/pages/CheckoutPage'
import TrackPage from '@/pages/TrackPage'

/** Debe coincidir con `base` en `vite.config` (sin barra final). */
const ROUTER_BASENAME =
  import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter
          basename={ROUTER_BASENAME === '/' ? undefined : ROUTER_BASENAME}
        >
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/producto/:id" element={<ProductPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/seguimiento" element={<TrackPage />} />
              <Route path="/seguimiento/:id" element={<TrackPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  )
}
