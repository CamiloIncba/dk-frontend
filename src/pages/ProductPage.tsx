import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { MenuResponse, ProductExtraGroupDto } from '@/types/store'
import { menuLinkTo, paths } from '@/config/paths'
import { fetchMenu, fetchProductExtras } from '@/api/storeApi'
import { formatCurrency, parsePrice } from '@/lib/format'
import { useCart } from '@/cart/useCart'
import type { CartExtra } from '@/cart/cartLine'
import {
  getAvailableOptions,
  maxForGroup,
} from '@/lib/productExtras'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function ProductPage() {
  const { id } = useParams()
  const productId = Number(id)
  const navigate = useNavigate()
  const { addLine, setCartSheetOpen } = useCart()

  const [menu, setMenu] = useState<MenuResponse | null>(null)
  const [groups, setGroups] = useState<ProductExtraGroupDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selections, setSelections] = useState<
    Map<number, Map<number, number>>
  >(() => new Map())

  const product = useMemo(() => {
    if (!menu || !Number.isFinite(productId)) return undefined
    for (const c of menu.categories) {
      const p = c.products.find((x) => x.id === productId)
      if (p) return p
    }
    return undefined
  }, [menu, productId])

  useDocumentTitle(product?.name)

  const initSelections = useCallback((g: ProductExtraGroupDto[]) => {
    const m = new Map<number, Map<number, number>>()
    g.forEach((row) => m.set(row.groupId, new Map()))
    setSelections(m)
  }, [])

  useEffect(() => {
    if (!Number.isFinite(productId)) {
      setError('Producto inválido')
      setLoading(false)
      return
    }

    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const [menuJson, exList] = await Promise.all([
          fetchMenu(),
          fetchProductExtras(productId),
        ])
        setMenu(menuJson)
        setGroups(exList)
        initSelections(exList)
      } catch {
        setError('No pudimos cargar el producto.')
      } finally {
        setLoading(false)
      }
    }
    void run()
  }, [productId, initSelections])

  const getTotalSelected = (groupId: number): number => {
    const g = selections.get(groupId)
    if (!g) return 0
    let n = 0
    g.forEach((q) => {
      n += q
    })
    return n
  }

  const toggleOption = (groupId: number, optionId: number) => {
    const gRow = groups.find((x) => x.groupId === groupId)
    if (!gRow) return
    const max = maxForGroup(gRow)
    setSelections((prev) => {
      const next = new Map(prev)
      const inner = new Map(next.get(groupId) ?? [])
      const cur = inner.get(optionId) ?? 0
      let total = 0
      inner.forEach((q) => {
        total += q
      })
      if (cur > 0) inner.delete(optionId)
      else if (total < max) inner.set(optionId, 1)
      next.set(groupId, inner)
      return next
    })
  }

  const extrasValid = (): boolean => {
    for (const g of groups) {
      const min = g.group.minSelections ?? 0
      if (getTotalSelected(g.groupId) < min) return false
    }
    return true
  }

  const buildCartExtras = (): CartExtra[] => {
    const out: CartExtra[] = []
    selections.forEach((inner, groupId) => {
      const gRow = groups.find((x) => x.groupId === groupId)
      if (!gRow) return
      const opts = getAvailableOptions(gRow)
      inner.forEach((qty, optionId) => {
        if (qty < 1) return
        const opt = opts.find((o) => o.id === optionId)
        if (opt) {
          out.push({
            optionId,
            name: opt.name,
            unitPrice: opt.finalPrice,
            qty,
          })
        }
      })
    })
    return out
  }

  const extrasSubtotal = (): number =>
    buildCartExtras().reduce((s, e) => s + e.unitPrice * e.qty, 0)

  const handleAdd = () => {
    if (!product) return
    if (!extrasValid()) return
    const ex = buildCartExtras()
    addLine({
      productId: product.id,
      productName: product.name,
      baseUnitPrice: parsePrice(product.price),
      extras: ex,
    })
    setCartSheetOpen(true)
    navigate(paths.home)
  }

  if (loading) {
    return (
      <div className="container px-6 py-12 text-sm text-muted-foreground">
        Cargando…
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container space-y-4 px-6 py-12">
        <p className="text-destructive">{error ?? 'Producto no encontrado'}</p>
        <Link to={menuLinkTo} className="text-sm text-primary underline">
          Volver a la carta
        </Link>
      </div>
    )
  }

  const unitTotal = parsePrice(product.price) + extrasSubtotal()

  return (
    <div className="container max-w-lg space-y-6 px-6 py-10">
      <Link
        to={menuLinkTo}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← La carta
      </Link>
      <div>
        <h1 className="font-serif text-2xl font-light text-foreground md:text-3xl">
          {product.name}
        </h1>
        {product.description ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        ) : null}
        <p className="mt-3 font-serif text-lg tabular-nums text-primary">
          {formatCurrency(parsePrice(product.price))}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            base
          </span>
        </p>
      </div>

      {groups.length > 0 ? (
        <div className="space-y-6">
          {groups.map((gRow) => {
            const opts = getAvailableOptions(gRow)
            const max = maxForGroup(gRow)
            const min = gRow.group.minSelections ?? 0
            const sel = getTotalSelected(gRow.groupId)
            return (
              <div
                key={gRow.groupId}
                className="rounded-xl border border-border bg-card p-4"
              >
                <h2 className="font-medium text-foreground">{gRow.group.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {min > 0 ? `Mínimo ${min}` : 'Opcional'}
                  {max < 999 ? ` · Máximo ${max}` : ''}
                  <span
                    className={
                      sel < min ? ' text-destructive' : ' text-primary'
                    }
                  >
                    {' '}
                    · {sel} seleccionados
                  </span>
                </p>
                <ul className="mt-3 space-y-2">
                  {opts.map((opt) => {
                    const on =
                      (selections.get(gRow.groupId)?.get(opt.id) ?? 0) > 0
                    const can = on || sel < max
                    return (
                      <li key={opt.id}>
                        <button
                          type="button"
                          disabled={!can && !on}
                          onClick={() => toggleOption(gRow.groupId, opt.id)}
                          className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${
                            on
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:bg-muted/50'
                          } ${!can && !on ? 'opacity-50' : ''}`}
                        >
                          <span>{opt.name}</span>
                          <span>
                            {opt.finalPrice > 0
                              ? `+${formatCurrency(opt.finalPrice)}`
                              : 'Gratis'}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      ) : null}

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total estimado</span>
          <span className="font-semibold tabular-nums text-foreground">
            {formatCurrency(unitTotal)}
          </span>
        </div>
        <button
          type="button"
          disabled={!extrasValid()}
          onClick={handleAdd}
          className="mt-3 w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          Agregar al pedido
        </button>
      </div>
    </div>
  )
}
