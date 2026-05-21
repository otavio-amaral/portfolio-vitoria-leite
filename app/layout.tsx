import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Bebas_Neue, Dancing_Script, Outfit } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
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
  title: `${SITE_CONFIG.fullName} | Fotografia e Video Maker`,
  description:
    "Portfólio de Vitória Leite, fotógrafa e videomaker focada em ensaios, detalhes espontâneos, imagens documentais e conteúdo visual com sensibilidade.",
  metadataBase: new URL("https://portfolio-vitoria-leite.vercel.app"),
  keywords: ["Vitória Leite", "fotógrafa", "videomaker", "ensaios fotográficos", "fotografia documental", "portfolio fotografia"],
  openGraph: {
    title: `${SITE_CONFIG.fullName} | Fotografia e Video Maker`,
    description: "Ensaios, campanhas e registros documentais com verdade, leveza e sensibilidade.",
    type: "website",
    url: "https://portfolio-vitoria-leite.vercel.app",
    images: [
      {
        url: SITE_CONFIG.mainPortraitUrl,
        width: 1200,
        height: 1600,
        alt: SITE_CONFIG.fullName
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.fullName} | Fotografia e Video Maker`,
    description: "Ensaios, campanhas e registros documentais com verdade, leveza e sensibilidade.",
    images: [SITE_CONFIG.mainPortraitUrl]
  }
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="pt-BR" className={`${display.variable} ${accent.variable} ${body.variable}`} suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var p=localStorage.getItem('vitoria-theme');var t=(p==='dark'||p==='light')?p:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){}"
          }}
        />
        <ScrollProgress />
        <GrainOverlay />
        <ThemeToggle />
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
