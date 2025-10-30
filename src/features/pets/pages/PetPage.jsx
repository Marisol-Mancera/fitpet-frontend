import { useState } from 'react'
import { Plus, Dog, Cat, Bird, Fish } from 'lucide-react'

/**
 * MascotasPage - Página principal de gestión de mascotas.
 * Muestra la lista de mascotas del usuario y permite agregar nuevas.
 */
export default function MascotasPage() {
  // TODO: Obtener mascotas reales del backend
  const [mascotas] = useState([])

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

      {/* Botón de agregar mascota */}
      <div className="flex justify-center mb-8">
        <button className="flex items-center gap-3 px-6 py-3 bg-fp-mint-500 hover:bg-fp-mint-600 text-white font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
          <Plus className="w-5 h-5" />
          Agregar Mascota
        </button>
      </div>

      {/* Lista de mascotas */}
      {mascotas.length === 0 ? (
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
        // Grid de mascotas (cuando haya datos)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mascotas.map((mascota) => (
            <div
              key={mascota.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 border-t-4 border-fp-mint-500"
            >
              {/* Card de mascota - TODO: Implementar cuando tengamos el modelo */}
              <p className="text-gray-900 font-bold">{mascota.nombre}</p>
            </div>
          ))}
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