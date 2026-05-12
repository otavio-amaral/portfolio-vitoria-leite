"use client";

import { useEffect, useRef, useState } from "react";
import type { Category, PortfolioFolder } from "@/types/portfolio";

interface DriveFoldersState {
  folders: PortfolioFolder[];
  isLoading: boolean;
  error: string | null;
}

type FolderCache = Partial<Record<Category, PortfolioFolder[]>>;

export function useDriveFolders(category: Category): DriveFoldersState {
  const cache = useRef<FolderCache>({});
  const [state, setState] = useState<DriveFoldersState>({
    folders: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;
    const cachedFolders = cache.current[category];

    if (cachedFolders) {
      setState({ folders: cachedFolders, isLoading: false, error: null });
      return () => {
        isMounted = false;
      };
    }

    setState((current) => ({ ...current, isLoading: true, error: null }));

    async function loadFolders(): Promise<void> {
      try {
        const response = await fetch(`/api/drive/${category}?view=folders`);

        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          throw new Error(data.error ?? "Não foi possível carregar os ensaios.");
        }

        const folders = (await response.json()) as PortfolioFolder[];
        cache.current[category] = folders;

        if (isMounted) {
          setState({ folders, isLoading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          const message = error instanceof Error ? error.message : "Erro ao carregar ensaios.";
          setState({ folders: [], isLoading: false, error: message });
        }
      }
    }

    void loadFolders();

    return () => {
      isMounted = false;
    };
  }, [category]);

  return state;
}
