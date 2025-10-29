import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, User } from 'lucide-react'

import Logo from '../../../assets/logo.svg'

/**
 * Página de registro de nuevos usuarios.
 * Se renderiza dentro de CredentialsLayout.
 */
export default function RegisterPage() {
  const navigate = useNavigate()

  // --- Estado Local (Reemplaza Redux y useRegisterForm) ---
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Limpia el error si el usuario empieza a escribir de nuevo
  useEffect(() => {
    if (email || password || confirmPassword) {
      setError(null)
    }
  }, [email, password, confirmPassword])

  /**
   * Maneja el envío del formulario de registro.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // --- Validación (Reemplaza validate()) ---
    if (!email || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setIsLoading(true)

    // --- Simulación de API (Reemplaza dispatch(registerUser)) ---
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // con un parámetro para que el login sepa que mostrar un éxito.
      navigate('/login?registered=true')
    } catch (err) {
      setError('Error simulado. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <Link to="/" className="flex justify-center mb-8">
        <img src={Logo} alt="FitPet" className="h-16 w-auto" />
      </Link>

      <h1 className="text-3xl font-bold text-center text-[var(--text-title)] mb-4">
        Crea tu cuenta
      </h1>
      <p className="text-center text-[var(--text-base)] mb-8">
        ¿Ya tienes una?{' '}
        <Link
          to="/login"
          className="font-medium text-[var(--fp-primary-500)] hover:underline"
        >
          Inicia sesión
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[var(--text-title)] mb-1"
          >
            Email
          </label>
          <div className="relative rounded-md shadow-sm">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail
                className="h-5 w-5 text-[var(--text-base)]"
                aria-hidden="true"
              />
            </span>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-0 py-2.5 pl-10 bg-[var(--bg-surface)] text-[var(--text-base)] ring-1 ring-inset ring-[var(--border-soft)] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--fp-primary-600)] sm:text-sm"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        {/* Input Contraseña */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[var(--text-title)] mb-1"
          >
            Contraseña
          </label>
          <div className="relative rounded-md shadow-sm">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock
                className="h-5 w-5 text-[var(--text-base)]"
                aria-hidden="true"
              />
            </span>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border-0 py-2.5 pl-10 bg-[var(--bg-surface)] text-[var(--text-base)] ring-1 ring-inset ring-[var(--border-soft)] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--fp-primary-600)] sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Input Confirmar Contraseña */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-[var(--text-title)] mb-1"
          >
            Confirmar Contraseña
          </label>
          <div className="relative rounded-md shadow-sm">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock
                className="h-5 w-5 text-[var(--text-base)]"
                aria-hidden="true"
              />
            </span>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-md border-0 py-2.5 pl-10 bg-[var(--bg-surface)] text-[var(--text-base)] ring-1 ring-inset ring-[var(--border-soft)] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--fp-primary-600)] sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div
            role="alert"
            className="rounded-md border border-[var(--fp-error)] bg-red-50 p-4"
          >
            <p className="text-sm font-medium text-[var(--fp-error)]">
              {error}
            </p>
          </div>
        )}

        {/* Botón Submit */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md bg-[var(--fp-primary-600)] px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[var(--fp-primary-500)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fp-primary-700)] disabled:opacity-50"
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </div>
      </form>
    </div>
  )
}

