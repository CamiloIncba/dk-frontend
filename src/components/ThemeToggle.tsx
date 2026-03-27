import { useTheme } from '@/context/ThemeContext'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.4 }}
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card/90 backdrop-blur-md text-xs tracking-wider text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-300 shadow-lg"
      aria-label="Alternar tema"
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
            theme === 'local' ? 'bg-primary animate-ping' : 'bg-accent-foreground animate-ping'
          }`}
          style={{ animationDuration: '2s' }}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            theme === 'local' ? 'bg-primary' : 'bg-accent-foreground'
          }`}
        />
      </span>
      <span className="font-sans uppercase">
        {theme === 'local' ? 'Demo 1' : 'Demo 2'}
      </span>
    </motion.button>
  )
}
