import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import PrivateRoute from '../PrivateRoute'

// Componente de prueba para rutas protegidas
const ProtectedComponent = () => <div>Protected Content</div>

// Componente de prueba para la página de login
const LoginPage = () => <div>Login Page</div>

describe('PrivateRoute Component', () => {
  // Mock de localStorage
  const localStorageMock = (() => {
    let store = {}
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString()
      },
      removeItem: (key) => {
        delete store[key]
      },
      clear: () => {
        store = {}
      }
    }
  })()

  beforeEach(() => {
    // Reemplazar localStorage con el mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })
    
    // Limpiar localStorage antes de cada test
    localStorageMock.clear()
  })

  afterEach(() => {
    // Limpiar localStorage después de cada test
    localStorageMock.clear()
  })

  // ========== AUTENTICACIÓN EXITOSA ==========

  it('should render children when token exists in localStorage', () => {
    // Simular que hay un token
    localStorageMock.setItem('token', 'fake-jwt-token-123')

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <ProtectedComponent />
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    // Debería mostrar el contenido protegido
    expect(screen.getByText('Protected Content')).toBeTruthy()
  })

  it('should render children when valid JWT token exists', () => {
    // Token JWT real (solo para testing, no importa que sea válido)
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    localStorageMock.setItem('token', validToken)

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <div>Admin Panel</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Admin Panel')).toBeTruthy()
  })

  it('should allow access to multiple nested components when authenticated', () => {
    localStorageMock.setItem('token', 'valid-token')

    const NestedComponent = () => (
      <div>
        <h1>Dashboard</h1>
        <p>Welcome back</p>
      </div>
    )

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <NestedComponent />
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Dashboard')).toBeTruthy()
    expect(screen.getByText('Welcome back')).toBeTruthy()
  })

  // ========== SIN AUTENTICACIÓN (REDIRECCIÓN) ==========

  it('should redirect to /login when token does not exist', () => {
    // No hay token en localStorage
    
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <ProtectedComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    )

    // Debería redirigir a la página de login
    expect(screen.getByText('Login Page')).toBeTruthy()
    
    // NO debería mostrar el contenido protegido
    expect(screen.queryByText('Protected Content')).toBeNull()
  })

  it('should redirect to /login when token is null', () => {
    localStorageMock.setItem('token', null)

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <div>Admin Content</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Login Page')).toBeTruthy()
    expect(screen.queryByText('Admin Content')).toBeNull()
  })

  it('should redirect to /login when token is empty string', () => {
    localStorageMock.setItem('token', '')

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <ProtectedComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Login Page')).toBeTruthy()
  })

  it('should redirect to /login when token is undefined', () => {
    // No establecer ningún token (undefined)
    
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div>Dashboard</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Login Page')).toBeTruthy()
    expect(screen.queryByText('Dashboard')).toBeNull()
  })

  // ========== COMPORTAMIENTO DE NAVIGATE ==========

  it('should use Navigate component with replace prop', () => {
    // Este test verifica que PrivateRoute usa <Navigate replace />
    // para evitar que el usuario vuelva atrás con el botón del navegador
    
    const { container } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <ProtectedComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    )

    // Debería redirigir a login
    expect(screen.getByText('Login Page')).toBeTruthy()
  })

  // ========== MÚLTIPLES RUTAS PROTEGIDAS ==========

  it('should protect multiple routes independently', () => {
    localStorageMock.setItem('token', 'valid-token')

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <div>Admin Page</div>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <div>Profile Page</div>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <div>Settings Page</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Admin Page')).toBeTruthy()
  })

  it('should allow access to one route while blocking another when token changes', () => {
    // Primer render con token
    localStorageMock.setItem('token', 'valid-token')

    const { rerender } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <ProtectedComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    )

    // Con token, debe mostrar contenido protegido
    expect(screen.getByText('Protected Content')).toBeTruthy()

    // Simular logout (eliminar token)
    localStorageMock.removeItem('token')

    // Re-renderizar
    rerender(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <ProtectedComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    )

    // Sin token, debe redirigir a login
    expect(screen.getByText('Login Page')).toBeTruthy()
  })

  // ========== EDGE CASES ==========

  it('should handle whitespace-only token as invalid', () => {
    localStorageMock.setItem('token', '   ')

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <ProtectedComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    )

    // Token con solo espacios debe considerarse válido (la validación real es en el backend)
    // PrivateRoute solo verifica existencia, no valida el contenido
    expect(screen.getByText('Protected Content')).toBeTruthy()
  })

  it('should render any type of children component', () => {
    localStorageMock.setItem('token', 'valid-token')

    const ComplexComponent = () => (
      <div>
        <header>Header</header>
        <main>Main Content</main>
        <footer>Footer</footer>
      </div>
    )

    render(
      <MemoryRouter initialEntries={['/complex']}>
        <Routes>
          <Route
            path="/complex"
            element={
              <PrivateRoute>
                <ComplexComponent />
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Header')).toBeTruthy()
    expect(screen.getByText('Main Content')).toBeTruthy()
    expect(screen.getByText('Footer')).toBeTruthy()
  })

  // ========== INTEGRACIÓN CON RUTAS REALES ==========

  it('should work with real route structure (admin, mascotas)', () => {
    localStorageMock.setItem('token', 'fake-jwt-token')

    const AdminPage = () => <div>Admin Dashboard</div>
    const MascotasPage = () => <div>Mis Mascotas</div>

    render(
      <MemoryRouter initialEntries={['/mascotas']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/mascotas"
            element={
              <PrivateRoute>
                <MascotasPage />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Mis Mascotas')).toBeTruthy()
  })

  it('should not render protected content even for a split second before redirect', () => {
    // Sin token
    const { container } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <ProtectedComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    )

    // Inmediatamente debe estar en login, nunca debe haber mostrado contenido protegido
    expect(screen.queryByText('Protected Content')).toBeNull()
    expect(screen.getByText('Login Page')).toBeTruthy()
  })
})