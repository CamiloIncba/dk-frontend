import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X } from 'lucide-react'
import CartSidebar from '@/components/CartSidebar'
import { useTheme } from '@/context/ThemeContext'
import { useCart } from '@/cart/useCart'
import { paths } from '@/config/paths'
import { appRootWithHash } from '@/config/publicUrl'

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    onClose()
  }, [location.pathname, location.hash, onClose])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 right-0 top-full border-b border-border/50 bg-background/95 px-6 py-6 backdrop-blur-lg sm:hidden"
        >
          <nav className="flex flex-col gap-5">
            <a
              href={appRootWithHash('story')}
              className="font-sans text-sm uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Historia
            </a>
            <a
              href={appRootWithHash('menu')}
              className="font-sans text-sm uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Carta
            </a>
            <Link
              to={paths.checkout}
              className="font-sans text-sm uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Finalizar
            </Link>
            <Link
              to={paths.track}
              className="font-sans text-sm uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Seguimiento
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function NavbarLocal() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed left-0 right-0 top-0 z-40 transition-all duration-500 ${
        scrolled || mobileOpen
          ? 'border-b border-border/50 bg-background/90 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          to={paths.home}
          className="font-serif text-xl tracking-wider text-foreground transition-colors duration-300 hover:text-primary"
        >
          Stone Fungus
        </Link>
        <div className="flex items-center gap-8">
          <a
            href={appRootWithHash('story')}
            className="hidden font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 hover:text-foreground sm:block"
          >
            Historia
          </a>
          <a
            href={appRootWithHash('menu')}
            className="hidden font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 hover:text-foreground sm:block"
          >
            Colección
          </a>
          <Link
            to={paths.checkout}
            className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Finalizar
          </Link>
          <Link
            to={paths.track}
            className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Seguimiento
          </Link>
          <CartSidebar />
          <button
            type="button"
            className="text-foreground sm:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </motion.header>
  )
}

function NavbarLovable() {
  const { itemCount, setCartSheetOpen } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-5 md:px-12">
        <Link
          to={paths.home}
          className="font-serif text-xl font-light uppercase tracking-widest text-foreground md:text-2xl"
        >
          Stone Fungus
        </Link>
        <div className="flex items-center gap-8">
          <a
            href={appRootWithHash('story')}
            className="hidden text-sm tracking-wider text-muted-foreground transition-colors hover:text-foreground md:inline"
          >
            Nuestra Historia
          </a>
          <a
            href={appRootWithHash('menu')}
            className="hidden text-sm tracking-wider text-muted-foreground transition-colors hover:text-foreground md:inline"
          >
            Menú
          </a>
          <Link
            to={paths.track}
            className="hidden text-sm tracking-wider text-muted-foreground transition-colors hover:text-foreground md:inline"
          >
            Seguimiento
          </Link>
          <button
            type="button"
            onClick={() => setCartSheetOpen(true)}
            className="relative p-2 text-foreground transition-colors hover:text-primary"
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {itemCount}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            className="text-foreground md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <CartSidebar navbarMode />
    </nav>
  )
}

export default function Navbar() {
  const { theme } = useTheme()
  return theme === 'lovable' ? <NavbarLovable /> : <NavbarLocal />
}
