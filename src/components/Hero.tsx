import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

function HeroLocal() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 text-center px-6"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-16 h-[1px] bg-primary/60 mx-auto mb-8"
        />

        <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-wide text-foreground">
          Stone
          <span className="block text-primary mt-1">Fungus</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 text-sm sm:text-base tracking-[0.3em] uppercase text-muted-foreground font-sans font-light"
        >
          El primer restaurante de hongos gourmet en Chile
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="w-16 h-[1px] bg-primary/60 mx-auto mt-8"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase font-sans">Descubrir</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}

function HeroLovable() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <p className="text-xs md:text-sm tracking-[0.4em] text-muted-foreground uppercase mb-8 animate-fade-up stagger-1">
          Temuco, Chile
        </p>

        <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-wide text-foreground mb-6 animate-fade-up stagger-2">
          Stone Fungus
        </h1>

        <div className="w-16 h-px bg-primary mx-auto mb-8 animate-fade-up stagger-3" />

        <p className="font-serif text-lg md:text-xl lg:text-2xl font-light italic text-muted-foreground max-w-2xl mx-auto animate-fade-up stagger-4">
          El primer restaurante de hongos gourmet en Chile
        </p>
      </div>

      <a
        href="#story"
        className="absolute bottom-12 text-muted-foreground animate-scroll-hint"
        aria-label="Scroll para descubrir"
      >
        <ChevronDown className="w-6 h-6" strokeWidth={1} />
      </a>
    </section>
  )
}

export default function Hero() {
  const { theme } = useTheme()
  return theme === 'lovable' ? <HeroLovable /> : <HeroLocal />
}
