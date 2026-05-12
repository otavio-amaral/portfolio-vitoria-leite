"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useRandomHeroMedia } from "@/hooks/useRandomHeroMedia";
import { SITE_CONFIG } from "@/lib/constants";

interface CollagePhotoProps {
  src: string;
  alt: string;
  rotation: number;
  speed: number;
  index: number;
}

function CollagePhoto({ src, alt, rotation, speed, index }: CollagePhotoProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [Math.abs(speed) * 0.5, speed]);
  const classNames = [
    "col-span-4 row-span-3 md:col-span-3 md:row-span-4",
    "col-span-3 row-span-2 translate-y-8 md:col-span-2 md:row-span-3",
    "col-span-5 row-span-3 -translate-y-3 md:col-span-3 md:row-span-5",
    "col-span-3 row-span-2 translate-y-1 md:col-span-2 md:row-span-3",
    "col-span-4 row-span-2 -translate-y-5 md:col-span-2 md:row-span-3",
    "col-span-5 row-span-3 translate-y-6 md:col-span-3 md:row-span-4"
  ];

  return (
    <motion.div
      ref={ref}
      className={`paper-tape sticker relative min-h-[9rem] overflow-hidden rounded-sm ${classNames[index]}`}
      style={{ y, rotate: rotation }}
      initial={{ opacity: 0, y: -120, rotate: rotation - 10 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ type: "spring", stiffness: 120, damping: 14, delay: index * 0.08 }}
      data-cursor="photo"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 55vw, 24vw"
        className="object-cover saturate-[1.08]"
        priority={index < 3}
      />
    </motion.div>
  );
}

export function Hero(): JSX.Element {
  const randomPhotoCount = Math.max(SITE_CONFIG.heroCollage.length - SITE_CONFIG.localPortraits.length, 0);
  const { items } = useRandomHeroMedia(randomPhotoCount);
  const collage = SITE_CONFIG.heroCollage.map((photo, index) => {
    const localPortrait = SITE_CONFIG.localPortraits[index];
    const media = index >= SITE_CONFIG.localPortraits.length ? items[index - SITE_CONFIG.localPortraits.length] : undefined;

    return {
      ...photo,
      src: localPortrait?.src ?? media?.thumbnailUrl ?? photo.src,
      alt: localPortrait?.alt ?? media?.name ?? photo.alt
    };
  });

  return (
    <section className="relative min-h-[100svh] overflow-hidden pb-28 pt-10" id="inicio">
      <div className="absolute left-4 top-7 rotate-[-5deg] bg-highlight px-4 py-2 font-accent text-3xl text-text shadow-[0_8px_18px_rgba(26,26,26,0.12)] md:left-10">
        {SITE_CONFIG.heroAccentWord}
      </div>
      <div className="section-shell relative grid min-h-[86svh] content-center gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="relative z-20 flex flex-col justify-end pt-24 lg:order-2">
          <h1 className="pointer-events-none max-w-full font-display text-[clamp(5.8rem,15vw,12rem)] uppercase leading-[0.78] tracking-normal text-text mix-blend-multiply">
            {SITE_CONFIG.name.toUpperCase()}
          </h1>
          <p className="max-w-xl rotate-[-1deg] bg-surface px-4 py-3 font-ui text-sm font-bold uppercase tracking-[0.12em] text-text shadow-[0_10px_24px_rgba(26,26,26,0.10)] md:text-base">
            {SITE_CONFIG.tagline}
          </p>
          <div className="mt-8">
            <MagneticButton href="#portfolio">Abrir feed ↓</MagneticButton>
          </div>
        </div>
        <div className="relative z-10 grid h-[66svh] max-w-full grid-cols-8 grid-rows-8 gap-3 lg:order-1 lg:h-[78svh]">
          {collage.map((photo, index) => (
            <CollagePhoto
              key={`${photo.src}-${index}`}
              src={photo.src}
              alt={photo.alt}
              rotation={photo.rotation}
              speed={photo.speed}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
