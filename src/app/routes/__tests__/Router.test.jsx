import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// MOCK para resolución de react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
    };
});

// --- MOCKS PARA COMPONENTES QUE NO EXISTEN O ESTÁN EN TEST ---
const MOCK_LOGIN_TEXT = 'Página de Login Mock'; // Texto usado en el mock

vi.mock('../../../features/auth/pages/LoginPage.jsx', () => {
    return {
        default: () => <div data-testid="login-page-mock">{MOCK_LOGIN_TEXT}</div>,
    };
});
// --- FIN DE MOCKS ---


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

        // Header
        expect(screen.getByRole('banner')).toBeInTheDocument()
        expect(screen.getByText(/fitpet/i)).toBeInTheDocument()

        // getAllByRole para encontrar los 2 botones
        const themeBtns = screen.getAllByRole('button', { name: /cambiar tema/i });
        expect(themeBtns).toHaveLength(2);

        // LoginPage. Buscar el texto del mock
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
        expect(screen.getByText(MOCK_LOGIN_TEXT)).toBeInTheDocument()
    })
})
