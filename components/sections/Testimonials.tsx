"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Testimonials(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="overflow-hidden bg-rose-100/40 py-24 md:py-32">
      <div className="section-shell">
        <div className="rotate-[-1.5deg]">
          <p className="font-ui text-xs font-black uppercase tracking-[0.22em] text-red">DMs recebidas</p>
          <h2 className="font-display text-7xl uppercase leading-none text-text md:text-9xl">
            printou <span className="font-accent text-5xl normal-case text-red md:text-7xl">porque</span> era bom
          </h2>
        </div>
        <motion.div
          className="mt-12 flex cursor-grab gap-5 active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -560, right: 0 }}
          onDragEnd={(_event, info) => {
            if (info.offset.x < -80) {
              setActiveIndex((current) => Math.min(current + 1, TESTIMONIALS.length - 1));
            }
            if (info.offset.x > 80) {
              setActiveIndex((current) => Math.max(current - 1, 0));
            }
          }}
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <article
              className={cn(
                "relative min-w-[82vw] rounded-[2rem] border border-border bg-surface p-5 shadow-[0_16px_34px_rgba(26,26,26,0.12)] md:min-w-[28rem]",
                index % 2 === 0 ? "rotate-[-1.5deg]" : "rotate-[1.2deg]"
              )}
              key={testimonial.author}
            >
              <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-red font-display text-2xl text-white">
                  {testimonial.author.slice(0, 1)}
                </span>
                <div>
                  <p className="font-ui text-sm font-extrabold text-text">{testimonial.author}</p>
                  <p className="font-ui text-xs text-muted">{testimonial.role}</p>
                </div>
              </div>
              <div className="ml-auto max-w-[88%] rounded-[1.4rem] rounded-br-sm bg-highlight px-5 py-4">
                <p className="font-ui text-lg font-bold leading-snug text-text">{testimonial.quote}</p>
              </div>
              <p className="mt-4 text-right font-ui text-xs font-bold text-muted">visualizada agora</p>
            </article>
          ))}
        </motion.div>
        <div className="mt-8 flex gap-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <button
              key={testimonial.author}
              type="button"
              aria-label={`Ir para depoimento ${index + 1}`}
              className={cn("h-2.5 w-8 rounded-full transition-colors", activeIndex === index ? "bg-red" : "bg-muted/30")}
              onClick={() => setActiveIndex(index)}
              data-cursor="link"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
