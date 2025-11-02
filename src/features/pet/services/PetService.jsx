/**
 * petService.js
 * Servicio centralizado para todas las llamadas al backend de mascotas.
 * 
 */

import { getToken } from './authService'

const API_BASE_URL = 'http://localhost:8080/api/v1/pets'

/**
 * Obtiene el header de autenticación con el JWT token.
 * @returns {Object} headers con Authorization Bearer
 */
const getAuthHeaders = () => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

/**
 * Endpoint: POST /api/v1/pets
 * 
 * @param {Object} petData - Datos de la mascota
 * @param {string} petData.name - Nombre de la mascota
 * @param {string} petData.species - Especie (Dog, Cat, etc.)
 * @param {string} petData.breed - Raza
 * @param {string} petData.sex - Sexo (Male, Female)
 * @param {string} petData.birthDate - Fecha de nacimiento (YYYY-MM-DD)
 * @param {number} petData.weightKg - Peso en kilogramos
 * @returns {Promise<Object>} PetDTOResponse con la mascota creada
 * @throws {Error} Con mensaje específico según tipo de error
 * 
 * - 201 Created: Mascota creada exitosamente
 * - 400 Bad Request: Campos obligatorios faltantes o inválidos
 * - 401 Unauthorized: Token JWT inválido o expirado
 */
export const createPet = async (petData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(petData),
    })

    if (response.status === 201) {
      const data = await response.json()
      return data
    }

    const errorData = await response.json().catch(() => ({}))

    if (response.status === 400) {
      throw new Error(errorData.message || 'Datos de mascota inválidos')
    }

    if (response.status === 401) {
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
    }

    throw new Error(errorData.message || 'Error al registrar mascota')

  } catch (err) {
    if (err instanceof Error && err.message !== 'Failed to fetch') {
      throw err
    }
    throw new Error('Error de conexión. No se pudo contactar al servidor.')
  }
}

/**
 * Endpoint: GET /api/v1/pets o GET /api/v1/pets?species={especie}
 * 
 * @param {string|null} species - (Opcional) Filtrar por especie (ej: "Dog", "Cat")
 * @returns {Promise<Array>} Array de PetDTOResponse
 * @throws {Error} Con mensaje específico según tipo de error
 * 
 * - 200 OK: Devuelve lista (vacía si no tiene mascotas)
 * - 401 Unauthorized: Token JWT inválido o expirado
 * 
 * Ejemplos de uso:
 * - listPets() → todas las mascotas
 * - listPets("Dog") → solo perros
 */
export const listPets = async (species = null) => {
  try {
    const url = species 
      ? `${API_BASE_URL}?species=${encodeURIComponent(species)}`
      : API_BASE_URL

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (response.status === 200) {
      const data = await response.json()
      return data
    }

    const errorData = await response.json().catch(() => ({}))

    if (response.status === 401) {
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
    }

    throw new Error(errorData.message || 'Error al obtener mascotas')

  } catch (err) {
    if (err instanceof Error && err.message !== 'Failed to fetch') {
      throw err
    }
    throw new Error('Error de conexión. No se pudo contactar al servidor.')
  }
}

/**
 * Obtener detalle de una mascota específica
 * Endpoint: GET /api/v1/pets/{id}
 * 
 * @param {number} id - ID de la mascota
 * @returns {Promise<Object>} PetDTOResponse con el detalle
 * @throws {Error} Con mensaje específico según tipo de error
 * 
 * Escenarios:
 * - 200 OK: Devuelve el detalle de la mascota
 * - 404 Not Found: Mascota no existe o no pertenece al usuario
 * - 401 Unauthorized: Token JWT inválido
 */
export const getPetById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
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
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
    }

    throw new Error(errorData.message || 'Error al obtener mascota')

  } catch (err) {
    if (err instanceof Error && err.message !== 'Failed to fetch') {
      throw err
    }
    throw new Error('Error de conexión. No se pudo contactar al servidor.')
  }
}

/**
 * Actualizar datos de una mascota existente
 * Endpoint: PUT /api/v1/pets/{id}
 * 
 * @param {number} id - ID de la mascota
 * @param {Object} petData - Datos actualizados (mismo formato que createPet)
 * @returns {Promise<Object>} PetDTOResponse actualizado
 */
export const updatePet = async (id, petData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(petData),
    })

    if (response.status === 200) {
      const data = await response.json()
      return data
    }

    const errorData = await response.json().catch(() => ({}))

    if (response.status === 400) {
      throw new Error(errorData.message || 'Datos de mascota inválidos')
    }

    if (response.status === 404) {
      throw new Error('Mascota no encontrada')
    }

    if (response.status === 401) {
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
    }

    throw new Error(errorData.message || 'Error al actualizar mascota')

  } catch (err) {
    if (err instanceof Error && err.message !== 'Failed to fetch') {
      throw err
    }
    throw new Error('Error de conexión. No se pudo contactar al servidor.')
  }
}

/**
 * Eliminar una mascota
 * Endpoint: DELETE /api/v1/pets/{id}
 * 
 * @param {number} id - ID de la mascota
 * @returns {Promise<void>}
 */
export const deletePet = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (response.status === 204) {
      return
    }

    const errorData = await response.json().catch(() => ({}))

    if (response.status === 404) {
      throw new Error('Mascota no encontrada')
    }

    if (response.status === 401) {
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
    }

    throw new Error(errorData.message || 'Error al eliminar mascota')

  } catch (err) {
    if (err instanceof Error && err.message !== 'Failed to fetch') {
      throw err
    }
    throw new Error('Error de conexión. No se pudo contactar al servidor.')
  }
}