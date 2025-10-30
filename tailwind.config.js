/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fp-primary': {
          500: '#155B6D',
          600: '#0F4C5C',
          700: '#0B3944',
        },
        'fp-mint': {
          500: '#7AD9C0',
          600: '#3CBFA1',
        },
        'fp-warm': {
          500: '#FFC857',
        },
        'teal': {
          100: '#CEEBD1',
        }
      }
    },
  },
  plugins: [],
}