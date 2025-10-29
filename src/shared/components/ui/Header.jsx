import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle.jsx'
import Logo from '../../../assets/logo.svg'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // placeholder de auth: token en localStorage (luego lo sustituimos por Redux)
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('token')
  )

  // Cierra el menú móvil si cambia la ruta
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Actualiza el estado si el token cambia (ej. en otra pestaña)
  // REFINAMIENTO: JSON.stringify para estabilizar la dependencia
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [JSON.stringify(isAuthenticated)]) // Solo se re-ejecuta si el estado cambia

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/') // Redirige al inicio tras logout
  }

  const menuItems = [
    { path: '/', label: 'Inicio' },
    { path: '/nueva-cita', label: 'Nueva Cita' },
  ]

  const navLinkClasses = (path) =>
    [
      'relative text-base lg:text-lg font-medium tracking-wide transition-all',
      'hover:text-[#EEF2F6]',
      'focus:outline-none focus-visible:text-[#EEF2F6]', // Accesibilidad
      'after:absolute after:content-[""] after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-white after:transition-all hover:after:w-full',
      'focus-visible:after:w-full', // Accesibilidad
      location.pathname === path ? 'after:w-full' : '',
    ].join(' ')

  const mobileLinkClasses = (path) =>
    [
      'text-white text-lg font-medium py-3 px-2 rounded-md transition-all',
      'hover:bg-white/10 focus:outline-none focus-visible:bg-white/10', // Accesibilidad
      location.pathname === path ? 'bg-white/15' : '',
    ].join(' ')

  return (
    <header
      role="banner"
      className="relative bg-[var(--fp-primary-600)] dark:bg-[var(--fp-primary-700)] text-white"
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* top bar */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Marca: logo + texto (texto solo móvil) */}
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
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
          <nav
            aria-label="Global"
            className="hidden md:flex items-center gap-8 lg:gap-10"
          >
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={navLinkClasses(item.path)}
              >
                {item.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link to="/admin" className={navLinkClasses('/admin')}>
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className={navLinkClasses('/logout')} // Reusa estilos
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className={navLinkClasses('/login')}>
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
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((v) => !v)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {isOpen ? (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
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
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={mobileLinkClasses(item.path)}
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className={mobileLinkClasses('/admin')}
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
        _className_={mobileLinkClasses('/logout')} // Reusa estilos
                    className="w-full text-left" // Asegura alineación
                  >
            _Logout_
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className={mobileLinkClasses('/login')}
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