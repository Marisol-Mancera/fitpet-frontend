import React from 'react'
import Logo from '../../assets/logo.svg'

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="
        w-full border-t border-fp-neutral-300
        bg-fp-neutral-100 text-fp-text-700
        dark:bg-[#0E1216] dark:text-fp-text-700
      "
    >
      <div className="mx-auto max-w-screen-lg px-4 py-6 sm:py-8">
        {/* fila principal */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            {/* Tu logo: deja este <img>; solo cambia el archivo de assets si lo necesitas */}
            <img
              src={Logo}
              alt="FitPet"
              className="h-8 w-auto"
            />
          </div>

          {/* Navegación mínima */}
          <nav aria-label="Footer links" className="flex items-center gap-6">
            <a
              href="/contacto"
              className="text-sm hover:underline hover:text-fp-primary-600"
            >
              Contacto
            </a>
          </nav>
        </div>

        {/* línea divisoria */}
        <div className="my-4 h-px w-full bg-fp-neutral-300" />

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