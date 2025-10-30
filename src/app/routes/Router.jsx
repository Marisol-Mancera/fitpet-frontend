import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from '/src/shared/layout/AppLayout.jsx'
import CredentialsLayout from '/src/shared/layout/CredentialsLayout.jsx'
import HomePage from '/src/features/home/HomePage.jsx'
import RegisterPage from '/src/features/auth/pages/RegisterPage.jsx'
import LoginPage from '/src/features/auth/pages/LoginPage.jsx'
import PrivateRoute from '../../shared/components/auth/PrivateRoute.jsx'

/**
 * Definición del Router de la aplicación FitPet.
 * Define dos grupos de rutas, cada uno con su propio layout:
 * 1. AppLayout: Para la aplicación principal (Header, Footer, contenido).
 * 2. CredentialsLayout: Para las páginas de autenticación (Login, Registro).
 */
const router = createBrowserRouter([
  {
    // Rutas de la App (Dashboard, etc.)
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      // Rutas protegidas (requieren autenticación)
      // { path: '/admin', element: <PrivateRoute><AdminPage /></PrivateRoute> },
      // { path: '/mascotas', element: <PrivateRoute><MascotasPage /></PrivateRoute> },
    ],
  },
  {
    // Rutas de Autenticación (Login, Registro)
    element: <CredentialsLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  // TODO: Añadir una ruta 404 Not Found
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}