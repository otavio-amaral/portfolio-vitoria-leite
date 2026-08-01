"use client";

import { useRef, useState, type JSX } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Testimonials(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  function goTo(index: number): void {
    const nextIndex = Math.min(Math.max(index, 0), TESTIMONIALS.length - 1);
    const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setActiveIndex(nextIndex);
    cardRefs.current[nextIndex]?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center"
    });
  }

  function updateActiveCard(): void {
    const track = trackRef.current;
    if (!track) return;
    const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      const distance = Math.abs(bounds.left + bounds.width / 2 - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    setActiveIndex(closestIndex);
  }

  return (
    <section className="overflow-hidden border-y border-border bg-highlight py-24 md:py-32" aria-labelledby="testimonials-title">
      <div className="section-shell">
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="editorial-label text-rose">Palavras de quem viveu</p>
            <h2 id="testimonials-title" className="mt-4 max-w-4xl font-display text-[clamp(4rem,8vw,7.5rem)] leading-[0.86] tracking-[-0.05em] text-plum">
              Relações que continuam na imagem.
            </h2>
          </div>
          <div className="hidden items-center gap-2 md:flex" role="group" aria-label="Controles dos depoimentos">
            <button type="button" className="grid h-12 w-12 place-items-center border border-plum text-plum transition-colors hover:bg-plum hover:text-surface focus-visible:sr-focus disabled:opacity-30" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Depoimento anterior">
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" className="grid h-12 w-12 place-items-center border border-plum text-plum transition-colors hover:bg-plum hover:text-surface focus-visible:sr-focus disabled:opacity-30" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === TESTIMONIALS.length - 1} aria-label="Próximo depoimento">
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div ref={trackRef} className="hide-scrollbar mt-14 flex snap-x snap-mandatory gap-8 overflow-x-auto" onScroll={updateActiveCard} aria-label="Depoimentos de clientes" role="group" tabIndex={0}>
          {TESTIMONIALS.map((testimonial, index) => (
            <article
              ref={(element) => { cardRefs.current[index] = element; }}
              className="min-w-[88vw] snap-center border-y border-border py-9 md:min-w-[44rem] lg:min-w-[52rem]"
              key={testimonial.author}
            >
              <p className="font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.05] tracking-[-0.035em] text-plum">“{testimonial.quote}”</p>
              <div className="mt-8 flex items-center gap-4">
                <span className="font-display text-4xl text-rose" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-sm font-bold text-plum">{testimonial.author}</p>
                  <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.15em] text-muted">{testimonial.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4 md:hidden">
          {TESTIMONIALS.map((testimonial, index) => (
            <button key={testimonial.author} type="button" aria-label={`Ir para depoimento ${index + 1}`} aria-current={activeIndex === index ? "true" : undefined} className={cn("min-h-11 border-b px-2 text-[0.62rem] font-bold tracking-[0.14em] focus-visible:sr-focus", activeIndex === index ? "border-blue text-blue" : "border-transparent text-muted")} onClick={() => goTo(index)}>
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
