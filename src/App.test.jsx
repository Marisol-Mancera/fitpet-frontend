import { render, screen } from '@testing-library/react'
import App from './App'

test('renders FitPet app', () => {
  render(<App />)
  expect(screen.getByText(/fitpet/i)).toBeInTheDocument()
})