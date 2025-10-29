import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
// 💡 CORRECCIÓN: Ruta relativa desde __tests__
import Header from '../Header.jsx'

// Mock del ThemeToggle (ya probado)
// 💡 CORRECCIÓN: Ruta relativa desde __tests__
vi.mock('../ThemeToggle.jsx', () => ({
  default: () => <div data-testid="theme-toggle-mock" />,
}))

// Mock del logo (como en Footer.test)
// 💡 CORRECCIÓN: Ruta relativa desde __tests__
vi.mock('../../../../assets/logo.svg', () => ({
  default: 'mocked-logo-path.svg',
}))

// Mock de matchMedia (usado por ThemeToggle y, a veces, por hooks)
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

// Wrapper para proveer el Router
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, { wrapper: MemoryRouter })
}

describe('Header (FitPet)', () => {
  beforeEach(() => {
    // Limpieza antes de cada test
    localStorage.clear()
    window.matchMedia = vi.fn(mockMatchMedia(false))
    // Mock de localStorage (setItem, getItem, removeItem)
    vi.spyOn(Storage.prototype, 'getItem')
    vi.spyOn(Storage.prototype, 'setItem')
    vi.spyOn(Storage.prototype, 'removeItem')
  })

  afterEach(() => {
    vi.restoreAllMocks() // Restaura mocks de localStorage
  })

  test('renderiza logo, nav desktop y ThemeToggle (logged out)', () => {
    renderWithRouter(<Header />)

    // Logo
    expect(screen.getByAltText('FitPet')).toBeInTheDocument()

    // ThemeToggle Mock
    expect(screen.getByTestId('theme-toggle-mock')).toBeInTheDocument()

    // Nav Desktop (visible)
    const navGlobal = screen.getByLabelText('Global')
    expect(navGlobal).toBeInTheDocument()
    expect(navGlobal).toBeVisible()

    // Vínculo "Login" (desktop)
    expect(
      screen.getByRole('link', { name: 'Login', hidden: true })
    ).toBeVisible()
  })

  test('el menú móvil está oculto por defecto', () => {
    renderWithRouter(<Header />)
    section   // El <nav aria-label="Mobile"> no existe en el DOM (está en {isOpen && ...})
    expect(screen.queryByLabelText('Mobile')).not.toBeInTheDocument()
  })

  test('muestra el menú móvil al hacer clic en la hamburguesa', () => {
    renderWithRouter(<Header />)

    // Botón hamburguesa (accesible por label "Abrir menú")
    const hamburgerButton = screen.getByLabelText('Abrir menú')
    fireEvent.click(hamburgerButton)

    // Ahora el nav móvil debe existir y ser visible
    const navMobile = screen.getByLabelText('Mobile')
    expect(navMobile).toBeInTheDocument()
    expect(navMobile).toBeVisible()

    // Y el botón ahora dice "Cerrar menú"
    expect(screen.getByLabelText('Cerrar menú')).toBeInTheDocument()
  })

  test('renderiza "Perfil" y "Logout" en desktop si está autenticado', () => {
    // Simulamos el token en localStorage ANTES de renderizar
    localStorage.setItem('token', 'fake-token-123')

    renderWithRouter(<Header />)

    // Nav Desktop
    const navGlobal = screen.getByLabelText('Global')
    expect(navGlobal).toBeVisible()

    // No debe estar "Login"
    expect(
      screen.queryByRole('link', { name: 'Login' })
    ).not.toBeInTheDocument()

    // Debe estar "Perfil" y "Logout"
    expect(
      screen.getByRole('link', { name: 'Perfil', hidden: true })
    ).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Logout', hidden: true })
    ).toBeVisible()
  })

  test('ejecuta logout y redirige al hacer clic en Logout', () => {
    localStorage.setItem('token', 'fake-token-123')
    renderWithRouter(<Header />, { route: '/admin' }) // Empezamos en /admin

    // Nav Desktop
    const logoutButton = screen.getByRole('button', {
      name: 'Logout',
      hidden: true,
    })
    fireEvent.click(logoutButton)

    // Verifica que se llamó a removeItem
    expect(localStorage.removeItem).toHaveBeenCalledWith('token')

    // El componente debe re-renderizar y mostrar "Login"
    expect(
      screen.getByRole('link', { name: 'Login', hidden: true })
    ).toBeVisible()
    // Y el hook useNavigate() debería haber redirigido (verificamos que "Perfil" ya no está)
    expect(
      screen.queryByRole('link', { name: 'Perfil', hidden: true })
    ).not.toBeInTheDocument()
  })
})

