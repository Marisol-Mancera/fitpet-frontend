import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// ThemeToggle permanece donde ya lo tienes
import ThemeToggle from "./ThemeToggle.jsx";

// ÚNICO asset nuevo: tu logo
import Logo from '../../assets/logo.svg'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // placeholder de auth: token en localStorage (luego lo sustituimos por Redux)
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('token')
  )

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/')
  }

  const menuItems = [
    { path: '/', label: 'Inicio' },
    { path: '/nueva-cita', label: 'Nueva Cita' },
  ]

  return (
    <header
      role="banner"
      className="relative bg-[var(--fp-primary-600)] dark:bg-[#0B3944] text-white"
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* top bar */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Marca: logo + texto (texto solo móvil) */}
          <Link to="/" className="group inline-flex items-center gap-2">
            <img
              src={Logo}
              alt="FitPet"
              className="h-8 w-auto transition-transform group-hover:scale-105"
            />
            <span className="md:hidden text-lg font-semibold tracking-wide">
              FitPet
            </span>
          </Link>

          {/* Nav Desktop */}
          <nav aria-label="Global" className="hidden md:flex items-center gap-8 lg:gap-10">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={[
                  'relative text-base lg:text-lg font-medium tracking-wide transition-all',
                  'hover:text-[#EEF2F6]',
                  'after:absolute after:content-[""] after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-white after:transition-all hover:after:w-full',
                  location.pathname === item.path ? 'after:w-full' : ''
                ].join(' ')}
              >
                {item.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  className={[
                    'relative text-base lg:text-lg font-medium tracking-wide transition-all',
                    'hover:text-[#EEF2F6]',
                    'after:absolute after:content-[""] after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-white after:transition-all hover:after:w-full',
                    location.pathname === '/admin' ? 'after:w-full' : ''
                  ].join(' ')}
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-base lg:text-lg font-medium tracking-wide hover:text-[#EEF2F6] transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={[
                  'relative text-base lg:text-lg font-medium tracking-wide transition-all',
                  'hover:text-[#EEF2F6]',
                  'after:absolute after:content-[""] after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-white after:transition-all hover:after:w-full',
                  location.pathname === '/login' ? 'after:w-full' : ''
                ].join(' ')}
              >
                Login
              </Link>
            )}

            {/* Botón tema (desktop) */}
            <ThemeToggle />
          </nav>

          {/* Móvil: tema + hamburguesa */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              aria-label="Abrir menú"
              onClick={() => setIsOpen(v => !v)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isOpen && (
          <nav
            aria-label="Mobile"
            className="md:hidden border-t border-white/10"
          >
            <div className="flex flex-col py-3">
              {menuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={[
                    'text-white text-lg font-medium py-3 px-2 rounded-md transition-all',
                    'hover:bg-white/10',
                    location.pathname === item.path ? 'bg-white/15' : ''
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className={[
                      'text-white text-lg font-medium py-3 px-2 rounded-md transition-all',
                      'hover:bg-white/10',
                      location.pathname === '/admin' ? 'bg-white/15' : ''
                    ].join(' ')}
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false) }}
                    className="text-white text-lg font-medium py-3 px-2 text-left hover:bg-white/10 rounded-md transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className={[
                    'text-white text-lg font-medium py-3 px-2 rounded-md transition-all',
                    'hover:bg-white/10',
                    location.pathname === '/login' ? 'bg-white/15' : ''
                  ].join(' ')}
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}