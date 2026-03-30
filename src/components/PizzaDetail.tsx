import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { MenuPizza } from '@/lib/menuProduct'
import { BASE_DESCRIPTION } from '@/data/pizzas'
import { useCart } from '@/cart/useCart'
import { formatCurrency, parsePrice } from '@/lib/format'
import { paths } from '@/config/paths'

interface PizzaDetailProps {
  pizza: MenuPizza | null
  onClose: () => void
}

function blurb(pizza: MenuPizza): string {
  if (pizza.description?.trim()) return pizza.description.trim()
  return pizza.ingredients.join(' · ')
}

export default function PizzaDetail({ pizza, onClose }: PizzaDetailProps) {
  const { addLine, setCartSheetOpen } = useCart()

  if (!pizza) return null

  return (
    <Dialog open={!!pizza} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-2xl">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-card via-card to-secondary">
          {pizza.image ? (
            <img
              src={pizza.image}
              alt={pizza.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span className="select-none font-serif text-7xl font-light text-foreground/10 sm:text-8xl">
              {pizza.name}
            </span>
          )}
          {pizza.seasonal && (
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="backdrop-blur-sm bg-black/40">
                De estación
              </Badge>
            </div>
          )}
        </div>

        <div className="p-8">
          <DialogHeader>
            <DialogTitle className="font-serif text-4xl font-light">{pizza.name}</DialogTitle>
            <DialogDescription className="sr-only">
              Detalle de pizza {pizza.name}
            </DialogDescription>
          </DialogHeader>

          <p className="mt-4 font-light leading-relaxed text-muted-foreground">
            {blurb(pizza)}
          </p>

          <Separator className="my-6 bg-border/50" />

          <div className="space-y-3">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
                Ingredientes
              </span>
              <p className="mt-1 text-sm tracking-wide text-foreground/80">
                {pizza.ingredients.join(' · ')}
              </p>
            </div>
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
                Base
              </span>
              <p className="mt-1 text-sm tracking-wide text-foreground/80">
                {BASE_DESCRIPTION}
              </p>
            </div>
          </div>

          <Separator className="my-6 bg-border/50" />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-serif text-2xl text-primary tabular-nums">
              {formatCurrency(parsePrice(pizza.price))}
            </span>
            <div className="flex flex-col gap-2 sm:items-end">
              <Button
                onClick={() => {
                  addLine({
                    productId: pizza.id,
                    productName: pizza.name,
                    baseUnitPrice: parsePrice(pizza.price),
                    extras: [],
                  })
                  setCartSheetOpen(true)
                  onClose()
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar al pedido
              </Button>
              <Button variant="outline" className="text-sm" asChild>
                <Link
                  to={paths.product(pizza.id)}
                  onClick={() => onClose()}
                >
                  Elegir extras y opciones
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
