import { render, screen, fireEvent } from '@testing-library/react'
// 💡 CORRECCIÓN: Usamos ruta absoluta
import ThemeToggle from '/src/shared/components/ui/ThemeToggle.jsx'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Función de simulación (Mock) para window.matchMedia
// (Requerido por la regla de 'Mocks controlados' en el informe)
const mockMatchMedia = (matches) => () => ({
  matches,
  media: '(prefers-color-scheme: dark)',
  onchange: null,
  addListener: vi.fn(), // mock obsoleto, pero seguro
  removeListener: vi.fn(), // mock obsoleto, pero seguro
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
})

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Estado limpio antes de cada test
    document.documentElement.classList.remove('dark')
    localStorage.clear()

    // Simula que el sistema NO prefiere el modo oscuro (matches: false),
    // forzando el estado inicial del tema a 'light' por defecto.
    window.matchMedia = vi.fn(mockMatchMedia(false))
  })

  test('renderiza en modo "light" por defecto si el sistema no prefiere "dark"', () => {
    render(<ThemeToggle />)
    // El botón debe existir
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()

    // <html> NO debe tener .dark
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    // localStorage debe guardar 'light' en la carga inicial
    expect(localStorage.getItem('theme')).toBe('light')
  })

  test('activa modo oscuro y persiste "dark" en localStorage al hacer click', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')

    // Estado inicial: sin .dark
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')

    // Act (Actuar)
    fireEvent.click(btn)

    // Assert (Verificar)
    // Tras el click: <html> tiene .dark y está persistido
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  test('desactiva modo oscuro y persiste "light" si ya estaba activado', () => {
    // Arrange (Preparar): Simular estado previo 'dark'
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')

    render(<ThemeToggle />)
    const btn = screen.getByRole('button')

    // Act (Actuar)
    fireEvent.click(btn)

    // Assert (Verificar)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })

  test('carga "dark" por defecto si el sistema operativo lo prefiere (matchMedia)', () => {
    // Arrange: Simular que el S.O. prefiere dark
    window.matchMedia = vi.fn(mockMatchMedia(true)) // matches: true

    // Act
    render(<ThemeToggle />)

    // Assert
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  test('carga "dark" si está guardado en localStorage, ignorando matchMedia', () => {
    // Arrange: 
    // S.O. prefiere 'light' (matches: false)
    window.matchMedia = vi.fn(mockMatchMedia(false))
    // Pero localStorage tiene 'dark' (prioridad)
    localStorage.setItem('theme', 'dark')

    // Act
    render(<ThemeToggle />)

    // Assert
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })
})

