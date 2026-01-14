/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ENET AERO CUP brand colors (from logo)
        dark: '#1E1B1C',
        orange: {
          400: '#FFB020',
          500: '#FF8C00',
          600: '#FF5A00',
          700: '#D93E2A',
        }
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'float1': 'float1 15s ease-in-out infinite',
        'float2': 'float2 18s ease-in-out infinite',
        'float-particle': 'float-particle 8s ease-in-out infinite',
      },
      keyframes: {
        float1: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(30px, -30px)' },
        },
        float2: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-20px, 20px)' },
        },
        'float-particle': {
          '0%, 100%': { transform: 'translate(0, 0)', opacity: '0.3' },
          '50%': { transform: 'translate(20px, 30px)', opacity: '0.6' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
