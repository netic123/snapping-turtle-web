import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        turtle: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#0a1628",
        },
        bark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        aurora: {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "25%": { transform: "rotate(90deg) scale(1.1)" },
          "50%": { transform: "rotate(180deg) scale(1)" },
          "75%": { transform: "rotate(270deg) scale(1.1)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        "aurora-reverse": {
          "0%": { transform: "rotate(0deg) scale(1.1)" },
          "25%": { transform: "rotate(-90deg) scale(1)" },
          "50%": { transform: "rotate(-180deg) scale(1.1)" },
          "75%": { transform: "rotate(-270deg) scale(1)" },
          "100%": { transform: "rotate(-360deg) scale(1.1)" },
        },
      },
      animation: {
        aurora: "aurora 20s linear infinite",
        "aurora-reverse": "aurora-reverse 25s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
