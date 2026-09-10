/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        background: "#07090e",
        surface: "#0d111a",
        "surface-raised": "#131926",
        border: "rgba(255, 255, 255, 0.08)",
        "border-glow": "rgba(99, 102, 241, 0.3)",
        brand: {
          50: "#eef2ff",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
      },
      transitionTimingFunction: {
        "spring-smooth": "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      boxShadow: {
        "inner-glow": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)",
        "bezel-outer": "0 0 0 1px rgba(255, 255, 255, 0.08), 0 20px 40px -15px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
};
