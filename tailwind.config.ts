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
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        red: "var(--color-red)",
        "red-dark": "var(--color-red-dark)"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        ui: ["var(--font-body)"],
        accent: ["var(--font-accent)"],
        body: ["var(--font-body)"]
      },
      boxShadow: {
        red: "0 0 40px var(--color-red-glow)"
      },
      screens: {
        xs: "420px"
      }
    }
  },
  plugins: []
};

export default config;
