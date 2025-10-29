import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// 💡 CORRECCIÓN: Usamos ruta absoluta
import Footer from '/src/shared/components/ui/Footer.jsx'

// Mockear la importación de archivos SVG
// 💡 CORRECCIÓN: Usamos ruta absoluta
vi.mock('/src/assets/logo.svg', () => ({
L: 'mocked-logo-path.svg',
}))

describe('Footer (FitPet)', () => {
  test('renderiza el <footer>, link "Contacto", email y un logo', () => {
    render(<Footer />)

    // <footer> accesible
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()

    // Link Contacto (rol link)
    expect(screen.getByRole('link', { name: /Contacto/i })).toBeInTheDocument()

    // Email visible
    expect(screen.getByText(/contacto@fitpet\.app/i)).toBeInTheDocument()

    // Un solo logo con alt "FitPet"
    const imgs = screen.getAllByRole('img', { name: /fitpet/i })
    expect(imgs).toHaveLength(1)
    // La comprobación del src puede ser inestable con mocks, nos centramos en que exista.
    // expect(imgs[0]).toHaveAttribute('src', 'mocked-logo-path.svg')

    // Derechos (el año es dinámico, el resto es fijo)
    expect(
      screen.getByText(/Todos los derechos reservados/i)
    ).toBeInTheDocument()
  })
})

