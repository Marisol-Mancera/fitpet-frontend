import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Layouts
// ANTES:
// import AppLayout from '../../shared/layout/AppLayout.jsx'
// import CredentialsLayout from '../../shared/layout/CredentialsLayout.jsx'
// Páginas
// import LoginPage from '../../features/auth/pages/LoginPage.jsx'

// DESPUÉS (Corrección de rutas): Usamos rutas absolutas desde /src/
import AppLayout from '/src/shared/layout/AppLayout.jsx'
import CredentialsLayout from '/src/shared/layout/CredentialsLayout.jsx'

// Páginas
import LoginPage from '/src/features/auth/pages/LoginPage.jsx'


// --- Placeholders (Páginas principales de la app) ---
// Estas son páginas de ejemplo para que las rutas del AppLayout funcionen.
// Deberás reemplazarlas por tus componentes reales.
const HomePage = () => (
  <div className="mx-auto max-w-screen-xl p-4 py-8 sm:p-8">
    <h1 className="text-3xl font-bold text-[var(--text-title)]">
      Bienvenido a FitPet
    </h1>
    <p className="mt-4 text-lg">
      Aquí irá el dashboard principal de seguimiento de mascotas.
    </p>
  </div>
)

const NuevaCitaPage = () => (
  <div className="mx-auto max-w-screen-xl p-4 py-8 sm:p-8">
    <h1 className="text-3xl font-bold text-[var(--text-title)]">
      Nueva Cita
    </h1>
    <p className="mt-4 text-lg">
      Formulario para crear una nueva cita.
    </p>
  </div>
)
// --- Fin Placeholders ---


/**
 * Definición del Router de la aplicación FitPet.
 * * Se definen dos grupos de rutas principales, cada uno con su propio layout:
 * 1. AppLayout: Para la aplicación principal (Header, Footer, contenido).
 * 2. CredentialsLayout: Para las páginas de autenticación (Login, Registro),
 * que tienen un fondo simple y contenido centrado (max-w-md).
 */
const router = createBrowserRouter([
  {
    // Rutas de la App (Dashboard, Citas, Perfil, etc.)
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/nueva-cita', element: <NuevaCitaPage /> },
      // { path: '/admin', element: <AdminPage /> }, // Futura ruta
    ],
  },
  {
    // Rutas de Autenticación (Login, Registro)
    element: <CredentialsLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      // { path: '/register', element: <RegisterPage /> }, // Futura ruta
    ],
  },
  // TODO: Añadir una ruta 404 Not Found
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}

