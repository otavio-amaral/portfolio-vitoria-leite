import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_CONFIG.fullName} — Portfólio`,
    short_name: SITE_CONFIG.fullName,
    description: SITE_CONFIG.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f7",
    theme_color: "#e8142b",
    icons: [{ src: SITE_CONFIG.logoUrl, sizes: "192x192", type: "image/webp" }]
  };
}
