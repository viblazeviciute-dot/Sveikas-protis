/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: "#e9f5ff", 100: "#d7eeff", 600: "#0ea5e9", 700: "#0284c7" }
      },
      borderRadius: { xl: "0.875rem", "2xl": "1rem" }
    },
  },
  plugins: [],
}
