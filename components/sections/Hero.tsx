"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, WhatsappLogo } from "@phosphor-icons/react";
import type { JSX } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import { formatWhatsAppLink } from "@/lib/utils";

export function Hero(): JSX.Element {
  const whatsappUrl = `${formatWhatsAppLink(SITE_CONFIG.whatsapp)}?text=${encodeURIComponent(
    "Oi, Vitória! Vim pelo site e quero conversar sobre um projeto."
  )}`;

  return (
    <section className="relative mt-[4.5rem] overflow-hidden border-b border-border lg:mt-[5.75rem]" id="inicio">
      <div className="grid min-h-[calc(100svh-4.5rem)] lg:min-h-[36rem] lg:grid-cols-[53.5%_46.5%]">
        <div className="relative z-20 flex min-w-0 flex-col justify-center px-6 pb-12 pt-14 md:px-12 lg:px-[clamp(3rem,9.5vw,9.5rem)] lg:py-16">
          <motion.p
            className="editorial-label text-rose"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            Fotógrafa & diretora de imagem
          </motion.p>

          <motion.h1
            className="relative z-20 mt-8 whitespace-nowrap font-display text-[clamp(4.5rem,21vw,7rem)] font-normal leading-[0.78] tracking-[-0.075em] text-plum md:text-[clamp(7rem,20vw,10rem)] lg:mt-5 lg:text-[clamp(8rem,11.8vw,11.25rem)]"
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            VITÓRIA
          </motion.h1>

          <motion.div
            className="mt-7 max-w-lg md:mt-9 lg:mt-6"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
          >
            <p className="editorial-label text-plum">{SITE_CONFIG.tagline}</p>
            <div className="my-6 w-8 border-t border-rose lg:my-5" aria-hidden="true" />
            <p className="max-w-lg font-display text-[clamp(1.7rem,3vw,2.25rem)] leading-[1.12] tracking-[-0.025em] text-plum lg:text-[2rem]">
              Um olhar atento para histórias que merecem permanecer.
            </p>
            <div className="mt-9 flex flex-col items-start gap-6 sm:flex-row sm:items-center lg:mt-7">
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 w-full items-center justify-between bg-rose px-7 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-surface transition-colors hover:bg-red-dark focus-visible:sr-focus sm:w-[18.75rem]"
                aria-label="Contar seu projeto para Vitória no WhatsApp"
              >
                <span className="flex items-center gap-3">
                  <WhatsappLogo size={18} aria-hidden="true" />
                  Conte seu projeto
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="#portfolio" className="editorial-link focus-visible:sr-focus">
                Ver trabalhos
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="relative min-h-[58svh] overflow-hidden bg-highlight lg:min-h-0"
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/images/hero-editorial-v2.png"
            alt="Vitória Leite fotografando com uma câmera"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 47vw"
            className="object-cover object-center"
          />
          <div className="absolute bottom-7 right-7 max-w-[10rem] text-right font-display text-2xl italic leading-tight text-surface drop-shadow-[0_2px_12px_rgba(58,48,57,0.5)] md:bottom-10 md:right-10 md:text-3xl">
            eternizar & cuidar
          </div>
        </motion.div>
      </div>
    </section>
  );
}
