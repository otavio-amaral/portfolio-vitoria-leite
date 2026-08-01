import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatWhatsAppLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function getEmbeddableVideoUrl(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    const isYoutube =
      ["youtube.com", "www.youtube.com", "www.youtube-nocookie.com"].includes(url.hostname) &&
      url.pathname.startsWith("/embed/");
    const isVimeo = url.hostname === "player.vimeo.com" && url.pathname.startsWith("/video/");

    return url.protocol === "https:" && (isYoutube || isVimeo) ? url.toString() : null;
  } catch {
    return null;
  }
}

export function isEmbeddableVideoUrl(value: string | undefined): boolean {
  return getEmbeddableVideoUrl(value) !== null;
}
