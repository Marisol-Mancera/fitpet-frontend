import { Link } from 'react-router-dom'
import { Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="w-full bg-gray-100 border-t border-gray-300 text-gray-700 mt-auto"
    >
      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Layout horizontal: Logo | Links | Contact */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: '2rem'
          }}
          className="flex-wrap"
        >
          
          {/* IZQUIERDA: Logo + Descripción */}
          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-fp-mint-500 rounded-md"
            >
              <span className="text-lg font-bold text-gray-900 group-hover:text-fp-mint-600 transition-colors">
                FitPet
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-gray-300">
              <Heart className="h-4 w-4 text-red-500" aria-hidden="true" />
              <span className="text-xs text-gray-600">
                Hecho con amor y React
              </span>
            </div>
          </div>
          
          {/* CENTRO: Links de navegación */}
          <nav className="flex items-center justify-center gap-6 text-sm">
            <Link 
              to="/contacto"
              className="text-gray-700 hover:text-fp-mint-600 transition-colors focus:outline-none focus-visible:underline"
            >
              Soporte
            </Link>
            <Link 
              to="/privacidad"
              className="text-gray-700 hover:text-fp-mint-600 transition-colors focus:outline-none focus-visible:underline"
            >
              Privacidad
            </Link>
            <Link 
              to="/terminos"
              className="text-gray-700 hover:text-fp-mint-600 transition-colors focus:outline-none focus-visible:underline"
            >
              Términos
            </Link>
          </nav>
          
          {/* DERECHA: Contacto + Copyright */}
          <div className="flex items-center gap-6 text-sm">
            <a 
              href="mailto:contacto@fitpet.app"
              className="flex items-center gap-2 text-gray-700 hover:text-fp-mint-600 transition-colors focus:outline-none focus-visible:underline"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span className="hidden lg:inline">contacto@fitpet.app</span>
            </a>
            <span className="text-xs text-gray-600 hidden sm:inline">
              © {new Date().getFullYear()} FitPet
            </span>
          </div>
          
        </div>

        {/* Copyright móvil */}
        <div className="mt-4 text-center sm:hidden">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} FitPet. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}