/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fef5f5',
          100: '#fde8e8',
          200: '#fad6d6',
          300: '#f5b9b9',
          400: '#f0a0a0',
          500: '#e89090',
          600: '#d87373',
          700: '#a85555',
          800: '#8b3a3a',
          900: '#5c2e2e',
        },
        gold: {
          50: '#fffbf5',
          100: '#fff8f0',
          200: '#ffe8d6',
          300: '#ffd4a8',
          400: '#f0c080',
          500: '#d4af37',
          600: '#b8941f',
          700: '#997d1a',
          800: '#7a6414',
          900: '#5c4d0a',
        },
        cream: '#f5e6d3',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        script: ['Cormorant Garamond', 'serif'],
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in',
        slideUp: 'slideUp 1s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
