import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        turtle: {
          50: "#0a1628",
          100: "#1e3a5f",
          200: "#1e40af",
          300: "#3b82f6",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#60a5fa",
          700: "#93c5fd",
          800: "#bfdbfe",
          900: "#dbeafe",
          950: "#000000",
        },
        bark: {
          50: "#0a0a0a",
          100: "#111111",
          200: "#1a1a1a",
          300: "#262626",
          400: "#404040",
          500: "#a3a3a3",
          600: "#d4d4d4",
          700: "#e5e5e5",
          800: "#f0f0f0",
          900: "#f5f5f5",
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
