import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import LoginPage from '../LoginPage.jsx'

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
  login: vi.fn(),
  saveToken: vi.fn(),
}))

import { login, saveToken } from '../../services/authService'

beforeEach(() => {
  mockNavigate.mockClear()
  vi.mocked(login).mockClear()
  vi.mocked(saveToken).mockClear()
  localStorage.clear()
})

const renderComponent = () => {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  test('renderiza el formulario de login correctamente', () => {
    renderComponent()

    expect(screen.getByRole('heading', { name: /Bienvenido/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Crear una cuenta/i })).toBeInTheDocument()
  })

  test('muestra error si se envía el formulario vacío', async () => {
    renderComponent()

    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))

    expect(await screen.findByText(/El email es obligatorio/i)).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test('muestra error con credenciales incorrectas', async () => {
    vi.mocked(login).mockRejectedValueOnce(new Error('Credenciales incorrectas'))

    renderComponent()

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'usuario@incorrecto.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), {
      target: { value: 'wrongpass' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))

    await waitFor(() => {
      expect(screen.getByText(/Credenciales incorrectas/i)).toBeInTheDocument()
    })

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test('redirige a / y guarda token con credenciales correctas', async () => {
    vi.mocked(login).mockResolvedValueOnce({
      accessToken: 'fake-jwt-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
    })

    renderComponent()

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@fitpet.app' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), {
      target: { value: 'ValidPass1!' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))

    await waitFor(() => {
      expect(saveToken).toHaveBeenCalledWith('fake-jwt-token')
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})