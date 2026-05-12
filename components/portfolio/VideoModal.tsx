"use client";

import { AnimatePresence, motion } from "framer-motion";
import { isEmbeddableVideoUrl } from "@/lib/utils";
import type { MediaItem } from "@/types/portfolio";

interface VideoModalProps {
  item: MediaItem | null;
  onClose: () => void;
}

export function VideoModal({ item, onClose }: VideoModalProps): JSX.Element {
  const description = item?.description;
  const src = isEmbeddableVideoUrl(description) ? description : null;

  return (
    <AnimatePresence>
      {item && src ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-bg/95 p-4 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={item.name}
        >
          <button
            type="button"
            className="absolute right-5 top-5 font-ui text-xs uppercase tracking-[0.28em] text-text focus-visible:sr-focus"
            onClick={onClose}
            data-cursor="link"
          >
            Fechar
          </button>
          <motion.div
            initial={{ y: 24, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.96 }}
            className="aspect-video w-full max-w-5xl border border-red/40 bg-surface shadow-red"
          >
            <iframe
              src={src}
              title={item.name}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
