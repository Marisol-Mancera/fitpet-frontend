import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock de react-router-dom para evitar errores de enrutamiento durante las pruebas
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
    };
});

import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import AppLayout from '../../../shared/layout/AppLayout.jsx'
import LoginPage from '../../../pages/auth/LoginPage.jsx'

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
        expect(screen.getByRole('button', { name: /cambiar tema/i })).toBeInTheDocument()

        // LoginPage 
        expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument()
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
        expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument()
    })
})
