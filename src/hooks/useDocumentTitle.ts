import { useEffect } from 'react'

const BASE = 'Stone Fungus'

export function useDocumentTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} — ${BASE}` : `${BASE} — Hongos Gourmet`
  }, [page])
}
