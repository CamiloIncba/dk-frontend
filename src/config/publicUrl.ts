/** `import.meta.env.BASE_URL` termina en `/` (p. ej. `/sf/`) */
export function appRootWithHash(hash: string): string {
  const h = hash.startsWith('#') ? hash.slice(1) : hash
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return base ? `${base}/#${h}` : `/#${h}`
}
