import { Outlet } from 'react-router-dom'
import Header from '../components/ui/Header.jsx'
import Footer from '../components/ui/Footer.jsx'

/**
 * AppLayout es el contenedor principal de la aplicación.
 * Muestra Header y Footer fijos, y renderiza la página
 * actual (a través de <Outlet />) en el medio.
 */
export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="grow pt-28">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}