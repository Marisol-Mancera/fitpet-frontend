import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import CredentialsLayout from '../CredentialsLayout.jsx'

// stub por ThemeToggle en otras vistas (no afecta aquí, pero lo mantenemos homogéneo)
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

  test('pinta el Outlet dentro de un contenedor centrado', () => {
    const Dummy = () => <h1>Auth Shell</h1>

    const router = createMemoryRouter(
      [
        {
          element: <CredentialsLayout />,
          children: [{ path: '/', element: <Dummy /> }],
        },
      ],
      { initialEntries: ['/'] }
    )

    render(<RouterProvider router={router} />)
    expect(screen.getByText('Auth Shell')).toBeInTheDocument()
  })
})