/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B00',
        secondary: '#2D9CDB',
        bg: '#F8F9FA',
        'text-main': '#212529',
        'text-sub': '#6C757D',
        border: '#E9ECEF'
      }
    },
  },
  plugins: [],
}
