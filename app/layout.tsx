import type { Metadata } from "next";
import { Bebas_Neue, Dancing_Script, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

const display = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display"
});

const accent = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-accent"
});

const body = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.fullName} | Portfólio`,
  description: SITE_CONFIG.tagline,
  metadataBase: new URL("https://vitorialeite.com"),
  openGraph: {
    title: `${SITE_CONFIG.fullName} | Portfólio`,
    description: SITE_CONFIG.tagline,
    type: "website"
  }
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="pt-BR" className={`${display.variable} ${accent.variable} ${body.variable}`}>
      <body>
        <ScrollProgress />
        <GrainOverlay />
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
