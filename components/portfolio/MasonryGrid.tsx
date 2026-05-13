"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIntersection } from "@/hooks/useIntersection";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { MediaCard } from "@/components/portfolio/MediaCard";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { MediaItem, PortfolioViewMode } from "@/types/portfolio";

interface MasonryGridProps {
  items: MediaItem[];
  isLoading: boolean;
  error: string | null;
  onOpenImage: (item: MediaItem) => void;
  onOpenVideo: (item: MediaItem) => void;
  viewMode: PortfolioViewMode;
  projectTitle?: string;
}

const PAGE_SIZE = 9;

export function MasonryGrid({
  items,
  isLoading,
  error,
  onOpenImage,
  onOpenVideo,
  viewMode,
  projectTitle
}: MasonryGridProps): JSX.Element {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [photoClicks, setPhotoClicks] = useState<Record<string, number>>({});
  const [sentinelRef, isSentinelVisible] = useIntersection<HTMLDivElement>({ rootMargin: "320px" });
  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const photoIds = useMemo(() => items.filter((item) => item.mediaType === "image").map((item) => item.id), [items]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [items]);

  useEffect(() => {
    if (isSentinelVisible) {
      setVisibleCount((current) => Math.min(current + PAGE_SIZE, items.length));
    }
  }, [isSentinelVisible, items.length]);

  useEffect(() => {
    if (!photoIds.length) {
      setPhotoClicks({});
      return;
    }

    const controller = new AbortController();

    async function loadPhotoClicks(): Promise<void> {
      try {
        const response = await fetch(`/api/album-clicks?type=photo&ids=${encodeURIComponent(photoIds.join(","))}`, {
          cache: "no-store",
          signal: controller.signal
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { counts?: Record<string, number> };
        setPhotoClicks(data.counts ?? {});
      } catch {
        if (!controller.signal.aborted) {
          setPhotoClicks({});
        }
      }
    }

    void loadPhotoClicks();

    return () => controller.abort();
  }, [photoIds]);

  function handleOpenImage(item: MediaItem): void {
    const optimisticCount = (photoClicks[item.id] ?? 0) + 1;

    setPhotoClicks((current) => ({ ...current, [item.id]: optimisticCount }));
    void fetch("/api/album-clicks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ type: "photo", targetId: item.id })
    })
      .then(async (response) => {
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { count?: number };

        if (typeof data.count === "number") {
          setPhotoClicks((current) => ({ ...current, [item.id]: data.count ?? optimisticCount }));
        }
      })
      .catch(() => undefined);

    onOpenImage(item);
  }

  if (isLoading) {
    return (
      <div className="columns-1 gap-5 md:columns-2 xl:columns-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="mb-5 break-inside-avoid" key={index}>
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-red/40 bg-red/10 p-6 font-ui text-sm uppercase tracking-[0.18em] text-text"
      >
        {error}
      </motion.div>
    );
  }

  if (!items.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-border bg-surface p-6 font-ui text-sm uppercase tracking-[0.18em] text-muted"
      >
        {SITE_CONFIG.emptyPortfolioMessage}
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        layout
        className={cn(
          viewMode === "grid" ? "columns-1 gap-5 md:columns-2 xl:columns-3" : "mx-auto flex max-w-[430px] flex-col gap-7"
        )}
      >
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item) => (
            <div className={cn(viewMode === "grid" ? "mb-5 break-inside-avoid" : "w-full")} key={item.id}>
              <MediaCard
                item={item}
                onOpenImage={handleOpenImage}
                onOpenVideo={onOpenVideo}
                viewMode={viewMode}
                projectTitle={projectTitle}
                clickCount={photoClicks[item.id] ?? 0}
              />
            </div>
          ))}
        </AnimatePresence>
      </motion.div>
      <div ref={sentinelRef} className="h-16" aria-hidden="true" />
    </>
  );
}
