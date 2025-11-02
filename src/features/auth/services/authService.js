/**
 * authService.js
 * Servicio centralizado para todas las llamadas al backend de autenticación.
 * 
 * Registro de usuario
 * : Login de usuario (autenticación con JWT)
 */

const API_BASE_URL = 'http://localhost:8080/api/v1/auth'

/**
 * Login de usuario
 * Endpoint: POST /api/v1/auth/login
 * 
 * @param {string} email - Email del usuario (será normalizado por backend)
 * @param {string} password - Contraseña (case-sensitive)
 * @returns {Promise<{tokenType: string, expiresIn: number, accessToken: string}>}
 * @throws {Error} Con mensaje específico según tipo de error
 * 
 * - 201 Created: Login exitoso → devuelve TokenResponse con JWT
 * - 400 Bad Request: Email con espacios o inválido
 * - 401 Unauthorized: Credenciales inválidas o password case mismatch
 */
export const login = async (email, password) => {
  try {
    // ENDPOINT: /login (genera JWT) - Refactor: reemplaza a /token deprecado
    // IMPORTANTE: Backend espera { email, password } (no username)
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // campo 'email', no 'username'
    })

    //  Scenario: Login exitoso → 201 Created
    if (response.status === 201) {
      const data = await response.json()
      // Backend devuelve: { tokenType: "Bearer", expiresIn: 900, accessToken: "eyJ..." }
      return data
    }

    // Manejo de errores según responses del backend
    const errorData = await response.json().catch(() => ({}))
    
    //  Scenario: 400 Bad Request
    // Causas posibles:
    // - Email con espacios → "Email must not contain spaces"
    // - Email inválido → "email must be valid"
    // - Password vacío → "password is required"
    if (response.status === 400) {
      throw new Error(errorData.message || 'Datos de entrada inválidos')
    }
    
    //  Scenarios: 401 Unauthorized
    // Causas posibles:
    // - Credenciales inválidas (email no existe)
    // - Password case mismatch (mayúsculas/minúsculas incorrectas)
    // Backend lanza BadCredentialsException → GlobalExceptionHandler mapea a 401
    if (response.status === 401) {
      throw new Error(errorData.message || 'Credenciales inválidas')
    }
    
    // Otros errores (500, etc.)
    throw new Error(errorData.message || 'Error al iniciar sesión')
    
  } catch (err) {
    // Si ya es un error personalizado (throw new Error arriba), lo propagamos
    if (err instanceof Error && err.message !== 'Failed to fetch') {
      throw err
    }
    // Error de red (backend no responde)
    throw new Error('Error de conexión. No se pudo contactar al servidor.')
  }
}

/**
 * Registro de nuevo usuario
 * Endpoint: POST /api/v1/auth/registro
 * 
 * @param {string} email - Email del usuario (será normalizado por backend)
 * @param {string} password - Contraseña (debe cumplir requisitos de seguridad)
 * @returns {Promise<{id: string, email: string, createdAt: string|null}>}
 * @throws {Error} Si el email ya existe o la validación falla
 */
export const register = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    // Registro exitoso → 201 Created
    if (response.status === 201) {
      const data = await response.json()
      // Backend devuelve: { id: "Registered", email, createdAt: null }
      return data
    }

    // Manejo de errores según responses del backend
    const errorData = await response.json().catch(() => ({}))
    
    // 409 Conflict → Email ya registrado
    if (response.status === 409) {
      throw new Error(errorData.message || 'El email ya está registrado')
    }
    
    // 400 Bad Request → Validación fallida (contraseña débil, etc.)
    if (response.status === 400) {
      throw new Error(errorData.message || 'Error de validación. Revisa la contraseña.')
    }
    
    // Otros errores
    throw new Error('Ha ocurrido un error inesperado. Inténtalo de nuevo.')
    
  } catch (err) {
    if (err instanceof Error && err.message !== 'Failed to fetch') {
      throw err
    }
    throw new Error('Error de conexión. No se pudo contactar al servidor.')
  }
}

/**
 * Guarda el JWT token en localStorage
 * @param {string} token - JWT access token
 */
export const saveToken = (token) => {
  localStorage.setItem('token', token)
  // Disparar evento para que otros componentes detecten el cambio
  window.dispatchEvent(new Event('storage'))
}

/**
 * Obtiene el token actual del localStorage
 * @returns {string|null} JWT token o null si no existe
 */
export const getToken = () => {
  return localStorage.getItem('token')
}

/**
 * Elimina el token (logout)
 */
export const removeToken = () => {
  localStorage.removeItem('token')
  window.dispatchEvent(new Event('storage'))
}

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} true si existe un token válido
 */
export const isAuthenticated = () => {
  return !!getToken()
}