"use client";

import { useRef, type JSX } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxWrapperProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export function ParallaxWrapper({ children, offset = 60, className }: ParallaxWrapperProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={cn("relative", className)}>
      {children}
    </motion.div>
  );
}
