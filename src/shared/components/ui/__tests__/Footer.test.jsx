import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Footer from '../Footer.jsx'

// Mock del logo
vi.mock('../../../assets/logo.svg', () => ({
  default: 'mocked-logo-path.svg',
}))

// Wrapper con Router (Footer usa <Link>)
const renderWithRouter = (ui) => {
  return render(ui, { wrapper: MemoryRouter })
}

describe('Footer (FitPet)', () => {
  test('renderiza el <footer>, links de navegación y email', () => {
    renderWithRouter(<Footer />)

    // <footer> accesible
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()

    // Links de navegación
    expect(screen.getByRole('link', { name: /Soporte/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Privacidad/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Términos/i })).toBeInTheDocument()

    // Email visible
    expect(screen.getByText(/contacto@fitpet\.app/i)).toBeInTheDocument()

    // Copyright (el año es dinámico)
    expect(screen.getByText(/FitPet/i)).toBeInTheDocument()
  })
})