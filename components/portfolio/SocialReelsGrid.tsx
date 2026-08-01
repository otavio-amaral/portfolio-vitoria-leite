"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { JSX } from "react";
import { SOCIAL_REELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SocialReelsGridProps {
  limit?: number;
  variant?: "grid" | "horizontal";
}

export function SocialReelsGrid({ limit, variant = "grid" }: SocialReelsGridProps): JSX.Element {
  const reels = typeof limit === "number" ? SOCIAL_REELS.slice(0, limit) : SOCIAL_REELS;

  return (
    <div className={cn(variant === "grid" ? "grid gap-7 md:grid-cols-2 xl:grid-cols-3" : "hide-scrollbar flex snap-x gap-5 overflow-x-auto pb-6")}>
      {reels.map((reel, index) => (
        <motion.article
          key={reel.id}
          className={cn("overflow-hidden border-t border-surface/30", variant === "horizontal" && "min-w-[78vw] snap-start md:min-w-[20rem] xl:min-w-[23rem]")}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.5, delay: index * 0.06 }}
        >
          <div className="aspect-[9/16] w-full overflow-hidden bg-black">
            <iframe
              src={reel.embedUrl}
              title={reel.title}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              aria-hidden="true"
              tabIndex={-1}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="flex items-start justify-between gap-4 border-t border-surface/20 py-5">
            <div>
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-rose">Filme {String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-display text-3xl leading-none text-surface">{reel.title}</h3>
            </div>
            <Link href={reel.url} target="_blank" rel="noreferrer" className="grid h-11 w-11 shrink-0 place-items-center border border-surface/30 text-surface transition-colors hover:border-rose hover:text-rose focus-visible:sr-focus" aria-label={`Abrir ${reel.title} no Instagram`}>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
