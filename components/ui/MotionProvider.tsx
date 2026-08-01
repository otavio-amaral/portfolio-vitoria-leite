"use client";

import { MotionConfig } from "framer-motion";
import type { JSX, ReactNode } from "react";

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps): JSX.Element {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
