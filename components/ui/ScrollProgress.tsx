"use client";

import { motion, useScroll } from "framer-motion";

export function ScrollProgress(): JSX.Element {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed left-0 top-0 z-[80] h-px origin-left bg-red shadow-red"
      style={{ scaleX: scrollYProgress, width: "100%" }}
      aria-hidden="true"
    />
  );
}
