import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react' // Iconos ya viene con shadcn/lucide
import clsx from 'clsx'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // Verifica si el usuario ya tenía un tema guardado
    const stored = localStorage.getItem('theme')
    if (stored) return stored
    // Si no hay, detecta preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  // Cada vez que cambia el tema, aplica la clase al <html>
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={clsx(
        'p-2 rounded-full transition-colors duration-300',
        theme === 'dark'
          ? 'bg-fp-neutral-300 text-fp-text-900 hover:bg-fp-mint-600'
          : 'bg-fp-neutral-100 text-fp-primary-700 hover:bg-fp-primary-600'
      )}
      aria-label="Cambiar tema"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}


