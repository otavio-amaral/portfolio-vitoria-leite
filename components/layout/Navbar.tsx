"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { List, WhatsappLogo, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type JSX } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import { cn, formatWhatsAppLink } from "@/lib/utils";

type NavHref = (typeof SITE_CONFIG.navItems)[number]["href"];

const MENU_FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Navbar(): JSX.Element {
  const [activeHref, setActiveHref] = useState<NavHref>(SITE_CONFIG.navItems[0].href);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationRef = useRef<HTMLElement>(null);
  const whatsappUrl = `${formatWhatsAppLink(SITE_CONFIG.whatsapp)}?text=${encodeURIComponent(
    "Oi, Vitória! Vim pelo site e quero conversar sobre um projeto."
  )}`;

  useEffect(() => {
    const sections = SITE_CONFIG.navItems.flatMap((item) => {
      const section = document.querySelector(item.href);
      return section ? [{ href: item.href, section }] : [];
    });
    let frame = 0;

    function updateActiveSection(): void {
      const marker = window.scrollY + window.innerHeight * 0.36;
      const orderedSections = [...sections].sort((first, second) => {
        const firstTop = first.section.getBoundingClientRect().top + window.scrollY;
        const secondTop = second.section.getBoundingClientRect().top + window.scrollY;
        return firstTop - secondTop;
      });
      const current = orderedSections.reduce<NavHref>((active, item) => {
        const top = item.section.getBoundingClientRect().top + window.scrollY;
        return top <= marker ? item.href : active;
      }, SITE_CONFIG.navItems[0].href);
      setActiveHref(current);
    }

    function requestUpdate(): void {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveSection);
    }

    updateActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen || !mobileNavigationRef.current) return undefined;

    const navigation = mobileNavigationRef.current;
    const menuButton = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    const outsideElements = Array.from(document.querySelectorAll<HTMLElement>("main, footer")).map((element) => ({
      element,
      inert: element.inert,
      ariaHidden: element.getAttribute("aria-hidden")
    }));

    document.body.style.overflow = "hidden";
    outsideElements.forEach(({ element }) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });

    const focusFrame = window.requestAnimationFrame(() => {
      navigation.querySelector<HTMLElement>(MENU_FOCUSABLE_SELECTOR)?.focus();
    });

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(navigation.querySelectorAll<HTMLElement>(MENU_FOCUSABLE_SELECTOR)).filter(
        (element) => element.getClientRects().length > 0
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) {
        event.preventDefault();
        navigation.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      outsideElements.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
      menuButton?.focus();
    };
  }, [menuOpen]);

  function closeMenu(href: NavHref): void {
    setActiveHref(href);
    setMenuOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[4.5rem] border-b border-border/80 bg-bg/95 backdrop-blur-md lg:h-[5.75rem]">
      <div className="flex h-full items-stretch">
        <Link
          href="#inicio"
          className="flex min-w-[9rem] items-center px-5 font-display text-[1.65rem] italic tracking-[-0.04em] text-rose focus-visible:sr-focus md:px-10 lg:min-w-[16rem]"
          aria-label="Vitória Leite — início"
        >
          vitória<span className="text-blue">.</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-end gap-8 px-10 lg:flex" aria-label="Navegação principal">
          {SITE_CONFIG.navItems.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activeHref === item.href ? "location" : undefined}
              className={cn(
                "border-b py-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] transition-colors focus-visible:sr-focus",
                activeHref === item.href
                  ? "border-rose text-text"
                  : "border-transparent text-text/78 hover:text-rose"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="ml-auto hidden min-w-[17.5rem] items-center justify-center gap-3 bg-plum px-8 text-[0.64rem] font-bold uppercase tracking-[0.2em] text-surface transition-colors hover:bg-red-dark focus-visible:sr-focus lg:flex"
          aria-label="Chamar Vitória no WhatsApp"
        >
          <WhatsappLogo size={20} weight="regular" aria-hidden="true" />
          Chamar no WhatsApp
        </Link>

        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="ml-auto grid w-[4.5rem] place-items-center border-l border-border text-plum focus-visible:sr-focus lg:hidden"
          aria-label="Chamar Vitória no WhatsApp"
        >
          <WhatsappLogo size={22} aria-hidden="true" />
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          className="grid w-[4.5rem] place-items-center border-l border-border text-plum focus-visible:sr-focus lg:hidden"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={24} aria-hidden="true" /> : <List size={24} aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            ref={mobileNavigationRef}
            id="mobile-navigation"
            tabIndex={-1}
            className="fixed inset-x-0 top-[4.5rem] flex h-[calc(100svh-4.5rem)] flex-col bg-bg px-6 pb-8 pt-6 lg:hidden"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            aria-label="Navegação móvel"
          >
            {SITE_CONFIG.navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => closeMenu(item.href)}
                className="flex min-h-14 items-center justify-between border-b border-border font-display text-[clamp(2.25rem,12vw,4.5rem)] leading-none text-plum focus-visible:sr-focus"
              >
                <span>{item.label}</span>
                <span className="font-ui text-[0.62rem] font-bold tracking-[0.18em] text-rose" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
