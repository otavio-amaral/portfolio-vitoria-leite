import Link from "next/link";
import { CONTACT_FIELDS, SITE_CONFIG } from "@/lib/constants";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { formatWhatsAppLink } from "@/lib/utils";

export function Contact(): JSX.Element {
  return (
    <section className="bg-bg py-24 md:py-32" id="contato">
      <div className="section-shell grid gap-14 lg:grid-cols-2">
        <div>
          <p className="font-ui text-xs font-black uppercase tracking-[0.22em] text-red">Contato</p>
          <h2 className="mt-5 font-display text-7xl uppercase leading-[0.86] text-text md:text-9xl">
            manda uma <span className="font-accent text-5xl normal-case text-red md:text-7xl">DM</span> de projeto
          </h2>
          <div className="mt-10 space-y-4 font-ui text-xs uppercase tracking-[0.22em]">
            <Link href={`mailto:${SITE_CONFIG.email}`} className="block text-text red-accent-line" data-cursor="link">
              {SITE_CONFIG.email}
            </Link>
            <Link href={formatWhatsAppLink(SITE_CONFIG.whatsapp)} className="block text-muted hover:text-text red-accent-line" data-cursor="link">
              {SITE_CONFIG.whatsapp}
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
        <form className="space-y-8" action={`mailto:${SITE_CONFIG.email}`}>
          {CONTACT_FIELDS.map((field) => (
            <label className="group relative block pt-5" key={field.id}>
              <input
                name={field.id}
                type={field.type}
                autoComplete={field.autoComplete}
                required
                placeholder=" "
                className="peer w-full border-0 border-b border-border bg-transparent px-0 pb-3 pt-4 font-ui text-sm uppercase tracking-[0.16em] text-text outline-none transition-colors focus:border-red"
              />
              <span className="absolute left-0 top-0 font-ui text-[0.65rem] uppercase tracking-[0.22em] text-muted transition-all peer-placeholder-shown:top-8 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[0.65rem] peer-focus:text-red">
                {field.label}
              </span>
            </label>
          ))}
          <label className="group relative block pt-5">
            <textarea
              name="message"
              required
              rows={5}
              placeholder=" "
              className="peer w-full resize-none border-0 border-b border-border bg-transparent px-0 pb-3 pt-4 font-ui text-sm uppercase tracking-[0.16em] text-text outline-none transition-colors focus:border-red"
            />
            <span className="absolute left-0 top-0 font-ui text-[0.65rem] uppercase tracking-[0.22em] text-muted transition-all peer-placeholder-shown:top-8 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[0.65rem] peer-focus:text-red">
              {SITE_CONFIG.messageFieldLabel}
            </span>
          </label>
          <MagneticButton type="submit">Enviar mensagem</MagneticButton>
        </form>
      </div>
    </section>
  );
}
