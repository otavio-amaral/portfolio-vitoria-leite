import { NextResponse } from "next/server";
import { getDriveMediaById } from "@/lib/drive";

export const dynamic = "force-dynamic";

function sanitizeFileId(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return /^[a-zA-Z0-9_-]+$/.test(trimmed) ? trimmed : null;
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const id = sanitizeFileId(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "Mídia inválida." }, { status: 400 });
  }

  try {
    const item = await getDriveMediaById(id);
    return NextResponse.json(item, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
