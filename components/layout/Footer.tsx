import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-border bg-bg py-10">
      <div className="section-shell flex flex-col gap-6 font-ui text-xs uppercase tracking-[0.18em] text-muted md:flex-row md:items-center md:justify-between">
        <p>© 2026 {SITE_CONFIG.fullName}</p>
        <div className="flex flex-wrap gap-5">
          {SITE_CONFIG.socialLinks.map((link) => (
            <Link key={link.label} href={link.href} className="red-accent-line hover:text-text" data-cursor="link">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
