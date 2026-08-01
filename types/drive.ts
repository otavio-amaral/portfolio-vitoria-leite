import type { MediaItem } from "@/types/portfolio";

export interface DriveFile {
  id: string;
  name: string;
  description?: string;
  mimeType: string;
  parents?: string[];
  createdTime?: string;
  thumbnailLink?: string;
  imageMediaMetadata?: {
    width?: number;
    height?: number;
  };
}

export interface DriveApiResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

export interface DriveMetadataResponse {
  id: string;
  name: string;
  description?: string;
  mimeType: string;
}

export interface DriveFolder {
  category: MediaItem["category"];
  folderId: string;
}
