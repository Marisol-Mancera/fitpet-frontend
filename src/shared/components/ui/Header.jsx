import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle.jsx'
import Logo from '../../assets/logo.svg'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Esta lógica está perfecta.
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('token')
  )

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Esta lógica también es perfecta para sincronizar pestañas.
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, []) 

  // Tu función de logout está perfecta.
  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/')
    // --- CAMBIO 1: Asegurarnos de cerrar el menú al hacer logout ---
    // (Tu botón onClick ya lo hacía, pero lo centralizamos aquí)
    setIsOpen(false)
  }

  // Estos items solo se usarán cuando el menú esté abierto (autenticado)
  const menuItems = [
    { path: '/', label: 'Inicio' },
    { path: '/mascotas', label: 'Mascotas' }, 
    { path: '/admin', label: 'Perfil' },
  ]

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 bg-white border-b-4 border-fp-mint-500 shadow-lg"
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        
        {/* Grid de 3 columnas */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: '1rem',
            height: '7rem'
          }}
        >
          
          {/* Logo IZQUIERDA (Sin cambios) */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              to="/"
              className="p-2 -ml-2 rounded-lg transition-all duration-300 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-fp-mint-500"
            >
              <img
                src={Logo}
                alt="FitPet"
                className="h-20 sm:h-28 w-auto transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(122,217,192,0.6)]"
              />
            </Link>
          </div>

          {/* Frase CENTRO (Sin cambios) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <span className="text-sm sm:text-base md:text-lg font-bold tracking-wide uppercase text-gray-700">
              Tu compañero en su{' '}
              <span className="text-fp-mint-600 font-extrabold">mejor forma</span>
            </span>
          </div>

          {/* --- CAMBIO 2: Lógica condicional para Botón DERECHA --- */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated ? (
              // 2a. Si está AUTENTICADO: Mostrar botón de hamburguesa
              <button
                aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={isOpen}
                onClick={() => setIsOpen(v => !v)}
                className={`inline-flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-fp-mint-500 ${
                  isOpen 
                    ? 'bg-fp-mint-500 border-fp-mint-500 text-white' 
                    : 'bg-fp-primary-700 border-fp-primary-700 text-white hover:bg-fp-primary-600 hover:scale-105'
                }`}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                >
                  {isOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            ) : (
              // 2b. Si NO está AUTENTICADO: Mostrar botón de Login
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border-2 border-fp-primary-700 bg-fp-primary-700 text-white font-bold text-sm sm:text-base transition-all duration-300 hover:bg-fp-primary-600 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-fp-mint-500"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* --- CAMBIO 3: Contenido del menú --- */}
        {/* Aseguramos que solo se muestre si isOpen Y el usuario está autenticado */}
        {isOpen && isAuthenticated && (
          <div className="border-t border-gray-200 py-4 sm:py-6 space-y-1.5 sm:space-y-2 bg-gray-50">
            
            {/* Enlaces del menú (Mascotas, Perfil, etc.) */}
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-fp-mint-500 text-white border-l-4 border-fp-primary-700'
                    : 'bg-white text-gray-700 hover:bg-fp-mint-500 hover:text-white hover:translate-x-2'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Separador (Sin cambios) */}
            <div className="border-t border-gray-200 my-3 sm:my-4"></div>

            {/* Theme Toggle (Sin cambios) */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-700 font-medium text-sm sm:text-base">🌓 Tema</span>
              <ThemeToggle />
            </div>

            {/* --- CAMBIO 4: Botón de logout (Simplificado) --- */}
            {/* Ya no necesitamos el ternario (if/else), solo mostramos "Cerrar Sesión" */}
            <button
              onClick={handleLogout} // handleLogout ya se encarga de cerrar el menú
              className="w-full px-4 sm:px-5 py-2.5 sm:py-3 mt-3 sm:mt-4 rounded-lg font-bold text-sm sm:text-base text-center transition-all duration-200 bg-fp-warm-500 text-fp-primary-700 hover:bg-fp-mint-500 hover:shadow-lg hover:shadow-fp-mint-500/40 hover:scale-[1.02]"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}