"use client";

import { useEffect, useState } from "react";
import type { Category, PortfolioFolder } from "@/types/portfolio";

interface DriveFoldersState {
  folders: PortfolioFolder[];
  isLoading: boolean;
  error: string | null;
}

interface FolderRequestState extends DriveFoldersState {
  category: Category;
}

type FolderCache = Partial<Record<Category, PortfolioFolder[]>>;
const folderCache: FolderCache = {};

export function useDriveFolders(category: Category): DriveFoldersState {
  const [request, setRequest] = useState<FolderRequestState>({
    category,
    folders: folderCache[category] ?? [],
    isLoading: !folderCache[category],
    error: null
  });

  useEffect(() => {
    const controller = new AbortController();

    if (folderCache[category]) return () => controller.abort();

    async function loadFolders(): Promise<void> {
      try {
        const response = await fetch(`/api/drive/${category}?view=folders`, { signal: controller.signal });

        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          throw new Error(data.error ?? "Não foi possível carregar os ensaios.");
        }

        const folders = (await response.json()) as PortfolioFolder[];
        folderCache[category] = folders;
        setRequest({ category, folders, isLoading: false, error: null });
      } catch (error) {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : "Erro ao carregar ensaios.";
        setRequest({ category, folders: [], isLoading: false, error: message });
      }
    }

    void loadFolders();
    return () => controller.abort();
  }, [category]);

  if (request.category === category) return request;

  const cachedFolders = folderCache[category];
  return { folders: cachedFolders ?? [], isLoading: !cachedFolders, error: null };
}
