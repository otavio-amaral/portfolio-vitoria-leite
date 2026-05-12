import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatWhatsAppLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function isEmbeddableVideoUrl(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  return value.includes("youtube.com/embed") || value.includes("player.vimeo.com/video");
}
