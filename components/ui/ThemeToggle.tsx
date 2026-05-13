"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Theme = "light" | "dark";
type ThemePreference = "system" | Theme;

const STORAGE_KEY = "vitoria-theme";
const THEME_CYCLE: ThemePreference[] = ["system", "dark", "light"];

function systemTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle(): JSX.Element {
  const [theme, setTheme] = useState<Theme>("light");
  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const initialPreference = savedTheme === "dark" || savedTheme === "light" ? savedTheme : "system";
    const initialTheme = initialPreference === "system" ? systemTheme() : initialPreference;

    setPreference(initialPreference);
    setTheme(initialTheme);
    applyTheme(initialTheme);

    function handleSystemChange(event: MediaQueryListEvent): void {
      const savedPreference = window.localStorage.getItem(STORAGE_KEY);

      if (savedPreference === "dark" || savedPreference === "light") {
        return;
      }

      const nextTheme = event.matches ? "dark" : "light";
      setTheme(nextTheme);
      applyTheme(nextTheme);
    }

    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, []);

  function toggleTheme(): void {
    const currentIndex = THEME_CYCLE.indexOf(preference);
    const nextPreference = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];
    const nextTheme = nextPreference === "system" ? systemTheme() : nextPreference;

    setPreference(nextPreference);
    setTheme(nextTheme);
    applyTheme(nextTheme);

    if (nextPreference === "system") {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, nextPreference);
    }
  }

  const isDark = theme === "dark";
  const label =
    preference === "system"
      ? `Tema seguindo o dispositivo: ${isDark ? "escuro" : "claro"}. Toque para fixar escuro.`
      : preference === "dark"
        ? "Tema escuro fixo. Toque para fixar claro."
        : "Tema claro fixo. Toque para seguir o dispositivo.";

  return (
    <motion.button
      type="button"
      className="group fixed right-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-text shadow-[0_14px_34px_rgba(26,26,26,0.16)] transition-colors hover:border-red focus-visible:sr-focus"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      data-cursor="link"
    >
      <span className="relative grid h-5 w-5 place-items-center">
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          className={`absolute transition-all duration-300 ${isDark ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          className={`absolute transition-all duration-300 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.2 14.8A8.4 8.4 0 0 1 9.2 3.8 8.7 8.7 0 1 0 20.2 14.8Z" />
        </svg>
        <span
          className={`absolute -right-1 -top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-red text-[0.48rem] font-black leading-none text-white transition-opacity duration-300 ${
            preference === "system" ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          A
        </span>
      </span>
    </motion.button>
  );
}
