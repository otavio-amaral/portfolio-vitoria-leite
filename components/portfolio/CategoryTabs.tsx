"use client";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/portfolio";

import type { JSX } from "react";

interface CategoryTabsProps {
  activeCategory: Category;
  onChange: (category: Category) => void;
}

export function CategoryTabs({ activeCategory, onChange }: CategoryTabsProps): JSX.Element {
  return (
    <div
      className="flex flex-wrap items-center gap-x-7 gap-y-2 font-ui uppercase tracking-[0.2em]"
      role="group"
      aria-label="Filtrar trabalhos do portfólio"
    >
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          className={cn(
            "relative min-h-11 py-3 text-[0.62rem] font-bold transition-colors focus-visible:sr-focus",
            activeCategory === category.id ? "text-plum" : "text-muted hover:text-rose"
          )}
          onClick={() => onChange(category.id)}
          aria-pressed={activeCategory === category.id}
          data-cursor="link"
        >
          {category.label}
          {activeCategory === category.id ? (
            <motion.span
              layoutId="portfolio-tab-indicator"
              className="absolute inset-x-0 bottom-1 h-px bg-rose"
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
            />
          ) : null}
        </button>
      ))}
    </div>
  );
}
