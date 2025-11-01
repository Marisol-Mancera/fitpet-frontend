import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import Logo from "../../../shared/assets/logo.svg"
import { login, saveToken } from '../services/authService'
import { isValidEmail } from '../utils/validation'
import Button from '../../../shared/components/ui/Button'
import Input from '../../../shared/components/ui/Input'

/**
 * Página de Login
 * Maneja la validación local y la autenticación mediante authService.
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showSuccess, setShowSuccess] = useState(false)

  // Estado del formulario
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Estado de la UI
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [apiError, setApiError] = useState(null)

  // Efecto para mostrar el mensaje de "Registro exitoso"
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  /**
   * Valida el formulario localmente ANTES de enviarlo a la API.
   */
  const validateForm = () => {
    const errors = {}
    if (!email) {
      errors.email = 'El email es obligatorio'
    } else if (!isValidEmail(email)) {
      errors.email = 'Por favor, introduce un email válido'
    }

    if (!password) {
      errors.password = 'La contraseña es obligatoria'
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
    setShowSuccess(false)

    // Validar localmente
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const data = await login(email, password)
      saveToken(data.accessToken)
      navigate('/')
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
        <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-gray-900">
          Inicia sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿Aún no tienes cuenta?{' '}
          <Link
            to="/register"
            className="font-medium text-fp-primary-600 hover:text-fp-primary-700 transition-colors"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>

      {/* Formulario */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
        {/* Mensaje de Registro Exitoso */}
        {showSuccess && (
          <div
            className="rounded-md border border-green-500 bg-green-50 p-3"
            role="alert"
          >
            <p className="text-sm font-medium text-green-700">
              ¡Registro completado! Por favor, inicia sesión.
            </p>
          </div>
        )}

        {/* Error de API (401) */}
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
            id="password_login"
            name="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={formErrors.password}
            icon={Lock}
            autoComplete="current-password"
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
          Entrar
        </Button>
      </form>
    </div>
  )
}