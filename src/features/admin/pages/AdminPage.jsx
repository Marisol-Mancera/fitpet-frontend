import { useNavigate } from 'react-router-dom'
import { User, Mail, Calendar, LogOut } from 'lucide-react'

/**
 * AdminPage - Página de perfil del usuario autenticado.
 * Muestra información básica del usuario y permite cerrar sesión.
 */
export default function AdminPage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  // TODO: Obtener datos reales del usuario desde el backend
  // Por ahora usamos datos de ejemplo
  const user = {
    email: localStorage.getItem('userEmail') || 'pajaritopio@example.com',
    registeredAt: new Date().toLocaleDateString('es-ES')
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Mi Perfil
        </h1>
        <p className="text-lg text-gray-600">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      {/* Card de información del usuario */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-t-4 border-fp-mint-500">
        
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-fp-mint-500 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Información */}
        <div className="space-y-6">
          
          {/* Email */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Mail className="w-6 h-6 text-fp-primary-600" />
            <div>
              <p className="text-sm text-gray-500 font-medium">Correo electrónico</p>
              <p className="text-lg text-gray-900 font-semibold">{user.email}</p>
            </div>
          </div>

          {/* Fecha de registro */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-6 h-6 text-fp-primary-600" />
            <div>
              <p className="text-sm text-gray-500 font-medium">Miembro desde</p>
              <p className="text-lg text-gray-900 font-semibold">{user.registeredAt}</p>
            </div>
          </div>

        </div>

        {/* Botón de cerrar sesión */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>

      </div>

      {/* Sección de información adicional */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          🐾 Próximamente
        </h2>
        <ul className="space-y-2 text-gray-600">
          <li>• Editar información de perfil</li>
          <li>• Cambiar contraseña</li>
          <li>• Configuración de notificaciones</li>
          <li>• Gestión de mascotas asociadas</li>
        </ul>
      </div>

    </div>
  )
}