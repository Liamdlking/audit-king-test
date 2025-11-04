/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        royal: {
          500: '#1e3a8a',
          600: '#1e40af'
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b'
        }
      },
      backgroundImage: {
        'gradient-blue-gold': 'linear-gradient(135deg, #1e3a8a 0%, #fbbf24 100%)'
      }
    }
  },
  plugins: []
}
