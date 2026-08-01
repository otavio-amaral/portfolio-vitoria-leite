"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { useMemo, useState, type JSX } from "react";
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

const PROJECT_LAYOUTS = [
  "md:col-span-5",
  "md:col-span-3 md:mt-20",
  "md:col-span-4",
  "md:col-span-4 md:mt-6",
  "md:col-span-5",
  "md:col-span-3 md:mt-24"
] as const;

const PROJECT_RATIOS = [
  "aspect-[4/5]",
  "aspect-[3/5]",
  "aspect-[4/3] md:aspect-[4/3]",
  "aspect-[5/4]",
  "aspect-[4/5]",
  "aspect-[3/4]"
] as const;

function FolderCover({ folder }: FolderCoverProps): JSX.Element {
  const [imageFailed, setImageFailed] = useState(false);

  if (!folder.coverUrl || imageFailed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-highlight p-6 text-center text-[0.66rem] font-bold uppercase tracking-[0.18em] text-muted">
        capa indisponível
      </div>
    );
  }

  return (
    <Image
      src={folder.coverUrl}
      alt=""
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1120px) 50vw, 40vw"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
      onError={() => setImageFailed(true)}
    />
  );
}

export function FolderGrid({ folders, isLoading, error, onOpenFolder }: FolderGridProps): JSX.Element {
  const [showAll, setShowAll] = useState(false);
  const visibleFolders = useMemo(() => (showAll ? folders : folders.slice(0, 3)), [folders, showAll]);

  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)}
      </div>
    );
  }

  if (error) {
    return <div className="border-y border-rose bg-rose/10 p-6 text-sm text-plum">{error}</div>;
  }

  if (!folders.length) {
    return <div className="border-y border-border p-6 text-sm text-muted">{SITE_CONFIG.emptyPortfolioMessage}</div>;
  }

  return (
    <div>
      <div className="grid gap-x-5 gap-y-12 md:grid-cols-12">
        {visibleFolders.map((folder, index) => {
          const layoutIndex = index % PROJECT_LAYOUTS.length;
          return (
            <motion.button
              key={folder.id}
              type="button"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.55, delay: Math.min(index, 5) * 0.05 }}
              className={cn("group min-w-0 text-left focus-visible:sr-focus", PROJECT_LAYOUTS[layoutIndex])}
              onClick={() => onOpenFolder(folder)}
              data-cursor="photo"
            >
              <span className={cn("relative block w-full overflow-hidden bg-highlight", PROJECT_RATIOS[layoutIndex])}>
                <FolderCover folder={folder} />
              </span>
              <span className="mt-5 flex items-start gap-4 border-t border-border pt-4">
                <span className="font-display text-3xl leading-none text-rose" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[clamp(1.9rem,3vw,3rem)] leading-[0.95] tracking-[-0.035em] text-plum">
                    {folder.name}
                  </span>
                  <span className="mt-2 flex items-center justify-between gap-3 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted">
                    <span>{folder.itemCount} {folder.itemCount === 1 ? "imagem" : "imagens"}</span>
                    <ArrowRight className="text-blue transition-transform duration-300 group-hover:translate-x-1" size={17} aria-hidden="true" />
                  </span>
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {folders.length > 3 ? (
        <div className="mt-14 flex justify-center">
          <button type="button" className="editorial-link min-h-11 focus-visible:sr-focus" onClick={() => setShowAll((current) => !current)}>
            {showAll ? "Mostrar seleção" : `Ver todos os ${folders.length} trabalhos`}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
