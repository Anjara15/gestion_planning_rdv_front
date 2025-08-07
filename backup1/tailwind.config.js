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
          DEFAULT: '#4CAF50',
          dark: '#45a049',
        },
        secondary: {
          DEFAULT: '#1a2634',
          light: '#2c3e50',
        },
        danger: '#e74c3c',
        info: '#0077cc',
      },
    },
  },
  plugins: [],
}
