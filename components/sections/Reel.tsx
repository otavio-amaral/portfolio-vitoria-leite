import { SocialReelsGrid } from "@/components/portfolio/SocialReelsGrid";

export function Reel(): JSX.Element {
  return (
    <section className="relative overflow-hidden bg-[#151312] py-24 text-white md:py-32" id="showreel">
      <h2 className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 font-display text-[18vw] uppercase leading-none text-[rgba(255,39,66,0.18)]">
        Reels
      </h2>
      <div className="section-shell relative z-10">
        <div className="mb-12 rotate-[-1.5deg] drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]">
          <p className="font-ui text-xs font-black uppercase tracking-[0.22em] text-red">Social Media</p>
          <h2 className="font-display text-7xl uppercase leading-none text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.5)] md:text-9xl">
            A Sala <span className="font-accent text-5xl normal-case text-red md:text-7xl">Secreta</span>
          </h2>
          <p className="mt-4 max-w-2xl font-ui text-sm font-bold uppercase tracking-[0.12em] text-white/70">
            Reels com direção, ritmo e estética assinados por Vitória Leite.
          </p>
        </div>
        <SocialReelsGrid randomize variant="horizontal" />
      </div>
    </section>
  );
}
