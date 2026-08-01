import type { JSX, ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps): JSX.Element {
  return <>{children}</>;
}
