import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/cart/useCart'
import { lineTotal, type CartLine } from '@/cart/cartLine'
import {
  createOrder,
  postStoreQuote,
  type CartQuoteItemPayload,
} from '@/api/storeApi'
import type { CartQuoteResponse } from '@/types/store'
import { formatCurrency } from '@/lib/format'
import { STORE_BRAND } from '@/config/store'
import { menuLinkTo, paths } from '@/config/paths'
import { getFriendlyError } from '@/pages/checkoutErrors'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

type Step = 1 | 2 | 3

function linesToQuotePayload(cartLines: CartLine[]): CartQuoteItemPayload[] {
  return cartLines.map((l) => ({
    productId: l.productId,
    quantity: l.quantity,
    extras: l.extras.map((ex) => ({
      optionId: ex.optionId,
      quantity: ex.qty,
    })),
  }))
}

export default function CheckoutPage() {
  useDocumentTitle('Checkout')
  const { lines, subtotal, setQty, removeLine, clear } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [serverQuote, setServerQuote] = useState<CartQuoteResponse | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState<string | null>(null)

  useEffect(() => {
    if (lines.length === 0 && step !== 1) setStep(1)
  }, [lines.length, step])

  useEffect(() => {
    if (step !== 3 || lines.length === 0) {
      setServerQuote(null)
      setQuoteError(null)
      setQuoteLoading(false)
      return
    }
    let cancelled = false
    setQuoteLoading(true)
    setQuoteError(null)
    void (async () => {
      try {
        const q = await postStoreQuote(linesToQuotePayload(lines))
        if (!cancelled) setServerQuote(q)
      } catch (err) {
        if (!cancelled) {
          setServerQuote(null)
          setQuoteError(getFriendlyError('quote', err))
        }
      } finally {
        if (!cancelled) setQuoteLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [step, lines])

  const validateContacts = (): string | null => {
    const n = name.trim()
    const p = phone.trim()
    const a = address.trim()
    if (!n) return 'El nombre es obligatorio.'
    if (!p) return 'El teléfono es obligatorio.'
    if (p.replace(/\D/g, '').length < 8) return 'Ingresá un teléfono válido.'
    if (!a) return 'La dirección de entrega es obligatoria.'
    return null
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const v = validateContacts()
    if (v) {
      setCheckoutError(v)
      return
    }
    if (lines.length === 0) {
      setCheckoutError('Tu pedido está vacío.')
      return
    }

    setSubmitting(true)
    setCheckoutError(null)
    setApiError(null)
    try {
      const created = await createOrder({
        items: linesToQuotePayload(lines),
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
        },
        paymentMethod: 'transfer',
        note: note.trim() || undefined,
        storeBrand: STORE_BRAND,
      })
      clear()
      navigate(paths.trackOrder(created.id), { replace: true })
    } catch (err) {
      setApiError(getFriendlyError('checkout', err))
    } finally {
      setSubmitting(false)
    }
  }

  if (lines.length === 0) {
    return (
      <div className="container max-w-lg space-y-4 px-6 py-12">
        <h1 className="font-serif text-2xl font-light text-foreground">Tu pedido</h1>
        <p className="text-sm text-muted-foreground">
          El carrito está vacío. Explorá la carta para armar tu pedido.
        </p>
        <Link
          to={menuLinkTo}
          className="inline-flex rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-foreground hover:bg-primary/20"
        >
          Volver a la carta
        </Link>
      </div>
    )
  }

  return (
    <div className="container max-w-lg space-y-8 px-6 py-10">
      <h1 className="font-serif text-2xl font-light tracking-tight text-foreground">
        Checkout
      </h1>

      <div className="flex flex-wrap gap-2 text-xs font-medium">
        {[
          [1, 'Carrito'],
          [2, 'Datos'],
          [3, 'Confirmar'],
        ].map(([n, label]) => (
          <span
            key={n}
            className={`rounded-full px-3 py-1 ${
              step === n
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {n}. {label}
          </span>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <ul className="space-y-3">
            {lines.map((line) => (
              <li
                key={line.key}
                className="rounded-xl border border-border bg-card p-4 text-sm"
              >
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{line.productName}</p>
                    {line.extras.length > 0 && (
                      <ul className="mt-1 text-muted-foreground">
                        {line.extras.map((ex) => (
                          <li key={ex.optionId}>
                            + {ex.name}
                            {ex.qty > 1 ? ` ×${ex.qty}` : ''}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(line.key)}
                    className="text-destructive hover:underline"
                  >
                    Quitar
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded border border-border px-2 py-1"
                      onClick={() => setQty(line.key, line.quantity - 1)}
                      aria-label={`Reducir cantidad de ${line.productName}`}
                    >
                      −
                    </button>
                    <span className="tabular-nums" aria-label={`Cantidad: ${line.quantity}`}>{line.quantity}</span>
                    <button
                      type="button"
                      className="rounded border border-border px-2 py-1"
                      onClick={() => setQty(line.key, line.quantity + 1)}
                      aria-label={`Aumentar cantidad de ${line.productName}`}
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold tabular-nums">
                    {formatCurrency(lineTotal(line))}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-right font-semibold tabular-nums">
            Subtotal {formatCurrency(subtotal)}
          </p>
          <button
            type="button"
            className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground"
            onClick={() => setStep(2)}
          >
            Continuar
          </button>
        </div>
      )}

      {step === 2 && (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            const err = validateContacts()
            setCheckoutError(err)
            if (!err) setStep(3)
          }}
        >
          <div className="space-y-2">
            <label htmlFor="ck-name" className="text-sm font-medium text-foreground">Nombre</label>
            <input
              id="ck-name"
              required
              autoComplete="name"
              className="w-full rounded-md border border-border bg-background p-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="ck-phone" className="text-sm font-medium text-foreground">Teléfono</label>
            <input
              id="ck-phone"
              required
              type="tel"
              autoComplete="tel"
              className="w-full rounded-md border border-border bg-background p-2 text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="ck-address" className="text-sm font-medium text-foreground">
              Dirección de entrega
            </label>
            <input
              id="ck-address"
              required
              autoComplete="street-address"
              className="w-full rounded-md border border-border bg-background p-2 text-sm"
              placeholder="Calle, número, comuna…"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="ck-note" className="text-sm font-medium text-foreground">Notas (opcional)</label>
            <textarea
              id="ck-note"
              className="w-full rounded-md border border-border bg-background p-2 text-sm"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          {checkoutError && (
            <p className="text-sm text-destructive">{checkoutError}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-md border border-border py-2 text-sm"
              onClick={() => setStep(1)}
            >
              Atrás
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-primary py-2 text-sm text-primary-foreground"
            >
              Revisar pedido
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form className="space-y-4" onSubmit={submit}>
          <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm">
            <p className="font-medium text-foreground">Resumen</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              {lines.map((l) => (
                <li key={l.key}>
                  {l.quantity}× {l.productName} — {formatCurrency(lineTotal(l))}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-semibold tabular-nums text-foreground">
              Total en carrito {formatCurrency(subtotal)}
            </p>
            {quoteLoading ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Validando total con el servidor…
              </p>
            ) : null}
            {quoteError ? (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-200">
                {quoteError}
              </p>
            ) : null}
            {serverQuote ? (
              <div className="mt-2 space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Total confirmado</span>{' '}
                  <span className="font-semibold tabular-nums text-foreground">
                    {formatCurrency(serverQuote.totalAmount)}
                  </span>
                </p>
                {Math.round(Math.abs(serverQuote.totalAmount - subtotal)) > 0 ? (
                  <p className="text-xs text-amber-600 dark:text-amber-200">
                    El importe difiere del carrito (precios o promociones actualizados).
                  </p>
                ) : null}
              </div>
            ) : null}
            <hr className="my-3 border-border" />
            <p className="text-foreground">
              {name.trim()} · {phone.trim()}
            </p>
            <p className="text-muted-foreground">{address.trim()}</p>
            {note.trim() ? (
              <p className="mt-1 text-muted-foreground">Nota: {note.trim()}</p>
            ) : null}
            <p className="mt-2 text-xs text-muted-foreground">
              Pago acordado: transferencia (confirmación manual o link en fases siguientes).
            </p>
          </div>
          {apiError && <p className="text-sm text-destructive">{apiError}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-md border border-border py-2 text-sm"
              onClick={() => setStep(2)}
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {submitting ? 'Enviando…' : 'Confirmar pedido'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
