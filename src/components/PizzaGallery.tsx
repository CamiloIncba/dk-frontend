import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { BASE_DESCRIPTION } from '@/data/pizzas'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/cart/useCart'
import { useTheme } from '@/context/ThemeContext'
import PizzaDetail from '@/components/PizzaDetail'
import { fetchMenu } from '@/api/storeApi'
import {
  productToMenuPizza,
  type MenuPizza,
} from '@/lib/menuProduct'
import { STONE_FUNGUS_CATEGORY } from '@/config/store'
import { paths } from '@/config/paths'
import { formatCurrency, parsePrice } from '@/lib/format'

function PizzaCardLocal({
  pizza,
  index,
  onSelect,
}: {
  pizza: MenuPizza
  index: number
  onSelect: () => void
}) {
  const { addLine, setCartSheetOpen } = useCart()
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
      <button
        type="button"
        onClick={onSelect}
        className="block w-full text-left"
      >
        <div className="relative aspect-[4/3] overflow-hidden border border-border/50 bg-card">
          {pizza.image ? (
            <img
              src={pizza.image}
              alt={pizza.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-card via-card to-secondary">
              <span className="select-none font-serif text-5xl font-light text-foreground/10 sm:text-6xl">
                {pizza.name}
              </span>
            </div>
          )}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40"
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-foreground/30 text-foreground hover:bg-foreground/10"
              onClick={(e) => {
                e.stopPropagation()
                addLine({
                  productId: pizza.id,
                  productName: pizza.name,
                  baseUnitPrice: parsePrice(pizza.price),
                  extras: [],
                })
                setCartSheetOpen(true)
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar
            </Button>
          </motion.div>
          {pizza.seasonal ? (
            <div className="absolute right-3 top-3">
              <Badge
                variant="outline"
                className="bg-black/40 text-[10px] backdrop-blur-sm"
              >
                De estación
              </Badge>
            </div>
          ) : null}
        </div>
      </button>
      <div className="mt-5 space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-serif text-2xl font-light tracking-wide text-foreground">
            {pizza.name}
          </h3>
          <span className="shrink-0 font-sans text-sm tabular-nums text-primary">
            {formatCurrency(parsePrice(pizza.price))}
          </span>
        </div>
        <p className="font-light text-sm tracking-wide text-muted-foreground">
          {pizza.ingredients.join(' · ')}
        </p>
        <Link
          to={paths.product(pizza.id)}
          className="mt-2 inline-block text-xs tracking-wide text-primary underline-offset-4 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Extras y opciones
        </Link>
      </div>
    </motion.div>
  )
}

function PizzaCardLovable({
  pizza,
  index,
  onSelect,
}: {
  pizza: MenuPizza
  index: number
  onSelect: () => void
}) {
  const { addLine, setCartSheetOpen } = useCart()

  return (
    <div
      className={`group animate-fade-up stagger-${Math.min(index + 1, 6)} cursor-pointer`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative mb-5 aspect-[4/3] overflow-hidden bg-secondary">
        {pizza.image ? (
          <img
            src={pizza.image}
            alt={pizza.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-muted/50 to-secondary p-6">
            <span className="font-serif text-3xl font-light tracking-wide text-foreground/80 md:text-4xl">
              {pizza.name}
            </span>
          </div>
        )}
        <div className="absolute inset-0 flex items-end justify-center bg-background/40 pb-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <Button
            variant="outline"
            size="sm"
            className="border-foreground/30 bg-background/60 text-foreground backdrop-blur-sm transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
            onClick={(e) => {
              e.stopPropagation()
              addLine({
                productId: pizza.id,
                productName: pizza.name,
                baseUnitPrice: parsePrice(pizza.price),
                extras: [],
              })
              setCartSheetOpen(true)
            }}
          >
            <Plus className="mr-1 h-4 w-4" strokeWidth={1.5} />
            Agregar
          </Button>
        </div>
        {pizza.seasonal ? (
          <div className="absolute left-4 top-4">
            <Badge
              variant="outline"
              className="border-accent bg-background/60 text-[10px] uppercase tracking-wider text-accent-foreground backdrop-blur-sm"
            >
              Estacional
            </Badge>
          </div>
        ) : null}
      </div>
      <h3 className="mb-2 font-serif text-xl font-light tracking-wide text-foreground md:text-2xl">
        {pizza.name}
      </h3>
      <p className="text-xs leading-relaxed tracking-wider text-muted-foreground md:text-sm">
        {pizza.ingredients.join(' · ')}
      </p>
      <p className="mt-2 font-light text-sm tabular-nums text-primary">
        {formatCurrency(parsePrice(pizza.price))}
      </p>
      <Link
        to={paths.product(pizza.id)}
        className="mt-2 inline-block text-xs tracking-wide text-primary underline-offset-4 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        Extras y opciones
      </Link>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] rounded bg-muted/40" />
      <div className="mt-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-6 w-32 rounded bg-muted/30" />
          <div className="h-4 w-16 rounded bg-muted/20" />
        </div>
        <div className="h-3 w-48 rounded bg-muted/20" />
      </div>
    </div>
  )
}

export default function PizzaGallery() {
  const [pizzas, setPizzas] = useState<MenuPizza[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedPizza, setSelectedPizza] = useState<MenuPizza | null>(null)
  const { theme } = useTheme()
  const isLovable = theme === 'lovable'

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const data = await fetchMenu()
        const cat = data.categories.find((c) => c.name === STONE_FUNGUS_CATEGORY)
        const list = (cat?.products ?? []).map(productToMenuPizza)
        setPizzas(list)
        setLoadError(
          cat
            ? null
            : `No se encontró la categoría «${STONE_FUNGUS_CATEGORY}». Ejecutá el seed en el backend.`,
        )
      } catch {
        setLoadError(
          'No pudimos cargar la carta. Revisá VITE_API_URL y que el backend esté en marcha.',
        )
      } finally {
        setLoading(false)
      }
    }
    void run()
  }, [])

  const gridCls = `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${isLovable ? 'gap-10 md:gap-12' : 'gap-x-8 gap-y-16'}`

  return (
    <section id="menu" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        {isLovable ? (
          <div className="mb-16 text-center">
            <p className="mb-6 text-xs uppercase tracking-[0.4em] text-primary">
              La Carta
            </p>
            <h2 className="mb-6 font-serif text-3xl font-light text-foreground md:text-4xl lg:text-5xl">
              Nuestras Pizzas
            </h2>
            <Separator className="mx-auto mb-6 w-12 bg-border" />
            <p className="mx-auto max-w-md text-sm font-light tracking-wide text-muted-foreground">
              Cada pizza sobre base de Salsa Pomodoro y Mix de Quesos, en masa madre
              biga horneada en piedra
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
          >
            <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-primary">
              Colección
            </span>
            <h2 className="mt-6 font-serif text-4xl font-light text-foreground sm:text-5xl md:text-6xl">
              Nuestras Pizzas
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-sm font-light tracking-wide text-muted-foreground">
              {BASE_DESCRIPTION}
            </p>
            <Separator className="mx-auto mt-8 w-12 bg-primary/30" />
          </motion.div>
        )}

        {loading ? (
          <div className={gridCls}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : loadError ? (
          <p className="text-center text-sm text-destructive">{loadError}</p>
        ) : pizzas.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Aún no hay pizzas disponibles.
          </p>
        ) : (
          <div className={gridCls}>
            {pizzas.map((pizza, i) => (
              <div key={pizza.id}>
                {isLovable ? (
                  <PizzaCardLovable
                    pizza={pizza}
                    index={i}
                    onSelect={() => setSelectedPizza(pizza)}
                  />
                ) : (
                  <PizzaCardLocal
                    pizza={pizza}
                    index={i}
                    onSelect={() => setSelectedPizza(pizza)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <PizzaDetail pizza={selectedPizza} onClose={() => setSelectedPizza(null)} />
    </section>
  )
}
