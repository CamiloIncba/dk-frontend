import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useTheme } from '@/context/ThemeContext'
import { formatCLP } from '@/data/pizzas'

interface CartSidebarProps {
  /** When true, skip rendering the trigger button (Lovable navbar renders its own) */
  navbarMode?: boolean
}

export default function CartSidebar({ navbarMode }: CartSidebarProps) {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart, isOpen, setIsOpen } =
    useCart()
  const { theme } = useTheme()
  const isLovable = theme === 'lovable'

  // In navbarMode (Lovable), only render the Sheet without a trigger
  if (navbarMode) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <CartContent
          items={items}
          totalItems={totalItems}
          totalPrice={totalPrice}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          clearCart={clearCart}
          isLovable={isLovable}
        />
      </Sheet>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <CartContent
        items={items}
        totalItems={totalItems}
        totalPrice={totalPrice}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        clearCart={clearCart}
        isLovable={isLovable}
      />
    </Sheet>
  )
}

/* ── Shared cart content ── */
function CartContent({
  items,
  totalItems,
  totalPrice,
  updateQuantity,
  removeItem,
  clearCart,
  isLovable,
}: {
  items: ReturnType<typeof useCart>['items']
  totalItems: number
  totalPrice: number
  updateQuantity: (id: string, qty: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  isLovable: boolean
}) {
  return (
    <SheetContent className={`flex flex-col ${isLovable ? 'bg-card border-border w-full sm:max-w-md' : ''}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-light text-foreground">Tu Pedido</h2>
        <p className="text-xs text-muted-foreground mt-1 tracking-wide">
          {totalItems === 0
            ? 'Tu carrito está vacío'
            : isLovable
              ? `${totalItems} artículo(s)`
              : `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
        </p>
      </div>

      <Separator className="bg-border" />

      {/* Items list */}
      <ScrollArea className="flex-1 -mx-6 px-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            {!isLovable && <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-4" />}
            <p className="text-sm text-muted-foreground font-light">
              {isLovable ? 'Explora nuestra carta y selecciona tus pizzas' : 'Explora nuestra colección y agrega tus favoritas'}
            </p>
          </div>
        ) : (
          <div className={isLovable ? 'space-y-6 py-4' : 'space-y-0 py-4'}>
            {items.map((item) =>
              isLovable ? (
                /* Lovable cart item */
                <div key={item.pizza.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-secondary flex-shrink-0 flex items-center justify-center">
                    <span className="font-serif text-xs text-foreground/50">{item.pizza.name.slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-base text-foreground truncate">{item.pizza.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatCLP(item.pizza.price)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.pizza.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm text-foreground w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.pizza.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.pizza.id)}
                        className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Local cart item */
                <div key={item.pizza.id} className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg font-light text-foreground">{item.pizza.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.pizza.ingredients.join(' · ')}</p>
                    </div>
                    <span className="text-sm text-primary whitespace-nowrap">{formatCLP(item.pizza.price * item.quantity)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.pizza.id, item.quantity - 1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm w-6 text-center font-sans">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.pizza.id, item.quantity + 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive-foreground" onClick={() => removeItem(item.pizza.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <Separator className="mt-4 bg-border/30" />
                </div>
              )
            )}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {items.length > 0 && (
        <div className="pt-4 space-y-4">
          <Separator className="bg-border" />
          <div className="flex items-center justify-between">
            <span className={`text-sm text-muted-foreground ${isLovable ? 'tracking-wider uppercase' : 'font-sans'}`}>Subtotal</span>
            <span className={`font-serif ${isLovable ? 'text-xl text-foreground' : 'text-xl text-primary'}`}>{formatCLP(totalPrice)}</span>
          </div>
          <Button className={`w-full ${isLovable ? 'bg-primary text-primary-foreground hover:bg-primary/90 tracking-wider uppercase text-xs py-6' : ''}`} size="lg">
            Confirmar Pedido
          </Button>
          {!isLovable && (
            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={clearCart}>
              Vaciar carrito
            </Button>
          )}
        </div>
      )}
    </SheetContent>
  )
}
