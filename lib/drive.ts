import { DRIVE_CATEGORY_ENV_KEYS } from "@/lib/constants";
import { getEmbeddableVideoUrl } from "@/lib/utils";
import type { DriveApiResponse, DriveFile, DriveMetadataResponse } from "@/types/drive";
import type { Category, MediaItem, MediaType, PortfolioFolder } from "@/types/portfolio";

const DRIVE_API_URL = "https://www.googleapis.com/drive/v3/files";
const DRIVE_FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";
const MEDIA_FIELDS =
  "nextPageToken,files(id,name,description,mimeType,parents,createdTime,thumbnailLink,imageMediaMetadata)";
const FOLDER_FIELDS = "nextPageToken,files(id,name,description,mimeType,parents,createdTime)";
const DRIVE_REQUEST_TIMEOUT_MS = 10_000;
const ALLOWED_FOLDER_CACHE_MS = 5 * 60_000;

let allowedFoldersCache: { expiresAt: number; ids: Set<string> } | null = null;

export class DriveAccessError extends Error {}

export function buildImageUrl(fileId: string, size = 1200): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

export function buildFullUrl(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

function resolveMediaType(file: DriveFile): MediaType {
  return file.mimeType.startsWith("video/") ? "video" : "image";
}

function isSupportedMedia(file: DriveFile): boolean {
  return file.mimeType.startsWith("image/") || file.mimeType.startsWith("video/");
}

function resolveAspectRatio(file: DriveFile): number | undefined {
  const width = file.imageMediaMetadata?.width;
  const height = file.imageMediaMetadata?.height;

  return width && height ? width / height : undefined;
}

function readableFileName(name: string): string {
  return name
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapDriveFile(file: DriveFile, category: Category): MediaItem {
  const rawDescription = file.description?.trim();
  const videoUrl = getEmbeddableVideoUrl(rawDescription);
  const description = videoUrl ? undefined : rawDescription;

  return {
    id: file.id,
    name: readableFileName(file.name) || "Imagem do portfólio",
    description,
    altText: description,
    videoUrl: videoUrl ?? undefined,
    mediaType: resolveMediaType(file),
    thumbnailUrl: buildImageUrl(file.id, 1200),
    fullUrl: buildFullUrl(file.id),
    category,
    aspectRatio: resolveAspectRatio(file)
  };
}

function getApiKey(): string {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (!apiKey) {
    throw new Error("Configuração do Google Drive ausente.");
  }

  return apiKey;
}

function getFolderId(category: Category): string {
  const folderId = process.env[DRIVE_CATEGORY_ENV_KEYS[category]];

  if (!folderId) {
    throw new Error("Pasta do portfólio não configurada.");
  }

  return folderId;
}

async function driveFetch(url: string): Promise<Response> {
  return fetch(url, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(DRIVE_REQUEST_TIMEOUT_MS)
  });
}

async function fetchDriveFiles(folderId: string, fields: string, orderBy: string): Promise<DriveFile[]> {
  const files: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed=false`,
      fields,
      key: getApiKey(),
      orderBy,
      pageSize: "1000"
    });

    if (pageToken) {
      params.set("pageToken", pageToken);
    }

    const response = await driveFetch(`${DRIVE_API_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Google Drive indisponível (${response.status}).`);
    }

    const data = (await response.json()) as DriveApiResponse;
    files.push(...(data.files ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return files;
}

async function fetchFolderMetadata(folderId: string): Promise<DriveMetadataResponse> {
  const params = new URLSearchParams({
    fields: "id,name,description,mimeType",
    key: getApiKey()
  });
  const response = await driveFetch(`${DRIVE_API_URL}/${folderId}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Google Drive indisponível (${response.status}).`);
  }

  return (await response.json()) as DriveMetadataResponse;
}

async function fetchDriveFile(fileId: string): Promise<DriveFile> {
  const params = new URLSearchParams({
    fields: "id,name,description,mimeType,parents,createdTime,thumbnailLink,imageMediaMetadata",
    key: getApiKey()
  });
  const response = await driveFetch(`${DRIVE_API_URL}/${fileId}?${params.toString()}`);

  if (!response.ok) {
    throw new DriveAccessError("Mídia não encontrada.");
  }

  return (await response.json()) as DriveFile;
}

async function getDirectChildFolders(rootFolderId: string): Promise<DriveMetadataResponse[]> {
  const children = await fetchDriveFiles(rootFolderId, FOLDER_FIELDS, "name_natural");
  return children.filter((file) => file.mimeType === DRIVE_FOLDER_MIME_TYPE);
}

async function getChildFolders(category: Category): Promise<DriveMetadataResponse[]> {
  const rootFolderId = getFolderId(category);
  const childFolders = await getDirectChildFolders(rootFolderId);
  return childFolders.length > 0 ? childFolders : [await fetchFolderMetadata(rootFolderId)];
}

async function getAllowedFolderIds(): Promise<Set<string>> {
  const now = Date.now();

  if (allowedFoldersCache && allowedFoldersCache.expiresAt > now) {
    return allowedFoldersCache.ids;
  }

  const rootIds = Object.values(DRIVE_CATEGORY_ENV_KEYS)
    .map((envKey) => process.env[envKey])
    .filter((folderId): folderId is string => Boolean(folderId));
  const childGroups = await Promise.all(rootIds.map((rootId) => getDirectChildFolders(rootId)));
  const ids = new Set([...rootIds, ...childGroups.flat().map((folder) => folder.id)]);

  allowedFoldersCache = { expiresAt: now + ALLOWED_FOLDER_CACHE_MS, ids };
  return ids;
}

function coverIdFromDescription(description: string | undefined): string | undefined {
  return description?.match(/(?:^|\n)cover(?:Id)?\s*[:=]\s*([a-zA-Z0-9_-]+)/i)?.[1];
}

function publicFolderDescription(description: string | undefined): string | undefined {
  const value = description?.replace(/(?:^|\n)cover(?:Id)?\s*[:=]\s*[a-zA-Z0-9_-]+/gi, "").trim();
  return value || undefined;
}

async function getDriveFilesFromFolder(category: Category, folderId: string): Promise<MediaItem[]> {
  const files = await fetchDriveFiles(folderId, MEDIA_FIELDS, "createdTime desc,name_natural");
  return files.filter(isSupportedMedia).map((file) => mapDriveFile(file, category));
}

export async function getDriveFiles(category: Category): Promise<MediaItem[]> {
  const folders = await getChildFolders(category);
  const mediaGroups = await Promise.all(folders.map((folder) => getDriveFilesFromFolder(category, folder.id)));
  return mediaGroups.flat();
}

export async function getDriveFilesFromAllowedFolder(category: Category, folderId: string): Promise<MediaItem[]> {
  const categoryRoot = getFolderId(category);
  const childFolders = await getDirectChildFolders(categoryRoot);
  const allowedIds = new Set([categoryRoot, ...childFolders.map((folder) => folder.id)]);

  if (!allowedIds.has(folderId)) {
    throw new DriveAccessError("Pasta não autorizada.");
  }

  return getDriveFilesFromFolder(category, folderId);
}

export async function getDriveMediaById(fileId: string): Promise<MediaItem> {
  const file = await fetchDriveFile(fileId);
  const allowedFolderIds = await getAllowedFolderIds();

  if (!isSupportedMedia(file) || !file.parents?.some((parentId) => allowedFolderIds.has(parentId))) {
    throw new DriveAccessError("Mídia não autorizada.");
  }

  return mapDriveFile(file, "todos");
}

export async function getDriveFolders(category: Category): Promise<PortfolioFolder[]> {
  const folders = await getChildFolders(category);

  return Promise.all(
    folders.map(async (folder) => {
      const items = await getDriveFilesFromFolder(category, folder.id);
      const explicitCoverId = coverIdFromDescription(folder.description);

      return {
        id: folder.id,
        name: folder.name,
        description: publicFolderDescription(folder.description),
        coverUrl: explicitCoverId ? buildImageUrl(explicitCoverId, 1200) : items[0]?.thumbnailUrl,
        itemCount: items.length,
        category
      };
    })
  );
}

export async function getRandomDriveMediaFromFolders(category: Category, limit: number): Promise<MediaItem[]> {
  const folders = await getChildFolders(category);
  const shuffledFolders = [...folders].sort(() => Math.random() - 0.5).slice(0, Math.max(limit * 2, limit));
  const mediaGroups = await Promise.all(
    shuffledFolders.map((folder) => getDriveFilesFromFolder(category, folder.id))
  );

  return mediaGroups
    .flat()
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
}
