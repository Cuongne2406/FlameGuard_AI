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
        primary: "#0062b2", 
        "primary-hover": "#005596",
        "primary-dark": "#005494",
        "background-light": "#f5f7f8",
        "background-dark": "#0f172a",
        "surface-light": "#ffffff",
        "surface-dark": "#1e293b",
        "text-main-light": "#1e293b",
        "text-main-dark": "#f8fafc",
        "text-muted-light": "#64748b",
        "text-muted-dark": "#94a3b8",
        "brand-blue": "#0066B3",
        "brand-blue-dark": "#005291",
        success: "#078838",  
        danger: "#e73908",
        accent: "#FFAB00", // Màu Vàng (Gold)
        silver: "#94a3b8", // Màu Bạc
        bronze: "#b45309", // Màu đồng
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}