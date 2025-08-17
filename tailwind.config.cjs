/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: { card: '0 6px 18px rgba(0,0,0,.45)' },
      colors: {
        emeraldInk: '#0c3b3b',
        goldInk: '#c7a44a'
      }
    }
  },
  plugins: []
}
