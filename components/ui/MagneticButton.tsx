"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
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
    "group relative inline-flex min-h-11 items-center justify-center overflow-hidden border px-6 py-3 font-ui text-xs font-extrabold uppercase tracking-[0.24em] shadow-[0_10px_24px_rgba(26,26,26,0.08)] transition-[border-color,box-shadow,color,transform] duration-300 focus-visible:sr-focus",
    variant === "solid"
      ? "border-red bg-red text-white shadow-[0_16px_34px_rgba(232,20,43,0.28)] hover:border-red-dark hover:text-white hover:shadow-[0_20px_42px_rgba(232,20,43,0.34)]"
      : variant === "whatsapp"
        ? "border-[#25d366] bg-[#25d366] text-[#062a16] shadow-[0_16px_34px_rgba(37,211,102,0.24)] hover:border-[#128c4a] hover:text-white hover:shadow-[0_20px_42px_rgba(37,211,102,0.3)]"
        : "border-red bg-surface/90 text-text hover:text-text hover:shadow-[0_16px_34px_rgba(26,26,26,0.12)]",
    className
  );

  const content = (
    <>
      <span
        className={cn(
          "absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
          variant === "solid" ? "bg-red-dark" : variant === "whatsapp" ? "bg-[#128c4a]" : "bg-red"
        )}
      />
      <span className="absolute inset-y-[-35%] left-[-35%] w-1/3 -skew-x-12 bg-white/35 opacity-0 blur-sm transition-all duration-700 group-hover:left-[115%] group-hover:opacity-100" />
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
          →
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <motion.span
        className="inline-flex"
        style={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        whileHover={{ scale: 1.035 }}
        whileTap={{ scale: 0.97 }}
      >
        <Link
          ref={ref as React.RefObject<HTMLAnchorElement>}
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
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      aria-label={ariaLabel}
      data-cursor="link"
      className={classes}
      style={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.97 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </motion.button>
  );
}
