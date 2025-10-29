/**
 * Validador simple de email (regex)
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validador de contraseña 
 * Mínimo 8 caracteres, 1 mayúscula, 1 número, 1 símbolo.
 */
export function isStrongPassword(password) {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  return (
    password.length >= minLength && hasUpperCase && hasNumber && hasSymbol
  )
}
