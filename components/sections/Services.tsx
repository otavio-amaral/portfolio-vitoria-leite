"use client";

import { motion } from "framer-motion";
import { Aperture, Camera, ShareNetwork, VideoCamera } from "@phosphor-icons/react";
import { SERVICES } from "@/lib/constants";
import type { ServiceItem } from "@/types/portfolio";
import type { JSX } from "react";

interface ServiceIconProps {
  icon: ServiceItem["icon"];
}

function ServiceIcon({ icon }: ServiceIconProps): JSX.Element {
  const props = { size: 30, weight: "light" as const, "aria-hidden": true };
  if (icon === "social") return <ShareNetwork {...props} />;
  if (icon === "photo") return <Camera {...props} />;
  if (icon === "video") return <VideoCamera {...props} />;
  return <Aperture {...props} />;
}

export function Services(): JSX.Element {
  return (
    <section className="scroll-mt-24 bg-bg py-24 md:py-32" id="servicos">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
          <div>
            <p className="editorial-label text-rose">Serviços</p>
            <p className="mt-6 max-w-sm text-base leading-8 text-muted">
              Da estratégia à captação, cada entrega nasce com uma direção visual coerente e feita para circular.
            </p>
          </div>
          <h2 className="font-display text-[clamp(4.5rem,9vw,8.5rem)] leading-[0.84] tracking-[-0.055em] text-plum">
            Formatos que encontram pessoas.
          </h2>
        </div>

        <div className="mt-16 border-t border-border">
          {SERVICES.map((service, index) => (
            <motion.article
              key={service.title}
              className="group grid gap-5 border-b border-border py-8 md:grid-cols-[4rem_1fr_1fr_3rem] md:items-center md:gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <span className="text-rose transition-colors group-hover:text-blue"><ServiceIcon icon={service.icon} /></span>
              <h3 className="font-display text-[clamp(2.3rem,5vw,4.5rem)] leading-[0.92] tracking-[-0.04em] text-plum">{service.title}</h3>
              <p className="max-w-xl text-sm leading-7 text-muted md:text-base">{service.description}</p>
              <span className="font-display text-3xl text-rose md:text-right" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
