"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { CATEGORIES, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { MediaItem, PortfolioViewMode } from "@/types/portfolio";

interface MediaCardProps {
  item: MediaItem;
  onOpenImage: (item: MediaItem) => void;
  onOpenVideo: (item: MediaItem) => void;
  viewMode?: PortfolioViewMode;
  projectTitle?: string;
}

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzMiA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIGZpbGw9IiNmYWY5ZjciLz48cGF0aCBkPSJNMCA0OGwzMi00OHY0OEgwWiIgZmlsbD0iI2YwYzRiMCIvPjwvc3ZnPg==";

function categoryLabel(item: MediaItem): string {
  return CATEGORIES.find((category) => category.id === item.category)?.label ?? item.category;
}

function hashtag(item: MediaItem): string {
  return `#${categoryLabel(item).toLowerCase().replace(/\s+/g, "")}`;
}

function metricFromId(id: string, base: number, spread: number): number {
  const seed = Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return base + (seed % spread);
}

interface AnimatedMetricProps {
  value: number;
}

function AnimatedMetric({ value }: AnimatedMetricProps): JSX.Element {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 70, damping: 16 });
  const rounded = useTransform(spring, (latest) => Math.round(latest).toLocaleString("pt-BR"));

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  return <motion.span>{rounded}</motion.span>;
}

export function MediaCard({ item, onOpenImage, onOpenVideo, viewMode = "grid", projectTitle }: MediaCardProps): JSX.Element {
  const isVideo = item.mediaType === "video";
  const aspectRatio = viewMode === "feed" ? 4 / 5 : item.aspectRatio ?? (isVideo ? 16 / 10 : 4 / 5);
  const views = metricFromId(`${item.id}-views`, 1900, 44000);
  const displayTitle = projectTitle ?? item.description ?? categoryLabel(item);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: -80, rotate: viewMode === "grid" ? -2 : 0 }}
      animate={{ opacity: 1, y: 0, rotate: viewMode === "grid" ? [-2, 1, 0] : 0 }}
      exit={{ opacity: 0, x: -120, rotate: -5 }}
      transition={{ type: "spring", stiffness: 130, damping: 16 }}
      className={cn(
        "group relative bg-surface text-left",
        viewMode === "grid"
          ? "sticker overflow-hidden rounded-sm"
          : "mx-auto w-full max-w-[400px] overflow-hidden rounded-[1.6rem] border border-border shadow-[0_14px_34px_rgba(26,26,26,0.12)]"
      )}
    >
      {viewMode === "feed" ? (
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 font-ui">
          <div>
            <p className="text-sm font-extrabold text-text">{SITE_CONFIG.instagram}</p>
            <p className="text-xs text-muted">post colaborativo</p>
          </div>
          <span className="rounded-full bg-highlight px-3 py-1 text-xs font-bold text-text">{hashtag(item)}</span>
        </div>
      ) : null}
      <button
        type="button"
        className="relative block w-full overflow-hidden focus-visible:sr-focus"
        style={{ aspectRatio }}
        onClick={() => (isVideo ? onOpenVideo(item) : onOpenImage(item))}
        data-cursor={isVideo ? "play" : "photo"}
      >
        <Image
          src={item.thumbnailUrl}
          alt={item.name}
          fill
          sizes={viewMode === "feed" ? "400px" : "(max-width: 768px) 100vw, (max-width: 1120px) 50vw, 33vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
        />
        <span className="absolute right-3 top-3 translate-y-2 rounded-full bg-text/78 px-3 py-1 font-ui text-[0.68rem] font-bold text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          IG <AnimatedMetric value={views} /> views
        </span>
        {isVideo ? (
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red text-white shadow-red transition-transform duration-300 group-hover:scale-110">
            <span className="ml-1 h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-white" />
          </span>
        ) : null}
      </button>
      <div className={cn("border-t border-red bg-surface", viewMode === "feed" ? "p-4" : "p-3")}>
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display text-4xl uppercase leading-none text-text">{displayTitle}</h3>
        </div>
        <p className="mt-2 font-ui text-xs font-bold lowercase tracking-[0.08em] text-muted">
          {hashtag(item)} #vitóriacriativa #conteudovisual
        </p>
      </div>
    </motion.article>
  );
}
