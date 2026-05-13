"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PortfolioFolder } from "@/types/portfolio";

interface FolderGridProps {
  folders: PortfolioFolder[];
  isLoading: boolean;
  error: string | null;
  onOpenFolder: (folder: PortfolioFolder) => void;
}

interface FolderCoverProps {
  folder: PortfolioFolder;
}

function FolderCover({ folder }: FolderCoverProps): JSX.Element {
  const [imageFailed, setImageFailed] = useState(false);

  if (!folder.coverUrl || imageFailed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-surface via-border to-rose p-6 text-center font-ui text-xs font-extrabold uppercase tracking-[0.18em] text-muted">
        capa indisponível
      </div>
    );
  }

  return (
    <Image
      src={folder.coverUrl}
      alt={folder.name}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1120px) 50vw, 33vw"
      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      onError={() => setImageFailed(true)}
    />
  );
}

function formatClickCount(count: number): string {
  return `${count.toLocaleString("pt-BR")} ${count === 1 ? "clique" : "cliques"}`;
}

export function FolderGrid({ folders, isLoading, error, onOpenFolder }: FolderGridProps): JSX.Element {
  const [showAll, setShowAll] = useState(false);
  const [albumClicks, setAlbumClicks] = useState<Record<string, number>>({});
  const visibleFolders = useMemo(() => (showAll ? folders : folders.slice(0, 3)), [folders, showAll]);

  useEffect(() => {
    if (!folders.length) {
      setAlbumClicks({});
      return;
    }

    const controller = new AbortController();
    const ids = folders.map((folder) => folder.id).join(",");

    async function loadClickCounts(): Promise<void> {
      try {
        const response = await fetch(`/api/album-clicks?ids=${encodeURIComponent(ids)}`, {
          cache: "no-store",
          signal: controller.signal
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { counts?: Record<string, number> };
        setAlbumClicks(data.counts ?? {});
      } catch {
        if (!controller.signal.aborted) {
          setAlbumClicks({});
        }
      }
    }

    void loadClickCounts();

    return () => controller.abort();
  }, [folders]);

  function handleOpenFolder(folder: PortfolioFolder): void {
    const optimisticCount = (albumClicks[folder.id] ?? 0) + 1;

    setAlbumClicks((current) => ({ ...current, [folder.id]: optimisticCount }));
    void fetch("/api/album-clicks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ albumId: folder.id })
    })
      .then(async (response) => {
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { count?: number };

        if (typeof data.count === "number") {
          setAlbumClicks((current) => ({ ...current, [folder.id]: data.count ?? optimisticCount }));
        }
      })
      .catch(() => undefined);
    onOpenFolder(folder);
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} />
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

  if (!folders.length) {
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
    <div>
      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {visibleFolders.map((folder, index) => (
          <motion.button
            key={folder.id}
            type="button"
            initial={{ opacity: 0, y: -70, rotate: index % 2 === 0 ? -3 : 2 }}
            animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
            exit={{ opacity: 0, x: -100, rotate: -5 }}
            transition={{ type: "spring", stiffness: 130, damping: 16, delay: index * 0.05 }}
            className={cn(
              "paper-tape sticker group relative overflow-hidden rounded-sm bg-surface text-left focus-visible:sr-focus",
              folder.coverUrl ? "min-h-[24rem]" : "min-h-[18rem]"
            )}
            onClick={() => handleOpenFolder(folder)}
            data-cursor="photo"
          >
            <FolderCover folder={folder} />
            <div className="absolute inset-0 bg-gradient-to-t from-text/78 via-text/16 to-transparent" />
            <div className="absolute right-4 top-4 rounded-full bg-text/82 px-3 py-1 font-ui text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-white backdrop-blur">
              {formatClickCount(albumClicks[folder.id] ?? 0)}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <span className="w-fit rotate-[-3deg] bg-highlight px-3 py-1 font-ui text-xs font-extrabold uppercase text-text">
                {folder.itemCount} fotos
              </span>
              <h3 className="mt-4 font-display text-6xl uppercase leading-none text-white">{folder.name}</h3>
              <p className="mt-2 font-ui text-xs font-bold uppercase tracking-[0.14em] text-white/80">abrir ensaio</p>
            </div>
          </motion.button>
        ))}
      </div>
      {folders.length > 3 ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className="rounded-full border border-red bg-red px-7 py-3 font-ui text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-red transition-colors hover:bg-red-dark focus-visible:sr-focus"
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? "Ver menos ensaios" : `Ver mais ensaios (${folders.length - 3})`}
          </button>
        </div>
      ) : null}
    </div>
  );
}
