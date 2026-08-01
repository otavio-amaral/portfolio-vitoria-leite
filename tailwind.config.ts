import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg-rgb) / <alpha-value>)",
        surface: "rgb(var(--color-surface-rgb) / <alpha-value>)",
        border: "rgb(var(--color-border-rgb) / <alpha-value>)",
        text: "rgb(var(--color-text-rgb) / <alpha-value>)",
        muted: "rgb(var(--color-muted-rgb) / <alpha-value>)",
        red: "rgb(var(--color-red-rgb) / <alpha-value>)",
        "red-dark": "rgb(var(--color-red-dark-rgb) / <alpha-value>)",
        rose: "rgb(var(--color-rose-rgb) / <alpha-value>)",
        plum: "rgb(var(--color-plum-rgb) / <alpha-value>)",
        blue: "rgb(var(--color-blue-rgb) / <alpha-value>)",
        highlight: "rgb(var(--color-highlight-rgb) / <alpha-value>)",
        sage: "rgb(var(--color-sage-rgb) / <alpha-value>)"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        ui: ["var(--font-body)"],
        accent: ["var(--font-accent)"],
        body: ["var(--font-body)"]
      },
      boxShadow: {
        red: "0 18px 42px var(--color-red-glow)",
        editorial: "0 24px 60px rgba(58, 48, 57, 0.12)"
      },
      screens: {
        xs: "420px"
      }
    }
  },
  plugins: []
};

export default config;
