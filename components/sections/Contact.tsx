import Link from "next/link";
import { EnvelopeSimple, InstagramLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SITE_CONFIG } from "@/lib/constants";
import { formatWhatsAppLink } from "@/lib/utils";
import type { JSX } from "react";

export function Contact(): JSX.Element {
  const instagramDmUrl = "https://ig.me/m/viemfoco";
  const whatsappUrl = `${formatWhatsAppLink(SITE_CONFIG.whatsapp)}?text=${encodeURIComponent(
    "Oi, Vitória! Vim pelo site e quero conversar sobre um projeto."
  )}`;

  return (
    <section className="scroll-mt-24 bg-plum py-24 text-surface md:py-32" id="contato">
      <div className="section-shell">
        <p className="editorial-label text-rose">Contato · agenda aberta</p>
        <div className="mt-6 grid gap-14 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <h2 className="font-display text-[clamp(5rem,11.5vw,11rem)] leading-[0.78] tracking-[-0.065em] text-surface">
              Vamos criar algo que permaneça.
            </h2>
          </div>
          <div className="border-t border-surface/25 pt-8">
            <p className="max-w-md text-base leading-8 text-surface/68">
              Conte o objetivo, o formato e o prazo. Vitória responde com um caminho claro para transformar a ideia em fotografia, filme ou conteúdo.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <MagneticButton href={whatsappUrl} target="_blank" rel="noreferrer" variant="solid" ariaLabel="Conversar com Vitória no WhatsApp" className="w-full justify-between">
                <WhatsappLogo size={19} aria-hidden="true" />
                Chamar no WhatsApp
              </MagneticButton>
              <Link href={instagramDmUrl} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-between border border-surface/35 px-7 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-surface transition-colors hover:border-rose hover:text-rose focus-visible:sr-focus">
                <span className="flex items-center gap-3"><InstagramLogo size={19} aria-hidden="true" /> Instagram</span>
                {SITE_CONFIG.instagram}
              </Link>
              <Link href={`mailto:${SITE_CONFIG.email}`} className="flex min-h-14 items-center justify-between border border-surface/35 px-7 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-surface transition-colors hover:border-rose hover:text-rose focus-visible:sr-focus">
                <span className="flex items-center gap-3"><EnvelopeSimple size={19} aria-hidden="true" /> E-mail</span>
                <span className="hidden sm:inline">{SITE_CONFIG.email}</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-surface/20 pt-6 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-surface/55 md:flex-row md:items-center md:justify-between">
          <p>{SITE_CONFIG.location}</p>
          <p>Fotografia · Filme · Conteúdo</p>
        </div>
      </div>
    </section>
  );
}
