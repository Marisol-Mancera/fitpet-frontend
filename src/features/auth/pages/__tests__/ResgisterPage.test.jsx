import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import RegisterPage from '../RegisterPage.jsx'

// Mock del logo
vi.mock('../../../../shared/assets/logo.svg', () => ({
  default: 'mocked-logo.svg',
}))

// Mock de useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock del authService
vi.mock('../../services/authService', () => ({
  register: vi.fn(),
}))

import { register } from '../../services/authService'

beforeEach(() => {
  mockNavigate.mockClear()
  vi.mocked(register).mockClear()
})

const renderComponent = () => {
  render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  )
}

describe('RegisterPage - HU1: Registro de Usuario', () => {
  test('renderiza el formulario de registro correctamente', () => {
    renderComponent()

    expect(screen.getByRole('heading', { name: /Crea tu cuenta/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Confirmar Contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Crear cuenta/i })).toBeInTheDocument()
  })

  test('muestra error si el email está vacío', async () => {
    renderComponent()
    
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }))

    expect(await screen.findByText(/El email es obligatorio/i)).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test('muestra "El correo electrónico no es válido" con email inválido', async () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'invalido' },
    })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'ValidPass1!' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Confirmar Contraseña/i), {
      target: { value: 'ValidPass1!' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }))

    expect(await screen.findByText(/El correo electrónico no es válido/i)).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test('muestra "La contraseña debe tener al menos 8 caracteres" con contraseña corta', async () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'Pass1!' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Confirmar Contraseña/i), {
      target: { value: 'Pass1!' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }))

    expect(await screen.findByText(/La contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test('muestra "La contraseña debe contener al menos un número" sin dígito', async () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'Password!' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Confirmar Contraseña/i), {
      target: { value: 'Password!' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }))

    expect(await screen.findByText(/La contraseña debe contener al menos un número/i)).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test('muestra "La contraseña debe contener al menos un símbolo" sin símbolo', async () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'Password1' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Confirmar Contraseña/i), {
      target: { value: 'Password1' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }))

    expect(await screen.findByText(/La contraseña debe contener al menos un símbolo/i)).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test('muestra error si las contraseñas no coinciden', async () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'ValidPass1!' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Confirmar Contraseña/i), {
      target: { value: 'Different1!' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }))

    expect(await screen.findByText(/Las contraseñas no coinciden/i)).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test('navega a /login con éxito cuando el registro es válido', async () => {
    vi.mocked(register).mockResolvedValueOnce({ email: 'test@test.com' })
    
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'ValidPass1!' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Confirmar Contraseña/i), {
      target: { value: 'ValidPass1!' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login?registered=true')
    })
  })
})