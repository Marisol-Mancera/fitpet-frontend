import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import HomePage from '../HomePage'

// Mock de lucide-react (todos los íconos usados en HomePage)
vi.mock('lucide-react', () => ({
  Zap: () => <svg data-testid="zap-icon" />,
  Heart: () => <svg data-testid="heart-icon" />,
  Activity: () => <svg data-testid="activity-icon" />,
  Shield: () => <svg data-testid="shield-icon" />,
  ClipboardPenLine: () => <svg data-testid="clipboardpenline-icon" />,
  Calendar: () => <svg data-testid="calendar-icon" />,
  Users: () => <svg data-testid="users-icon" />,
  PawPrint: () => <svg data-testid="pawprint-icon" />,
  Sparkles: () => <svg data-testid="sparkles-icon" />
}))

// Mock de authService
const mockAuthService = {
  isAuthenticated: vi.fn()
}

vi.mock('../../../features/auth/services/authService', () => ({
  isAuthenticated: () => mockAuthService.isAuthenticated()
}))

describe('HomePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuthService.isAuthenticated.mockReturnValue(false)
  })

  it('should render main heading with "Hola, dueño de mascota!"', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Busca el heading exacto según el HTML real
    const heading = screen.getByRole('heading', { name: /Hola, dueño de mascota!/i })
    expect(heading).toBeTruthy()
  })

  it('should render hero section with main description', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Busca el texto exacto del párrafo hero
    expect(screen.getByText(/Tu dashboard de bienestar personalizado/i)).toBeTruthy()
    expect(screen.getByText(/controlas la vida activa y saludable de tu compañero peludo/i)).toBeTruthy()
  })

  it('should render 4 feature cards in grid layout', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Verifica que existe un grid
    const gridSection = container.querySelector('.grid')
    expect(gridSection).not.toBeNull()

    // Verifica los 4 títulos de las cards
    expect(screen.getByText(/Monitoreo de Actividad/i)).toBeTruthy()
    expect(screen.getByText(/Historial Clínico Digital/i)).toBeTruthy()
    expect(screen.getByText(/Recordatorios Inteligentes/i)).toBeTruthy()
    expect(screen.getByText(/Más que Datos, es Amor en Acción/i)).toBeTruthy()
  })

  it('should render card with highlighted border (Card 2 - Historial Clínico)', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Busca la card con borde naranja (border-fp-warm-500)
    const highlightedCard = container.querySelector('.border-fp-warm-500')
    expect(highlightedCard).not.toBeNull()
    expect(highlightedCard?.classList.contains('border-4')).toBe(true)
  })

  it('should render cards with hover effects', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Verifica que las cards tienen hover:scale-105
    const cards = container.querySelectorAll('.hover\\:scale-105')
    expect(cards.length).toBe(4)
  })

  it('should render icons in cards', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Verifica que hay 4 íconos (uno por card)
    const icons = container.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThanOrEqual(4)
  })

  it('should render philosophy section with border accent', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Busca la sección filosofía con borde superior verde
    const philosophySection = container.querySelector('.border-t-8.border-fp-mint-500')
    expect(philosophySection).not.toBeNull()

    // Verifica el título de la sección
    expect(screen.getByText(/Nuestra Filosofía:/i)).toBeTruthy()
    expect(screen.getByText(/Tecnología con Amor/i)).toBeTruthy()
  })

  it('should NOT render CTA button (HomePage no tiene botón CTA)', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // HomePage no tiene botón de "Comienza ahora" ni links de registro
    const ctaButton = screen.queryByRole('link', { name: /comienza ahora|registra|empezar/i })
    expect(ctaButton).toBeNull()
  })

  it('should NOT show CTA button when authenticated (no existe en este componente)', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true)

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // HomePage no tiene lógica condicional de auth, solo muestra contenido estático
    const ctaButton = screen.queryByRole('link', { name: /comienza ahora/i })
    expect(ctaButton).toBeNull()
  })

  it('should have correct background colors', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Verifica fondo principal (bg-white)
    const mainContainer = container.querySelector('.bg-white')
    expect(mainContainer).not.toBeNull()

    // Verifica cards con bg-teal-100 (3 cards)
    const tealCards = container.querySelectorAll('.bg-teal-100')
    expect(tealCards.length).toBe(3)

    // Verifica card con bg-gray-100 (1 card - la destacada)
    const grayCard = container.querySelector('.bg-gray-100')
    expect(grayCard).not.toBeNull()

    // Verifica sección filosofía con bg-gray-50
    const philosophySection = container.querySelector('.bg-gray-50')
    expect(philosophySection).not.toBeNull()
  })

  it('should render cards with rounded corners', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Verifica que las cards tienen rounded-2xl
    const roundedCards = container.querySelectorAll('.rounded-2xl')
    expect(roundedCards.length).toBeGreaterThanOrEqual(4)
  })

  it('should render cards with shadow effects', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Verifica que las cards tienen shadow-xl o shadow-2xl
    const shadowXL = container.querySelectorAll('.shadow-xl')
    const shadow2XL = container.querySelectorAll('.shadow-2xl')
    expect(shadowXL.length + shadow2XL.length).toBeGreaterThanOrEqual(4)
  })

  it('should be responsive with grid-cols-1 on mobile and grid-cols-2 on desktop', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Verifica clases responsive
    const gridSection = container.querySelector('.grid-cols-1')
    expect(gridSection).not.toBeNull()
    expect(gridSection?.className).toMatch(/md:grid-cols-2/)
  })

  it('should have proper spacing between cards (gap-10)', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Verifica gap entre cards
    const gridSection = container.querySelector('.gap-10')
    expect(gridSection).not.toBeNull()
  })

  it('should render philosophy section with proper padding', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Verifica padding de la sección filosofía (p-8 md:p-20)
    const philosophySection = container.querySelector('.p-8.md\\:p-20')
    expect(philosophySection).not.toBeNull()
  })
})