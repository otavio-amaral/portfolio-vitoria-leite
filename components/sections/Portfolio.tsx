"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CategoryTabs } from "@/components/portfolio/CategoryTabs";
import { FolderGrid } from "@/components/portfolio/FolderGrid";
import { MasonryGrid } from "@/components/portfolio/MasonryGrid";
import { Lightbox } from "@/components/portfolio/Lightbox";
import { VideoModal } from "@/components/portfolio/VideoModal";
import { SocialReelsGrid } from "@/components/portfolio/SocialReelsGrid";
import { useDriveFolders } from "@/hooks/useDriveFolders";
import { useDriveMedia } from "@/hooks/useDriveMedia";
import { useLightbox } from "@/hooks/useLightbox";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Category, MediaItem, PortfolioFolder, PortfolioViewMode } from "@/types/portfolio";

export function Portfolio(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<Category>("todos");
  const [activeVideo, setActiveVideo] = useState<MediaItem | null>(null);
  const [viewMode, setViewMode] = useState<PortfolioViewMode>("grid");
  const [flashKey, setFlashKey] = useState(0);
  const [activeFolder, setActiveFolder] = useState<PortfolioFolder | null>(null);
  const shouldShowSocialReels = activeCategory === "social_media";
  const shouldShowFolders = activeCategory === "todos" && !activeFolder;
  const { folders, isLoading: isLoadingFolders, error: foldersError } = useDriveFolders("todos");
  const { items, isLoading, error } = useDriveMedia(activeCategory, activeFolder?.id, !shouldShowFolders && !shouldShowSocialReels);
  const lightbox = useLightbox(items);
  const heading =
    activeCategory === "social_media"
      ? { before: "Reels", accent: "da", after: "Vitória" }
      : activeCategory === "fotografia"
        ? { before: "Fotos", accent: "sem", after: "pastas" }
        : { before: "Ensaios", accent: "em", after: "pastas" };

  useEffect(() => {
    setActiveFolder(null);
  }, [activeCategory]);

  function openImage(item: MediaItem): void {
    setFlashKey((current) => current + 1);
    window.setTimeout(() => lightbox.open(item), 120);
  }

  function handleCategoryChange(category: Category): void {
    setActiveCategory(category);
  }

  return (
    <section className="relative overflow-hidden bg-bg py-24 md:py-32" id="portfolio">
      <AnimatePresence>
        {flashKey > 0 ? (
          <motion.div
            key={flashKey}
            className="pointer-events-none fixed inset-0 z-[95] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36, times: [0, 0.22, 1] }}
          />
        ) : null}
      </AnimatePresence>
      <div className="section-shell">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="-ml-4 rotate-[-2deg] bg-highlight px-5 py-3 md:-ml-8">
            <p className="font-ui text-xs font-black uppercase tracking-[0.22em] text-red">Portfólio</p>
            <h2 className="font-display text-7xl uppercase leading-none text-text md:text-9xl">
              {heading.before} <span className="font-accent text-5xl normal-case text-red md:text-7xl">{heading.accent}</span>{" "}
              {heading.after}
            </h2>
          </div>
          {!shouldShowSocialReels ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-border bg-surface p-1 shadow-[0_10px_28px_rgba(26,26,26,0.10)]">
                {SITE_CONFIG.portfolioViewModes.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    className={cn(
                      "rounded-full px-5 py-2 font-ui text-xs font-extrabold uppercase tracking-[0.12em] transition-colors focus-visible:sr-focus",
                      viewMode === mode.id ? "bg-red text-white" : "text-muted hover:text-text"
                    )}
                    onClick={() => setViewMode(mode.id)}
                    data-cursor="link"
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <CategoryTabs activeCategory={activeCategory} onChange={handleCategoryChange} />
        {activeFolder ? (
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="font-ui text-xs font-extrabold uppercase tracking-[0.16em] text-red">ensaio aberto</p>
              <h3 className="font-display text-5xl uppercase leading-none text-text">{activeFolder.name}</h3>
            </div>
            <button
              type="button"
              className="rounded-full border border-border bg-surface px-5 py-3 font-ui text-xs font-extrabold uppercase tracking-[0.12em] text-text shadow-[0_10px_24px_rgba(26,26,26,0.08)] focus-visible:sr-focus"
              onClick={() => setActiveFolder(null)}
              data-cursor="link"
            >
              voltar para pastas
            </button>
          </div>
        ) : null}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${viewMode}-${activeFolder?.id ?? "folders"}`}
            initial={{ opacity: 0, x: 90, rotate: 1.5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -90, rotate: -2 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="mt-10"
          >
            {shouldShowSocialReels ? (
              <SocialReelsGrid />
            ) : shouldShowFolders ? (
              <FolderGrid
                folders={folders}
                isLoading={isLoadingFolders}
                error={foldersError}
                onOpenFolder={setActiveFolder}
              />
            ) : (
              <MasonryGrid
                items={items}
                isLoading={isLoading}
                error={error}
                onOpenImage={openImage}
                onOpenVideo={setActiveVideo}
                viewMode={viewMode}
                projectTitle={activeFolder?.name}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <Lightbox item={lightbox.activeItem} onClose={lightbox.close} onNext={lightbox.next} onPrevious={lightbox.previous} />
      <VideoModal item={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
}
