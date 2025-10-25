/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores basados en tu diseño de Figma
        primary: {
          DEFAULT: '#2563EB', // Azul principal
          light: '#3B82F6',
          dark: '#1E40AF',
        },
        success: {
          DEFAULT: '#10B981', // Verde
          light: '#34D399',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B', // Naranja/Amarillo
          light: '#FBBF24',
          dark: '#D97706',
        },
        purple: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
        },
        background: {
          DEFAULT: '#F3F4F6',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}