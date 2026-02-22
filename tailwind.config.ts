import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        turtle: {
          50: "#eef8f2",
          100: "#d5eedc",
          200: "#aedcbc",
          300: "#7bc496",
          400: "#4ba86f",
          500: "#2e8b57",
          600: "#1e6e42",
          700: "#155635",
          800: "#0f4029",
          900: "#0a3d1f",
          950: "#062a14",
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
