import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import Logo from '/src/assets/logo.svg'
import { isValidEmail, isStrongPassword } from '/src/features/auth/utils/validation.js'

/**
 * Página de Registro
 * Maneja la validación local y la llamada a la API de registro.
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
    } else if (!isStrongPassword(password)) {
      errors.password =
        'Debe tener 8+ caracteres, 1 mayúscula, 1 número y 1 símbolo.'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Debes confirmar la contraseña'
    } else if (password && password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setFormErrors(errors)
    // Devuelve true si no hay errores
    return Object.keys(errors).length === 0
  }

  /**
   * Maneja el envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError(null)

    // 1. Validar localmente
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // 2. Llamar a la API 
    try {
      const response = await fetch('/api/v1/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      // 3. Manejar respuestas
      if (response.status === 201) {
        // ÉXITO (201 Created)
        // Redirigimos al login con un parámetro para mostrar el mensaje
        navigate('/login?registered=true')
      } else {
        // ERRORES (400, 409, 500...)
        const errorData = await response.json()
        if (response.status === 409) {
          setApiError(errorData.message || 'El email ya está registrado')
        } else if (response.status === 400) {
          setApiError(
            errorData.message || 'Error de validación. Revisa la contraseña.'
          )
        } else {
          setApiError('Ha ocurrido un error inesperado. Inténtalo de nuevo.')
        }
      }
    } catch (err) {
      console.error('Error de red al registrar:', err)
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
          Crea tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--text-base)]">
          ¿Ya tienes una?{' '}
          <Link
            to="/login"
            className="font-medium text-[var(--fp-primary-500)] hover:text-[var(--fp-primary-600)]"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      {/* Formulario */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
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
            <label htmlFor="password_register" className="sr-only">
              Contraseña
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="password_register"
                name="password"
                type="password"
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
              <p className="mt-1 max-w-xs text-xs text-[var(--fp-error)]">
                {formErrors.password}
              </p>
            )}
          </div>

          {/* Confirmar Password */}
          <div>
            <label htmlFor="confirm-password" className="sr-only">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                className={`relative block w-full appearance-none rounded-md border py-3 pl-10 pr-3 text-[var(--text-base)] placeholder-gray-500 transition-colors duration-200 focus:z-10 focus:outline-none focus:ring-1 sm:text-sm ${getErrorClass(
                  'confirmPassword'
                )}`}
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {formErrors.confirmPassword && (
              <p className="mt-1 text-xs text-[var(--fp-error)]">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Error de API (409, 400, etc.) */}
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

        {/* Botón de envío */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--fp-primary-600)] px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--fp-primary-700)] focus:outline-none focus:ring-2 focus:ring-[var(--fp-primary-500)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </div>
      </form>
    </div>
  )
}

