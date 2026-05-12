"use client";

import { motion } from "framer-motion";
import { SERVICES } from "@/lib/constants";
import type { ServiceItem } from "@/types/portfolio";

interface ServiceIconProps {
  icon: ServiceItem["icon"];
}

function ServiceIcon({ icon }: ServiceIconProps): JSX.Element {
  const paths: Record<ServiceItem["icon"], string> = {
    social: "M7 17h10M7 12h14M7 7h10M5 3h18v18H5z",
    photo: "M4 8h4l2-3h4l2 3h4v12H4z M12 11a4 4 0 100 8 4 4 0 000-8z",
    video: "M4 6h13v12H4z M17 10l5-3v10l-5-3z",
    direction: "M12 3v18M3 12h18M6 6l12 12M18 6L6 18"
  };

  return (
    <svg viewBox="0 0 24 24" className="h-12 w-12 text-red" fill="none" role="img" aria-label={icon}>
      <motion.path
        d={paths[icon]}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0.2 }}
        whileHover={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
    </svg>
  );
}

export function Services(): JSX.Element {
  return (
    <section className="bg-bg py-24 md:py-32" id="servicos">
      <div className="section-shell">
        <p className="font-ui text-xs font-black uppercase tracking-[0.22em] text-red">Serviços</p>
        <h2 className="mt-4 font-display text-7xl uppercase leading-none text-text md:text-9xl">
          formatos que <span className="font-accent text-5xl normal-case text-red md:text-7xl">circulam</span>
        </h2>
        <div className="mt-14 flex gap-5 overflow-x-auto pb-8 md:grid md:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service) => (
            <motion.article
              key={service.title}
              className="group paper-tape relative min-h-[20rem] min-w-[78vw] border border-border bg-surface p-7 shadow-[0_14px_32px_rgba(26,26,26,0.10)] md:min-w-0"
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <ServiceIcon icon={service.icon} />
              <h3 className="mt-12 font-display text-3xl font-light leading-tight text-text">{service.title}</h3>
              <p className="mt-5 font-body text-lg leading-relaxed text-muted">{service.description}</p>
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-red transition-transform duration-300 group-hover:scale-x-100" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
