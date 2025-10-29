import { Outlet } from 'react-router-dom'

import Header from '../components/ui/Header.jsx'
import Footer from '../components/ui/Footer.jsx'

import '../../styles/themes.css'

/**
 * AppLayout es el contenedor principal de la aplicación.
 * Muestra Header y Footer fijos, y renderiza la página
 * actual (a través de <Outlet />) en el medio.
 */
export default function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg-app)] text-[var(--text-base)]">
      <Header />

      <main className="flex-grow">
        {/* El Outlet renderizará la página actual (ej. HomePage, CitasPage) */}
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

