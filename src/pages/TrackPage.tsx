import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { OrderStatusResponse } from '@/types/store'
import { menuLinkTo, paths } from '@/config/paths'
import { fetchOrderStatus } from '@/api/storeApi'
import { formatCurrency, parsePrice } from '@/lib/format'
import { getFriendlyError } from '@/pages/checkoutErrors'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const POLL_MIN = 10_000
const POLL_MAX = 15_000

export default function TrackPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const orderId = id ? Number(id) : NaN
  useDocumentTitle(id ? `Pedido #${id}` : 'Seguimiento')
  const [manualId, setManualId] = useState(id ?? '')
  const [status, setStatus] = useState<OrderStatusResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [paused, setPaused] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (oid: number) => {
    setRefreshing(true)
    setError(null)
    try {
      setStatus(await fetchOrderStatus(oid))
    } catch (err) {
      setError(getFriendlyError('status', err))
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!Number.isFinite(orderId)) return
    setLoading(true)
    void load(orderId)
  }, [orderId, load])

  useEffect(() => {
    if (!Number.isFinite(orderId) || !status || paused) return
    const delay =
      Math.floor(Math.random() * (POLL_MAX - POLL_MIN + 1)) + POLL_MIN
    const t = window.setTimeout(() => void load(orderId), delay)
    return () => window.clearTimeout(t)
  }, [orderId, status, paused, load])

  if (!id) {
    return (
      <div className="container max-w-md space-y-4 px-6 py-12">
        <h1 className="font-serif text-2xl font-light text-foreground">Seguimiento</h1>
        <label htmlFor="track-id" className="block text-sm text-muted-foreground">
          Ingresá el número de pedido que te mostramos al confirmar.
        </label>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            const n = Number(manualId.replace(/\D/g, ''))
            if (n > 0) void navigate(paths.trackOrder(n))
          }}
        >
          <input
            id="track-id"
            className="flex-1 rounded-md border border-border bg-background p-2 text-sm"
            placeholder="Ej: 42"
            inputMode="numeric"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Ver
          </button>
        </form>
        <Link to={menuLinkTo} className="text-sm text-primary underline">
          Volver a la carta
        </Link>
      </div>
    )
  }

  if (!Number.isFinite(orderId)) {
    return (
      <div className="container px-6 py-12 text-sm text-destructive">
        Número de pedido inválido.
      </div>
    )
  }

  return (
    <div className="container max-w-md space-y-6 px-6 py-10">
      <Link
        to={paths.track}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Buscar otro pedido
      </Link>
      <h1 className="font-serif text-xl font-medium text-foreground">Pedido #{orderId}</h1>

      {loading && !status ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : null}

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {status && (
        <>
          <div className="rounded-xl border border-border bg-card p-4 text-sm">
            <p className="text-muted-foreground">Pago</p>
            <p className="font-medium text-foreground">
              {status.paymentLabel ?? status.status}
            </p>
            <p className="mt-3 text-muted-foreground">Cocina / entrega</p>
            <p className="font-medium text-foreground">
              {status.kitchenLabel ?? status.kitchenStatus}
            </p>
            <p className="mt-3 text-muted-foreground">Total</p>
            <p className="font-semibold tabular-nums text-foreground">
              {formatCurrency(parsePrice(status.totalAmount))}
            </p>
          </div>

          {status.timeline && status.timeline.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground">Avance</p>
              <ol className="mt-3 space-y-2" aria-label="Progreso del pedido">
                {status.timeline.map((s) => (
                  <li
                    key={s.id}
                    className={`flex gap-2 text-sm ${
                      s.current ? 'font-semibold text-primary' : ''
                    } ${s.done ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    <span aria-hidden="true">{s.done ? '✓' : s.current ? '→' : '○'}</span>
                    <span>
                      {s.label}
                      {s.done ? <span className="sr-only"> (completado)</span> : null}
                      {s.current ? <span className="sr-only"> (en curso)</span> : null}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {status.lineItems && status.lineItems.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4 text-sm">
              <p className="font-medium text-foreground">Tu pedido</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {status.lineItems.map((li, i) => (
                  <li key={`${i}-${li.productName}`}>
                    {li.quantity}× {li.productName}
                    {li.extras?.map((ex, j) => (
                      <span
                        key={`${i}-${j}-${ex.name}`}
                        className="block pl-2 text-xs"
                      >
                        + {ex.name}
                        {ex.quantity > 1 ? ` ×${ex.quantity}` : ''}
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void load(orderId)}
              className="rounded-md border border-border px-3 py-1.5 text-sm"
            >
              {refreshing ? 'Actualizando…' : 'Actualizar'}
            </button>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="rounded-md border border-border px-3 py-1.5 text-sm"
            >
              {paused ? 'Reanudar auto-actualización' : 'Pausar auto-actualización'}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {paused
              ? 'Auto-actualización detenida.'
              : `Actualizamos cada ${POLL_MIN / 1000}–${POLL_MAX / 1000} s.`}
          </p>
        </>
      )}
    </div>
  )
}
