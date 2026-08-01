import { SocialReelsGrid } from "@/components/portfolio/SocialReelsGrid";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SITE_CONFIG } from "@/lib/constants";
import type { JSX } from "react";

export function Reel(): JSX.Element {
  return (
    <section className="scroll-mt-24 overflow-hidden bg-plum py-24 text-surface md:py-32" id="showreel">
      <div className="section-shell">
        <div className="grid gap-8 border-b border-surface/20 pb-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <div>
            <p className="editorial-label text-rose">Filme & movimento</p>
            <h2 className="mt-4 font-display text-[clamp(4.5rem,10vw,9rem)] leading-[0.82] tracking-[-0.055em] text-surface">
              Histórias em movimento.
            </h2>
          </div>
          <p className="max-w-lg text-base leading-8 text-surface/65 lg:justify-self-end">
            Reels e filmes curtos com direção, ritmo e uma estética que continua reconhecível mesmo quando tudo se move.
          </p>
        </div>

        <div className="mt-10">
          <SocialReelsGrid limit={3} variant="horizontal" />
        </div>

        <div className="mt-6 flex justify-end">
          <MagneticButton href={SITE_CONFIG.instagramUrl} target="_blank" rel="noreferrer" variant="solid">
            Ver mais no Instagram
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
