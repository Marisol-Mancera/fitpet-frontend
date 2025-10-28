import { render, screen } from '@testing-library/react'
import LoginPage from '../../auth/LoginPage.jsx'

describe('LoginPage', () => {
  it('muestra el título "Iniciar Sesión"', () => {
    render(<LoginPage />)
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument()
  })
})