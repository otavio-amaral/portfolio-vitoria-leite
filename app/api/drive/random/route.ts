import { NextResponse } from "next/server";
import { getRandomDriveMediaFromFolders } from "@/lib/drive";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get("limit") ?? "6");
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 12) : 6;

  try {
    const items = await getRandomDriveMediaFromFolders("todos", limit);
    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
