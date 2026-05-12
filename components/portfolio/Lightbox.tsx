"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import type { MediaItem } from "@/types/portfolio";

interface LightboxProps {
  item: MediaItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function Lightbox({ item, onClose, onNext, onPrevious }: LightboxProps): JSX.Element {
  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void {
    if (info.offset.x < -80) {
      onNext();
    }

    if (info.offset.x > 80) {
      onPrevious();
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
            <Image src={item.fullUrl} alt={item.name} fill sizes="100vw" className="object-contain p-8 md:p-14" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
