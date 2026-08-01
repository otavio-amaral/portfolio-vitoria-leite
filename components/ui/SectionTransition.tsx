import type { JSX } from "react";
interface SectionTransitionProps {
  flip?: boolean;
}

export function SectionTransition({ flip = false }: SectionTransitionProps): JSX.Element {
  return (
    <div className="relative h-20 overflow-hidden bg-bg" aria-hidden="true">
      <div
        className="absolute inset-x-[-5%] top-1/2 h-px bg-red/50"
        style={{ transform: flip ? "rotate(-2deg)" : "rotate(2deg)" }}
      />
    </div>
  );
}
