import { useState, useEffect } from 'react'
import { Plus, Dog, Cat, Bird, Fish, Heart, AlertCircle } from 'lucide-react'
import { getMyPets, createPet } from '../services/PetService'
import PetForm from '../components/PetForm'
import PetCard from '../components/PetCard'

/**
 * PetPage - Página principal de gestión de mascotas (HU3)
 * Permite listar y registrar mascotas del usuario autenticado
 */
export default function PetPage() {
  // Estado de mascotas
  const [pets, setPets] = useState([])
  
  // Estado de UI
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  /**
   * Efecto: Cargar mascotas al montar el componente
   */
  useEffect(() => {
    fetchPets()
  }, [])

  /**
   * Efecto: Ocultar mensaje de éxito después de 5 segundos
   */
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  /**
   * Obtiene la lista de mascotas del backend
   */
  const fetchPets = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getMyPets()
      setPets(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Maneja la creación de una nueva mascota
   */
  const handleCreatePet = async (petData) => {
    try {
      setIsCreating(true)
      setError(null)
      
      const newPet = await createPet(petData)
      
      // Agregar la nueva mascota a la lista
      setPets(prevPets => [...prevPets, newPet])
      
      // Cerrar formulario y mostrar mensaje de éxito
      setShowForm(false)
      setSuccessMessage(`¡${newPet.name} ha sido registrado exitosamente!`)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setIsCreating(false)
    }
  }

  /**
   * Maneja el cierre del formulario
   */
  const handleCancelForm = () => {
    setShowForm(false)
    setError(null)
  }

  /**
   * Maneja la apertura del formulario
   */
  const handleOpenForm = () => {
    setShowForm(true)
    setError(null)
    setSuccessMessage(null)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Mis Mascotas
        </h1>
        <p className="text-lg text-gray-600">
          Gestiona el perfil y seguimiento de tus compañeros peludos
        </p>
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="mb-6 max-w-2xl mx-auto bg-green-50 border border-green-500 rounded-lg p-4 flex items-start gap-3">
          <Heart className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-700 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="mb-6 max-w-2xl mx-auto bg-red-50 border border-red-500 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-700 font-medium">{error}</p>
            {error.includes('conexión') && (
              <button
                onClick={fetchPets}
                className="mt-2 text-sm text-red-600 underline hover:text-red-800"
              >
                Reintentar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Botón de agregar mascota */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleOpenForm}
          disabled={isLoading}
          className="flex items-center gap-3 px-6 py-3 bg-fp-mint-500 hover:bg-fp-mint-600 text-white font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          Agregar Mascota
        </button>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-fp-mint-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando mascotas...</p>
        </div>
      )}

      {/* Lista de mascotas o estado vacío */}
      {!isLoading && (
        <>
          {pets.length === 0 ? (
            // Estado vacío
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-t-4 border-fp-mint-500">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                  <Dog className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                ¡Aún no tienes mascotas registradas!
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Comienza agregando el perfil de tu primera mascota para llevar un seguimiento completo 
                de su salud, actividad y bienestar.
              </p>
              
              {/* Iconos de tipos de mascotas */}
              <div className="flex justify-center gap-6 mt-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                    <Dog className="w-8 h-8 text-fp-primary-600" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Perros</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                    <Cat className="w-8 h-8 text-fp-primary-600" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Gatos</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                    <Bird className="w-8 h-8 text-fp-primary-600" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Aves</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                    <Fish className="w-8 h-8 text-fp-primary-600" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Otros</p>
                </div>
              </div>
            </div>
          ) : (
            // Grid de mascotas
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Información adicional */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          📋 Información que puedes registrar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
          <ul className="space-y-2">
            <li>• Datos básicos (nombre, especie, raza, sexo)</li>
            <li>• Fecha de nacimiento y edad automática</li>
            <li>• Peso actual en kilogramos</li>
          </ul>
          <ul className="space-y-2">
            <li>• Historial médico y vacunas (próximamente)</li>
            <li>• Recordatorios de citas (próximamente)</li>
            <li>• Actividad física y paseos (próximamente)</li>
          </ul>
        </div>
      </div>

      {/* Modal del formulario */}
      {showForm && (
        <PetForm
          onSubmit={handleCreatePet}
          onCancel={handleCancelForm}
          isLoading={isCreating}
        />
      )}
    </div>
  )
}