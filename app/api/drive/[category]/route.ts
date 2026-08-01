import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/constants";
import { DriveAccessError, getDriveFiles, getDriveFilesFromAllowedFolder, getDriveFolders } from "@/lib/drive";
import { checkRateLimit } from "@/lib/rate-limit";
import type { Category } from "@/types/portfolio";

export const revalidate = 3600;

interface RouteContext {
  params: Promise<{
    category: string;
  }>;
}

function isCategory(value: string): value is Category {
  return CATEGORIES.some((category) => category.id === value);
}

export async function GET(request: Request, context: RouteContext): Promise<NextResponse> {
  const rateLimit = checkRateLimit(request, "drive-category", 60);

  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Muitas solicitações. Tente novamente em instantes." }, { status: 429, headers: rateLimit.headers });
  }

  const { category } = (await context.params);

  if (!isCategory(category)) {
    return NextResponse.json({ error: "Categoria inválida" }, { status: 400, headers: rateLimit.headers });
  }

  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view");
    const folderId = searchParams.get("folderId");
    const items =
      view === "folders"
        ? await getDriveFolders(category)
        : folderId
          ? await getDriveFilesFromAllowedFolder(category, folderId)
          : await getDriveFiles(category);

    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
        ...rateLimit.headers
      }
    });
  } catch (error) {
    if (error instanceof DriveAccessError) {
      return NextResponse.json({ error: error.message }, { status: 403, headers: rateLimit.headers });
    }

    console.error("Falha ao carregar o portfólio do Google Drive", error);
    return NextResponse.json({ error: "Não foi possível carregar o portfólio." }, { status: 502, headers: rateLimit.headers });
  }
}
