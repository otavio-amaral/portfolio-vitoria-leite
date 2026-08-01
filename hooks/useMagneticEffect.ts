"use client";

import { useCallback, useRef, useState } from "react";

interface MagneticPosition {
  x: number;
  y: number;
}

interface MagneticEffect {
  ref: React.RefObject<HTMLButtonElement | HTMLAnchorElement | null>;
  position: MagneticPosition;
  handleMouseMove: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  handleMouseLeave: () => void;
}

export function useMagneticEffect(strength = 0.28): MagneticEffect {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [position, setPosition] = useState<MagneticPosition>({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - bounds.left - bounds.width / 2) * strength;
      const y = (event.clientY - bounds.top - bounds.height / 2) * strength;
      setPosition({ x, y });
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return { ref, position, handleMouseMove, handleMouseLeave };
}
