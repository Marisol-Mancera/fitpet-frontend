import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import ThemeToggle from '../ThemeToggle.jsx'

// Mock para window.matchMedia
const mockMatchMedia = (matches) => () => ({
  matches,
  media: '(prefers-color-scheme: dark)',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
})

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Estado limpio antes de cada test
    document.documentElement.classList.remove('dark')
    localStorage.clear()

    // Simula que el sistema NO prefiere el modo oscuro
    window.matchMedia = vi.fn(mockMatchMedia(false))
  })

  test('renderiza en modo "light" por defecto si el sistema no prefiere "dark"', () => {
    render(<ThemeToggle />)
    
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

    fireEvent.click(btn)

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  test('desactiva modo oscuro y persiste "light" si ya estaba activado', () => {
    //Simular estado previo 'dark'
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')

    render(<ThemeToggle />)
    const btn = screen.getByRole('button')

    fireEvent.click(btn)

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })

  test('carga "dark" por defecto si el sistema operativo lo prefiere', () => {
    // Simular que el S.O. prefiere dark
    window.matchMedia = vi.fn(mockMatchMedia(true))

    render(<ThemeToggle />)

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  test('carga "dark" si está guardado en localStorage, ignorando matchMedia', () => {
    window.matchMedia = vi.fn(mockMatchMedia(false))
    localStorage.setItem('theme', 'dark')

    render(<ThemeToggle />)

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })
})