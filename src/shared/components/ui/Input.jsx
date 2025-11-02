/**
 * Input.jsx
 * Componente de input reutilizable con soporte para íconos y validación.
 */

export default function Input({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  autoComplete,
  icon: Icon,
  className = '',
  ...props
}) {
  const hasError = !!error

  // Clases base del input
  const baseClasses = 'relative block w-full appearance-none rounded-lg border py-3 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:z-10 focus:outline-none focus:ring-2 sm:text-sm'
  
  // Clases con padding para el ícono
  const paddingClasses = Icon ? 'pl-10 pr-3' : 'px-3'
  
  // Clases de borde según error
  const borderClasses = hasError
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-fp-primary-600 focus:ring-fp-primary-600'

  // Clases combinadas
  const combinedClasses = `${baseClasses} ${paddingClasses} ${borderClasses} ${className}`.trim()

  return (
    <div className="w-full">
      {/* Label (si existe) */}
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Ícono (si existe) */}
        {Icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}

        {/* Input */}
        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={combinedClasses}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id || name}-error` : undefined}
          {...props}
        />
      </div>

      {/* Mensaje de error */}
      {hasError && (
        <p
          id={`${id || name}-error`}
          className="mt-1 text-xs text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}