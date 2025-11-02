const API_BASE_URL = 'http://localhost:8080/api/v1/pets'

/**
 * Obtiene todas las mascotas del usuario autenticado
 * Endpoint: GET /api/v1/pets
 * 
 * @returns {Promise<Array>} Lista de mascotas
 * @throws {Error} Si no hay token o si falla la petición
 */
export const getMyPets = async () => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    throw new Error('No autenticado')
  }
  
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    // 401 Unauthorized: Token inválido o expirado
    if (response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      throw new Error('Sesión expirada')
    }
    
    // 200 OK: Lista de mascotas (puede ser array vacío)
    if (response.status === 200) {
      return await response.json()
    }
    
    // Otros errores
    throw new Error('Error al obtener mascotas')
    
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      throw new Error('Error de conexión con el servidor')
    }
    throw err
  }
}

/**
 * Crea una nueva mascota
 * Endpoint: POST /api/v1/pets
 * 
 * @param {Object} petData - Datos de la mascota
 * @param {string} petData.name - Nombre (requerido)
 * @param {string} petData.species - Especie (requerido)
 * @param {string} petData.breed - Raza (requerido)
 * @param {string} petData.sex - Sexo (requerido)
 * @param {string} petData.birthDate - Fecha nacimiento YYYY-MM-DD (requerido)
 * @param {number} petData.weightKg - Peso en kg (requerido)
 * @returns {Promise<Object>} Mascota creada con su ID
 * @throws {Error} Si validación falla o hay error de conexión
 */
export const createPet = async (petData) => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    throw new Error('No autenticado')
  }
  
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(petData)
    })
    
    // 401 Unauthorized: Token inválido
    if (response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      throw new Error('Sesión expirada')
    }
    
    // 201 Created: Mascota creada exitosamente
    if (response.status === 201) {
      return await response.json()
    }
    
    // 400 Bad Request: Validación fallida
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Datos inválidos. Revisa los campos.')
    }
    
    // Otros errores (500, etc.)
    throw new Error('Error al crear mascota')
    
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      throw new Error('Error de conexión con el servidor')
    }
    throw err
  }
}

/**
 * Calcula la edad en años a partir de una fecha de nacimiento
 * @param {string} birthDate - Fecha en formato YYYY-MM-DD
 * @returns {number} Edad en años
 */
export const calculateAge = (birthDate) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}