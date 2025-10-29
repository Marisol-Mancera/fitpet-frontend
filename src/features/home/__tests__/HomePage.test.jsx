import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

import HomePage from '/src/features/home/pages/HomePage.jsx'

// Mock de lucide-react (para no probar los iconos)
vi.mock('lucide-react', () => ({
  Dog: () => <div data-testid="icon-dog" />,
  Activity: () => <div data-testid="icon-activity" />,
  ClipboardPenLine: () => <div data-testid="icon-clipboard" />,
}))

// Mock de matchMedia (necesario por dependencias)
beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), 
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

const renderComponent = () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )
}

describe('HomePage (FitPet)', () => {
  test('renderiza el contenido adaptado de FitPet', () => {
    renderComponent()

    // Verifica Títulos de Tarjetas (Sección 1)
    expect(
      screen.getByRole('heading', { name: /Tu compañero, conectado/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Bienestar proactivo/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Todo en un solo lugar/i })
    ).toBeInTheDocument()

    // Verifica Título de Sección 2
    expect(
      screen.getByRole('heading', { name: /Monitorea su actividad diaria/i })
    ).toBeInTheDocument()

    // Verifica Placeholder de Imagen (Sección 2)
    expect(
      screen.getByAltText(/App de FitPet monitoreando a un perro/i)
    ).toBeInTheDocument()

    // Verifica Título de Sección 3
    expect(
      screen.getByRole('heading', { name: /Funcionalidades Destacadas/i })
    ).toBeInTheDocument()

    // Verifica que los iconos (mockeados) están
    expect(screen.getByTestId('icon-dog')).toBeInTheDocument()
    expect(screen.getByTestId('icon-activity')).toBeInTheDocument()
    expect(screen.getByTestId('icon-clipboard')).toBeInTheDocument()
  })
})
