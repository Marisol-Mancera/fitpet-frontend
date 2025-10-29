import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import CredentialsLayout from '../../../shared/layout/CredentialsLayout.jsx'

// Mock fino de LoginPage para no arrastrar dependencias
const MOCK_LOGIN_TEXT = 'Página de Login Mock'
vi.mock('../../../features/auth/pages/LoginPage.jsx', () => ({
  default: () => <div>{MOCK_LOGIN_TEXT}</div>,
}))

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

describe('Router con CredentialsLayout', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    localStorage.clear()
    window.matchMedia = vi.fn(mockMatchMedia(false))
  })

  test('renderiza LoginPage en /', () => {
    const router = createMemoryRouter(
      [
        {
          element: <CredentialsLayout />,
          children: [
            { path: '/', element: <div>{MOCK_LOGIN_TEXT}</div> },
            { path: '/login', element: <div>{MOCK_LOGIN_TEXT}</div> },
          ],
        },
      ],
      { initialEntries: ['/'] }
    )

    render(<RouterProvider router={router} />)
    expect(screen.getByText(MOCK_LOGIN_TEXT)).toBeInTheDocument()
  })

  test('renderiza LoginPage en /login', () => {
    const router = createMemoryRouter(
      [
        {
          element: <CredentialsLayout />,
          children: [
            { path: '/', element: <div>{MOCK_LOGIN_TEXT}</div> },
            { path: '/login', element: <div>{MOCK_LOGIN_TEXT}</div> },
          ],
        },
      ],
      { initialEntries: ['/login'] }
    )

    render(<RouterProvider router={router} />)
    expect(screen.getByText(MOCK_LOGIN_TEXT)).toBeInTheDocument()
  })
})