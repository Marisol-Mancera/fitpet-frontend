import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Input from '../Input'

// Mock de lucide-react para íconos
vi.mock('lucide-react', () => ({
  Mail: (props) => <svg data-testid="mail-icon" {...props} />,
  Lock: (props) => <svg data-testid="lock-icon" {...props} />,
  User: (props) => <svg data-testid="user-icon" {...props} />,
  Search: (props) => <svg data-testid="search-icon" {...props} />
}))

// Componente de ícono de prueba
const TestIcon = (props) => <svg data-testid="test-icon" {...props} />

describe('Input Component', () => {
  // ========== RENDERIZADO BÁSICO ==========

  it('should render input with placeholder', () => {
    render(<Input name="email" placeholder="Enter your email" />)
    
    const input = screen.getByPlaceholderText(/enter your email/i)
    expect(input).toBeTruthy()
  })

  it('should render input with default type="text"', () => {
    const { container } = render(<Input name="username" />)
    
    const input = container.querySelector('input[type="text"]')
    expect(input).toBeTruthy()
  })

  it('should render input with id attribute', () => {
    const { container } = render(<Input id="email-input" name="email" />)
    
    const input = container.querySelector('#email-input')
    expect(input).toBeTruthy()
  })

  it('should use name as id when id is not provided', () => {
    const { container } = render(<Input name="username" />)
    
    const input = container.querySelector('#username')
    expect(input).toBeTruthy()
  })

  // ========== LABEL ==========

  it('should render label when provided', () => {
    render(<Input name="email" label="Email Address" />)
    
    expect(screen.getByText(/email address/i)).toBeTruthy()
  })

  it('should not render label when not provided', () => {
    const { container } = render(<Input name="email" />)
    
    const label = container.querySelector('label')
    expect(label).toBeNull()
  })

  it('should associate label with input via htmlFor', () => {
    render(<Input id="email" name="email" label="Email" />)
    
    const label = screen.getByText(/email/i)
    expect(label.getAttribute('for')).toBe('email')
  })

  it('should show asterisk (*) when required is true', () => {
    render(<Input name="email" label="Email" required />)
    
    const asterisk = screen.getByText('*')
    expect(asterisk).toBeTruthy()
    expect(asterisk.classList.contains('text-red-500')).toBe(true)
  })

  it('should not show asterisk when required is false', () => {
    render(<Input name="email" label="Email" required={false} />)
    
    const asterisk = screen.queryByText('*')
    expect(asterisk).toBeNull()
  })

  // ========== TIPOS DE INPUT ==========

  it('should render input with type="email"', () => {
    const { container } = render(<Input name="email" type="email" />)
    
    const input = container.querySelector('input[type="email"]')
    expect(input).toBeTruthy()
  })

  it('should render input with type="password"', () => {
    const { container } = render(<Input name="password" type="password" />)
    
    const input = container.querySelector('input[type="password"]')
    expect(input).toBeTruthy()
  })

  it('should render input with type="number"', () => {
    const { container } = render(<Input name="age" type="number" />)
    
    const input = container.querySelector('input[type="number"]')
    expect(input).toBeTruthy()
  })

  it('should render input with type="tel"', () => {
    const { container } = render(<Input name="phone" type="tel" />)
    
    const input = container.querySelector('input[type="tel"]')
    expect(input).toBeTruthy()
  })

  // ========== VALUE Y ONCHANGE ==========

  it('should render input with value', () => {
    render(<Input name="email" value="test@example.com" onChange={() => {}} />)
    
    const input = screen.getByDisplayValue('test@example.com')
    expect(input).toBeTruthy()
  })

  it('should call onChange when input value changes', () => {
    const handleChange = vi.fn()
    render(<Input name="email" value="" onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new value' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('should update input value when typing', () => {
    const handleChange = vi.fn()
    const { container } = render(<Input name="email" value="" onChange={handleChange} />)
    
    const input = container.querySelector('input')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    
    expect(handleChange).toHaveBeenCalledWith(expect.any(Object))
  })

  // ========== DISABLED ==========

  it('should disable input when disabled is true', () => {
    const { container } = render(<Input name="email" disabled />)
    
    const input = container.querySelector('input')
    expect(input?.hasAttribute('disabled')).toBe(true)
  })

  it('should not disable input by default', () => {
    const { container } = render(<Input name="email" />)
    
    const input = container.querySelector('input')
    expect(input?.hasAttribute('disabled')).toBe(false)
  })

  it('should not call onChange when disabled and typing', () => { //fallo, revisar luego
    const handleChange = vi.fn()
    const { container } = render(<Input name="email" disabled onChange={handleChange} />)
    
    const input = container.querySelector('input')
    fireEvent.change(input, { target: { value: 'test' } })
    
    // onChange no debería llamarse porque el input está disabled
    expect(handleChange).not.toHaveBeenCalled()
  })

  // ========== REQUIRED ==========

  it('should mark input as required when required is true', () => {
    const { container } = render(<Input name="email" required />)
    
    const input = container.querySelector('input')
    expect(input?.hasAttribute('required')).toBe(true)
  })

  it('should not mark input as required by default', () => {
    const { container } = render(<Input name="email" />)
    
    const input = container.querySelector('input')
    expect(input?.hasAttribute('required')).toBe(false)
  })

  // ========== AUTOCOMPLETE ==========

  it('should set autocomplete attribute when provided', () => {
    const { container } = render(<Input name="email" autoComplete="email" />)
    
    const input = container.querySelector('input')
    expect(input?.getAttribute('autocomplete')).toBe('email')
  })

  it('should not have autocomplete attribute when not provided', () => {
    const { container } = render(<Input name="email" />)
    
    const input = container.querySelector('input')
    expect(input?.hasAttribute('autocomplete')).toBe(false)
  })

  // ========== ÍCONOS ==========

  it('should render icon when provided', () => {
    render(<Input name="email" icon={TestIcon} />)
    
    const icon = screen.getByTestId('test-icon')
    expect(icon).toBeTruthy()
  })

  it('should not render icon when not provided', () => {
    const { container } = render(<Input name="email" />)
    
    const icon = screen.queryByTestId('test-icon')
    expect(icon).toBeNull()
  })

  it('should apply correct padding when icon is present', () => {
    const { container } = render(<Input name="email" icon={TestIcon} />)
    
    const input = container.querySelector('input')
    expect(input?.classList.contains('pl-10')).toBe(true)
    expect(input?.classList.contains('pr-3')).toBe(true)
  })

  it('should apply correct padding when icon is not present', () => {
    const { container } = render(<Input name="email" />)
    
    const input = container.querySelector('input')
    expect(input?.classList.contains('px-3')).toBe(true)
  })

  it('should position icon correctly', () => {
    const { container } = render(<Input name="email" icon={TestIcon} />)
    
    const iconContainer = container.querySelector('.pointer-events-none')
    expect(iconContainer?.classList.contains('absolute')).toBe(true)
    expect(iconContainer?.classList.contains('left-3')).toBe(true)
  })

  it('should mark icon as aria-hidden', () => {
    render(<Input name="email" icon={TestIcon} />)
    
    const icon = screen.getByTestId('test-icon')
    expect(icon.getAttribute('aria-hidden')).toBe('true')
  })

  // ========== ERROR HANDLING ==========

  it('should display error message when error prop is provided', () => {
    render(<Input name="email" error="Email is required" />)
    
    expect(screen.getByText(/email is required/i)).toBeTruthy()
  })

  it('should not display error message when error is not provided', () => {
    const { container } = render(<Input name="email" />)
    
    const errorMessage = container.querySelector('[role="alert"]')
    expect(errorMessage).toBeNull()
  })

  it('should apply error border classes when error exists', () => {
    const { container } = render(<Input name="email" error="Invalid email" />)
    
    const input = container.querySelector('input')
    expect(input?.classList.contains('border-red-500')).toBe(true)
    expect(input?.classList.contains('focus:border-red-500')).toBe(true)
    expect(input?.classList.contains('focus:ring-red-500')).toBe(true)
  })

  it('should apply normal border classes when no error', () => {
    const { container } = render(<Input name="email" />)
    
    const input = container.querySelector('input')
    expect(input?.classList.contains('border-gray-300')).toBe(true)
    expect(input?.classList.contains('focus:border-fp-primary-600')).toBe(true)
    expect(input?.classList.contains('focus:ring-fp-primary-600')).toBe(true)
  })

  it('should set aria-invalid to true when error exists', () => {
    const { container } = render(<Input name="email" error="Invalid" />)
    
    const input = container.querySelector('input')
    expect(input?.getAttribute('aria-invalid')).toBe('true')
  })

  it('should set aria-invalid to false when no error', () => {
    const { container } = render(<Input name="email" />)
    
    const input = container.querySelector('input')
    expect(input?.getAttribute('aria-invalid')).toBe('false')
  })

  it('should link error message to input via aria-describedby', () => {
    const { container } = render(<Input id="email" name="email" error="Invalid email" />)
    
    const input = container.querySelector('input')
    expect(input?.getAttribute('aria-describedby')).toBe('email-error')
    
    const errorMessage = container.querySelector('#email-error')
    expect(errorMessage).toBeTruthy()
  })

  it('should not have aria-describedby when no error', () => {
    const { container } = render(<Input name="email" />)
    
    const input = container.querySelector('input')
    expect(input?.hasAttribute('aria-describedby')).toBe(false)
  })

  it('should render error message with role="alert"', () => {
    render(<Input name="email" error="This field is required" />)
    
    const errorMessage = screen.getByRole('alert')
    expect(errorMessage).toBeTruthy()
    expect(errorMessage.textContent).toBe('This field is required')
  })

  // ========== CLASES PERSONALIZADAS ==========

  it('should apply custom className', () => {
    const { container } = render(<Input name="email" className="custom-class" />)
    
    const input = container.querySelector('input')
    expect(input?.classList.contains('custom-class')).toBe(true)
  })

  it('should preserve base classes when custom className is added', () => {
    const { container } = render(<Input name="email" className="custom-class" />)
    
    const input = container.querySelector('input')
    expect(input?.classList.contains('rounded-lg')).toBe(true)
    expect(input?.classList.contains('custom-class')).toBe(true)
  })

  // ========== PROPS ADICIONALES ==========

  it('should pass through additional props', () => {
    const { container } = render(
      <Input 
        name="email" 
        data-testid="custom-input" 
        aria-label="Email Input"
        maxLength={50}
      />
    )
    
    const input = container.querySelector('input')
    expect(input?.getAttribute('data-testid')).toBe('custom-input')
    expect(input?.getAttribute('aria-label')).toBe('Email Input')
    expect(input?.getAttribute('maxlength')).toBe('50')
  })

  // ========== CLASES BASE ==========

  it('should always have base classes', () => {
    const { container } = render(<Input name="email" />)
    
    const input = container.querySelector('input')
    expect(input?.classList.contains('block')).toBe(true)
    expect(input?.classList.contains('w-full')).toBe(true)
    expect(input?.classList.contains('rounded-lg')).toBe(true)
    expect(input?.classList.contains('border')).toBe(true)
    expect(input?.classList.contains('py-3')).toBe(true)
  })

  // ========== COMBINACIONES ==========

  it('should render complete input with all props', () => {
    const handleChange = vi.fn()
    const { container } = render(
      <Input
        id="email"
        name="email"
        type="email"
        label="Email Address"
        placeholder="Enter email"
        value="test@example.com"
        onChange={handleChange}
        error="Invalid email format"
        required
        autoComplete="email"
        icon={TestIcon}
        className="custom-input"
      />
    )
    
    // Verifica label
    expect(screen.getByText(/email address/i)).toBeTruthy()
    expect(screen.getByText('*')).toBeTruthy()
    
    // Verifica input
    const input = container.querySelector('#email')
    expect(input?.getAttribute('type')).toBe('email')
    expect(input?.getAttribute('placeholder')).toBe('Enter email')
    expect(input?.getAttribute('value')).toBe('test@example.com')
    expect(input?.hasAttribute('required')).toBe(true)
    expect(input?.getAttribute('autocomplete')).toBe('email')
    
    // Verifica icon
    expect(screen.getByTestId('test-icon')).toBeTruthy()
    
    // Verifica error
    expect(screen.getByText(/invalid email format/i)).toBeTruthy()
    expect(input?.classList.contains('border-red-500')).toBe(true)
    
    // Verifica custom class
    expect(input?.classList.contains('custom-input')).toBe(true)
  })

  it('should render minimal input with only required props', () => {
    const { container } = render(<Input name="username" />)
    
    const input = container.querySelector('input')
    expect(input?.getAttribute('name')).toBe('username')
    expect(input?.getAttribute('type')).toBe('text')
    expect(input?.classList.contains('border-gray-300')).toBe(true)
  })

  // ========== WRAPPER CONTAINER ==========

  it('should wrap input in a div with w-full class', () => {
    const { container } = render(<Input name="email" />)
    
    const wrapper = container.querySelector('.w-full')
    expect(wrapper).toBeTruthy()
    expect(wrapper?.querySelector('input')).toBeTruthy()
  })
})