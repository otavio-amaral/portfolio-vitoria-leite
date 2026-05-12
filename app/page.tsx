import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Portfolio } from "@/components/sections/Portfolio";
import { Reel } from "@/components/sections/Reel";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { SectionTransition } from "@/components/ui/SectionTransition";

export default function Home(): JSX.Element {
  return (
    <main>
      <Hero />
      <About />
      <SectionTransition />
      <Portfolio />
      <Reel />
      <Services />
      <SectionTransition flip />
      <Testimonials />
      <Contact />
    </main>
  );
}
