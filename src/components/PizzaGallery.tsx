import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { PIZZAS, BASE_DESCRIPTION, formatCLP, type Pizza } from '@/data/pizzas'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/context/CartContext'
import { useTheme } from '@/context/ThemeContext'
import PizzaDetail from '@/components/PizzaDetail'

/* ── Local card (framer-motion hover) ── */
function PizzaCardLocal({ pizza, index }: { pizza: Pizza; index: number }) {
  const { addItem } = useCart()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] bg-card overflow-hidden border border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-secondary flex items-center justify-center">
          <span className="font-serif text-5xl sm:text-6xl font-light text-foreground/10 select-none">
            {pizza.name}
          </span>
        </div>
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); addItem(pizza) }}
            className="border-foreground/30 text-foreground hover:bg-foreground/10 gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar
          </Button>
        </motion.div>
        {pizza.seasonal && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="text-[10px] backdrop-blur-sm bg-black/40">De estación</Badge>
          </div>
        )}
      </div>
      <div className="mt-5 space-y-2">
        <div className="flex items-baseline justify-between">
          <h3 className="font-serif text-2xl font-light text-foreground tracking-wide">{pizza.name}</h3>
          <span className="text-sm text-primary font-sans">{formatCLP(pizza.price)}</span>
        </div>
        <p className="text-sm text-muted-foreground font-light tracking-wide">{pizza.ingredients.join(' · ')}</p>
      </div>
    </motion.div>
  )
}

/* ── Lovable card (CSS animation) ── */
function PizzaCardLovable({ pizza, index }: { pizza: Pizza; index: number }) {
  const { addItem } = useCart()

  return (
    <div className={`group cursor-pointer animate-fade-up stagger-${Math.min(index + 1, 6)}`}>
      <div className="relative aspect-[4/3] bg-secondary overflow-hidden mb-5">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-muted/50 to-secondary">
          <span className="font-serif text-3xl md:text-4xl font-light text-foreground/80 tracking-wide">
            {pizza.name}
          </span>
        </div>
        <div className="absolute inset-0 flex items-end justify-center pb-6 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Button
            variant="outline"
            size="sm"
            className="border-foreground/30 text-foreground bg-background/60 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            onClick={(e) => { e.stopPropagation(); addItem(pizza) }}
          >
            <Plus className="w-4 h-4 mr-1" strokeWidth={1.5} />
            Agregar
          </Button>
        </div>
        {pizza.seasonal && (
          <div className="absolute top-4 left-4">
            <Badge variant="outline" className="bg-background/60 backdrop-blur-sm border-accent text-accent-foreground text-[10px] tracking-wider uppercase">
              Estacional
            </Badge>
          </div>
        )}
      </div>
      <h3 className="font-serif text-xl md:text-2xl font-light tracking-wide text-foreground mb-2">{pizza.name}</h3>
      <p className="text-xs md:text-sm text-muted-foreground tracking-wider leading-relaxed">{pizza.ingredients.join(' · ')}</p>
      <p className="mt-2 text-sm text-primary font-light">{formatCLP(pizza.price)}</p>
    </div>
  )
}

export default function PizzaGallery() {
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null)
  const { theme } = useTheme()
  const isLovable = theme === 'lovable'

  return (
    <section id="menu" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        {isLovable ? (
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] text-primary uppercase mb-6">La Carta</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-6">Nuestras Pizzas</h2>
            <Separator className="w-12 mx-auto mb-6 bg-border" />
            <p className="text-sm text-muted-foreground max-w-md mx-auto font-light tracking-wide">
              Cada pizza sobre base de Salsa Pomodoro y Mix de Quesos, en masa madre biga horneada en piedra
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-[11px] tracking-[0.35em] uppercase text-primary font-sans">Colección</span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light mt-6 text-foreground">Nuestras Pizzas</h2>
            <p className="mt-6 text-sm text-muted-foreground tracking-wide font-light max-w-lg mx-auto">{BASE_DESCRIPTION}</p>
            <Separator className="w-12 mx-auto mt-8 bg-primary/30" />
          </motion.div>
        )}

        {/* Pizza grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${isLovable ? 'gap-10 md:gap-12' : 'gap-x-8 gap-y-16'}`}>
          {PIZZAS.map((pizza, i) => (
            <div key={pizza.id} onClick={() => setSelectedPizza(pizza)} className="cursor-pointer">
              {isLovable
                ? <PizzaCardLovable pizza={pizza} index={i} />
                : <PizzaCardLocal pizza={pizza} index={i} />
              }
            </div>
          ))}
        </div>
      </div>

      <PizzaDetail pizza={selectedPizza} onClose={() => setSelectedPizza(null)} />
    </section>
  )
}
