"use client";

import { useEffect, useState } from "react";
import type { Category, MediaItem } from "@/types/portfolio";

interface DriveMediaState {
  items: MediaItem[];
  isLoading: boolean;
  error: string | null;
}

interface MediaRequestState extends DriveMediaState {
  key: string;
}

type MediaCache = Record<string, MediaItem[]>;
const mediaCache: MediaCache = {};

export function useDriveMedia(category: Category, folderId?: string, enabled = true): DriveMediaState {
  const key = folderId ? `${category}:${folderId}` : category;
  const [request, setRequest] = useState<MediaRequestState>({
    key,
    items: mediaCache[key] ?? [],
    isLoading: enabled && !mediaCache[key],
    error: null
  });

  useEffect(() => {
    const controller = new AbortController();

    if (!enabled || mediaCache[key]) return () => controller.abort();

    async function loadMedia(): Promise<void> {
      try {
        const params = folderId ? `?folderId=${encodeURIComponent(folderId)}` : "";
        const response = await fetch(`/api/drive/${category}${params}`, { signal: controller.signal });

        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          throw new Error(data.error ?? "Não foi possível carregar as mídias.");
        }

        const items = (await response.json()) as MediaItem[];
        mediaCache[key] = items;
        setRequest({ key, items, isLoading: false, error: null });
      } catch (error) {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : "Erro ao carregar portfólio.";
        setRequest({ key, items: [], isLoading: false, error: message });
      }
    }

    void loadMedia();
    return () => controller.abort();
  }, [category, enabled, folderId, key]);

  if (!enabled) return { items: [], isLoading: false, error: null };
  if (request.key === key) return request;

  const cachedItems = mediaCache[key];
  return { items: cachedItems ?? [], isLoading: !cachedItems, error: null };
}
