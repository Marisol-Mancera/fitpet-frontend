import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
// 💡 (FIX) Cambiamos a ruta absoluta para el preview
import Logo from '/src/assets/logo.svg'

/**
 * Validador simple de email (regex)
 */
const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Página de Login
 * Refactorizada para incluir validación local y llamada fetch real a la API.
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // apiError: Para errores del servidor (ej. "Credenciales inválidas")
  const [apiError, setApiError] = useState(null)
  // formErrors: Para errores del cliente (ej. "Campo requerido")
  const [formErrors, setFormErrors] = useState({})

  // Muestra un mensaje de éxito si venimos de /register
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setShowSuccessMessage(true)
      // Limpia el parámetro de la URL
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate])

  /**
   * Validación del formulario del lado del cliente
   */
  const validateForm = () => {
    const errors = {}
    if (!email) {
      errors.email = 'El email es obligatorio.'
    } else if (!isEmailValid(email)) {
      errors.email = 'El formato del email no es válido.'
    }
    if (!password) {
      errors.password = 'La contraseña es obligatoria.'
    }
    setFormErrors(errors)
    // Devuelve true si no hay errores
    return Object.keys(errors).length === 0
  }

  /**
   * Manejo de envío con fetch real
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Limpiar errores previos
    setApiError(null)
    setFormErrors({})

    // Validar campos del cliente
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Llamada real a la API (endpoint del anexo)
    try {
      const response = await fetch('/api/v1/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // El backend espera 'username' (que es el email) y 'password'
        body: JSON.stringify({ username: email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Usamos el mensaje del backend (ej. "Invalid credentials")
        setApiError(data.message || 'Error al iniciar sesión.')
        return
      }

      // Éxito (201 Created)
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken)
        navigate('/')
      } else {
        setApiError('Respuesta inesperada del servidor.')
      }
    } catch (err) {
      console.error('Error en fetch:', err)
      setApiError('No se pudo conectar al servidor. Inténtalo más tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm lg:w-96">
      {/* Logo y Título */}
      <div>
        <img className="mx-auto h-12 w-auto" src={Logo} alt="FitPet" />
        <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-[var(--text-title)]">
          Inicia sesión
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--text-base)]">
          O{' '}
          <Link
            to="/register"
            className="font-medium text-[var(--fp-primary-500)] hover:text-[var(--fp-primary-600)]"
          >
            regístrate si eres nuevo
          </Link>
        </p>
      </div>

      <div className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mensaje de éxito (si vienes de registro) */}
          {showSuccessMessage && (
            <div className="rounded-md border border-[var(--fp-success)] bg-green-50 p-4">
              <p className="text-sm font-medium text-green-800">
                ¡Registro completado! Por favor, inicia sesión.
              </p>
            </div>
          )}

          {/* Mensaje de error de la API */}
          {apiError && (
            <div className="rounded-md border border-[var(--fp-error)] bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{apiError}</p>
            </div>
          )}

          {/* Campo Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-[var(--text-base)]"
            >
              Email
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full rounded-md border-0 py-2.5 pl-10 text-[var(--text-title)] shadow-sm ring-1 ring-inset ring-[var(--border-soft)] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--fp-primary-600)] sm:text-sm sm:leading-6 ${
                  formErrors.email
                    ? 'ring-[var(--fp-error)] focus:ring-[var(--fp-error)]'
                    : ''
                }`}
              />
            </div>
            {/* Mensaje de error del campo Email */}
            {formErrors.email && (
              <p className="mt-2 text-sm text-[var(--fp-error)]" id="email-error">
                {formErrors.email}
              </p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-[var(--text-base)]"
            >
              Contraseña
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full rounded-md border-0 py-2.5 pl-10 text-[var(--text-title)] shadow-sm ring-1 ring-inset ring-[var(--border-soft)] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--fp-primary-600)] sm:text-sm sm:leading-6 ${
                  formErrors.password
                    ? 'ring-[var(--fp-error)] focus:ring-[var(--fp-error)]'
                    : ''
                }`}
              />
            </div>
            {/* Mensaje de error del campo Contraseña */}
            {formErrors.password && (
              <p
                className="mt-2 text-sm text-[var(--fp-error)]"
                id="password-error"
              >
                {formErrors.password}
              </p>
            )}
          </div>

          {/* Botón Submit */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-[var(--fp-primary-600)] px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[var(--fp-primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fp-primary-500)] disabled:opacity-50"
            >
              {isLoading ? 'Iniciando sesión...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


