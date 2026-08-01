"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "@phosphor-icons/react";
import { useState, type JSX } from "react";
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

function categoryLabel(item: MediaItem): string {
  return CATEGORIES.find((category) => category.id === item.category)?.label ?? item.category;
}

export function MediaCard({
  item,
  onOpenImage,
  onOpenVideo,
  viewMode = "grid",
  projectTitle
}: MediaCardProps): JSX.Element {
  const [imageFailed, setImageFailed] = useState(false);
  const isVideo = item.mediaType === "video";
  const aspectRatio = viewMode === "feed" ? 4 / 5 : item.aspectRatio ?? (isVideo ? 16 / 10 : 4 / 5);
  const displayTitle = projectTitle ?? item.description ?? categoryLabel(item);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.42 }}
      className={cn("group text-left", viewMode === "feed" && "mx-auto w-full max-w-[430px] border border-border bg-surface")}
    >
      {viewMode === "feed" ? (
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-bold text-plum">{SITE_CONFIG.instagram}</p>
            <p className="text-[0.62rem] uppercase tracking-[0.14em] text-muted">{isVideo ? "vídeo selecionado" : "imagem selecionada"}</p>
          </div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-rose">{categoryLabel(item)}</p>
        </div>
      ) : null}

      <button
        type="button"
        className="relative block w-full overflow-hidden bg-highlight focus-visible:sr-focus"
        style={{ aspectRatio }}
        onClick={() => (isVideo ? onOpenVideo(item) : onOpenImage(item))}
        data-cursor={isVideo ? "play" : "photo"}
      >
        {imageFailed ? (
          <span className="absolute inset-0 grid place-items-center p-6 text-center text-[0.66rem] font-bold uppercase tracking-[0.18em] text-muted">
            mídia indisponível
          </span>
        ) : (
          <Image
            src={item.thumbnailUrl}
            alt={item.altText ?? (projectTitle ? `Fotografia do ensaio ${projectTitle}` : item.name)}
            fill
            sizes={viewMode === "feed" ? "430px" : "(max-width: 768px) 100vw, (max-width: 1120px) 50vw, 33vw"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            onError={() => setImageFailed(true)}
          />
        )}
        {isVideo ? (
          <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center bg-plum text-surface transition-transform duration-300 group-hover:scale-105">
            <Play size={22} weight="fill" aria-hidden="true" />
          </span>
        ) : null}
      </button>

      <div className={cn("border-t border-border", viewMode === "feed" ? "p-4" : "py-4") }>
        <h3 className="font-display text-[clamp(1.8rem,3vw,2.75rem)] leading-none tracking-[-0.035em] text-plum">{displayTitle}</h3>
        <p className="mt-2 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-muted">
          {categoryLabel(item)} · {isVideo ? "abrir vídeo" : "abrir imagem"}
        </p>
      </div>
    </motion.article>
  );
}
