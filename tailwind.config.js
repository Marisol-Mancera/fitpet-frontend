/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand / Primarios
        'fp-primary-700': '#0B3944',
        'fp-primary-600': '#0F4C5C',
        'fp-primary-500': '#155B6D',

        // Menta (salud/progreso)
        'fp-mint-600': '#3CBFA1',
        'fp-mint-500': '#7AD9C0',

        // Acento cálido
        'fp-warm-500': '#FFC857',

        // Neutros de fondo/borde
        'fp-neutral-50':  '#F5F7FA',
        'fp-neutral-100': '#EEF2F6',
        'fp-neutral-300': '#E2E8F0',

        // Texto
        'fp-text-900': '#1F2937', // titulares
        'fp-text-700': '#374151', // cuerpo
        'fp-placeholder': '#64748B', // placeholder

        // Estados
        'fp-success': '#16A34A',
        'fp-warning': '#F59E0B',
        'fp-error':   '#DC2626',

        // Blanco (texto inverso sobre primario / superficies)
        'fp-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
}