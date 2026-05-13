"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { SOCIAL_REELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { SocialReelItem } from "@/types/portfolio";

interface SocialReelsGridProps {
  limit?: number;
  randomize?: boolean;
  variant?: "grid" | "horizontal";
}

function shuffleReels(reels: readonly SocialReelItem[]): SocialReelItem[] {
  const shuffled = [...reels];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

export function SocialReelsGrid({ limit, randomize = false, variant = "grid" }: SocialReelsGridProps): JSX.Element {
  const baseReels = useMemo(
    () => (typeof limit === "number" ? SOCIAL_REELS.slice(0, limit) : SOCIAL_REELS),
    [limit]
  );
  const [reels, setReels] = useState<SocialReelItem[]>(() => [...baseReels]);

  useEffect(() => {
    setReels(randomize ? shuffleReels(baseReels) : [...baseReels]);
  }, [baseReels, randomize]);

  return (
    <div
      className={cn(
        variant === "grid"
          ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          : "flex snap-x gap-5 overflow-x-auto pb-8"
      )}
    >
      {reels.map((reel, index) => (
        <motion.article
          key={reel.id}
          className={cn(
            "paper-tape sticker overflow-hidden rounded-sm bg-surface",
            variant === "horizontal" ? "min-w-[76vw] snap-center md:min-w-[19rem] xl:min-w-[22rem]" : ""
          )}
          initial={{ opacity: 0, y: -60, rotate: index % 2 === 0 ? -2 : 2 }}
          animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1 : 1 }}
          exit={{ opacity: 0, x: -90, rotate: -4 }}
          transition={{ type: "spring", stiffness: 130, damping: 16, delay: index * 0.04 }}
        >
          <div className="aspect-[9/16] w-full overflow-hidden bg-text">
            <iframe
              src={reel.embedUrl}
              title={reel.title}
              className="h-full w-full"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="border-t border-red bg-surface p-4">
            <h3 className="font-display text-4xl uppercase leading-none text-text">{reel.title}</h3>
            <Link
              href={reel.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex font-ui text-xs font-extrabold uppercase tracking-[0.14em] text-red"
            >
              abrir no Instagram
            </Link>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
