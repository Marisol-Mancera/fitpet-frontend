import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

import RegisterPage from '/src/features/auth/pages/RegisterPage.jsx'

// --- Mocks ---
vi.mock('/src/assets/logo.svg', () => ({
  default: 'mocked-logo.svg',
}))

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

beforeEach(() => {
  mockNavigate.mockClear()
})

// --- Componente de renderizado ---
const renderComponent = () => {
  render(
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<div>Página de Login</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('RegisterPage', () => {
  test('renderiza el formulario de registro correctamente', () => {
    renderComponent()

    expect(screen.getByRole('heading', { name: /Crea tu cuenta/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByLabelText(/Confirmar Contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Crear cuenta/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Inicia sesión/i })).toBeInTheDocument()
  })

  test('muestra error si se envía el formulario vacío', async () => {
    renderComponent()
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }))

    expect(await screen.findByText(/Todos los campos son obligatorios./i)).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test('muestra error si las contraseñas no coinciden', async () => {
    renderComponent()

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'pass123' },
    })
    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), {
      target: { value: 'pass456' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }))

    expect(await screen.findByText(/Las contraseñas no coinciden./i)).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test('navega a /login con éxito en el registro', async () => {
    renderComponent()

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }))

    expect(screen.getByRole('button', { name: /Creando cuenta.../i })).toBeDisabled()

    await waitFor(() => {
      // Verificamos que navega a /login y añade el parámetro
      expect(mockNavigate).toHaveBeenCalledWith('/login?registered=true')
    })
  })
})
