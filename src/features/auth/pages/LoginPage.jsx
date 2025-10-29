import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import Logo from '../../../assets/logo.svg'
import { isValidEmail } from '/src/features/auth/utils/validation.js'

/**
 * Página de Login
 * Maneja la validación local y la llamada a la API de token.
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
      const timer = setTimeout(() => setShowSuccess(false), 5000) // Ocultar después de 5s
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
    setShowSuccess(false) // Ocultar mensaje de éxito al reenviar

    // Validar localmente
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Llamar a la API (endpoint del anexo HU2)
    try {
      const response = await fetch('/api/v1/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // El backend espera 'username' y 'password' para el AuthRequest
        body: JSON.stringify({ username: email, password }),
      })

      // Manejar respuestas
      if (response.status === 201) {
        // ÉXITO (201 Created)
        const data = await response.json()
        localStorage.setItem('token', data.accessToken)
        // Forzamos un reload para que el Header detecte el token
        // (En un futuro, esto lo manejará un estado global)
        window.location.href = '/'
      } else {
        // ERROR (401 Unauthorized)
        const errorData = await response.json()
        setApiError(errorData.message || 'Email o contraseña incorrectos')
      }
    } catch (err) {
      console.error('Error de red al loguear:', err)
      setApiError('Error de conexión. No se pudo contactar al servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  // Helper para mostrar borde de error
  const getErrorClass = (fieldName) =>
    formErrors[fieldName]
      ? 'border-[var(--fp-error)] focus:border-[var(--fp-error)] focus:ring-[var(--fp-error)]'
      : 'border-[var(--border-soft)] focus:border-[var(--fp-primary-600)] focus:ring-[var(--fp-primary-600)]'

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Encabezado y Logo */}
      <div className="text-center">
        <img
          className="mx-auto h-16 w-auto"
          src={Logo}
          alt="FitPet Logo"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[var(--text-title)]">
          Inicia sesión
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--text-base)]">
          ¿Aún no tienes cuenta?{' '}
          <Link
            to="/register"
            className="font-medium text-[var(--fp-primary-500)] hover:text-[var(--fp-primary-600)]"
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
            className="rounded-md border border-[var(--fp-success)] bg-[var(--fp-success)]/10 p-3"
            role="alert"
          >
            <p className="text-sm font-medium text-[var(--fp-success)]">
              ¡Registro completado! Por favor, inicia sesión.
            </p>
          </div>
        )}

        {/* Error de API (401) */}
        {apiError && (
          <div
            className="rounded-md border border-[var(--fp-error)] bg-[var(--fp-error)]/10 p-3"
            role="alert"
          >
            <p className="text-sm font-medium text-[var(--fp-error)]">
              {apiError}
            </p>
          </div>
        )}

        <div className="space-y-4 rounded-md shadow-sm">
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
                className={`relative block w-full appearance-none rounded-md border py-3 pl-10 pr-3 text-[var(--text-base)] placeholder-gray-500 transition-colors duration-200 focus:z-10 focus:outline-none focus:ring-1 sm:text-sm ${getErrorClass(
                  'email'
                )}`}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-xs text-[var(--fp-error)]">
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
                className={`relative block w-full appearance-none rounded-md border py-3 pl-10 pr-3 text-[var(--text-base)] placeholder-gray-500 transition-colors duration-200 focus:z-10 focus:outline-none focus:ring-1 sm:text-sm ${getErrorClass(
                  'password'
                )}`}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {formErrors.password && (
              <p className="mt-1 text-xs text-[var(--fp-error)]">
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
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--fp-primary-600)] px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--fp-primary-700)] focus:outline-none focus:ring-2 focus:ring-[var(--fp-primary-500)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </div>
      </form>
    </div>
  )
}


