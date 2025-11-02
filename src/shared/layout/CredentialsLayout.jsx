import { Outlet } from 'react-router-dom'

/**
 * CredentialsLayout es un contenedor simple para las vistas
 * de autenticación (Login, Register).
 * No incluye Header ni Footer, solo centra el contenido.
 */
export default function CredentialsLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenedor centrado y con ancho máximo para formularios */}
      <main className="mx-auto max-w-md px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}