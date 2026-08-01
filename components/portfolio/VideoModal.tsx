"use client";

import { motion } from "framer-motion";
import type { JSX } from "react";
import { createPortal } from "react-dom";
import { useAccessibleDialog } from "@/hooks/useAccessibleDialog";
import { useMounted } from "@/hooks/useMounted";
import type { MediaItem } from "@/types/portfolio";

interface VideoModalProps {
  item: MediaItem | null;
  onClose: () => void;
}

export function VideoModal({ item, onClose }: VideoModalProps): JSX.Element | null {
  const mounted = useMounted();
  const { dialogRef, initialFocusRef } = useAccessibleDialog({ isOpen: Boolean(item?.videoUrl), onClose });

  if (!mounted) {
    return null;
  }

  return createPortal(
    item?.videoUrl ? (
        <motion.div
          key={item.id}
          ref={dialogRef}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-bg/95 p-4 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
          tabIndex={-1}
        >
          <h2 className="sr-only" id="video-modal-title">{item.name}</h2>
          <button
            ref={initialFocusRef}
            type="button"
            className="absolute right-5 top-5 min-h-11 rounded-full border border-border bg-surface px-5 font-ui text-xs font-extrabold uppercase tracking-[0.18em] text-text focus-visible:sr-focus"
            onClick={onClose}
            data-cursor="link"
          >
            Fechar
          </button>
          <motion.div
            initial={{ y: 24, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            className="aspect-video w-full max-w-5xl overflow-hidden rounded-sm border border-red/40 bg-surface shadow-red"
          >
            <iframe
              src={item.videoUrl}
              title={item.name}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      ) : null,
    document.body
  );
}
