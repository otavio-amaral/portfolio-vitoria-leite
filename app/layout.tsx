import type { JSX, ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const title = `${SITE_CONFIG.fullName} | Fotografia, vídeo e social media`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: title,
    template: `%s | ${SITE_CONFIG.fullName}`
  },
  description: SITE_CONFIG.tagline,
  applicationName: SITE_CONFIG.fullName,
  authors: [{ name: SITE_CONFIG.fullName, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.fullName,
  alternates: { canonical: "/" },
  keywords: ["fotografia", "videomaker", "social media", "direção de fotografia", "São Paulo"],
  icons: {
    icon: [{ url: SITE_CONFIG.logoUrl, type: "image/webp" }],
    apple: [{ url: SITE_CONFIG.logoUrl, type: "image/webp" }]
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title,
    description: SITE_CONFIG.tagline,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.fullName,
    locale: "pt_BR",
    type: "website",
    images: [{ url: SITE_CONFIG.portraitUrl, width: 1200, height: 1200, alt: SITE_CONFIG.fullName }]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: SITE_CONFIG.tagline,
    images: [SITE_CONFIG.portraitUrl]
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: "#f6f2ec"
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`} data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
        <MotionProvider>
          <Navbar />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </MotionProvider>
        {process.env.VERCEL === "1" ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
