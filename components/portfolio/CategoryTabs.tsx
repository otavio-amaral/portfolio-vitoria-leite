"use client";

import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/portfolio";

interface CategoryTabsProps {
  activeCategory: Category;
  onChange: (category: Category) => void;
}

export function CategoryTabs({ activeCategory, onChange }: CategoryTabsProps): JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-border pb-4 font-ui uppercase tracking-[0.24em]">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          className={cn(
            "relative pb-2 text-xs transition-colors focus-visible:sr-focus",
            activeCategory === category.id ? "text-text" : "text-muted hover:text-text"
          )}
          onClick={() => onChange(category.id)}
          data-cursor="link"
        >
          {category.label}
          {activeCategory === category.id ? (
            <motion.span
              layoutId="portfolio-tab-indicator"
              className="absolute inset-x-0 bottom-0 h-px bg-red shadow-red"
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
            />
          ) : null}
        </button>
      ))}
    </div>
  );
}
