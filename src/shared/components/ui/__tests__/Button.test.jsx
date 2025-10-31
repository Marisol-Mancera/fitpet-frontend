import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from '../Button'

describe('Button Component', () => {
  
  it('should render button with children text', () => {
    render(<Button>Click me</Button>)
    
    expect(screen.getByRole('button', { name: /click me/i })).toBeTruthy()
  })

  it('should render button with default props', () => {
    const { container } = render(<Button>Default Button</Button>)
    
    const button = container.querySelector('button')
    expect(button?.getAttribute('type')).toBe('button')
    expect(button?.classList.contains('bg-fp-primary-600')).toBe(true)
  })

  // ========== VARIANTES ==========

  it('should render primary variant correctly', () => {
    const { container } = render(<Button variant="primary">Primary</Button>)
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('bg-fp-primary-600')).toBe(true)
    expect(button?.classList.contains('text-white')).toBe(true)
  })

  it('should render secondary variant correctly', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>)
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('bg-gray-200')).toBe(true)
    expect(button?.classList.contains('text-gray-800')).toBe(true)
  })

  it('should render outline variant correctly', () => {
    const { container } = render(<Button variant="outline">Outline</Button>)
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('bg-transparent')).toBe(true)
    expect(button?.classList.contains('text-fp-primary-600')).toBe(true)
    expect(button?.classList.contains('border-fp-primary-600')).toBe(true)
  })

  it('should render danger variant correctly', () => {
    const { container } = render(<Button variant="danger">Delete</Button>)
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('bg-red-600')).toBe(true)
    expect(button?.classList.contains('text-white')).toBe(true)
  })

  it('should render success variant correctly', () => {
    const { container } = render(<Button variant="success">Save</Button>)
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('bg-green-600')).toBe(true)
    expect(button?.classList.contains('text-white')).toBe(true)
  })

  // ========== TAMAÑOS ==========

  it('should render small size correctly', () => {
    const { container } = render(<Button size="sm">Small</Button>)
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('px-3')).toBe(true)
    expect(button?.classList.contains('py-2')).toBe(true)
    expect(button?.classList.contains('text-xs')).toBe(true)
  })

  it('should render medium size correctly (default)', () => {
    const { container } = render(<Button size="md">Medium</Button>)
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('px-4')).toBe(true)
    expect(button?.classList.contains('py-3')).toBe(true)
    expect(button?.classList.contains('text-sm')).toBe(true)
  })

  it('should render large size correctly', () => {
    const { container } = render(<Button size="lg">Large</Button>)
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('px-6')).toBe(true)
    expect(button?.classList.contains('py-4')).toBe(true)
    expect(button?.classList.contains('text-base')).toBe(true)
  })

  // ========== ANCHO COMPLETO ==========

  it('should render full width when fullWidth is true', () => {
    const { container } = render(<Button fullWidth>Full Width</Button>)
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('w-full')).toBe(true)
  })

  it('should not render full width by default', () => {
    const { container } = render(<Button>Normal Width</Button>)
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('w-full')).toBe(false)
  })

  // ========== ESTADO DISABLED ==========

  it('should disable button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    
    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button.hasAttribute('disabled')).toBe(true)
  })

  it('should apply disabled styles when disabled', () => {
    const { container } = render(<Button disabled>Disabled</Button>)
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('disabled:cursor-not-allowed')).toBe(true)
    expect(button?.classList.contains('disabled:opacity-50')).toBe(true)
  })

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    
    const button = screen.getByRole('button', { name: /disabled/i })
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  // ========== ESTADO LOADING ==========

  it('should show loading spinner when isLoading is true', () => {
    const { container } = render(<Button isLoading>Submit</Button>)
    
    // Verifica que aparece el spinner SVG
    const spinner = container.querySelector('svg.animate-spin')
    expect(spinner).toBeTruthy()
    
    // Verifica que aparece el texto "Cargando..."
    expect(screen.getByText(/cargando/i)).toBeTruthy()
  })

  it('should disable button when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>)
    
    const button = screen.getByRole('button')
    expect(button.hasAttribute('disabled')).toBe(true)
  })

  it('should not show children text when isLoading', () => {
    render(<Button isLoading>Submit Form</Button>)
    
    // El texto "Submit Form" no debería aparecer
    expect(screen.queryByText(/submit form/i)).toBeNull()
    
    // En su lugar, debería aparecer "Cargando..."
    expect(screen.getByText(/cargando/i)).toBeTruthy()
  })

  it('should not call onClick when isLoading', () => {
    const handleClick = vi.fn()
    render(<Button isLoading onClick={handleClick}>Loading</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  // ========== EVENTOS ==========

  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should not have hover shadow when disabled', () => {
    const { container } = render(<Button disabled>Disabled</Button>)
    
    const button = container.querySelector('button')
    // No debería tener hover:shadow-lg cuando está disabled
    expect(button?.classList.contains('hover:shadow-lg')).toBe(false)
  })

  it('should not have hover shadow when isLoading', () => {
    const { container } = render(<Button isLoading>Loading</Button>)
    
    const button = container.querySelector('button')
    // No debería tener hover:shadow-lg cuando está loading
    expect(button?.classList.contains('hover:shadow-lg')).toBe(false)
  })

  // ========== TIPOS DE BOTÓN ==========

  it('should render with type="submit" when specified', () => {
    const { container } = render(<Button type="submit">Submit</Button>)
    
    const button = container.querySelector('button')
    expect(button?.getAttribute('type')).toBe('submit')
  })

  it('should render with type="reset" when specified', () => {
    const { container } = render(<Button type="reset">Reset</Button>)
    
    const button = container.querySelector('button')
    expect(button?.getAttribute('type')).toBe('reset')
  })

  // ========== CLASES PERSONALIZADAS ==========

  it('should apply custom className', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>)
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('custom-class')).toBe(true)
  })

  it('should preserve base classes when custom className is added', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>)
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('rounded-lg')).toBe(true)
    expect(button?.classList.contains('custom-class')).toBe(true)
  })

  // ========== PROPS ADICIONALES ==========

  it('should pass through additional props', () => {
    const { container } = render(
      <Button data-testid="custom-button" aria-label="Custom Button">
        Test
      </Button>
    )
    
    const button = container.querySelector('button')
    expect(button?.getAttribute('data-testid')).toBe('custom-button')
    expect(button?.getAttribute('aria-label')).toBe('Custom Button')
  })

  // ========== CLASES BASE ==========

  it('should always have base classes', () => {
    const { container } = render(<Button>Base</Button>)
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('inline-flex')).toBe(true)
    expect(button?.classList.contains('items-center')).toBe(true)
    expect(button?.classList.contains('justify-center')).toBe(true)
    expect(button?.classList.contains('rounded-lg')).toBe(true)
    expect(button?.classList.contains('font-semibold')).toBe(true)
  })

  // ========== COMBINACIONES ==========

  it('should render outline danger button correctly', () => {
    const { container } = render(
      <Button variant="outline" size="lg" fullWidth>
        Outline Large Full Width
      </Button>
    )
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('bg-transparent')).toBe(true)
    expect(button?.classList.contains('px-6')).toBe(true)
    expect(button?.classList.contains('py-4')).toBe(true)
    expect(button?.classList.contains('w-full')).toBe(true)
  })

  it('should render small success button when loading', () => {
    const { container } = render(
      <Button variant="success" size="sm" isLoading>
        Save
      </Button>
    )
    
    const button = container.querySelector('button')
    expect(button?.classList.contains('bg-green-600')).toBe(true)
    expect(button?.classList.contains('text-xs')).toBe(true)
    expect(button?.hasAttribute('disabled')).toBe(true)
    expect(screen.getByText(/cargando/i)).toBeTruthy()
  })
})