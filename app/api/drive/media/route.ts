import { NextResponse } from "next/server";
import { DriveAccessError, getDriveMediaById } from "@/lib/drive";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function sanitizeFileId(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return /^[a-zA-Z0-9_-]+$/.test(trimmed) ? trimmed : null;
}

export async function GET(request: Request): Promise<NextResponse> {
  const rateLimit = checkRateLimit(request, "drive-media", 60);

  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Muitas solicitações. Tente novamente em instantes." }, { status: 429, headers: rateLimit.headers });
  }

  const { searchParams } = new URL(request.url);
  const id = sanitizeFileId(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "Mídia inválida." }, { status: 400, headers: rateLimit.headers });
  }

  try {
    const item = await getDriveMediaById(id);
    return NextResponse.json(item, {
      headers: {
        "Cache-Control": "private, max-age=300",
        ...rateLimit.headers
      }
    });
  } catch (error) {
    if (error instanceof DriveAccessError) {
      return NextResponse.json({ error: "Mídia não encontrada." }, { status: 404, headers: rateLimit.headers });
    }

    console.error("Falha ao carregar mídia compartilhada", error);
    return NextResponse.json({ error: "Não foi possível carregar a mídia." }, { status: 502, headers: rateLimit.headers });
  }
}
