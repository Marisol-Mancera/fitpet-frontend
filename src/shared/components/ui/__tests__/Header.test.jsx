import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'; 
import Header from '../../ui/Header.jsx'

const mockMatchMedia = (matches) => () => ({
  matches,
  media: '(prefers-color-scheme: dark)',
  onchange: null,
  addListener: vi.fn(), 
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

describe('Header', () => {
  beforeEach(() => {
    // Limpieza 
    document.documentElement.classList.remove('dark')
    localStorage.clear()
    
    window.matchMedia = vi.fn(mockMatchMedia(false));
  })

  test('renderiza el header con la marca y el botón de tema', () => {
    render(<Header />)

    const banner = screen.getByRole('banner')
    expect(banner).toBeInTheDocument()

    expect(screen.getByText(/fitpet/i)).toBeInTheDocument()

    const themeBtn = screen.getByRole('button', { name: /cambiar tema/i })
    expect(themeBtn).toBeInTheDocument()
  })
})
