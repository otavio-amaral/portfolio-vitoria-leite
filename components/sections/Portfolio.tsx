"use client";

import { useEffect, useRef, useState, type JSX } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { CategoryTabs } from "@/components/portfolio/CategoryTabs";
import { FolderGrid } from "@/components/portfolio/FolderGrid";
import { MasonryGrid } from "@/components/portfolio/MasonryGrid";
import { Lightbox } from "@/components/portfolio/Lightbox";
import { VideoModal } from "@/components/portfolio/VideoModal";
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
  const shouldShowFolders = activeCategory === "todos" && !activeFolder;
  const shouldRestorePortfolioScroll = useRef(false);
  const shouldReduceMotion = useReducedMotion();
  const { folders, isLoading: isLoadingFolders, error: foldersError } = useDriveFolders("todos");
  const { items, isLoading, error } = useDriveMedia(activeCategory, activeFolder?.id, !shouldShowFolders);
  const lightbox = useLightbox(items);
  const heading = activeFolder?.name ?? (activeCategory === "fotografia" ? "Fotografia em foco" : "Trabalhos selecionados");

  useEffect(() => {
    if (!shouldRestorePortfolioScroll.current) return;
    shouldRestorePortfolioScroll.current = false;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("portfolio")?.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeCategory, activeFolder, shouldReduceMotion]);

  useEffect(() => {
    const photoId = new URLSearchParams(window.location.search).get("foto");
    if (!photoId) return;

    const controller = new AbortController();
    const sharedPhotoId = photoId;
    async function loadSharedPhoto(): Promise<void> {
      try {
        const response = await fetch(`/api/drive/media?id=${encodeURIComponent(sharedPhotoId)}`, {
          cache: "no-store",
          signal: controller.signal
        });
        if (!response.ok) return;
        const item = (await response.json()) as MediaItem;
        if (item.mediaType === "image") setSharedPhoto(item);
      } catch {
        if (!controller.signal.aborted) setSharedPhoto(null);
      }
    }
    void loadSharedPhoto();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const activePhoto = sharedPhoto ?? lightbox.activeItem;
    if (!activePhoto || typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("foto", activePhoto.id);
    url.hash = "portfolio";
    window.history.replaceState(null, "", url.toString());
  }, [lightbox.activeItem, sharedPhoto]);

  function openImage(item: MediaItem): void {
    if (!shouldReduceMotion) setFlashKey((current) => current + 1);
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
    shouldRestorePortfolioScroll.current = true;
    setActiveFolder(null);
    setActiveCategory(category);
  }

  function handleOpenFolder(folder: PortfolioFolder): void {
    shouldRestorePortfolioScroll.current = true;
    setActiveFolder(folder);
  }

  function handleCloseFolder(): void {
    shouldRestorePortfolioScroll.current = true;
    setActiveFolder(null);
  }

  return (
    <section className="relative scroll-mt-24 overflow-hidden bg-bg py-8 lg:py-5" id="portfolio">
      {flashKey > 0 ? (
        <motion.div
          key={flashKey}
          className="pointer-events-none fixed inset-0 z-[95] bg-[var(--flash-color)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.82, 0] }}
          transition={{ duration: 0.3, times: [0, 0.2, 1] }}
        />
      ) : null}

      <div className="section-shell-wide lg:grid lg:grid-cols-[5rem_minmax(0,1fr)_6rem] lg:gap-8">
        <div className="mb-6 flex items-center gap-3 lg:mb-0 lg:flex-col lg:items-start">
          <p className="editorial-label text-rose lg:[writing-mode:vertical-rl] lg:rotate-180">Portfólio</p>
          <span className="font-display text-3xl text-plum lg:mt-auto" aria-hidden="true">01</span>
        </div>

        <div className="min-w-0">
          <div className="grid gap-5 border-b border-border pb-5 md:grid-cols-[1fr_auto] md:items-end lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)_auto] lg:gap-8 lg:pb-4">
            <div>
              <p className="editorial-label text-muted">Ensaios, eventos & marcas</p>
              <h2 className="mt-2 max-w-5xl font-display text-[clamp(3.25rem,4.4vw,4.75rem)] leading-[0.88] tracking-[-0.05em] text-plum md:whitespace-nowrap lg:text-[clamp(2.75rem,3.5vw,3.5rem)]">
                {heading}
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-7 text-muted md:text-right">
              Imagens com intenção, presença e memória — do primeiro briefing à entrega final.
            </p>
            <div className="hidden lg:block">
              <CategoryTabs activeCategory={activeCategory} onChange={handleCategoryChange} />
            </div>
          </div>

          <div
            className={cn(
              "flex flex-col gap-4 border-b border-border py-4 md:flex-row md:items-center md:justify-between",
              shouldShowFolders ? "lg:hidden" : "lg:justify-end"
            )}
          >
            <div className="lg:hidden">
              <CategoryTabs activeCategory={activeCategory} onChange={handleCategoryChange} />
            </div>
            {!shouldShowFolders ? (
              <div className="flex items-center gap-5" role="group" aria-label="Modo de exibição">
                {SITE_CONFIG.portfolioViewModes.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    className={cn(
                      "min-h-11 border-b py-3 text-[0.62rem] font-bold uppercase tracking-[0.18em] focus-visible:sr-focus",
                      viewMode === mode.id ? "border-blue text-blue" : "border-transparent text-muted hover:text-plum"
                    )}
                    onClick={() => setViewMode(mode.id)}
                    aria-pressed={viewMode === mode.id}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {activeFolder ? (
            <div className="flex flex-col gap-4 border-b border-border py-5 md:flex-row md:items-center md:justify-between">
              <p className="max-w-2xl text-sm leading-7 text-muted">
                {activeFolder.description ?? `${activeFolder.itemCount} imagens selecionadas deste ensaio.`}
              </p>
              <button type="button" className="editorial-link min-h-11 focus-visible:sr-focus" onClick={handleCloseFolder}>
                <ArrowLeft size={17} aria-hidden="true" />
                Voltar aos trabalhos
              </button>
            </div>
          ) : null}

          <motion.div
            key={`${activeCategory}-${viewMode}-${activeFolder?.id ?? "folders"}`}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-5"
          >
            {shouldShowFolders ? (
              <FolderGrid folders={folders} isLoading={isLoadingFolders} error={foldersError} onOpenFolder={handleOpenFolder} />
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
        </div>

        <a href="#contato" className="mt-10 hidden min-h-11 items-center gap-3 self-start text-blue lg:flex lg:[writing-mode:vertical-rl] focus-visible:sr-focus">
          <span className="editorial-label">Criar juntos</span>
          <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>

      <Lightbox
        item={sharedPhoto ?? lightbox.activeItem}
        onClose={closeLightbox}
        onNext={sharedPhoto ? undefined : lightbox.next}
        onPrevious={sharedPhoto ? undefined : lightbox.previous}
      />
      <VideoModal item={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
}
