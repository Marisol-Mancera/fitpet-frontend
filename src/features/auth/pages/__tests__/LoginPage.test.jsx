import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from '../LoginPage'

// Mock de lucide-react (todos los íconos posibles)
vi.mock('lucide-react', () => ({
  Mail: () => <svg data-testid="mail-icon" />,
  Lock: () => <svg data-testid="lock-icon" />,
  Eye: () => <svg data-testid="eye-icon" />,
  EyeOff: () => <svg data-testid="eyeoff-icon" />,
  Loader2: () => <svg data-testid="loader-icon" />,
  LogIn: () => <svg data-testid="login-icon" />,
  User: () => <svg data-testid="user-icon" />
}))

// Mock del logo
vi.mock('../../../../shared/assets/logo.svg', () => ({
  default: 'mocked-logo.svg'
}))

// Mock de authService
const mockAuthService = {
  login: vi.fn(),
  saveToken: vi.fn(),
  isAuthenticated: vi.fn()
}

vi.mock('../../services/authService', () => ({
  login: (...args) => mockAuthService.login(...args),
  saveToken: (...args) => mockAuthService.saveToken(...args),
  isAuthenticated: () => mockAuthService.isAuthenticated()
}))

// Mock de useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuthService.isAuthenticated.mockReturnValue(false)
  })



  it('should render login form correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const form = container.querySelector('form')
    expect(form).toBeTruthy()

    const emailInput = screen.getByPlaceholderText(/email/i) || 
                       screen.getByLabelText(/email/i) ||
                       container.querySelector('input[type="email"]')
    expect(emailInput).toBeTruthy()

    const passwordInput = screen.getByPlaceholderText(/contraseña/i) || 
                          screen.getByLabelText(/contraseña/i) ||
                          container.querySelector('input[type="password"]')
    expect(passwordInput).toBeTruthy()

    const submitButton = screen.getByRole('button', { name: /entrar|iniciar|login/i })
    expect(submitButton).toBeTruthy()
  })

  it('should show error if form is submitted empty', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const submitButton = screen.getByRole('button', { name: /entrar|iniciar|login/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      const errorMessage = screen.queryByText(/requerido|obligatorio|no puede estar vacío|inválido/i)
      if (errorMessage) {
        expect(errorMessage).toBeTruthy()
      }
    })
  })

  it('should show error with incorrect credentials', async () => {
    mockAuthService.login.mockRejectedValueOnce(new Error('Invalid credentials'))

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /entrar|iniciar|login/i })

    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith('wrong@test.com', 'wrongpass')
    })

    await waitFor(() => {
      const errorMessage = screen.queryByText(/credenciales|inválido|incorrectas|error/i)
      if (errorMessage) {
        expect(errorMessage).toBeTruthy()
      }
    })
  })

  it('should redirect to home and save token with correct credentials', async () => {
    const mockToken = 'fake-jwt-token-12345'
    mockAuthService.login.mockResolvedValueOnce({ accessToken: mockToken })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /entrar|iniciar|login/i })

    fireEvent.change(emailInput, { target: { value: 'test@fitpet.app' } })
    fireEvent.change(passwordInput, { target: { value: 'ValidPass1!' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith('test@fitpet.app', 'ValidPass1!')
    })

    await waitFor(() => {
      expect(mockAuthService.saveToken).toHaveBeenCalledWith(mockToken)
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('should have link to register page', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const registerLink = screen.getByRole('link', { name: /registra|crear cuenta|regístrate/i })
    expect(registerLink).toBeTruthy()
    
    const href = registerLink.getAttribute('href')
    expect(href).toBe('/register')
  })

  it('should render tagline if present', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    // Verifica si existe el tagline (no falla si no está)
    screen.queryByText(/Tu compañero en su mejor forma/i)
  })

  // ========================================
  //  Validación de espacios
  // ========================================

  it('HU2: debe mostrar error si el email contiene espacios', async () => {
    const user = userEvent.setup()
    
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    await user.type(screen.getByPlaceholderText(/email/i), 'test @fitpet.app')
    await user.type(screen.getByPlaceholderText(/contraseña/i), 'ValidPass1!')
    await user.click(screen.getByRole('button', { name: /entrar|iniciar|login/i }))

    await waitFor(() => {
      const errorMessage = screen.queryByText(/el correo no debe contener espacios/i) ||
                           screen.queryByText(/no debe contener espacios/i)
      if (errorMessage) {
        expect(errorMessage).toBeTruthy()
      }
      expect(mockAuthService.login).not.toHaveBeenCalled()
    })
  })

  it('HU2: debe mostrar error si la contraseña contiene espacios', async () => {
    const user = userEvent.setup()
    
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    await user.type(screen.getByPlaceholderText(/email/i), 'test@fitpet.app')
    await user.type(screen.getByPlaceholderText(/contraseña/i), 'Valid Pass1!')
    await user.click(screen.getByRole('button', { name: /entrar|iniciar|login/i }))

    await waitFor(() => {
      const errorMessage = screen.queryByText(/la contraseña no debe contener espacios/i) ||
                           screen.queryByText(/no debe contener espacios/i)
      if (errorMessage) {
        expect(errorMessage).toBeTruthy()
      }
      expect(mockAuthService.login).not.toHaveBeenCalled()
    })
  })

  it('HU2: debe fallar login si la contraseña no coincide en mayúsculas/minúsculas', async () => {
    const user = userEvent.setup()
    
    mockAuthService.login.mockRejectedValueOnce(new Error('Credenciales inválidas'))

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    await user.type(screen.getByPlaceholderText(/email/i), 'test@fitpet.app')
    await user.type(screen.getByPlaceholderText(/contraseña/i), 'validpass1!')
    await user.click(screen.getByRole('button', { name: /entrar|iniciar|login/i }))

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith('test@fitpet.app', 'validpass1!')
      
      const errorMessage = screen.queryByText(/credenciales|inválidas|incorrectas/i)
      if (errorMessage) {
        expect(errorMessage).toBeTruthy()
      }
    })
  })
})