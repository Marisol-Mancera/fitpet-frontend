import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import CredentialsLayout from '/src/shared/layout/CredentialsLayout.jsx'

// Mock de themes.css (ya que el componente lo importa)
vi.mock('/src/styles/themes.css', () => ({}))

// Mock de matchMedia (usado por ThemeToggle, que puede ser dependencia indirecta)
const mockMatchMedia = (matches) => () => ({
  matches,
  media: '(prefers-color-scheme: dark)',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
})

describe('CredentialsLayout', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    localStorage.clear()
    window.matchMedia = vi.fn(mockMatchMedia(false))
  })

  test('pinta el Outlet (contenido hijo) dentro de un contenedor', () => {
    // Componente falso que simula la página de Login/Register
    const DummyChildPage = () => <h1>Auth Shell</h1>

    const router = createMemoryRouter(
      [
        {
          element: <CredentialsLayout />,
          children: [{ path: '/', element: <DummyChildPage /> }],
        },
      ],
      { initialEntries: ['/'] }
    )

    render(<RouterProvider router={router} />)

    // Verificamos que el contenido del Outlet (DummyChildPage) se renderiza
    expect(screen.getByText('Auth Shell')).toBeInTheDocument()
  })
})

