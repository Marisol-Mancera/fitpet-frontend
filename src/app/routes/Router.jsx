import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from '../../shared/layout/AppLayout.jsx'
import LoginPage from '../../pages/auth/LoginPage.jsx'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <LoginPage /> },
      { path: '/login', element: <LoginPage /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}