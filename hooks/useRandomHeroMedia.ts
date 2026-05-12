"use client";

import { useEffect, useState } from "react";
import type { MediaItem } from "@/types/portfolio";

interface RandomHeroMediaState {
  items: MediaItem[];
  isLoading: boolean;
}

export function useRandomHeroMedia(limit: number): RandomHeroMediaState {
  const [state, setState] = useState<RandomHeroMediaState>({
    items: [],
    isLoading: true
  });

  useEffect(() => {
    let isMounted = true;

    async function loadMedia(): Promise<void> {
      try {
        const response = await fetch(`/api/drive/random?limit=${limit}`, {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Não foi possível carregar fotos aleatórias.");
        }

        const items = (await response.json()) as MediaItem[];

        if (isMounted) {
          setState({ items, isLoading: false });
        }
      } catch {
        if (isMounted) {
          setState({ items: [], isLoading: false });
        }
      }
    }

    void loadMedia();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return state;
}
