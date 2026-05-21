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
  const [sharedPhoto, setSharedPhoto] = useState<MediaItem | null>(null);
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

  useEffect(() => {
    const photoId = new URLSearchParams(window.location.search).get("foto");

    if (!photoId) {
      return;
    }

    let isMounted = true;
    const sharedPhotoId = photoId;

    async function loadSharedPhoto(): Promise<void> {
      try {
        const response = await fetch(`/api/drive/media?id=${encodeURIComponent(sharedPhotoId)}`, {
          cache: "no-store"
        });

        if (!response.ok) {
          return;
        }

        const item = (await response.json()) as MediaItem;

        if (isMounted && item.mediaType === "image") {
          setSharedPhoto(item);
          void fetch("/api/album-clicks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ type: "photo", targetId: item.id })
          }).catch(() => undefined);
        }
      } catch {
        if (isMounted) {
          setSharedPhoto(null);
        }
      }
    }

    void loadSharedPhoto();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const activePhoto = sharedPhoto ?? lightbox.activeItem;

    if (!activePhoto || typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("foto", activePhoto.id);
    url.hash = "portfolio";
    window.history.replaceState(null, "", url.toString());
  }, [lightbox.activeItem, sharedPhoto]);

  function openImage(item: MediaItem): void {
    setFlashKey((current) => current + 1);
    setSharedPhoto(null);
    window.setTimeout(() => lightbox.open(item), 120);
  }

  function closeLightbox(): void {
    setSharedPhoto(null);
    lightbox.close();

    const url = new URL(window.location.href);
    url.searchParams.delete("foto");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash || "#portfolio"}`);
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
            className="pointer-events-none fixed inset-0 z-[95] bg-[var(--flash-color)]"
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
          <div className="mt-7 grid gap-5 border-b border-border bg-surface/70 p-5 shadow-[0_14px_34px_rgba(26,26,26,0.06)] md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="font-ui text-xs font-extrabold uppercase tracking-[0.16em] text-red">ensaio aberto</p>
              <h3 className="mt-2 font-display text-6xl uppercase leading-none text-text md:text-8xl">{activeFolder.name}</h3>
              <p className="mt-4 max-w-2xl font-ui text-base font-semibold leading-relaxed text-muted">
                {activeFolder.description ??
                  "Uma seleção com clima documental, detalhes espontâneos e imagens pensadas para contar a história desse ensaio."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 font-ui text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-muted">
                <span className="bg-highlight px-3 py-1 text-text">{activeFolder.itemCount} fotos</span>
                <span className="border border-border bg-bg px-3 py-1">galeria editorial</span>
                <span className="border border-border bg-bg px-3 py-1">clique na foto para ampliar</span>
              </div>
            </div>
            <button
              type="button"
              className="w-fit rounded-full border border-border bg-bg px-5 py-3 font-ui text-xs font-extrabold uppercase tracking-[0.12em] text-text shadow-[0_10px_24px_rgba(26,26,26,0.08)] transition-colors hover:border-red focus-visible:sr-focus"
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
      <Lightbox
        item={sharedPhoto ?? lightbox.activeItem}
        onClose={closeLightbox}
        onNext={sharedPhoto ? () => undefined : lightbox.next}
        onPrevious={sharedPhoto ? () => undefined : lightbox.previous}
      />
      <VideoModal item={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
}
