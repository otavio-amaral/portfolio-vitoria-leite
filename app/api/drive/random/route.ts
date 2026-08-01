import { NextResponse } from "next/server";
import { getRandomDriveMediaFromFolders } from "@/lib/drive";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const rateLimit = checkRateLimit(request, "drive-random", 30);

  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Muitas solicitações. Tente novamente em instantes." }, { status: 429, headers: rateLimit.headers });
  }

  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get("limit") ?? "6");
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 12) : 6;

  try {
    const items = await getRandomDriveMediaFromFolders("todos", limit);
    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "private, max-age=300",
        ...rateLimit.headers
      }
    });
  } catch (error) {
    console.error("Falha ao carregar imagens aleatórias", error);
    return NextResponse.json({ error: "Não foi possível carregar as imagens." }, { status: 502, headers: rateLimit.headers });
  }
}
