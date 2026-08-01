import type { JSX } from "react";
export function SkeletonCard(): JSX.Element {
  return (
    <div className="min-h-[22rem] animate-pulse border border-border bg-highlight">
      <div className="h-full min-h-[22rem] bg-surface/40" />
    </div>
  );
}
