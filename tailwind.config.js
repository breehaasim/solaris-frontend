/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- This line tells Tailwind to scan your App.jsx!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}