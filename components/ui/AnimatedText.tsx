"use client";

import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  mode?: "letters" | "words";
}

export function AnimatedText({ text, className, mode = "letters" }: AnimatedTextProps): JSX.Element {
  const parts = mode === "letters" ? Array.from(text) : text.split(" ");

  return (
    <span className={className} aria-label={text}>
      {parts.map((part, index) => (
        <motion.span
          aria-hidden="true"
          className="inline-block overflow-hidden"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
          key={`${part}-${index}`}
        >
          {part === " " ? "\u00A0" : part}
          {mode === "words" && index < parts.length - 1 ? "\u00A0" : null}
        </motion.span>
      ))}
    </span>
  );
}
