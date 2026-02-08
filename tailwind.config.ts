import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        turtle: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        bark: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
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
