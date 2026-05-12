import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/constants";
import { getDriveFiles, getDriveFilesFromFolder, getDriveFolders } from "@/lib/drive";
import type { Category } from "@/types/portfolio";

export const revalidate = 3600;

interface RouteContext {
  params: {
    category: string;
  };
}

function isCategory(value: string): value is Category {
  return CATEGORIES.some((category) => category.id === value);
}

export async function GET(request: Request, context: RouteContext): Promise<NextResponse> {
  const { category } = context.params;

  if (!isCategory(category)) {
    return NextResponse.json({ error: "Categoria inválida" }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view");
    const folderId = searchParams.get("folderId");
    const items =
      view === "folders"
        ? await getDriveFolders(category)
        : folderId
          ? await getDriveFilesFromFolder(category, folderId)
          : await getDriveFiles(category);

    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
