"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

type NavIcon = (typeof SITE_CONFIG.navItems)[number]["icon"];

interface IconProps {
  icon: NavIcon;
}

function Icon({ icon }: IconProps): JSX.Element {
  const paths: Record<NavIcon, string> = {
    home: "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
    spark: "M12 3l1.7 5.2L19 10l-5.3 1.8L12 17l-1.7-5.2L5 10l5.3-1.8z",
    grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    play: "M8 5v14l11-7z",
    tag: "M4 5h9l7 7-8 8-7-7zM9 9h.01",
    dm: "M4 5h16v11H8l-4 4z"
  };

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d={paths[icon]} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Navbar(): JSX.Element {
  return (
    <header className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-3">
      <nav
        className="flex max-w-[calc(100vw-1.5rem)] items-center gap-1 rounded-full border border-border/80 bg-surface/78 px-2 py-2 font-ui shadow-[0_12px_40px_rgba(26,26,26,0.16)] backdrop-blur-xl"
        aria-label="Navegação principal"
      >
        {SITE_CONFIG.navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex min-w-[3.25rem] flex-col items-center gap-1 rounded-full px-2 py-2 text-[0.58rem] font-bold uppercase tracking-[0.06em] text-muted transition-colors hover:bg-red hover:text-white focus-visible:sr-focus md:min-w-[4.8rem] md:flex-row md:justify-center md:px-3 md:text-[0.62rem]"
            data-cursor="link"
          >
            <Icon icon={item.icon} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
