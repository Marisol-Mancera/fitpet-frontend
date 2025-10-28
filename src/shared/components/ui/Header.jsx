import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'

export default function Header() {
  const [open, setOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/rutinas', label: 'Rutinas' },
    { href: '/progreso', label: 'Progreso' },
    { href: '/perfil', label: 'Perfil' },
  ]

  return (
    <header
      role="banner"
      className="w-full bg-fp-white border-b border-fp-neutral-300"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Brand / logo slot */}
        <div className="flex items-center gap-3">
          {/* Sube tu logo y reemplaza este div por <img .../> */}
          <div
            aria-label="Logo FitPet"
            className="h-8 w-8 rounded-full bg-fp-primary-600"
          />
          <span className="text-fp-text-900 text-lg font-semibold tracking-wide">
            FitPet
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Principal">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-fp-text-700 hover:text-fp-primary-600 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* Hamburger (mobile) */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg border border-fp-neutral-300 text-fp-text-700"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-fp-neutral-300 bg-fp-white" aria-label="Principal móvil">
          <ul className="px-4 py-2 flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block py-2 text-fp-text-700 hover:text-fp-primary-600"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}