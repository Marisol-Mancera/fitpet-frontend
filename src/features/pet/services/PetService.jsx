/**
 * petService.js
 * Servicio centralizado para todas las llamadas al backend de mascotas (pets).
 * 
 */

import { getToken } from './authService'

const API_BASE_URL = 'http://localhost:8080/api/v1/pets'

/**
 * Obtiene el token JWT del localStorage y construye el header de autorización
 * @returns {Object} Headers con Authorization Bearer token
 * @throws {Error} Si no hay token (usuario no autenticado)
 */
const getAuthHeaders = () => {
  const token = getToken()
  if (!token) {
    throw new Error('No estás autenticado. Por favor, inicia sesión.')
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

/**
 * Endpoint: GET /api/v1/pets
 * 
 * @param {string|null} species - Especie para filtrar (opcional). Ej: 'Dog', 'Cat', 'Bird'
 * @returns {Promise<Array>} Lista de mascotas como PetDTOResponse[]
 * @throws {Error} Con mensaje específico según tipo de error
 * 
 * - 200 OK: Lista de mascotas (puede ser vacía [])
 * - 401 Unauthorized: Token inválido o expirado
 * - 403 Forbidden: Token válido pero sin permisos
 * 
 * Formato de respuesta:
 * [
 *   {
 *     "id": 1,
 *     "ownerId": 5,
 *     "name": "Pony",
 *     "species": "Dog",
 *     "breed": "Beagle",
 *     "sex": "Female",
 *     "birthDate": "2022-04-15",
 *     "weightKg": 12.4
 *   }
 * ]
 */
export const listPets = async (species = null) => {
  try {
    // Construir URL con query parameter opcional
    const url = species 
      ? `${API_BASE_URL}?species=${encodeURIComponent(species)}`
      : API_BASE_URL

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    // Scenario: Listado exitoso → 200 OK
    if (response.status === 200) {
      const data = await response.json()
      return data // Array de PetDTOResponse
    }

    // Manejo de errores según responses del backend
    const errorData = await response.json().catch(() => ({}))
    
    // 401 Unauthorized: Token inválido o expirado
    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
    }
    
    // 403 Forbidden: Sin permisos
    if (response.status === 403) {
      throw new Error('No tienes permisos para acceder a esta información.')
    }
    
    // Otros errores (500, etc.)
    throw new Error(errorData.message || 'Error al obtener las mascotas')
    
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
 * Obtener detalles de una mascota específica
 * Endpoint: GET /api/v1/pets/{id}
 * 
 * @param {number} id - ID de la mascota
 * @returns {Promise<Object>} PetDTOResponse con todos los datos
 * @throws {Error} Con mensaje específico según tipo de error
 * 
 * Escenarios:
 * - 200 OK: Mascota encontrada y pertenece al usuario
 * - 404 Not Found: Mascota no existe o no pertenece al usuario
 * - 401 Unauthorized: Token inválido
 */
export const getPetById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    if (response.status === 200) {
      const data = await response.json()
      return data
    }

    const errorData = await response.json().catch(() => ({}))
    
    if (response.status === 404) {
      throw new Error('Mascota no encontrada')
    }
    
    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
    }
    
    throw new Error(errorData.message || 'Error al obtener la mascota')
    
  } catch (err) {
    if (err instanceof Error && err.message !== 'Failed to fetch') {
      throw err
    }
    throw new Error('Error de conexión. No se pudo contactar al servidor.')
  }
}

/**
 * Crear nueva mascota
 * Endpoint: POST /api/v1/pets
 * 
 * @param {Object} petData - Datos de la mascota
 * @param {string} petData.name - Nombre (obligatorio, no vacío)
 * @param {string} petData.species - Especie (obligatorio, ej: 'Dog', 'Cat')
 * @param {string} petData.breed - Raza (obligatorio)
 * @param {string} petData.sex - Sexo (obligatorio, ej: 'Male', 'Female')
 * @param {string} petData.birthDate - Fecha de nacimiento (obligatorio, formato 'YYYY-MM-DD', debe ser pasado)
 * @param {number} petData.weightKg - Peso en kg (obligatorio, positivo)
 * @returns {Promise<Object>} PetDTOResponse de la mascota creada
 * @throws {Error} Con mensaje específico según tipo de error
 * 
 * Escenarios HU3:
 * - 201 Created: Mascota creada exitosamente
 * - 400 Bad Request: Validación fallida (campos obligatorios, birthDate futuro, weightKg negativo)
 * - 401 Unauthorized: Token inválido
 * 
 * Ejemplo de uso:
 * const nuevaMascota = await createPet({
 *   name: 'Rex',
 *   species: 'Dog',
 *   breed: 'Labrador',
 *   sex: 'Male',
 *   birthDate: '2022-01-15',
 *   weightKg: 25.5
 * })
 */
export const createPet = async (petData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(petData)
    })

    // Scenario: Creación exitosa → 201 Created
    if (response.status === 201) {
      const data = await response.json()
      return data // PetDTOResponse
    }

    const errorData = await response.json().catch(() => ({}))
    
    // 400 Bad Request → Validación fallida
    // Ejemplos de errores backend:
    // - "name must not be blank"
    // - "birthDate must be in the past"
    // - "weightKg must be positive"
    if (response.status === 400) {
      throw new Error(errorData.message || 'Error de validación. Revisa los datos ingresados.')
    }
    
    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
    }
    
    throw new Error(errorData.message || 'Error al crear la mascota')
    
  } catch (err) {
    if (err instanceof Error && err.message !== 'Failed to fetch') {
      throw err
    }
    throw new Error('Error de conexión. No se pudo contactar al servidor.')
  }
}

/**
 * Actualizar mascota existente
 * Endpoint: PUT /api/v1/pets/{id}
 * 
 * @param {number} id - ID de la mascota a actualizar
 * @param {Object} petData - Datos actualizados (misma estructura que createPet)
 * @returns {Promise<Object>} PetDTOResponse de la mascota actualizada
 * @throws {Error} Con mensaje específico según tipo de error
 * 
 * Escenarios:
 * - 200 OK: Mascota actualizada exitosamente
 * - 400 Bad Request: Validación fallida
 * - 404 Not Found: Mascota no existe o no pertenece al usuario
 * - 401 Unauthorized: Token inválido
 */
export const updatePet = async (id, petData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(petData)
    })

    if (response.status === 200) {
      const data = await response.json()
      return data
    }

    const errorData = await response.json().catch(() => ({}))
    
    if (response.status === 400) {
      throw new Error(errorData.message || 'Error de validación. Revisa los datos ingresados.')
    }
    
    if (response.status === 404) {
      throw new Error('Mascota no encontrada')
    }
    
    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
    }
    
    throw new Error(errorData.message || 'Error al actualizar la mascota')
    
  } catch (err) {
    if (err instanceof Error && err.message !== 'Failed to fetch') {
      throw err
    }
    throw new Error('Error de conexión. No se pudo contactar al servidor.')
  }
}

/**
 * Eliminar mascota
 * Endpoint: DELETE /api/v1/pets/{id}
 * 
 * @param {number} id - ID de la mascota a eliminar
 * @returns {Promise<void>} No devuelve contenido (204 No Content)
 * @throws {Error} Con mensaje específico según tipo de error
 * 
 * Escenarios:
 * - 204 No Content: Mascota eliminada exitosamente
 * - 404 Not Found: Mascota no existe o no pertenece al usuario
 * - 401 Unauthorized: Token inválido
 */
export const deletePet = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })

    // 204 No Content: Eliminación exitosa
    if (response.status === 204) {
      return // No hay contenido que retornar
    }

    const errorData = await response.json().catch(() => ({}))
    
    if (response.status === 404) {
      throw new Error('Mascota no encontrada')
    }
    
    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
    }
    
    throw new Error(errorData.message || 'Error al eliminar la mascota')
    
  } catch (err) {
    if (err instanceof Error && err.message !== 'Failed to fetch') {
      throw err
    }
    throw new Error('Error de conexión. No se pudo contactar al servidor.')
  }
}