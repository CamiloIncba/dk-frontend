import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type ThemeVariant = 'local' | 'lovable'

interface ThemeContextType {
  theme: ThemeVariant
  toggleTheme: () => void
  setTheme: (theme: ThemeVariant) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeVariant>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('sf-theme') as ThemeVariant) || 'local'
    }
    return 'local'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'lovable') {
      root.classList.add('theme-lovable')
    } else {
      root.classList.remove('theme-lovable')
    }
    localStorage.setItem('sf-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'local' ? 'lovable' : 'local'))
  }, [])

  const setTheme = useCallback((t: ThemeVariant) => {
    setThemeState(t)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
