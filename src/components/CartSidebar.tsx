import { useNavigate } from 'react-router-dom'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/cart/useCart'
import { useTheme } from '@/context/ThemeContext'
import { lineTotal, type CartLine } from '@/cart/cartLine'
import { formatCurrency } from '@/lib/format'
import { paths } from '@/config/paths'

interface CartSidebarProps {
  navbarMode?: boolean
}

export default function CartSidebar({ navbarMode }: CartSidebarProps) {
  const {
    lines,
    itemCount,
    subtotal,
    setQty,
    removeLine,
    clear,
    cartSheetOpen,
    setCartSheetOpen,
  } = useCart()
  const { theme } = useTheme()
  const isLovable = theme === 'lovable'

  if (navbarMode) {
    return (
      <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
        <CartContent
          lines={lines}
          itemCount={itemCount}
          subtotal={subtotal}
          setQty={setQty}
          removeLine={removeLine}
          clear={clear}
          setCartSheetOpen={setCartSheetOpen}
          isLovable={isLovable}
        />
      </Sheet>
    )
  }

  return (
    <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setCartSheetOpen(true)}
        aria-label="Abrir carrito"
      >
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
            {itemCount}
          </span>
        ) : null}
      </Button>
      <CartContent
        lines={lines}
        itemCount={itemCount}
        subtotal={subtotal}
        setQty={setQty}
        removeLine={removeLine}
        clear={clear}
        setCartSheetOpen={setCartSheetOpen}
        isLovable={isLovable}
      />
    </Sheet>
  )
}

function CartContent({
  lines,
  itemCount,
  subtotal,
  setQty,
  removeLine,
  clear,
  setCartSheetOpen,
  isLovable,
}: {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  setQty: (key: string, q: number) => void
  removeLine: (key: string) => void
  clear: () => void
  setCartSheetOpen: (open: boolean) => void
  isLovable: boolean
}) {
  const navigate = useNavigate()

  return (
    <SheetContent
      className={`flex w-full flex-col sm:max-w-md ${isLovable ? 'border-border bg-card' : ''}`}
    >
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-light text-foreground">Tu selección</h2>
        <p className="mt-1 text-xs tracking-wide text-muted-foreground">
          {itemCount === 0
            ? 'Tu carrito está vacío'
            : isLovable
              ? `${itemCount} artículo(s)`
              : `${itemCount} ${itemCount === 1 ? 'pieza' : 'piezas'}`}
        </p>
      </div>

      <Separator className="bg-border" />

      <ScrollArea className="-mx-6 flex-1 px-6">
        {lines.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            {!isLovable ? (
              <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground/30" />
            ) : null}
            <p className="text-sm font-light text-muted-foreground">
              {isLovable
                ? 'Explorá nuestra carta y seleccioná tus pizzas'
                : 'Explorá nuestra colección y agregá tus favoritas'}
            </p>
          </div>
        ) : (
          <div className={isLovable ? 'space-y-6 py-4' : 'space-y-0 py-4'}>
            {lines.map((line) =>
              isLovable ? (
                <div key={line.key} className="flex gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center bg-secondary">
                    <span className="font-serif text-xs text-foreground/50">
                      {line.productName.slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-serif text-base text-foreground">
                      {line.productName}
                    </h4>
                    {line.extras.length > 0 ? (
                      <ul className="mt-1 space-y-0.5 text-[11px] text-muted-foreground">
                        {line.extras.map((ex) => (
                          <li key={ex.optionId}>
                            + {ex.name}
                            {ex.qty > 1 ? ` ×${ex.qty}` : ''}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatCurrency(line.baseUnitPrice)} c/u
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQty(line.key, line.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                        aria-label={`Reducir ${line.productName}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-4 text-center text-sm text-foreground">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(line.key, line.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                        aria-label={`Aumentar ${line.productName}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeLine(line.key)}
                        className="ml-auto text-muted-foreground transition-colors hover:text-destructive"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={line.key} className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-lg font-light text-foreground">
                        {line.productName}
                      </h3>
                      {line.extras.length > 0 ? (
                        <ul className="mt-1 text-xs text-muted-foreground">
                          {line.extras.map((ex) => (
                            <li key={ex.optionId}>
                              + {ex.name}
                              {ex.qty > 1 ? ` ×${ex.qty}` : ''}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    <span className="whitespace-nowrap text-sm tabular-nums text-primary">
                      {formatCurrency(lineTotal(line))}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setQty(line.key, line.quantity - 1)}
                        aria-label={`Reducir ${line.productName}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center font-sans text-sm">
                        {line.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setQty(line.key, line.quantity + 1)}
                        aria-label={`Aumentar ${line.productName}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeLine(line.key)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <Separator className="mt-4 bg-border/30" />
                </div>
              ),
            )}
          </div>
        )}
      </ScrollArea>

      {lines.length > 0 ? (
        <div className="space-y-4 pt-4">
          <Separator className="bg-border" />
          <div className="flex items-center justify-between">
            <span
              className={`text-sm text-muted-foreground ${isLovable ? 'uppercase tracking-wider' : 'font-sans'}`}
            >
              Subtotal
            </span>
            <span
              className={`font-serif tabular-nums ${isLovable ? 'text-xl text-foreground' : 'text-xl text-primary'}`}
            >
              {formatCurrency(subtotal)}
            </span>
          </div>
          <Button
            className={`w-full ${isLovable ? 'bg-primary py-6 text-xs uppercase tracking-wider text-primary-foreground hover:bg-primary/90' : ''}`}
            size="lg"
            onClick={() => {
              setCartSheetOpen(false)
              navigate(paths.checkout)
            }}
          >
            Confirmar Pedido
          </Button>
          {!isLovable ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground"
              onClick={() => clear()}
            >
              Vaciar carrito
            </Button>
          ) : null}
        </div>
      ) : null}
    </SheetContent>
  )
}
