import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

import LoginPage from '/src/features/auth/pages/LoginPage.jsx'

// --- Mocks ---

// Mock del logo
// (Esta ruta absoluta parece funcionar en el preview, la mantenemos)
vi.mock('/src/assets/logo.svg', () => ({
  default: 'mocked-logo.svg',
}))

// Mock de useNavigate para espiar sus llamadas
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock de matchMedia (necesario por el ThemeToggle en otros componentes)
beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

// Limpiamos mocks y localStorage antes de cada test
beforeEach(() => {
  mockNavigate.mockClear()
  localStorage.clear()
})

// --- Componente de renderizado ---
const renderComponent = () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<div>Página de Inicio</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  test('renderiza el formulario de login correctamente', () => {
    renderComponent()

    expect(screen.getByRole('heading', { name: /Bienvenido/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Crear una cuenta/i })).toBeInTheDocument()
  })

  test('muestra error si se envía el formulario vacío', async () => {
    renderComponent()

    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))

    expect(await screen.findByText(/Email y contraseña son obligatorios./i)).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
    expect(localStorage.getItem('token')).toBeNull()
  })

  test('muestra error con credenciales incorrectas', async () => {
    renderComponent()

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'usuario@incorrecto.com' },
    })
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: '123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))

    expect(screen.getByRole('button', { name: /Iniciando sesión.../i })).toBeDisabled()

    await waitFor(() => {
      expect(screen.getByText(/Credenciales incorrectas/i)).toBeInTheDocument()
    })

    expect(mockNavigate).not.toHaveBeenCalled()
    expect(localStorage.getItem('token')).toBeNull()
  })

  test('redirige a / y guarda token con credenciales correctas', async () => {
    renderComponent()

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@fitpet.app' },
    })
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))

    expect(screen.getByRole('button', { name: /Iniciando sesión.../i })).toBeDisabled()

    // Esperamos a que la navegación ocurra
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })

    // Verificamos que el token se guardó
    expect(localStorage.getItem('token')).toBe('fake-jwt-token-from-login')
    
    // Verificamos que ya no muestra error
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

