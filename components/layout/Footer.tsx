import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import type { JSX } from "react";

export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-border bg-bg py-10">
      <div className="section-shell flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
        <Link href="#inicio" className="font-display text-3xl italic tracking-[-0.04em] text-rose focus-visible:sr-focus">
          vitória<span className="text-blue">.</span>
        </Link>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted">© {new Date().getFullYear()} {SITE_CONFIG.fullName}</p>
        <div className="flex flex-wrap gap-6">
          {SITE_CONFIG.socialLinks.map((link) => (
            <Link key={link.label} href={link.href} className="editorial-link focus-visible:sr-focus" data-cursor="link">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
