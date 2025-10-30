
/**
 * authService.js
 * Servicio centralizado para todas las llamadas al backend de autenticación.
 */

const API_BASE_URL = 'http://localhost:8080/api/v1/auth'

/**
 * Login de usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @returns {Promise<{accessToken: string, tokenType: string, expiresIn: number}>}
 * @throws {Error} Si las credenciales son inválidas o hay error de red
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
    })

    if (response.status === 201) {
      const data = await response.json()
      return data
    } else {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Email o contraseña incorrectos')
    }
  } catch (err) {
    if (err instanceof Error && err.message !== 'Failed to fetch') {
      throw err
    }
    throw new Error('Error de conexión. No se pudo contactar al servidor.')
  }
}

/**
 * Registro de nuevo usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @returns {Promise<{email: string, message: string}>}
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

    if (response.status === 201) {
      const data = await response.json()
      return data
    } else {
      const errorData = await response.json()
      
      if (response.status === 409) {
        throw new Error(errorData.message || 'El email ya está registrado')
      } else if (response.status === 400) {
        throw new Error(errorData.message || 'Error de validación. Revisa la contraseña.')
      } else {
        throw new Error('Ha ocurrido un error inesperado. Inténtalo de nuevo.')
      }
    }
  } catch (err) {
    if (err instanceof Error && err.message !== 'Failed to fetch') {
      throw err
    }
    throw new Error('Error de conexión. No se pudo contactar al servidor.')
  }
}

/**
 * Guarda el token en localStorage
 * @param {string} token - JWT token
 */
export const saveToken = (token) => {
  localStorage.setItem('token', token)
  window.dispatchEvent(new Event('storage'))
}

/**
 * Obtiene el token actual
 * @returns {string|null}
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
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!getToken()
}