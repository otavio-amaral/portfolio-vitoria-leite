"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useRandomHeroMedia } from "@/hooks/useRandomHeroMedia";
import { SITE_CONFIG } from "@/lib/constants";
import { formatWhatsAppLink } from "@/lib/utils";

interface CollagePhotoProps {
  src: string;
  alt: string;
  className: string;
  rotation: number;
  speed: number;
  index: number;
}

const COLLAGE_LAYOUTS = [
  [
    "col-span-4 row-span-3 md:col-span-3 md:row-span-4",
    "col-span-4 row-span-2 translate-y-7 md:col-span-2 md:row-span-3",
    "col-span-4 row-span-3 -translate-y-2 md:col-span-3 md:row-span-5",
    "col-span-3 row-span-2 translate-y-1 md:col-span-2 md:row-span-3",
    "col-span-3 row-span-2 -translate-y-5 md:col-span-2 md:row-span-3",
    "col-span-5 row-span-3 translate-y-5 md:col-span-3 md:row-span-4",
    "col-span-3 row-span-2 translate-y-2 md:col-span-2 md:row-span-3"
  ],
  [
    "col-span-4 row-span-3 -translate-y-1 md:col-span-3 md:row-span-4",
    "col-span-3 row-span-2 translate-y-5 md:col-span-2 md:row-span-3",
    "col-span-5 row-span-3 md:col-span-3 md:row-span-5",
    "col-span-4 row-span-2 -translate-y-3 md:col-span-2 md:row-span-3",
    "col-span-4 row-span-2 translate-y-4 md:col-span-2 md:row-span-3",
    "col-span-4 row-span-3 -translate-y-1 md:col-span-3 md:row-span-4",
    "col-span-3 row-span-2 translate-y-2 md:col-span-2 md:row-span-3"
  ],
  [
    "col-span-5 row-span-3 md:col-span-3 md:row-span-4",
    "col-span-3 row-span-2 translate-y-4 md:col-span-2 md:row-span-3",
    "col-span-4 row-span-3 -translate-y-2 md:col-span-3 md:row-span-5",
    "col-span-4 row-span-2 translate-y-3 md:col-span-2 md:row-span-3",
    "col-span-3 row-span-2 -translate-y-4 md:col-span-2 md:row-span-3",
    "col-span-5 row-span-3 translate-y-5 md:col-span-3 md:row-span-4",
    "col-span-3 row-span-2 -translate-y-1 md:col-span-2 md:row-span-3"
  ]
] as const;

function shuffleIndexes(length: number): number[] {
  const indexes = Array.from({ length }, (_, index) => index);

  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [indexes[index], indexes[randomIndex]] = [indexes[randomIndex], indexes[index]];
  }

  return indexes;
}

function randomizeCollageLayout(length: number): string[] {
  const layout = COLLAGE_LAYOUTS[Math.floor(Math.random() * COLLAGE_LAYOUTS.length)];
  const order = shuffleIndexes(Math.min(length, layout.length));

  return order.map((layoutIndex) => layout[layoutIndex]);
}

function CollagePhoto({ src, alt, className, rotation, speed, index }: CollagePhotoProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [Math.abs(speed) * 0.25, speed * 0.72]
  );

  return (
    <motion.div
      ref={ref}
      className={`paper-tape sticker relative min-h-[6.75rem] overflow-hidden rounded-sm will-change-transform md:min-h-[9rem] ${className}`}
      style={{ y, rotate: rotation }}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -34, scale: 0.96, rotate: rotation - 4 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: rotation }}
      transition={{ type: "spring", stiffness: 95, damping: 18, mass: 0.85, delay: index * 0.045 }}
      data-cursor="photo"
    >
      {imageFailed ? (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[var(--sticker-paper)] via-[#efe2d6] to-[#f1d94d]/45 p-4 text-center font-ui text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[var(--sticker-muted)]">
          em breve
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 55vw, 24vw"
          className="object-cover saturate-[1.08]"
          priority={index < 3}
          onError={() => setImageFailed(true)}
        />
      )}
    </motion.div>
  );
}

function InstagramIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true" className="h-4 w-4 shrink-0">
      <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" className="h-4 w-4 shrink-0">
      <path d="M12.04 3.5a8.45 8.45 0 0 0-7.2 12.88L3.9 20.5l4.2-1a8.44 8.44 0 1 0 3.94-16Zm0 1.7a6.75 6.75 0 0 1 5.75 10.28 6.7 6.7 0 0 1-7.72 2.65l-.27-.1-2.48.6.56-2.43-.14-.28A6.75 6.75 0 0 1 12.04 5.2Zm-2.5 3.12c-.15 0-.4.06-.62.31-.22.25-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.67 4.15 3.63 2.05.8 2.47.64 2.92.6.45-.04 1.45-.59 1.65-1.17.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28-.25-.13-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.16-.28.18-.53.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.1-.5.11-.1.25-.28.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.84-.2-.48-.4-.42-.55-.43h-.47Z" />
    </svg>
  );
}

export function Hero(): JSX.Element {
  const randomPhotoCount = Math.max(SITE_CONFIG.heroCollage.length - SITE_CONFIG.localPortraits.length, 0);
  const { items } = useRandomHeroMedia(randomPhotoCount);
  const [layoutClasses, setLayoutClasses] = useState<string[]>(() => [...COLLAGE_LAYOUTS[0]]);
  const heroName = SITE_CONFIG.name.toUpperCase();
  const whatsappMessage =
    "Oi, Vitória! Vim pelo site e queria conversar sobre um projeto. Gostei muito do seu olhar criativo e quero entender como podemos transformar minha ideia em conteúdo.";
  const whatsappUrl = `${formatWhatsAppLink(SITE_CONFIG.whatsapp)}?text=${encodeURIComponent(whatsappMessage)}`;
  const collage = useMemo(
    () =>
      SITE_CONFIG.heroCollage.map((photo, index) => {
        const localPortrait = SITE_CONFIG.localPortraits[index];
        const media = index >= SITE_CONFIG.localPortraits.length ? items[index - SITE_CONFIG.localPortraits.length] : undefined;

        return {
          ...photo,
          src: localPortrait?.src ?? media?.thumbnailUrl ?? photo.src,
          alt: localPortrait?.alt ?? media?.name ?? photo.alt,
          className: layoutClasses[index] ?? COLLAGE_LAYOUTS[0][index],
          rotation: photo.rotation + (index >= SITE_CONFIG.localPortraits.length ? ((index % 3) - 1) : 0)
        };
      }),
    [items, layoutClasses]
  );

  useEffect(() => {
    setLayoutClasses(randomizeCollageLayout(SITE_CONFIG.heroCollage.length));
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden pb-28 pt-10 md:pt-10" id="inicio">
      <div className="paper-surface absolute left-4 top-7 rotate-[-5deg] px-4 py-2 font-accent text-3xl text-[var(--sticker-ink)] shadow-[0_8px_18px_rgba(26,26,26,0.18)] md:left-10">
        {SITE_CONFIG.heroAccentWord}
      </div>
      <div className="section-shell relative grid min-h-[86svh] content-center gap-8 pt-16 lg:grid-cols-[0.82fr_1.18fr] lg:pt-0">
        <div className="relative z-20 flex flex-col justify-end lg:order-2">
          <h1 className="pointer-events-none max-w-full font-display text-[clamp(4.7rem,24vw,12rem)] uppercase leading-[0.78] tracking-normal text-text mix-blend-multiply md:text-[clamp(5.8rem,15vw,12rem)]">
            <span className="text-red">{heroName.slice(0, 2)}</span>
            {heroName.slice(2)}
          </h1>
          <p className="max-w-xl rotate-[-1deg] bg-surface px-4 py-3 font-ui text-sm font-bold uppercase tracking-[0.12em] text-text shadow-[0_10px_24px_rgba(26,26,26,0.10)] md:text-base">
            {SITE_CONFIG.tagline}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:flex md:flex-wrap md:items-center">
            <MagneticButton
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              variant="whatsapp"
              ariaLabel="Chamar Vitória no WhatsApp"
            >
              <WhatsAppIcon />
              WhatsApp
            </MagneticButton>
            <MagneticButton
              href={SITE_CONFIG.instagramUrl}
              target="_blank"
              rel="noreferrer"
              variant="solid"
              ariaLabel="Abrir Instagram da Vitória"
            >
              <InstagramIcon />
              Instagram
            </MagneticButton>
            <MagneticButton href="#portfolio">Abrir feed</MagneticButton>
          </div>
        </div>
        <div className="relative z-10 grid h-[58svh] max-h-[35rem] max-w-full grid-cols-8 grid-rows-9 gap-3 sm:h-[64svh] lg:order-1 lg:h-[78svh] lg:max-h-none lg:grid-rows-8">
          {collage.map((photo, index) => (
            <CollagePhoto
              key={`${photo.src}-${index}`}
              src={photo.src}
              alt={photo.alt}
              className={photo.className}
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
