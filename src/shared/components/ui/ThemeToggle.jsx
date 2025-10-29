import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import clsx from 'clsx'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // Verifica si el usuario ya tenía un tema guardado en localStorage
    const stored = localStorage.getItem('theme')
    if (stored) return stored

    // Si no hay, detecta preferencia del sistema operativo
    // (usamos '!!' para asegurar que sea un booleano si matchMedia no está disponible en test)
    return !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  // Efecto que sincroniza el estado 'theme' con el DOM (<html>) y localStorage
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={clsx(
        'p-2 rounded-full transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        theme === 'dark'
          ? 'bg-fp-neutral-300 text-fp-text-900 hover:bg-fp-mint-600 focus:ring-fp-mint-500' // Estilos Dark
          : 'bg-fp-neutral-100 text-fp-primary-700 hover:bg-fp-primary-600 hover:text-white focus:ring-fp-primary-500' // Estilos Light
      )}
      aria-label="Cambiar tema (actual: modo oscuro)"
    
    >
      <span className="sr-only">
        {theme === 'dark' ? 'Modo claro activado' : 'Modo oscuro activado'}
      </span>
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}

