import { Outlet } from 'react-router-dom'
// ANTES:
// import Header from '../components/ui/Header.jsx'
// import Footer from '../components/ui/Footer.jsx'
// import '../../styles/themes.css'

// DESPUÉS (Corrección de rutas):
// Usamos rutas absolutas desde /src/ para evitar problemas
// de resolución de '..' en el entorno de build.
import Header from '/src/shared/components/ui/Header.jsx'
import Footer from '/src/shared/components/ui/Footer.jsx'
import '/src/styles/themes.css'

/**
 * AppLayout: El contenedor principal de la aplicación.
 * Renderiza el Header, el Footer y el contenido dinámico (Outlet)
 * que corresponde a las rutas protegidas o públicas principales.
 */
export default function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg-app)] text-[var(--text-base)]">
      <Header />
      
      {/* El 'flex-grow' asegura que 'main' ocupe todo el espacio 
        disponible, empujando el Footer hacia abajo. 
      */}
      <main className="w-full flex-grow">
        {/* El contenido de la ruta anidada se renderiza aquí */}
        <Outlet />
      </main>
      
      <Footer />
    </div>
  )
}

