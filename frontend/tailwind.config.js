/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#E50914',
          'red-dark': '#B20710',
          black: '#141414',
          'black-light': '#181818',
          dark: '#000000',
          gray: '#333333',
          'gray-light': '#564d4d',
          'gray-dark': '#222222',
          white: '#ffffff'
        }
      },
      fontFamily: {
        'netflix': ['Netflix Sans', 'Helvetica Neue', 'Segoe UI', 'Roboto', 'Ubuntu', 'sans-serif']
      },
      backgroundImage: {
        'gradient-to-t-black': 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
        'gradient-to-b-black': 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
        'hero-gradient': 'linear-gradient(77deg, rgba(0,0,0,.6), transparent 85%)'
      },
      boxShadow: {
        'netflix': '0 4px 14px 0 rgba(0,0,0,.8)',
        'card-hover': '0 8px 25px rgba(0,0,0,0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
