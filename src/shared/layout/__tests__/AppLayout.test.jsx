import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
// ANTES:
// import AppLayout from '../AppLayout.jsx'
// DESPUÉS (Corrección de ruta): Usamos ruta absoluta
import AppLayout from '/src/shared/layout/AppLayout.jsx'

// --- Mocks ---

// Mock de Header (Regla 10: No probar dependencias)
// Usamos un mock simple para verificar que se renderiza.
vi.mock('/src/shared/components/ui/Header.jsx', () => ({
  default: () => <header data-testid="header-mock">Header Mock</header>,
}))

// 2. Mock de Footer
vi.mock('/src/shared/components/ui/Footer.jsx', () => ({
  default: () => <footer data-testid="footer-mock">Footer Mock</footer>,
}))

// Mock de themes.css (para evitar errores de importación en Vitest)
vi.mock('/src/styles/themes.css', () => ({
  default: '',
}))

//Mock de matchMedia (dependencia indirecta vía Header -> ThemeToggle)
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

// --- Tests ---

describe('AppLayout', () => {
  beforeEach(() => {
    // Limpieza estándar de tests
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    window.matchMedia = vi.fn(mockMatchMedia(false))
  })

  test('renderiza Header, Footer y el contenido del Outlet', () => {
    // Contenido ficticio que simula el <Outlet />
    const DUMMY_PAGE_TEXT = 'Contenido de la página (Outlet)'
    const DummyPage = () => <h1>{DUMMY_PAGE_TEXT}</h1>

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          {/* Definimos una ruta que usa AppLayout */}
          <Route element={<AppLayout />}>
            {/* El Outlet renderizará DummyPage en la ruta '/' */}
            <Route path="/" element={<DummyPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    // Verificar que el Header (mock) está presente
    expect(screen.getByTestId('header-mock')).toBeInTheDocument()
    expect(screen.getByText('Header Mock')).toBeInTheDocument()

    // Verificar que el Footer (mock) está presente
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument()
    expect(screen.getByText('Footer Mock')).toBeInTheDocument()

    // Verificar que el contenido del Outlet (DummyPage) está presente
    expect(screen.getByRole('heading', { name: DUMMY_PAGE_TEXT })).toBeInTheDocument()
  })
})

