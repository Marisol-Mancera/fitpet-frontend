import { Navigate } from 'react-router-dom'

/**
 * PrivateRoute - Componente para proteger rutas que requieren autenticación.
 * 
 * Verifica si existe un token JWT válido en localStorage.
 * - Si existe token → renderiza el componente hijo
 * - Si NO existe token → redirige a /login
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a proteger
 * @returns {React.ReactNode}
 * 
 * @example
 * // En router.jsx:
 * <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
 */
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  
  // Si no hay token, redirigir a login
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  // Si hay token, renderizar el componente protegido
  return children
}