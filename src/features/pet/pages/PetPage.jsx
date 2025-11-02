import { useState, useEffect } from 'react'
import { Plus, Dog, Cat, Bird, Fish, X, Calendar, Weight, Heart } from 'lucide-react'
import { listPets, getPetById, createPet, updatePet, deletePet } from '../services/PetService'
import { useNavigate } from 'react-router-dom'

/**
 * PetPage - Página principal de gestión de mascotas.
 * HU3: Registro de mascota
 * HU4: Visualización y filtrado de mascotas
 * HU5: Edición y eliminación de mascotas
 */
export default function PetPage() {
  const navigate = useNavigate()
  
  // Estado para las mascotas
  const [mascotas, setMascotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Estado para el filtro 
  const [filtroEspecie, setFiltroEspecie] = useState(null)
  
  // Estado para el modal de detalle/edición
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false)
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null)
  const [loadingModal, setLoadingModal] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [formDataEdicion, setFormDataEdicion] = useState({})
  const [formErrorsEdicion, setFormErrorsEdicion] = useState({})
  const [loadingEditar, setLoadingEditar] = useState(false)

  // Estado para el modal de creación
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    sex: '',
    birthDate: '',
    weightKg: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [loadingCrear, setLoadingCrear] = useState(false)

  // Estado para confirmación de eliminación
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false)
  const [loadingEliminar, setLoadingEliminar] = useState(false)

  /**
   * HU4: Cargar mascotas (con filtro opcional)
   */
  useEffect(() => {
    const cargarMascotas = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await listPets(filtroEspecie)
        setMascotas(data)
      } catch (err) {
        console.error('Error al cargar mascotas:', err)
        setError(err.message)
        
        if (err.message.includes('sesión ha expirado') || err.message.includes('autenticado')) {
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    cargarMascotas()
  }, [filtroEspecie, navigate])

  /**
   * HU4: Ver detalle de mascota
   */
  const handleVerMas = async (petId) => {
    try {
      setLoadingModal(true)
      setModalDetalleAbierto(true)
      setModoEdicion(false)
      
      const data = await getPetById(petId)
      setMascotaSeleccionada(data)
      setFormDataEdicion({
        name: data.name,
        species: data.species,
        breed: data.breed,
        sex: data.sex,
        birthDate: data.birthDate,
        weightKg: data.weightKg.toString()
      })
    } catch (err) {
      console.error('Error al cargar mascota:', err)
      setError(err.message)
      setModalDetalleAbierto(false)
    } finally {
      setLoadingModal(false)
    }
  }

  const handleCerrarModalDetalle = () => {
    setModalDetalleAbierto(false)
    setMascotaSeleccionada(null)
    setModoEdicion(false)
    setFormErrorsEdicion({})
  }

  /**
   * HU4: Filtrar por especie
   */
  const handleFiltrar = (especie) => {
    setFiltroEspecie(filtroEspecie === especie ? null : especie)
  }

  /**
   * HU5: Activar modo edición
   */
  const handleActivarEdicion = () => {
    setModoEdicion(true)
    setFormErrorsEdicion({})
  }

  /**
   * HU5: Cancelar edición
   */
  const handleCancelarEdicion = () => {
    setModoEdicion(false)
    setFormDataEdicion({
      name: mascotaSeleccionada.name,
      species: mascotaSeleccionada.species,
      breed: mascotaSeleccionada.breed,
      sex: mascotaSeleccionada.sex,
      birthDate: mascotaSeleccionada.birthDate,
      weightKg: mascotaSeleccionada.weightKg.toString()
    })
    setFormErrorsEdicion({})
  }

  /**
   * HU5: Manejar cambios en formulario de edición
   */
  const handleInputChangeEdicion = (e) => {
    const { name, value } = e.target
    setFormDataEdicion(prev => ({
      ...prev,
      [name]: value
    }))
    if (formErrorsEdicion[name]) {
      setFormErrorsEdicion(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  /**
   * HU5: Validar formulario de edición
   */
  const validarFormularioEdicion = () => {
    const errores = {}

    if (!formDataEdicion.name.trim()) {
      errores.name = 'El nombre es obligatorio'
    }

    if (!formDataEdicion.species) {
      errores.species = 'La especie es obligatoria'
    }

    if (!formDataEdicion.breed.trim()) {
      errores.breed = 'La raza es obligatoria'
    }

    if (!formDataEdicion.sex) {
      errores.sex = 'El sexo es obligatorio'
    }

    if (!formDataEdicion.birthDate) {
      errores.birthDate = 'La fecha de nacimiento es obligatoria'
    } else {
      const fechaNacimiento = new Date(formDataEdicion.birthDate)
      const hoy = new Date()
      if (fechaNacimiento >= hoy) {
        errores.birthDate = 'La fecha de nacimiento debe ser en el pasado'
      }
    }

    if (!formDataEdicion.weightKg) {
      errores.weightKg = 'El peso es obligatorio'
    } else if (parseFloat(formDataEdicion.weightKg) <= 0) {
      errores.weightKg = 'El peso debe ser mayor a 0'
    }

    setFormErrorsEdicion(errores)
    return Object.keys(errores).length === 0
  }

  /**
   * HU5: Guardar cambios de edición
   */
  const handleGuardarEdicion = async (e) => {
    e.preventDefault()

    if (!validarFormularioEdicion()) {
      return
    }

    setLoadingEditar(true)

    try {
      const petData = {
        name: formDataEdicion.name.trim(),
        species: formDataEdicion.species,
        breed: formDataEdicion.breed.trim(),
        sex: formDataEdicion.sex,
        birthDate: formDataEdicion.birthDate,
        weightKg: parseFloat(formDataEdicion.weightKg)
      }

      await updatePet(mascotaSeleccionada.id, petData)

      // Actualizar mascota seleccionada
      const mascotaActualizada = await getPetById(mascotaSeleccionada.id)
      setMascotaSeleccionada(mascotaActualizada)
      
      // Recargar lista
      const data = await listPets(filtroEspecie)
      setMascotas(data)

      // Salir de modo edición
      setModoEdicion(false)

      console.log('Mascota actualizada exitosamente')

    } catch (err) {
      console.error('Error al actualizar mascota:', err)
      setError(err.message)
      
      if (err.message.includes('sesión ha expirado')) {
        navigate('/login')
      }
    } finally {
      setLoadingEditar(false)
    }
  }

  /**
   * HU5: Abrir modal de confirmación de eliminación
   */
  const handleAbrirModalEliminar = () => {
    setModalEliminarAbierto(true)
  }

  /**
   * HU5: Cerrar modal de confirmación de eliminación
   */
  const handleCerrarModalEliminar = () => {
    setModalEliminarAbierto(false)
  }

  /**
   * HU5: Confirmar y ejecutar eliminación
   */
  const handleConfirmarEliminar = async () => {
    setLoadingEliminar(true)

    try {
      await deletePet(mascotaSeleccionada.id)

      // Cerrar modales
      setModalEliminarAbierto(false)
      setModalDetalleAbierto(false)
      setMascotaSeleccionada(null)

      // Recargar lista
      const data = await listPets(filtroEspecie)
      setMascotas(data)

      console.log('Mascota eliminada exitosamente')

    } catch (err) {
      console.error('Error al eliminar mascota:', err)
      setError(err.message)
      
      if (err.message.includes('sesión ha expirado')) {
        navigate('/login')
      }
    } finally {
      setLoadingEliminar(false)
    }
  }

  /**
   * HU3: Abrir modal de creación
   */
  const handleAbrirModalCrear = () => {
    setModalCrearAbierto(true)
    setFormData({
      name: '',
      species: '',
      breed: '',
      sex: '',
      birthDate: '',
      weightKg: ''
    })
    setFormErrors({})
  }

  /**
   * HU3: Cerrar modal de creación
   */
  const handleCerrarModalCrear = () => {
    setModalCrearAbierto(false)
    setFormData({
      name: '',
      species: '',
      breed: '',
      sex: '',
      birthDate: '',
      weightKg: ''
    })
    setFormErrors({})
  }

  /**
   * HU3: Manejar cambios en el formulario
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  /**
   * HU3: Validar formulario
   */
  const validarFormulario = () => {
    const errores = {}

    if (!formData.name.trim()) {
      errores.name = 'El nombre es obligatorio'
    }

    if (!formData.species) {
      errores.species = 'La especie es obligatoria'
    }

    if (!formData.breed.trim()) {
      errores.breed = 'La raza es obligatoria'
    }

    if (!formData.sex) {
      errores.sex = 'El sexo es obligatorio'
    }

    if (!formData.birthDate) {
      errores.birthDate = 'La fecha de nacimiento es obligatoria'
    } else {
      const fechaNacimiento = new Date(formData.birthDate)
      const hoy = new Date()
      if (fechaNacimiento >= hoy) {
        errores.birthDate = 'La fecha de nacimiento debe ser en el pasado'
      }
    }

    if (!formData.weightKg) {
      errores.weightKg = 'El peso es obligatorio'
    } else if (parseFloat(formData.weightKg) <= 0) {
      errores.weightKg = 'El peso debe ser mayor a 0'
    }

    setFormErrors(errores)
    return Object.keys(errores).length === 0
  }

  /**
   * HU3: Guardar mascota
   */
  const handleGuardarMascota = async (e) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    setLoadingCrear(true)

    try {
      const petData = {
        name: formData.name.trim(),
        species: formData.species,
        breed: formData.breed.trim(),
        sex: formData.sex,
        birthDate: formData.birthDate,
        weightKg: parseFloat(formData.weightKg)
      }

      await createPet(petData)

      handleCerrarModalCrear()

      const data = await listPets(filtroEspecie)
      setMascotas(data)

      console.log('Mascota registrada exitosamente')

    } catch (err) {
      console.error('Error al crear mascota:', err)
      setError(err.message)
      
      if (err.message.includes('sesión ha expirado')) {
        navigate('/login')
      }
    } finally {
      setLoadingCrear(false)
    }
  }

  /**
   * Mapeo de especies a iconos
   */
  const getEspecieIcon = (species) => {
    const icons = {
      'Dog': Dog,
      'Cat': Cat,
      'Bird': Bird
    }
    const Icon = icons[species] || Fish
    return <Icon className="w-8 h-8 text-fp-primary-600" />
  }

  /**
   * Calcular edad
   */
  const calcularEdad = (birthDate) => {
    const hoy = new Date()
    const nacimiento = new Date(birthDate)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const m = hoy.getMonth() - nacimiento.getMonth()
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    return edad
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

      {/* HU3: Botón de agregar mascota */}
      <div className="flex justify-center mb-8">
        <button 
          onClick={handleAbrirModalCrear}
          className="flex items-center gap-3 px-6 py-3 bg-fp-mint-500 hover:bg-fp-mint-600 text-white font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          Agregar Mascota
        </button>
      </div>

      {/* HU4: Filtros por especie */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          onClick={() => handleFiltrar(null)}
          className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
            filtroEspecie === null
              ? 'bg-fp-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas las mascotas
        </button>
        <button
          onClick={() => handleFiltrar('Dog')}
          className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
            filtroEspecie === 'Dog'
              ? 'bg-fp-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Dog className="w-4 h-4" />
          Perros
        </button>
        <button
          onClick={() => handleFiltrar('Cat')}
          className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
            filtroEspecie === 'Cat'
              ? 'bg-fp-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Cat className="w-4 h-4" />
          Gatos
        </button>
        <button
          onClick={() => handleFiltrar('Bird')}
          className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
            filtroEspecie === 'Bird'
              ? 'bg-fp-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Bird className="w-4 h-4" />
          Aves
        </button>
      </div>

      {/* Estados de carga y error */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-fp-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando mascotas...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
          <p className="text-red-700 font-semibold">Error: {error}</p>
        </div>
      )}

      {/* Lista de mascotas */}
      {!loading && !error && mascotas.length === 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-t-4 border-fp-mint-500">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
              <Dog className="w-16 h-16 text-gray-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {filtroEspecie 
              ? `No tienes mascotas de tipo ${filtroEspecie === 'Dog' ? 'Perro' : filtroEspecie === 'Cat' ? 'Gato' : 'Ave'}`
              : '¡Aún no tienes mascotas registradas!'}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {filtroEspecie
              ? 'Intenta con otro filtro o agrega una nueva mascota.'
              : 'Comienza agregando el perfil de tu primera mascota para llevar un seguimiento completo de su salud, actividad y bienestar.'}
          </p>
          
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
      )}

      {/* Grid de mascotas */}
      {!loading && !error && mascotas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mascotas.map((mascota) => (
            <div
              key={mascota.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border-t-4 border-fp-mint-500"
            >
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  {getEspecieIcon(mascota.species)}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                {mascota.name}
              </h3>

              <p className="text-center text-gray-600 mb-4">
                {mascota.species} • {mascota.breed}
              </p>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-fp-primary-600" />
                  <span>{calcularEdad(mascota.birthDate)} año(s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-fp-primary-600" />
                  <span>{mascota.weightKg} kg</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-fp-primary-600" />
                  <span>{mascota.sex === 'Male' ? 'Macho' : 'Hembra'}</span>
                </div>
              </div>

              <button
                onClick={() => handleVerMas(mascota.id)}
                className="w-full px-4 py-2 bg-fp-primary-600 hover:bg-fp-primary-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
              >
                Ver más
              </button>
            </div>
          ))}
        </div>
      )}

      {/* HU3: Modal de creación de mascota */}
      {modalCrearAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Agregar Nueva Mascota
              </h2>
              <button
                onClick={handleCerrarModalCrear}
                disabled={loadingCrear}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleGuardarMascota} className="p-6">
              <div className="space-y-4">
                
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fp-primary-600 focus:border-transparent ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Max, Luna, Rocky"
                    disabled={loadingCrear}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Especie */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Especie <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="species"
                    value={formData.species}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fp-primary-600 focus:border-transparent ${
                      formErrors.species ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loadingCrear}
                  >
                    <option value="">Selecciona una especie</option>
                    <option value="Dog">Perro</option>
                    <option value="Cat">Gato</option>
                    <option value="Bird">Ave</option>
                    <option value="Other">Otro</option>
                  </select>
                  {formErrors.species && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.species}</p>
                  )}
                </div>

                {/* Raza */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Raza <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fp-primary-600 focus:border-transparent ${
                      formErrors.breed ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Labrador, Persa, Canario"
                    disabled={loadingCrear}
                  />
                  {formErrors.breed && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.breed}</p>
                  )}
                </div>

                {/* Sexo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sexo <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fp-primary-600 focus:border-transparent ${
                      formErrors.sex ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loadingCrear}
                  >
                    <option value="">Selecciona el sexo</option>
                    <option value="Male">Macho</option>
                    <option value="Female">Hembra</option>
                  </select>
                  {formErrors.sex && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.sex}</p>
                  )}
                </div>

                {/* Fecha de nacimiento */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Nacimiento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fp-primary-600 focus:border-transparent ${
                      formErrors.birthDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loadingCrear}
                  />
                  {formErrors.birthDate && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.birthDate}</p>
                  )}
                </div>

                {/* Peso */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Peso (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="weightKg"
                    value={formData.weightKg}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0.1"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fp-primary-600 focus:border-transparent ${
                      formErrors.weightKg ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: 12.5"
                    disabled={loadingCrear}
                  />
                  {formErrors.weightKg && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.weightKg}</p>
                  )}
                </div>

              </div>

              {Object.keys(formErrors).length > 0 && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 text-sm font-semibold">
                    Por favor, completa todos los campos obligatorios correctamente.
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCerrarModalCrear}
                  disabled={loadingCrear}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingCrear}
                  className="flex-1 px-4 py-2 bg-fp-mint-500 hover:bg-fp-mint-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingCrear ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                      Guardando...
                    </>
                  ) : (
                    'Guardar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HU4/HU5: Modal de detalle/edición */}
      {modalDetalleAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {modoEdicion ? 'Editar Mascota' : 'Información de la mascota'}
              </h2>
              <button
                onClick={handleCerrarModalDetalle}
                disabled={loadingEditar}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {loadingModal ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-fp-primary-600 border-r-transparent"></div>
                  <p className="mt-4 text-gray-600">Cargando detalles...</p>
                </div>
              ) : mascotaSeleccionada ? (
                <>
                  {!modoEdicion ? (
                    // Modo visualización
                    <div className="space-y-6">
                      <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                          {getEspecieIcon(mascotaSeleccionada.species)}
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 text-center mb-2">
                        {mascotaSeleccionada.name}
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Especie</p>
                          <p className="font-semibold text-gray-900">{mascotaSeleccionada.species}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Raza</p>
                          <p className="font-semibold text-gray-900">{mascotaSeleccionada.breed}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Sexo</p>
                          <p className="font-semibold text-gray-900">
                            {mascotaSeleccionada.sex === 'Male' ? 'Macho' : 'Hembra'}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Edad</p>
                          <p className="font-semibold text-gray-900">
                            {calcularEdad(mascotaSeleccionada.birthDate)} año(s)
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Fecha de nacimiento</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(mascotaSeleccionada.birthDate).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Peso</p>
                          <p className="font-semibold text-gray-900">{mascotaSeleccionada.weightKg} kg</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Nota:</strong> Los datos de salud (vacunas y medicaciones) se implementarán en futuras versiones.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={handleActivarEdicion}
                          className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={handleAbrirModalEliminar}
                          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Modo edición
                    <form onSubmit={handleGuardarEdicion}>
                      <div className="space-y-4">
                        
                        {/* Nombre */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formDataEdicion.name}
                            onChange={handleInputChangeEdicion}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fp-primary-600 focus:border-transparent ${
                              formErrorsEdicion.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loadingEditar}
                          />
                          {formErrorsEdicion.name && (
                            <p className="text-red-500 text-sm mt-1">{formErrorsEdicion.name}</p>
                          )}
                        </div>

                        {/* Especie */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Especie <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="species"
                            value={formDataEdicion.species}
                            onChange={handleInputChangeEdicion}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fp-primary-600 focus:border-transparent ${
                              formErrorsEdicion.species ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loadingEditar}
                          >
                            <option value="">Selecciona una especie</option>
                            <option value="Dog">Perro</option>
                            <option value="Cat">Gato</option>
                            <option value="Bird">Ave</option>
                            <option value="Other">Otro</option>
                          </select>
                          {formErrorsEdicion.species && (
                            <p className="text-red-500 text-sm mt-1">{formErrorsEdicion.species}</p>
                          )}
                        </div>

                        {/* Raza */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Raza <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="breed"
                            value={formDataEdicion.breed}
                            onChange={handleInputChangeEdicion}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fp-primary-600 focus:border-transparent ${
                              formErrorsEdicion.breed ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loadingEditar}
                          />
                          {formErrorsEdicion.breed && (
                            <p className="text-red-500 text-sm mt-1">{formErrorsEdicion.breed}</p>
                          )}
                        </div>

                        {/* Sexo */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Sexo <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="sex"
                            value={formDataEdicion.sex}
                            onChange={handleInputChangeEdicion}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fp-primary-600 focus:border-transparent ${
                              formErrorsEdicion.sex ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loadingEditar}
                          >
                            <option value="">Selecciona el sexo</option>
                            <option value="Male">Macho</option>
                            <option value="Female">Hembra</option>
                          </select>
                          {formErrorsEdicion.sex && (
                            <p className="text-red-500 text-sm mt-1">{formErrorsEdicion.sex}</p>
                          )}
                        </div>

                        {/* Fecha de nacimiento */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Fecha de Nacimiento <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="birthDate"
                            value={formDataEdicion.birthDate}
                            onChange={handleInputChangeEdicion}
                            max={new Date().toISOString().split('T')[0]}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fp-primary-600 focus:border-transparent ${
                              formErrorsEdicion.birthDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loadingEditar}
                          />
                          {formErrorsEdicion.birthDate && (
                            <p className="text-red-500 text-sm mt-1">{formErrorsEdicion.birthDate}</p>
                          )}
                        </div>

                        {/* Peso */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Peso (kg) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="weightKg"
                            value={formDataEdicion.weightKg}
                            onChange={handleInputChangeEdicion}
                            step="0.1"
                            min="0.1"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fp-primary-600 focus:border-transparent ${
                              formErrorsEdicion.weightKg ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loadingEditar}
                          />
                          {formErrorsEdicion.weightKg && (
                            <p className="text-red-500 text-sm mt-1">{formErrorsEdicion.weightKg}</p>
                          )}
                        </div>

                      </div>

                      {Object.keys(formErrorsEdicion).length > 0 && (
                        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                          <p className="text-red-700 text-sm font-semibold">
                            Por favor, completa todos los campos obligatorios correctamente.
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3 mt-6">
                        <button
                          type="button"
                          onClick={handleCancelarEdicion}
                          disabled={loadingEditar}
                          className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={loadingEditar}
                          className="flex-1 px-4 py-2 bg-fp-mint-500 hover:bg-fp-mint-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {loadingEditar ? (
                            <>
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                              Guardando...
                            </>
                          ) : (
                            'Guardar Cambios'
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* HU5: Modal de confirmación de eliminación */}
      {modalEliminarAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ¿Eliminar mascota?
              </h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar a <strong>{mascotaSeleccionada?.name}</strong>? 
                Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCerrarModalEliminar}
                  disabled={loadingEliminar}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarEliminar}
                  disabled={loadingEliminar}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingEliminar ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          📋 Información que podrás registrar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
          <ul className="space-y-2">
            <li>• Datos básicos (nombre, especie, raza, edad)</li>
            <li>• Historial médico y vacunas</li>
            <li>• Peso y medidas</li>
          </ul>
          <ul className="space-y-2">
            <li>• Alergias y condiciones especiales</li>
            <li>• Recordatorios de citas y medicamentos</li>
            <li>• Actividad física y paseos</li>
          </ul>
        </div>
      </div>

    </div>
  )
}