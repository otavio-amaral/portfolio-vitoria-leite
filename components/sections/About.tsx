"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, type JSX } from "react";
import { useIntersection } from "@/hooks/useIntersection";
import { SITE_CONFIG } from "@/lib/constants";

interface CounterProps {
  value: number;
  suffix?: string;
}

function Counter({ value, suffix = "" }: CounterProps): JSX.Element {
  const [ref, inView] = useIntersection<HTMLSpanElement>({ threshold: 0.6, freezeOnceVisible: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 18 });
  const rounded = useTransform(spring, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function About(): JSX.Element {
  return (
    <section className="scroll-mt-24 border-y border-border bg-highlight py-24 md:py-32" id="sobre">
      <div className="section-shell grid items-start gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <motion.div
          className="relative mx-auto w-full max-w-[29rem] lg:mx-0"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-surface">
            <Image
              src="/images/vitoria-pb.jpeg"
              alt="Retrato em preto e branco de Vitória Leite com uma câmera"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <p className="mt-4 editorial-label text-muted">São Paulo · Brasil</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="editorial-label text-rose">Sobre Vitória</p>
          <h2 className="mt-6 max-w-4xl font-display text-[clamp(3.9rem,8vw,7.5rem)] leading-[0.88] tracking-[-0.055em] text-plum">
            Direção antes do clique. Presença depois dele.
          </h2>
          <div className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
            <p className="font-display text-2xl leading-[1.3] text-plum md:text-3xl">
              “{SITE_CONFIG.quote}”
            </p>
            <p className="text-base leading-8 text-muted">{SITE_CONFIG.about}</p>
          </div>

          <div className="mt-14 grid grid-cols-2 border-y border-border md:grid-cols-4">
            {SITE_CONFIG.stats.map((stat) => (
              <div className="border-border px-3 py-6 first:pl-0 even:border-l md:border-l md:first:border-l-0" key={stat.label}>
                <p className="font-display text-5xl leading-none text-plum">
                  <Counter value={stat.value} suffix={"suffix" in stat ? stat.suffix : ""} />
                </p>
                <p className="mt-3 text-[0.6rem] font-bold uppercase leading-relaxed tracking-[0.16em] text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
