"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { useState, type JSX } from "react";
import { createPortal } from "react-dom";
import { useAccessibleDialog } from "@/hooks/useAccessibleDialog";
import { useMounted } from "@/hooks/useMounted";
import type { MediaItem } from "@/types/portfolio";

interface LightboxProps {
  item: MediaItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function Lightbox({ item, onClose, onNext, onPrevious }: LightboxProps): JSX.Element | null {
  const mounted = useMounted();
  const [shareStatus, setShareStatus] = useState("");
  const canNavigate = Boolean(onNext && onPrevious);
  const { dialogRef, initialFocusRef } = useAccessibleDialog({
    isOpen: Boolean(item),
    onClose,
    onNext,
    onPrevious
  });

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void {
    if (info.offset.x < -80) {
      onNext?.();
    } else if (info.offset.x > 80) {
      onPrevious?.();
    }
  }

  async function sharePhoto(): Promise<void> {
    if (!item) {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("foto", item.id);
    url.hash = "portfolio";
    const shareData = {
      title: `Foto do portfólio de Vitória Leite`,
      text: "Confira esta foto do portfólio de Vitória Leite.",
      url: url.toString()
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("Foto compartilhada.");
      } else {
        await navigator.clipboard.writeText(url.toString());
        setShareStatus("Link copiado.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setShareStatus("Não foi possível compartilhar.");
    }

    window.setTimeout(() => setShareStatus(""), 2200);
  }

  if (!mounted) {
    return null;
  }

  return createPortal(
    item ? (
        <motion.div
          key={item.id}
          ref={dialogRef}
          className="fixed inset-0 z-[90] bg-bg/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          aria-describedby={item.description ? "lightbox-description" : undefined}
          tabIndex={-1}
        >
          <h2 className="sr-only" id="lightbox-title">{item.name}</h2>
          <button
            ref={initialFocusRef}
            type="button"
            className="absolute right-4 top-4 z-20 min-h-11 rounded-full border border-border bg-surface px-5 font-ui text-xs font-extrabold uppercase tracking-[0.18em] text-text shadow-[0_10px_24px_rgba(26,26,26,0.12)] focus-visible:sr-focus md:right-5 md:top-5"
            onClick={onClose}
            data-cursor="link"
          >
            Fechar
          </button>
          <button
            type="button"
            className="absolute left-4 top-4 z-20 min-h-11 rounded-full border border-red bg-surface px-4 font-ui text-xs font-extrabold uppercase tracking-[0.12em] text-text shadow-[0_10px_24px_rgba(26,26,26,0.12)] focus-visible:sr-focus md:left-5 md:top-5 md:tracking-[0.18em]"
            onClick={sharePhoto}
            data-cursor="link"
          >
            Compartilhar
          </button>
          {canNavigate ? (
            <>
              <button
                type="button"
                className="absolute bottom-5 left-4 z-20 h-12 w-12 rounded-full border border-red bg-bg/80 text-2xl text-text backdrop-blur focus-visible:sr-focus md:bottom-auto md:left-5 md:top-1/2 md:-translate-y-1/2"
                onClick={onPrevious}
                aria-label="Imagem anterior"
                data-cursor="link"
              >
                ←
              </button>
              <button
                type="button"
                className="absolute bottom-5 right-4 z-20 h-12 w-12 rounded-full border border-red bg-bg/80 text-2xl text-text backdrop-blur focus-visible:sr-focus md:bottom-auto md:right-5 md:top-1/2 md:-translate-y-1/2"
                onClick={onNext}
                aria-label="Próxima imagem"
                data-cursor="link"
              >
                →
              </button>
            </>
          ) : null}
          <motion.div
            className="relative h-full w-full p-4 pt-20 md:p-12"
            drag={canNavigate ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          >
            <Image
              src={item.fullUrl}
              alt={item.altText ?? item.name}
              fill
              sizes="100vw"
              className="object-contain px-2 pb-14 pt-2 md:p-14"
              priority
            />
          </motion.div>
          {item.description ? (
            <p id="lightbox-description" className="absolute bottom-6 left-1/2 z-10 max-w-[65vw] -translate-x-1/2 rounded-full bg-bg/80 px-5 py-2 text-center font-ui text-sm text-text backdrop-blur">
              {item.description}
            </p>
          ) : null}
          <p className="sr-only" aria-live="polite">{shareStatus}</p>
        </motion.div>
      ) : null,
    document.body
  );
}
