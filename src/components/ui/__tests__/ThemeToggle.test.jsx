import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../../ui/ThemeToggle.jsx';
import '@testing-library/jest-dom'; 
// Función de simulación (Mock) para window.matchMedia
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

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Estado limpio antes de cada test
    document.documentElement.classList.remove('dark');
    localStorage.clear();

    // Simula que el sistema NO prefiere el modo oscuro (matches: false), 
    // forzando el estado inicial del tema a 'light'.
    window.matchMedia = vi.fn(mockMatchMedia(false));
  });

  test('activa modo oscuro y persiste "dark" en localStorage', () => {
    render(<ThemeToggle />);

    const btn = screen.getByRole('button', { name: /cambiar tema/i });
    
    // Estado inicial: sin .dark
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    
    // El componente guarda 'light' en localStorage en la carga inicial.
    expect(localStorage.getItem('theme')).toBe('light'); // Cambiado de toBe(light) a toBe('light')

    fireEvent.click(btn);

    // Tras el click: con .dark y persistido
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  test('desactiva modo oscuro y persiste "light" en localStorage si ya estaba activado', () => {
    // Simular estado previo: dark activo y guardado
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');

    render(<ThemeToggle />);

    const btn = screen.getByRole('button', { name: /cambiar tema/i });
    fireEvent.click(btn);

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});