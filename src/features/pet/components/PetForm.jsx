import { useState } from 'react'
import { X } from 'lucide-react'
import Input from '../../../shared/components/ui/Input'
import Select from '../../../shared/components/ui/Select'
import Button from '../../../shared/components/ui/Button'

/**
 * PetForm - Formulario de registro de mascotas
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback al enviar formulario válido
 * @param {Function} props.onCancel - Callback al cancelar
 * @param {boolean} props.isLoading - Estado de carga
 */
export default function PetForm({ onSubmit, onCancel, isLoading = false }) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    sex: '',
    birthDate: '',
    weightKg: ''
  })

  // Estado de errores
  const [errors, setErrors] = useState({})

  /**
   * Valida el formulario completo
   * @returns {boolean} true si es válido
   */
  const validateForm = () => {
    const newErrors = {}

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
    }

    // Validar especie
    if (!formData.species) {
      newErrors.species = 'Debes seleccionar una especie'
    }

    // Validar raza
    if (!formData.breed.trim()) {
      newErrors.breed = 'La raza es obligatoria'
    }

    // Validar sexo
    if (!formData.sex) {
      newErrors.sex = 'Debes seleccionar el sexo'
    }

    // Validar fecha de nacimiento
    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria'
    } else {
      const birthDate = new Date(formData.birthDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Resetear horas para comparación de solo fecha
      
      if (birthDate > today) {
        newErrors.birthDate = 'La fecha de nacimiento no puede ser futura'
      }
    }

    // Validar peso
    if (!formData.weightKg) {
      newErrors.weightKg = 'El peso es obligatorio'
    } else {
      const weight = parseFloat(formData.weightKg)
      if (isNaN(weight) || weight <= 0) {
        newErrors.weightKg = 'El peso debe ser mayor a 0'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Maneja cambios en los campos del formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo al modificarlo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Preparar datos para enviar (convertir weightKg a número)
    const petData = {
      ...formData,
      weightKg: parseFloat(formData.weightKg)
    }

    onSubmit(petData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header del formulario */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Registrar Nueva Mascota
          </h2>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar formulario"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          
          {/* Nombre */}
          <Input
            id="name"
            name="name"
            type="text"
            label="Nombre"
            placeholder="Ej: Max"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            disabled={isLoading}
          />

          {/* Grid de 2 columnas: Especie y Raza */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Especie */}
            <Select
              id="species"
              name="species"
              label="Especie"
              value={formData.species}
              onChange={handleChange}
              error={errors.species}
              required
              disabled={isLoading}
            >
              <option value="">Selecciona una especie</option>
              <option value="Dog">Perro</option>
              <option value="Cat">Gato</option>
              <option value="Bird">Ave</option>
              <option value="Other">Otro</option>
            </Select>

            {/* Raza */}
            <Input
              id="breed"
              name="breed"
              type="text"
              label="Raza"
              placeholder="Ej: Labrador"
              value={formData.breed}
              onChange={handleChange}
              error={errors.breed}
              required
              disabled={isLoading}
            />
          </div>

          {/* Grid de 2 columnas: Sexo y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Sexo */}
            <Select
              id="sex"
              name="sex"
              label="Sexo"
              value={formData.sex}
              onChange={handleChange}
              error={errors.sex}
              required
              disabled={isLoading}
            >
              <option value="">Selecciona el sexo</option>
              <option value="Male">Macho</option>
              <option value="Female">Hembra</option>
            </Select>

            {/* Fecha de nacimiento */}
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              label="Fecha de nacimiento"
              value={formData.birthDate}
              onChange={handleChange}
              error={errors.birthDate}
              required
              disabled={isLoading}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Peso */}
          <Input
            id="weightKg"
            name="weightKg"
            type="number"
            label="Peso (kg)"
            placeholder="Ej: 15.5"
            value={formData.weightKg}
            onChange={handleChange}
            error={errors.weightKg}
            required
            disabled={isLoading}
            step="0.1"
            min="0.1"
          />

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Guardar Mascota
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}