import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SITE_CONFIG } from "@/lib/constants";
import { formatWhatsAppLink } from "@/lib/utils";

export function Contact(): JSX.Element {
  const instagramDmUrl = "https://ig.me/m/viemfoco";
  const whatsappMessage = "Oi, Vitória! Vim pelo site e queria conversar sobre um ensaio, evento ou campanha.";
  const whatsappUrl = `${formatWhatsAppLink(SITE_CONFIG.whatsapp)}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="bg-bg py-24 md:py-32" id="contato">
      <div className="section-shell grid gap-14 lg:grid-cols-2">
        <div>
          <p className="font-ui text-xs font-black uppercase tracking-[0.22em] text-red">Contato</p>
          <h2 className="mt-5 font-display text-7xl uppercase leading-[0.86] text-text md:text-9xl">
            manda uma <span className="font-accent text-5xl normal-case text-red md:text-7xl">DM</span> de projeto
          </h2>
          <div className="mt-10 space-y-4 font-ui text-xs uppercase tracking-[0.22em]">
            <Link href={instagramDmUrl} target="_blank" rel="noreferrer" className="block text-text red-accent-line">
              {SITE_CONFIG.instagram}
            </Link>
            <p className="text-muted">{SITE_CONFIG.location}</p>
          </div>
          <div className="mt-10 flex flex-wrap gap-5 font-ui text-xs uppercase tracking-[0.2em] text-muted">
            {SITE_CONFIG.socialLinks.map((link) => (
              <Link key={link.label} href={link.href} className="red-accent-line hover:text-text" data-cursor="link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="paper-tape sticker paper-surface rotate-[1.5deg] p-8 md:p-10">
          <p className="font-ui text-xs font-black uppercase tracking-[0.22em] text-red">atalho para orçamento</p>
          <h3 className="mt-5 font-display text-6xl uppercase leading-none text-text md:text-8xl">
            quer registrar um <span className="font-accent text-5xl normal-case text-red md:text-7xl">momento?</span>
          </h3>
          <p className="mt-6 max-w-lg font-ui text-lg font-bold leading-relaxed text-muted">
            Conte se a ideia é um ensaio, evento ou campanha. A Vitória responde com caminhos possíveis, datas e próximos passos.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <MagneticButton
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              variant="whatsapp"
              ariaLabel="Chamar Vitória no WhatsApp"
            >
              Chamar no WhatsApp
            </MagneticButton>
            <MagneticButton
              href={instagramDmUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-transparent text-[var(--sticker-ink)]"
              ariaLabel="Abrir DM da Vitória no Instagram"
            >
              DM no Instagram
            </MagneticButton>
          </div>
          <p className="mt-6 font-ui text-xs font-bold uppercase tracking-[0.16em] text-muted">
            dica: escreva “vim pelo site” na primeira mensagem
          </p>
        </div>
      </div>
    </section>
  );
}
