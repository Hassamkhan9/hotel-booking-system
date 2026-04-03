/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: {
          50:  '#fdfbf3',
          100: '#faf4d9',
          200: '#f4e4a0',
          300: '#edce5c',
          400: '#e6b820',
          500: '#c99a0f',
          600: '#a67c0b',
          700: '#7d5c08',
        },
        navy: {
          50:  '#f0f4f8',
          100: '#d9e5f0',
          700: '#1a3a5c',
          800: '#122840',
          900: '#0c1c2d',
        },
      },
    },
  },
  plugins: [],
}
