/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#08233D',
          green: '#34B796',
          yellow: '#F8CD46',
          white: '#FFFFFF',
          // Mantener escala de colores para compatibilidad
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#34B796', // Usar el verde como color principal
          600: '#2aa085', // Versión más oscura del verde
          700: '#08233D', // Usar el azul oscuro
          800: '#071e33', // Versión más oscura del azul
          900: '#051525',
        },
        secondary: {
          grey: '#F3F4F6',
          text: '#2A2D34',
          // Mantener escala de colores para compatibilidad
          50: '#F3F4F6',
          100: '#e9eaec',
          200: '#d4d6da',
          300: '#b0b3b9',
          400: '#8c8f98',
          500: '#6b6e76',
          600: '#4d5058',
          700: '#2A2D34',
          800: '#22252b',
          900: '#191b20',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem', // --font-size-small
        'base': '1rem',   // --font-size-base
        'md': '1.125rem', // --font-size-medium
        'lg': '1.25rem',
        'xl': '1.5rem',   // --font-size-large
        '2xl': '2rem',    // --font-size-xlarge
        '3xl': '2.5rem',
        '4xl': '3rem',
      },
      fontWeight: {
        normal: '400',     // --font-weight-regular
        bold: '700',       // --font-weight-bold
      },
    },
  },
  plugins: [],
}
