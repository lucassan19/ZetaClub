/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        accent: {
          500: '#ec4899',
          600: '#db2777',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #ec4899 0%, #9333ea 50%, #6366f1 100%)',
        'gradient-primary-soft': 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(147,51,234,0.15) 50%, rgba(99,102,241,0.15) 100%)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
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
