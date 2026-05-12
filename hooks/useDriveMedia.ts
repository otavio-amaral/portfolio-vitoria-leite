"use client";

import { useEffect, useRef, useState } from "react";
import type { Category, MediaItem } from "@/types/portfolio";

interface DriveMediaState {
  items: MediaItem[];
  isLoading: boolean;
  error: string | null;
}

type MediaCache = Record<string, MediaItem[]>;

export function useDriveMedia(category: Category, folderId?: string, enabled = true): DriveMediaState {
  const cache = useRef<MediaCache>({});
  const [state, setState] = useState<DriveMediaState>({
    items: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    if (!enabled) {
      setState({ items: [], isLoading: false, error: null });
      return () => {
        isMounted = false;
      };
    }

    const cacheKey = folderId ? `${category}:${folderId}` : category;
    const cachedItems = cache.current[cacheKey];

    if (cachedItems) {
      setState({ items: cachedItems, isLoading: false, error: null });
      return () => {
        isMounted = false;
      };
    }

    setState((current) => ({ ...current, isLoading: true, error: null }));

    async function loadMedia(): Promise<void> {
      try {
        const params = folderId ? `?folderId=${encodeURIComponent(folderId)}` : "";
        const response = await fetch(`/api/drive/${category}${params}`);

        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          throw new Error(data.error ?? "Não foi possível carregar as mídias.");
        }

        const items = (await response.json()) as MediaItem[];
        cache.current[cacheKey] = items;

        if (isMounted) {
          setState({ items, isLoading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          const message = error instanceof Error ? error.message : "Erro ao carregar portfólio.";
          setState({ items: [], isLoading: false, error: message });
        }
      }
    }

    void loadMedia();

    return () => {
      isMounted = false;
    };
  }, [category, enabled, folderId]);

  return state;
}
