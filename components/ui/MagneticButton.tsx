"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  className?: string;
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  href,
  type = "button",
  className,
  ariaLabel
}: MagneticButtonProps): JSX.Element {
  const { ref, position, handleMouseMove, handleMouseLeave } = useMagneticEffect();
  const classes = cn(
    "group relative inline-flex items-center justify-center overflow-hidden border border-red px-6 py-3 font-ui text-xs font-bold uppercase tracking-[0.28em] text-text transition-colors duration-300 hover:text-text focus-visible:sr-focus",
    className
  );

  const content = (
    <>
      <span className="absolute inset-0 origin-left scale-x-0 bg-red transition-transform duration-300 group-hover:scale-x-100" />
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <motion.span style={{ x: position.x, y: position.y }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
        <Link
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={href}
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
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      aria-label={ariaLabel}
      data-cursor="link"
      className={classes}
      style={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </motion.button>
  );
}
