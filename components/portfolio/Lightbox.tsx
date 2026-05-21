"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { useEffect, useState } from "react";
import type { MediaItem } from "@/types/portfolio";

interface LightboxProps {
  item: MediaItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function Lightbox({ item, onClose, onNext, onPrevious }: LightboxProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setCopied(false);
    setImageLoaded(false);
  }, [item?.id]);

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void {
    if (info.offset.x < -80) {
      onNext();
    }

    if (info.offset.x > 80) {
      onPrevious();
    }
  }

  async function sharePhoto(): Promise<void> {
    if (!item) {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("foto", item.id);
    url.hash = "portfolio";
    const message = `Olha essa foto do portfólio da Vitória, achei muito boa: ${url.toString()}`;

    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-[90] bg-bg/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={item.name}
        >
          <button
            type="button"
            className="absolute right-5 top-5 z-10 font-ui text-xs uppercase tracking-[0.28em] text-text focus-visible:sr-focus"
            onClick={onClose}
            data-cursor="link"
          >
            Fechar
          </button>
          <button
            type="button"
            className="absolute left-5 top-5 z-10 border border-red bg-surface px-4 py-3 font-ui text-xs font-extrabold uppercase tracking-[0.18em] text-text shadow-[0_10px_24px_rgba(26,26,26,0.12)] focus-visible:sr-focus"
            onClick={sharePhoto}
            data-cursor="link"
          >
            {copied ? "Link copiado" : "Compartilhar foto"}
          </button>
          <button
            type="button"
            className="absolute left-5 top-1/2 z-10 h-12 w-12 -translate-y-1/2 border border-red text-2xl text-text focus-visible:sr-focus"
            onClick={onPrevious}
            aria-label="Imagem anterior"
            data-cursor="link"
          >
            ←
          </button>
          <button
            type="button"
            className="absolute right-5 top-1/2 z-10 h-12 w-12 -translate-y-1/2 border border-red text-2xl text-text focus-visible:sr-focus"
            onClick={onNext}
            aria-label="Próxima imagem"
            data-cursor="link"
          >
            →
          </button>
          <motion.div
            className="relative h-full w-full p-6 md:p-12"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          >
            {!imageLoaded ? (
              <div className="absolute inset-6 grid place-items-center md:inset-12">
                <div className="h-full max-h-[72vh] w-full max-w-4xl animate-pulse bg-surface/80 shadow-[0_18px_50px_rgba(26,26,26,0.10)]" />
              </div>
            ) : null}
            <Image
              src={item.fullUrl}
              alt={item.name}
              fill
              sizes="100vw"
              className={`object-contain p-8 transition-opacity duration-500 md:p-14 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
