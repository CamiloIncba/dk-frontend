import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import CartSidebar from '@/components/CartSidebar'
import { useTheme } from '@/context/ThemeContext'
import { useCart } from '@/context/CartContext'

function NavbarLocal() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-md border-b border-border/50'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="font-serif text-xl tracking-wider text-foreground hover:text-primary transition-colors duration-300">
            Stone Fungus
          </a>
          <div className="flex items-center gap-8">
            <a href="#menu" className="hidden sm:block text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 font-sans">
              Colección
            </a>
            <CartSidebar />
          </div>
        </nav>
      </motion.header>
    </AnimatePresence>
  )
}

function NavbarLovable() {
  const { totalItems, setIsOpen } = useCart()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-background/80 backdrop-blur-md border-b border-border/50">
      <a href="#" className="font-serif text-xl md:text-2xl font-light tracking-widest text-foreground uppercase">
        Stone Fungus
      </a>
      <div className="flex items-center gap-8">
        <a href="#story" className="hidden md:inline text-sm tracking-wider text-muted-foreground hover:text-foreground transition-colors">
          Nuestra Historia
        </a>
        <a href="#menu" className="hidden md:inline text-sm tracking-wider text-muted-foreground hover:text-foreground transition-colors">
          Menú
        </a>
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2 text-foreground hover:text-primary transition-colors"
          aria-label="Abrir carrito"
        >
          <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-medium rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </div>
      {/* Cart sheet rendered from CartSidebar */}
      <CartSidebar navbarMode />
    </nav>
  )
}

export default function Navbar() {
  const { theme } = useTheme()
  return theme === 'lovable' ? <NavbarLovable /> : <NavbarLocal />
}
