import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

type AlbumClickCounts = Record<string, number>;
export type ClickTargetType = "album" | "photo";

const STORAGE_DIR = path.join(process.cwd(), ".data");
const STORAGE_FILE = path.join(STORAGE_DIR, "album-clicks.json");
const KEY_PREFIX = "clicks:";

function redisConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  return url && token ? { url, token } : null;
}

function keyForTarget(targetType: ClickTargetType, targetId: string): string {
  return `${KEY_PREFIX}${targetType}:${targetId}`;
}

async function redisRequest<T>(pathName: string): Promise<T> {
  const config = redisConfig();

  if (!config) {
    throw new Error("Redis não configurado.");
  }

  const response = await fetch(`${config.url}/${pathName}`, {
    headers: {
      Authorization: `Bearer ${config.token}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Não foi possível acessar o contador global.");
  }

  return (await response.json()) as T;
}

async function readLocalCounts(): Promise<AlbumClickCounts> {
  try {
    return JSON.parse(await readFile(STORAGE_FILE, "utf8")) as AlbumClickCounts;
  } catch {
    return {};
  }
}

async function writeLocalCounts(counts: AlbumClickCounts): Promise<void> {
  await mkdir(STORAGE_DIR, { recursive: true });
  await writeFile(STORAGE_FILE, JSON.stringify(counts, null, 2), "utf8");
}

export async function getClickCounts(targetType: ClickTargetType, targetIds: string[]): Promise<AlbumClickCounts> {
  const config = redisConfig();

  if (config) {
    const entries = await Promise.all(
      targetIds.map(async (targetId) => {
        const data = await redisRequest<{ result: string | null }>(`get/${encodeURIComponent(keyForTarget(targetType, targetId))}`);
        return [targetId, Number(data.result ?? 0)] as const;
      })
    );

    return Object.fromEntries(entries);
  }

  const localCounts = await readLocalCounts();

  return Object.fromEntries(targetIds.map((targetId) => [targetId, localCounts[keyForTarget(targetType, targetId)] ?? 0]));
}

export async function incrementClick(targetType: ClickTargetType, targetId: string): Promise<number> {
  const config = redisConfig();

  if (config) {
    const data = await redisRequest<{ result: number }>(`incr/${encodeURIComponent(keyForTarget(targetType, targetId))}`);
    return data.result;
  }

  const localCounts = await readLocalCounts();
  const storageKey = keyForTarget(targetType, targetId);
  const nextCount = (localCounts[storageKey] ?? 0) + 1;

  localCounts[storageKey] = nextCount;
  await writeLocalCounts(localCounts);

  return nextCount;
}

export async function getAlbumClickCounts(albumIds: string[]): Promise<AlbumClickCounts> {
  return getClickCounts("album", albumIds);
}

export async function incrementAlbumClick(albumId: string): Promise<number> {
  return incrementClick("album", albumId);
}
