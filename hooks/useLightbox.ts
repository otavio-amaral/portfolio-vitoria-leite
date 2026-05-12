"use client";

import { useCallback, useMemo, useState } from "react";
import type { MediaItem } from "@/types/portfolio";

interface UseLightboxResult {
  activeItem: MediaItem | null;
  activeIndex: number;
  open: (item: MediaItem) => void;
  close: () => void;
  next: () => void;
  previous: () => void;
}

export function useLightbox(items: MediaItem[]): UseLightboxResult {
  const [activeIndex, setActiveIndex] = useState(-1);
  const imageItems = useMemo(() => items.filter((item) => item.mediaType === "image"), [items]);
  const activeItem = activeIndex >= 0 ? imageItems[activeIndex] ?? null : null;

  const open = useCallback(
    (item: MediaItem) => {
      const nextIndex = imageItems.findIndex((imageItem) => imageItem.id === item.id);
      setActiveIndex(nextIndex);
    },
    [imageItems]
  );

  const close = useCallback(() => setActiveIndex(-1), []);

  const next = useCallback(() => {
    setActiveIndex((current) => (imageItems.length ? (current + 1) % imageItems.length : -1));
  }, [imageItems.length]);

  const previous = useCallback(() => {
    setActiveIndex((current) => (imageItems.length ? (current - 1 + imageItems.length) % imageItems.length : -1));
  }, [imageItems.length]);

  return { activeItem, activeIndex, open, close, next, previous };
}
