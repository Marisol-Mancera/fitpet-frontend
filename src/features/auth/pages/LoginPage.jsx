import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import Logo from "../../../shared/assets/logo.svg"
import { login, saveToken } from '../services/authService'
import { isValidEmail } from '../utils/validation'

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

  // Helper para mostrar borde de error
  const getErrorClass = (fieldName) =>
    formErrors[fieldName]
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-fp-primary-600 focus:ring-fp-primary-600'

  return (
    <div className="w-full max-w-md space-y-8 mx-auto py-12 px-4">
      {/* Encabezado y Logo */}
      <div className="text-center">
        <img
          className="mx-auto h-32 w-auto"
          src={Logo}
          alt="FitPet Logo"
        />
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

        <div className="space-y-4 rounded-md">
          {/* Email */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`relative block w-full appearance-none rounded-lg border py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:z-10 focus:outline-none focus:ring-2 sm:text-sm ${getErrorClass(
                  'email'
                )}`}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-xs text-red-600">
                {formErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password_login" className="sr-only">
              Contraseña
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="password_login"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`relative block w-full appearance-none rounded-lg border py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:z-10 focus:outline-none focus:ring-2 sm:text-sm ${getErrorClass(
                  'password'
                )}`}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {formErrors.password && (
              <p className="mt-1 text-xs text-red-600">
                {formErrors.password}
              </p>
            )}
          </div>
        </div>

        {/* Botón de envío */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-lg border border-transparent bg-fp-primary-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-fp-primary-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-fp-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </div>
      </form>
    </div>
  )
}