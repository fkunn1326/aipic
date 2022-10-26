/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    theme: {
      screens: {
        'desktop': '769px',
      }
    }
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}
