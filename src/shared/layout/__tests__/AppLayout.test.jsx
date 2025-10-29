import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import AppLayout from '/src/shared/layout/AppLayout.jsx'

// --- Mocks ---
// Mock de Header
vi.mock('/src/shared/components/ui/Header.jsx', () => ({
  default: () => <header data-testid="header-mock">Header</header>,
}))

// Mock de Footer
vi.mock('/src/shared/components/ui/Footer.jsx', () => ({
  default: () => <footer data-testid="footer-mock">Footer</footer>,
}))

// Mock de themes (para la importación en AppLayout)
vi.mock('/src/styles/themes.css', () => ({}))

// Mock de matchMedia (usado por componentes internos como ThemeToggle)
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
// --- Fin Mocks ---

describe('AppLayout (FitPet)', () => {
  beforeEach(() => {
    // Aseguramos que matchMedia esté mockeado antes de cada test
    window.matchMedia = vi.fn(mockMatchMedia(false))
  })

  test('renderiza Header, Footer y el Outlet (página)', () => {
    // Página de prueba que simula el <Outlet>
    const TestPage = () => <h1>Página de Prueba</h1>

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          {/* El AppLayout envuelve la ruta */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<TestPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    // Verifica que los mocks de Header y Footer están
    expect(screen.getByTestId('header-mock')).toBeInTheDocument()
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument()

    // Verifica que el contenido del Outlet (TestPage) está
    expect(
      screen.getByRole('heading', { name: 'Página de Prueba' })
    ).toBeInTheDocument()
  })
})


