import { Dog, Cat, Bird, Fish } from 'lucide-react'
import { calculateAge } from '../services/PetService'

/**
 * PetCard - Tarjeta individual para mostrar información de una mascota
 * @param {Object} props
 * @param {Object} props.pet - Datos de la mascota
 * @param {string} props.pet.name - Nombre
 * @param {string} props.pet.species - Especie (Dog, Cat, Bird, Other)
 * @param {string} props.pet.breed - Raza
 * @param {string} props.pet.sex - Sexo (Male, Female)
 * @param {string} props.pet.birthDate - Fecha nacimiento (YYYY-MM-DD)
 * @param {number} props.pet.weightKg - Peso en kg
 */
export default function PetCard({ pet }) {
  // Mapeo de especies a iconos
  const getSpeciesIcon = (species) => {
    const iconProps = { className: "w-12 h-12 text-fp-primary-600" }
    
    switch (species) {
      case 'Dog':
        return <Dog {...iconProps} />
      case 'Cat':
        return <Cat {...iconProps} />
      case 'Bird':
        return <Bird {...iconProps} />
      default:
        return <Fish {...iconProps} />
    }
  }

  // Mapeo de especies a español
  const getSpeciesName = (species) => {
    const names = {
      'Dog': 'Perro',
      'Cat': 'Gato',
      'Bird': 'Ave',
      'Other': 'Otro'
    }
    return names[species] || species
  }

  // Mapeo de sexo a español
  const getSexName = (sex) => {
    return sex === 'Male' ? 'Macho' : 'Hembra'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border-t-4 border-fp-mint-500 hover:scale-[1.02]">
      
      {/* Icono de especie */}
      <div className="flex justify-center mb-4">
        {getSpeciesIcon(pet.species)}
      </div>
      
      {/* Nombre de la mascota */}
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
        {pet.name}
      </h3>
      
      {/* Detalles de la mascota */}
      <div className="space-y-2 text-gray-600 text-sm">
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
          <span className="font-medium">Especie:</span>
          <span className="text-gray-900">{getSpeciesName(pet.species)}</span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
          <span className="font-medium">Raza:</span>
          <span className="text-gray-900">{pet.breed}</span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
          <span className="font-medium">Sexo:</span>
          <span className="text-gray-900">{getSexName(pet.sex)}</span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
          <span className="font-medium">Edad:</span>
          <span className="text-gray-900">{calculateAge(pet.birthDate)} años</span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
          <span className="font-medium">Peso:</span>
          <span className="text-gray-900">{pet.weightKg} kg</span>
        </div>
      </div>
    </div>
  )
}