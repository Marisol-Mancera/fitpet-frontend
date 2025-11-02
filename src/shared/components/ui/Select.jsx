
export default function Select({
  id,
  name,
  label,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  children,
  className = '',
  ...props
}) {
  const hasError = !!error

  // Clases base del select
  const baseClasses = 'relative block w-full appearance-none rounded-lg border py-3 px-3 text-gray-900 transition-colors duration-200 focus:z-10 focus:outline-none focus:ring-2 sm:text-sm bg-white'
  
  // Clases de borde según error
  const borderClasses = hasError
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-fp-primary-600 focus:ring-fp-primary-600'

  // Clases combinadas
  const combinedClasses = `${baseClasses} ${borderClasses} ${className}`.trim()

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

      {/* Select */}
      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={combinedClasses}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id || name}-error` : undefined}
        {...props}
      >
        {children}
      </select>

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