/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A2342', // Deep navy
          50: '#E6EDF7',
          100: '#CCDAEF',
          200: '#99B5DF',
          300: '#6690CF',
          400: '#336BC0',
          500: '#0A2342', // Base primary
          600: '#091E3B',
          700: '#081A33',
          800: '#06152B',
          900: '#051124',
          950: '#03091A',
        },
        secondary: {
          DEFAULT: '#E6C229', // Warm gold
          50: '#FCF7E6',
          100: '#F9EFCD',
          200: '#F3DF9B',
          300: '#EDD069',
          400: '#E6C229', // Base secondary
          500: '#CF9C24',
          600: '#B7871F',
          700: '#9F731A',
          800: '#875F16',
          900: '#6F4C11',
          950: '#5F410E',
        },
        accent: {
          DEFAULT: '#D8315B', // Rich red
          50: '#F9E6EC',
          100: '#F3CDD9',
          200: '#E89BB3',
          300: '#DD6A8D',
          400: '#D8315B', // Base accent
          500: '#C22C52',
          600: '#AB2749',
          700: '#952240',
          800: '#7E1D36',
          900: '#67172D',
          950: '#591426',
        },
      },
      fontFamily: {
        sans: [
          '"SF Pro Display"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};