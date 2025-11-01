import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import Logo from "../../../shared/assets/logo.svg"
import { register } from '../services/authService'
import { isValidEmail } from '../utils/validation'
import Button from '../../../shared/components/ui/Button'
import Input from '../../../shared/components/ui/Input'

/**
 * Página de Registro
 * Maneja la validación local y el registro mediante authService.
 */
export default function RegisterPage() {
  const navigate = useNavigate()

  // Estado del formulario
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Estado de la UI
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [apiError, setApiError] = useState(null)

  /**
   * Valida la contraseña de forma granular.
   * Retorna el PRIMER error encontrado (prioridad).
   */
  const validatePassword = (pwd) => {
    if (pwd.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres'
    }
    if (!/\d/.test(pwd)) {
      return 'La contraseña debe contener al menos un número'
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return 'La contraseña debe contener al menos un símbolo'
    }
    return null
  }

  /**
   * Valida el formulario localmente ANTES de enviarlo a la API.
   */
  const validateForm = () => {
    const errors = {}

    // Validación de email
    if (!email) {
      errors.email = 'El email es obligatorio'
    } else if (!isValidEmail(email)) {
      errors.email = 'El correo electrónico no es válido'
    }

    // Validación de contraseña (granular)
    if (!password) {
      errors.password = 'La contraseña es obligatoria'
    } else {
      const passwordError = validatePassword(password)
      if (passwordError) {
        errors.password = passwordError
      }
    }

    // Validación de confirmación
    if (!confirmPassword) {
      errors.confirmPassword = 'Debes confirmar la contraseña'
    } else if (password && password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  /**
   * Maneja el envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError(null)

    // Validar localmente
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await register(email, password)
      navigate('/login?registered=true')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8 mx-auto py-12 px-4">
      {/* Encabezado y Logo */}
      <div className="text-center">
        <Link to="/" className="inline-block" aria-label="Ir a la página de inicio">
          <img
            className="mx-auto h-32 w-auto transition-all duration-300 hover:scale-110"
            src={Logo}
            alt="FitPet Logo"
          />
        </Link>
        <p className="-mt-4 text-sm font-semibold tracking-wide uppercase text-gray-600">
          Tu compañero en su{' '}
          <span className="text-fp-mint-600 font-bold">mejor forma</span>
        </p>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Crea tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿Ya tienes una?{' '}
          <Link
            to="/login"
            className="font-medium text-fp-primary-600 hover:text-fp-primary-700 transition-colors"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      {/* Formulario */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
        {/* Error de API (409, 400, etc.) */}
        {apiError && (
          <div
            className="rounded-md border border-red-500 bg-red-50 p-3"
            role="alert"
          >
            <p className="text-sm font-medium text-red-700">
              {apiError}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* Email */}
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={formErrors.email}
            icon={Mail}
            autoComplete="email"
            required
          />

          {/* Password */}
          <Input
            id="password_register"
            name="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={formErrors.password}
            icon={Lock}
            required
          />

          {/* Confirmar Password */}
          <Input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={formErrors.confirmPassword}
            icon={Lock}
            required
          />
        </div>

        {/* Botón de envío */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isLoading}
        >
          Crear cuenta
        </Button>
      </form>
    </div>
  )
}