import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'

import Logo from '/src/assets/logo.svg'

/**
 * Página de inicio de sesión.
 * Renderizada por el router dentro de CredentialsLayout.
 */
export default function LoginPage() {
  const navigate = useNavigate()

  // --- Estado Local (Reemplaza Redux temporalmente) ---
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Limpia el error si el usuario empieza a escribir de nuevo
  useEffect(() => {
    if (email || password) setError(null)
  }, [email, password])

  // --- Simulación de Submit (Reemplaza Dispatch) ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLoading) return
    
    // Validación simple
    if (!email || !password) {
      setError('Email y contraseña son obligatorios.')
      return
    }

    setIsLoading(true)
    setError(null)

    // Simulación de llamada a la API (Backend HU-1)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Lógica de autenticación (temporal)
    if (email === 'test@fitpet.app' && password === 'password123') {
      // Guardamos token (Placeholder, igual que en Header.jsx)
      localStorage.setItem('token', 'fake-jwt-token-from-login')
      navigate('/') // Redirige a la home
    } else {
      setError('Credenciales incorrectas. Inténtalo de nuevo.')
    }

    setIsLoading(false)
  }

  return (
    <div className="flex w-full flex-col items-center">
      <img
        src={Logo}
        alt="FitPet"
        className="mb-6 h-16 w-auto"
      />
      <h1 className="mb-6 text-3xl font-bold text-[var(--text-title)]">
        Bienvenido
      </h1>

      {/* Contenedor del formulario */}
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 shadow-sm"
        noValidate
      >
        <div className="flex flex-col gap-5">
          {/* --- Campo Email (Adaptado de Input) --- */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-[var(--text-title)]"
            >
              Email
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-md border border-[var(--border-soft)] bg-[var(--bg-app)] py-2.5 pl-10 pr-3 text-[var(--text-base)] shadow-sm focus:border-[var(--fp-primary-500)] focus:outline-none focus:ring-1 focus:ring-[var(--fp-primary-500)]"
              />
            </div>
          </div>

          {/* --- Campo Contraseña (Adaptado de Input) --- */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-[var(--text-title)]"
            >
              Contraseña
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                className="w-full rounded-md border border-[var(--border-soft)] bg-[var(--bg-app)] py-2.5 pl-10 pr-3 text-[var(--text-base)] shadow-sm focus:border-[var(--fp-primary-500)] focus:outline-none focus:ring-1 focus:ring-[var(--fp-primary-500)]"
              />
            </div>
          </div>

          {/* --- Error (Adaptado de FormError) --- */}
          {error && (
            <p
              role="alert"
              className="-mt-2 text-center text-sm text-[var(--fp-error)]"
            >
              {error}
            </p>
          )}

          {/* --- Botones --- */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[var(--fp-primary-600)] py-2.5 text-base font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[var(--fp-primary-700)] focus:outline-none focus:ring-2 focus:ring-[var(--fp-primary-500)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Iniciando sesión...' : 'Entrar'}
          </button>

          <Link
            to="/register"
            className="w-full rounded-lg border border-[var(--fp-primary-600)] py-2.5 text-center text-base font-semibold text-[var(--fp-primary-600)] shadow-sm transition-colors duration-200 hover:bg-[var(--fp-primary-600)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--fp-primary-500)] focus:ring-offset-2"
          >
            Crear una cuenta
          </Link>
        </div>
      </form>
    </div>
  )
}


