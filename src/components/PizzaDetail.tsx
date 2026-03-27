import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { type Pizza, BASE_DESCRIPTION, formatCLP } from '@/data/pizzas'
import { useCart } from '@/context/CartContext'

interface PizzaDetailProps {
  pizza: Pizza | null
  onClose: () => void
}

export default function PizzaDetail({ pizza, onClose }: PizzaDetailProps) {
  const { addItem } = useCart()

  if (!pizza) return null

  return (
    <Dialog open={!!pizza} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        {/* Image area */}
        <div className="relative aspect-video bg-gradient-to-br from-card via-card to-secondary flex items-center justify-center">
          <span className="font-serif text-7xl sm:text-8xl font-light text-foreground/8 select-none">
            {pizza.name}
          </span>
          {pizza.seasonal && (
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="backdrop-blur-sm bg-black/40">
                De estación
              </Badge>
            </div>
          )}
        </div>

        <div className="p-8">
          <DialogHeader>
            <DialogTitle className="font-serif text-4xl font-light">{pizza.name}</DialogTitle>
            <DialogDescription className="sr-only">Detalle de pizza {pizza.name}</DialogDescription>
          </DialogHeader>

          <p className="mt-4 text-muted-foreground leading-relaxed font-light">
            {pizza.description}
          </p>

          <Separator className="my-6 bg-border/50" />

          <div className="space-y-3">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/60 font-sans">
                Ingredientes
              </span>
              <p className="mt-1 text-sm text-foreground/80 tracking-wide">
                {pizza.ingredients.join(' · ')}
              </p>
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/60 font-sans">
                Base
              </span>
              <p className="mt-1 text-sm text-foreground/80 tracking-wide">{BASE_DESCRIPTION}</p>
            </div>
          </div>

          <Separator className="my-6 bg-border/50" />

          <div className="flex items-center justify-between">
            <span className="text-2xl font-serif text-primary">{formatCLP(pizza.price)}</span>
            <Button
              onClick={() => {
                addItem(pizza)
                onClose()
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar al pedido
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
