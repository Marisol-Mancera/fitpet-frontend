import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CredentialsLayout from '../../shared/layout/CredentialsLayout.jsx'
import LoginPage from '../../features/auth/pages/LoginPage.jsx'

const router = createBrowserRouter([
  {
    element: <CredentialsLayout />,
    children: [
      { path: '/', element: <LoginPage /> },
      { path: '/login', element: <LoginPage /> },
      // cuando añadamos /register, irá aquí también
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}