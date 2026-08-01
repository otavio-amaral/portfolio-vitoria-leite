export type Category = "fotografia" | "social_media" | "video" | "direcao" | "todos";

export type MediaType = "image" | "video";

export type PortfolioViewMode = "grid" | "feed";

export interface MediaItem {
  id: string;
  name: string;
  description?: string;
  altText?: string;
  videoUrl?: string;
  mediaType: MediaType;
  thumbnailUrl: string;
  fullUrl: string;
  category: Category;
  aspectRatio?: number;
}

export interface PortfolioFolder {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  itemCount: number;
  category: Category;
}

export interface PortfolioCategory {
  id: Category;
  label: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: "social" | "photo" | "video" | "direction";
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
}

export interface SocialReelItem {
  id: string;
  title: string;
  url: string;
  embedUrl: string;
}
