"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import { useDriveFolders } from "@/hooks/useDriveFolders";
import { useIntersection } from "@/hooks/useIntersection";
import { ParallaxWrapper } from "@/components/ui/ParallaxWrapper";

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
}

function Counter({ value, prefix = "", suffix = "" }: CounterProps): JSX.Element {
  const [ref, inView] = useIntersection<HTMLSpanElement>({ threshold: 0.6, freezeOnceVisible: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 18 });
  const rounded = useTransform(spring, (latest) => `${prefix}${Math.round(latest)}${suffix}`);

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, motionValue, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function About(): JSX.Element {
  const { folders, isLoading: isLoadingFolders, error: foldersError } = useDriveFolders("todos");

  return (
    <section className="bg-bg py-24 md:py-32" id="sobre">
      <div className="section-shell grid gap-14 lg:grid-cols-[1.25fr_0.75fr]">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="font-ui text-xs font-black uppercase tracking-[0.22em] text-red">Sobre</p>
          <p className="mt-8 max-w-3xl font-display text-6xl uppercase leading-[0.9] text-text md:text-8xl">
            um pouco sobre meu olhar
          </p>
          <p className="mt-8 max-w-2xl font-ui text-xl font-medium leading-relaxed text-muted">{SITE_CONFIG.about}</p>
          <blockquote className="mt-8 w-fit rotate-[-2deg] bg-highlight px-5 py-4 font-accent text-3xl leading-tight text-text md:text-5xl">
            {SITE_CONFIG.quote}
          </blockquote>
        </motion.div>
        <ParallaxWrapper className="space-y-8" offset={42}>
          <div className="paper-tape sticker relative aspect-[4/5] rotate-[2deg] overflow-hidden bg-surface">
            <Image
              src={SITE_CONFIG.portraitUrl}
              alt={SITE_CONFIG.fullName}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover saturate-[1.08]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SITE_CONFIG.stats.map((stat) => {
              const isFeaturedProjects = stat.label === "projetos destacados";
              const value = isFeaturedProjects && !isLoadingFolders && !foldersError ? folders.length : stat.value;
              const prefix = isFeaturedProjects ? "+" : "";
              const suffix = "suffix" in stat ? stat.suffix : "";

              return (
                <div className="rotate-[-1deg] border border-border bg-surface p-5 shadow-[0_10px_24px_rgba(26,26,26,0.08)] even:rotate-[1.5deg]" key={stat.label}>
                  <p className="font-display text-6xl text-red">
                    <Counter value={value} prefix={prefix} suffix={suffix} />
                  </p>
                  <p className="mt-2 font-ui text-[0.65rem] uppercase tracking-[0.2em] text-muted">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </ParallaxWrapper>
      </div>
    </section>
  );
}
