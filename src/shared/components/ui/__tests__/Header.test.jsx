import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// MOCK para resolución de react-router-dom
vi.mock('react-router-dom', () => {
  const actual = vi.importActual('react-router-dom');
  return {
    ...actual,
    createMemoryRouter: actual.createMemoryRouter,
    RouterProvider: actual.RouterProvider,
    MemoryRouter: actual.MemoryRouter,
  };
});

//MOCK para AppLayout.jsx: Simula el layout para aislar la prueba del router.
vi.mock('../../../shared/layout/AppLayout.jsx', () => {
  return {
    default: ({ children }) => <div data-testid="app-layout-mock">{children}</div>,
  };
});

// 💡para LoginPage.jsx
const MOCK_LOGIN_TEXT = 'Página de Login Mock';

vi.mock('../../../features/auth/pages/LoginPage.jsx', () => {
  return {
    default: () => <div data-testid="login-page-mock">{MOCK_LOGIN_TEXT}</div>,
  };
});


import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import AppLayout from '../../../shared/layout/AppLayout.jsx'
import LoginPage from '../../../features/auth/pages/LoginPage.jsx'


// Stub para matchMedia usado en el ThemeToggle dentro del Header
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

describe('AppRouter + Layout', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    localStorage.clear()
    window.matchMedia = vi.fn(mockMatchMedia(false))
  })

  test('renderiza Header y LoginPage en /', () => {
    const router = createMemoryRouter(
      [
        {
          element: <AppLayout />,
          children: [
            { path: '/', element: <LoginPage /> },
            { path: '/login', element: <LoginPage /> },
          ],
        },
      ],
      { initialEntries: ['/'] }
    )

    render(<RouterProvider router={router} />)

    expect(screen.getByTestId('app-layout-mock')).toBeInTheDocument();

    expect(screen.getByText(MOCK_LOGIN_TEXT)).toBeInTheDocument()
  })

  test('renderiza LoginPage en /login', () => {
    const router = createMemoryRouter(
      [
        {
          element: <AppLayout />,
          children: [
            { path: '/', element: <LoginPage /> },
            { path: '/login', element: <LoginPage /> },
          ],
        },
      ],
      { initialEntries: ['/login'] }
    )

    render(<RouterProvider router={router} />)
    expect(screen.getByTestId('app-layout-mock')).toBeInTheDocument();
    expect(screen.getByText(MOCK_LOGIN_TEXT)).toBeInTheDocument()
  })
})
