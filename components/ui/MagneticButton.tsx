"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { cn } from "@/lib/utils";
import type { JSX, ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  variant?: "outline" | "solid" | "whatsapp";
  type?: "button" | "submit";
  className?: string;
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  href,
  target,
  rel,
  variant = "outline",
  type = "button",
  className,
  ariaLabel
}: MagneticButtonProps): JSX.Element {
  const { ref, position, handleMouseMove, handleMouseLeave } = useMagneticEffect();
  const classes = cn(
    "group relative inline-flex min-h-14 items-center justify-center overflow-hidden border px-7 py-4 font-ui text-[0.66rem] font-bold uppercase tracking-[0.18em] transition-[background-color,border-color,color,transform] duration-300 focus-visible:sr-focus",
    variant === "solid"
      ? "border-rose bg-rose text-surface hover:border-red-dark hover:bg-red-dark"
      : variant === "whatsapp"
        ? "border-plum bg-plum text-surface hover:border-red-dark hover:bg-red-dark"
        : "border-plum bg-transparent text-plum hover:bg-plum hover:text-surface",
    className
  );

  const content = (
    <span className="relative z-10 flex items-center gap-3">
      {children}
      <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={17} aria-hidden="true" />
    </span>
  );

  if (href) {
    return (
      <motion.span
        className="inline-flex"
        style={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
      >
        <Link
          ref={ref as React.RefObject<HTMLAnchorElement | null>}
          href={href}
          target={target}
          rel={rel}
          aria-label={ariaLabel}
          data-cursor="link"
          className={classes}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {content}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement | null>}
      type={type}
      aria-label={ariaLabel}
      data-cursor="link"
      className={classes}
      style={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </motion.button>
  );
}
