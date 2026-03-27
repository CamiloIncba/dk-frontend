import { CartProvider } from '@/context/CartContext'
import { ThemeProvider } from '@/context/ThemeContext'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import OurStory from '@/components/OurStory'
import PizzaGallery from '@/components/PizzaGallery'
import Footer from '@/components/Footer'
import ThemeToggle from '@/components/ThemeToggle'

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main>
            <Hero />
            <OurStory />
            <PizzaGallery />
          </main>
          <Footer />
          <ThemeToggle />
        </div>
      </CartProvider>
    </ThemeProvider>
  )
}
