import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { createMemoryRouter, RouterProvider, Outlet } from 'react-router-dom'

// --- Mocks ---
// Mockeamos todos los componentes que importa el router
// Usamos rutas absolutas porque es lo que usa el `router.jsx`
// (El <Outlet /> es necesario para que se rendericen los 'children' de las rutas)

vi.mock('/src/shared/layout/AppLayout.jsx', () => ({
  default: () => (
    <div data-testid="app-layout-mock">
      App Layout <Outlet />
    </div>
  ),
}))

vi.mock('/src/shared/layout/CredentialsLayout.jsx', () => ({
  default: () => (
    <div data-testid="credentials-layout-mock">
      Credentials Layout <Outlet />
    </div>
  ),
}))

vi.mock('/src/features/home/pages/HomePage.jsx', () => ({
  default: () => <div data-testid="home-page-mock">Home Page</div>,
}))

vi.mock('/src/features/auth/pages/LoginPage.jsx', () => ({
  default: () => <div data-testid="login-page-mock">Login Page</div>,
}))

vi.mock('/src/features/auth/pages/RegisterPage.jsx', () => ({
  default: () => <div data-testid="register-page-mock">Register Page</div>,
}))

import AppLayout from '/src/shared/layout/AppLayout.jsx'
import CredentialsLayout from '/src/shared/layout/CredentialsLayout.jsx'
import HomePage from '/src/features/home/pages/HomePage.jsx'
import LoginPage from '/src/features/auth/pages/LoginPage.jsx'
import RegisterPage from '/src/features/auth/pages/RegisterPage.jsx'

// --- Test ---
describe('App Router', () => {
  const testRoutes = [
    {
      element: <AppLayout />,
      children: [{ path: '/', element: <HomePage /> }],
    },
    {
      element: <CredentialsLayout />,
      children: [
        { path: '/login', element: <LoginPage /> },
        { path: '/register', element: <RegisterPage /> },
      ],
    },
  ]

  test('renderiza HomePage y AppLayout en /', () => {
    const router = createMemoryRouter(testRoutes, { initialEntries: ['/'] })
    render(<RouterProvider router={router} />)

    expect(screen.getByTestId('app-layout-mock')).toBeInTheDocument()
    expect(screen.getByTestId('home-page-mock')).toBeInTheDocument()
  })

  test('renderiza LoginPage y CredentialsLayout en /login', () => {
    const router = createMemoryRouter(testRoutes, { initialEntries: ['/login'] })
    render(<RouterProvider router={router} />)

    expect(screen.getByTestId('credentials-layout-mock')).toBeInTheDocument()
    expect(screen.getByTestId('login-page-mock')).toBeInTheDocument()
  })

  test('renderiza RegisterPage y CredentialsLayout en /register', () => {
    const router = createMemoryRouter(testRoutes, {
      initialEntries: ['/register'],
    })
    render(<RouterProvider router={router} />)

    expect(screen.getByTestId('credentials-layout-mock')).toBeInTheDocument()
    expect(screen.getByTestId('register-page-mock')).toBeInTheDocument()
  })
})

