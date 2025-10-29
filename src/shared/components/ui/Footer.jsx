import React from 'react'
// 💡 CORRECCIÓN: Volvemos a ruta relativa desde la ubicación del archivo
import Logo from '../../../assets/logo.svg'

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="
        w-full border-t 
        bg-fp-neutral-100 
        dark:bg-[var(--bg-app)] 
        text-[var(--text-base)]
        border-[var(--border-soft)]
      "
    >
      <div className="mx-auto max-w-screen-lg px-4 py-6 sm:py-8">
        {/* fila principal */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="FitPet"
              className="h-8 w-auto"
            />
          </div>

          {/* Navegación mínima */}
          <nav aria-label="Footer links" className="flex items-center gap-6">
            <a
              href="/contacto" // (temporal, luego cambiaremos por <Link>)
              className="text-sm hover:underline hover:text-fp-primary-600"
            >
              Contacto
            </a>
          </nav>
        </div>

        {/* línea divisoria */}
        <div className="my-4 h-px w-full bg-[var(--border-soft)]" />

        {/* contacto + derechos */}
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm">
            Escríbenos: <span className="font-medium">contacto@fitpet.app</span>
          </p>
          <p className="text-xs">
            © {new Date().getFullYear()} FitPet. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}


