import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        turtle: {
          50: "#111111",
          100: "#1a1a1a",
          200: "#333333",
          300: "#555555",
          400: "#888888",
          500: "#ffffff",
          600: "#e5e5e5",
          700: "#cccccc",
          800: "#999999",
          900: "#666666",
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
