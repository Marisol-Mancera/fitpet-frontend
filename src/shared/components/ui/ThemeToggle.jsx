import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

/**
 * ThemeToggle - Componente mejorado para cambiar entre modo claro y oscuro
 * Con animaciones suaves y diseño moderno tipo switch
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // Verifica si el usuario ya tenía un tema guardado
    const stored = localStorage.getItem('theme')
    if (stored) return stored

    // Si no, detecta preferencia del sistema
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  // Sincroniza el tema con el DOM y localStorage
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-20 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-fp-mint-500 focus:ring-offset-2 bg-gray-200 hover:bg-gray-300"
      style={{
        backgroundColor: isDark ? '#0F4C5C' : '#E5E7EB'
      }}
      aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
    >
      {/* Círculo deslizante */}
      <span
        className="inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out"
        style={{
          transform: isDark ? 'translateX(2.5rem)' : 'translateX(0.25rem)'
        }}
      >
        {/* Ícono dentro del círculo */}
        <span className="flex h-full w-full items-center justify-center">
          {isDark ? (
            <Moon className="h-5 w-5 text-fp-primary-700 animate-pulse" />
          ) : (
            <Sun className="h-5 w-5 text-fp-warm-500 animate-pulse" />
          )}
        </span>
      </span>

      {/* Texto indicador (opcional, se oculta en móvil) */}
      <span className="sr-only">
        {isDark ? 'Modo oscuro activado' : 'Modo claro activado'}
      </span>
    </button>
  )
}