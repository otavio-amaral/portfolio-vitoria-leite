import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Portfolio } from "@/components/sections/Portfolio";
import { Reel } from "@/components/sections/Reel";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { SITE_CONFIG } from "@/lib/constants";

import type { JSX } from "react";

export default function Home(): JSX.Element {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_CONFIG.fullName,
    url: SITE_CONFIG.url,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.portraitUrl}`,
    description: SITE_CONFIG.about,
    email: SITE_CONFIG.email,
    telephone: SITE_CONFIG.whatsapp,
    address: {
      "@type": "PostalAddress",
      addressLocality: "São Paulo",
      addressCountry: "BR"
    },
    sameAs: [SITE_CONFIG.instagramUrl],
    founder: {
      "@type": "Person",
      name: SITE_CONFIG.fullName,
      jobTitle: SITE_CONFIG.heroRoles.join(", ")
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <main id="main-content">
        <Hero />
        <Portfolio />
        <About />
        <Reel />
        <Services />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}
