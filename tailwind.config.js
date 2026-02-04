/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0066B3", 
        "primary-hover": "#005596",
        "background-light": "#F4F7FA",
        "background-dark": "#0f172a",
        "surface-light": "#ffffff",
        "surface-dark": "#1e293b",
        "text-main-light": "#1e293b",
        "text-main-dark": "#f8fafc",
        "text-muted-light": "#64748b",
        "text-muted-dark": "#94a3b8",
        success: "#10B981",
        danger: "#EF4444",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}