import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import Footer from '../Footer.jsx'

// Mockear la importación de archivos SVG
// Reemplazamos el path exacto que usa Footer.jsx con una cadena de texto.
vi.mock('../../../../assets/logo.svg', () => ({
    // Devuelve un path ficticio para evitar errores de carga en Vitest
    default: 'mocked-logo-path.svg',
}));

describe('Footer (FitPet)', () => {
    test('renderiza el <footer>, link "Contacto", email y un logo', () => {
        render(<Footer />)

        // <footer> accesible
        const footer = screen.getByRole('contentinfo')
        expect(footer).toBeInTheDocument()

        // Link Contacto (rol link)
        expect(screen.getByRole('link', { name: /Contacto/i })).toBeInTheDocument()

        // Email visible
        // Nota: Usamos una regex con \. para escapar el punto en el email.
        expect(screen.getByText(/contacto@fitpet\.app/i)).toBeInTheDocument()

        // Un solo logo con alt "FitPet" (ahora se renderiza gracias al mock)
        const imgs = screen.getAllByRole('img', { name: /fitpet/i })
        expect(imgs).toHaveLength(1)

        // Derechos (el año es dinámico, el resto es fijo)
        expect(screen.getByText(/Todos los derechos reservados/i)).toBeInTheDocument()
    })
})
