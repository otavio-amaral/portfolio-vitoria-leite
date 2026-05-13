import { NextResponse } from "next/server";
import { getClickCounts, incrementClick, type ClickTargetType } from "@/lib/album-clicks";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function sanitizeAlbumId(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return /^[a-zA-Z0-9_-]+$/.test(trimmed) ? trimmed : null;
}

function sanitizeTargetType(value: string | null): ClickTargetType {
  return value === "photo" ? "photo" : "album";
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const targetType = sanitizeTargetType(searchParams.get("type"));
  const ids = searchParams
    .get("ids")
    ?.split(",")
    .map((id) => sanitizeAlbumId(id))
    .filter((id): id is string => Boolean(id));

  if (!ids?.length) {
    return NextResponse.json({ counts: {} });
  }

  try {
    const counts = await getClickCounts(targetType, ids);
    return NextResponse.json(
      { counts },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { albumId?: string };
    const targetType = sanitizeTargetType("type" in body ? String((body as { type?: string }).type) : null);
    const albumId = sanitizeAlbumId(body.albumId ?? (body as { targetId?: string }).targetId ?? null);

    if (!albumId) {
      return NextResponse.json({ error: "Álbum inválido." }, { status: 400 });
    }

    const count = await incrementClick(targetType, albumId);
    return NextResponse.json(
      { albumId, count },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
