"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

type NavIcon = (typeof SITE_CONFIG.navItems)[number]["icon"];
type NavHref = (typeof SITE_CONFIG.navItems)[number]["href"];

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
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      className="h-4 w-4 shrink-0"
      fill="none"
      aria-hidden="true"
    >
      <path d={paths[icon]} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Navbar(): JSX.Element {
  const [activeHref, setActiveHref] = useState<NavHref>(SITE_CONFIG.navItems[0].href);

  useEffect(() => {
    const sections = SITE_CONFIG.navItems.flatMap((item) => {
      const section = document.querySelector(item.href);
      return section ? [{ href: item.href, section }] : [];
    });
    let frame = 0;

    function updateActiveSection(): void {
      const marker = window.scrollY + window.innerHeight * 0.45;
      const current = sections.reduce<NavHref>(
        (active, item) => {
          const top = item.section.getBoundingClientRect().top + window.scrollY;
          return top <= marker ? item.href : active;
        },
        SITE_CONFIG.navItems[0].href
      );

      setActiveHref(current);
    }

    function requestUpdate(): void {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveSection);
    }

    function handleHashChange(): void {
      const nextHref = window.location.hash as NavHref;

      if (SITE_CONFIG.navItems.some((item) => item.href === nextHref)) {
        setActiveHref(nextHref);
      } else {
        requestUpdate();
      }
    }

    updateActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-3">
      <nav
        className="flex max-w-[calc(100vw-1.5rem)] items-center gap-1 rounded-full border border-[rgba(232,222,215,0.95)] bg-surface px-2 py-2 font-ui shadow-[0_18px_54px_rgba(26,26,26,0.24)] ring-1 ring-[rgba(26,26,26,0.08)]"
        aria-label="Navegação principal"
      >
        {SITE_CONFIG.navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={activeHref === item.href ? "page" : undefined}
            className={cn(
              "group flex min-w-[3.25rem] flex-col items-center gap-1 rounded-full px-2 py-2 text-[0.58rem] font-extrabold uppercase tracking-[0.06em] no-underline transition-[background-color,color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:bg-red hover:text-white hover:shadow-[0_10px_22px_rgba(232,20,43,0.22)] focus-visible:sr-focus md:min-w-[4.8rem] md:flex-row md:justify-center md:px-3 md:text-[0.62rem]",
              activeHref === item.href ? "bg-red text-white shadow-[0_10px_22px_rgba(232,20,43,0.22)]" : "text-muted"
            )}
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
