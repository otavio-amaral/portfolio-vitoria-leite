import { DRIVE_CATEGORY_ENV_KEYS } from "@/lib/constants";
import type { DriveApiResponse, DriveFile, DriveMetadataResponse } from "@/types/drive";
import type { Category, MediaItem, MediaType, PortfolioFolder } from "@/types/portfolio";

const DRIVE_API_URL = "https://www.googleapis.com/drive/v3/files";
const DRIVE_FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";
const MEDIA_FIELDS = "files(id,name,description,mimeType,thumbnailLink,imageMediaMetadata)";
const FOLDER_FIELDS = "files(id,name,description,mimeType)";

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

  if (!width || !height || height === 0) {
    return undefined;
  }

  return width / height;
}

function mapDriveFile(file: DriveFile, category: Category): MediaItem {
  return {
    id: file.id,
    name: file.name,
    description: file.description,
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
    throw new Error("Variável de ambiente ausente: GOOGLE_DRIVE_API_KEY");
  }

  return apiKey;
}

function getFolderId(category: Category): string {
  const envKey = DRIVE_CATEGORY_ENV_KEYS[category];
  const folderId = process.env[envKey];

  if (!folderId) {
    throw new Error(`Variável de ambiente ausente: ${envKey}`);
  }

  return folderId;
}

async function fetchDriveFiles(folderId: string, fields: string): Promise<DriveFile[]> {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and trashed=false`,
    fields,
    key: getApiKey()
  });

  const response = await fetch(`${DRIVE_API_URL}?${params.toString()}`, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error(`Google Drive API respondeu com status ${response.status}`);
  }

  const data = (await response.json()) as DriveApiResponse;
  return data.files;
}

async function fetchFolderMetadata(folderId: string): Promise<DriveMetadataResponse> {
  const params = new URLSearchParams({
    fields: "id,name,description,mimeType",
    key: getApiKey()
  });

  const response = await fetch(`${DRIVE_API_URL}/${folderId}?${params.toString()}`, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error(`Google Drive API respondeu com status ${response.status}`);
  }

  return (await response.json()) as DriveMetadataResponse;
}

async function fetchDriveFile(fileId: string): Promise<DriveFile> {
  const params = new URLSearchParams({
    fields: "id,name,description,mimeType,thumbnailLink,imageMediaMetadata",
    key: getApiKey()
  });

  const response = await fetch(`${DRIVE_API_URL}/${fileId}?${params.toString()}`, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error(`Google Drive API respondeu com status ${response.status}`);
  }

  return (await response.json()) as DriveFile;
}

async function getChildFolders(category: Category): Promise<DriveMetadataResponse[]> {
  const rootFolderId = getFolderId(category);
  const children = await fetchDriveFiles(rootFolderId, FOLDER_FIELDS);
  const childFolders = children.filter((file) => file.mimeType === DRIVE_FOLDER_MIME_TYPE);

  if (childFolders.length > 0) {
    return childFolders;
  }

  return [await fetchFolderMetadata(rootFolderId)];
}

export async function getDriveFiles(category: Category): Promise<MediaItem[]> {
  if (category === "fotografia") {
    const folders = await getChildFolders("todos");
    const mediaGroups = await Promise.all(folders.map((folder) => getDriveFilesFromFolder(category, folder.id)));
    return mediaGroups.flat();
  }

  return getDriveFilesFromFolder(category, getFolderId(category));
}

export async function getDriveFilesFromFolder(category: Category, folderId: string): Promise<MediaItem[]> {
  const files = await fetchDriveFiles(folderId, MEDIA_FIELDS);
  return files.filter(isSupportedMedia).map((file) => mapDriveFile(file, category));
}

export async function getDriveMediaById(fileId: string): Promise<MediaItem> {
  const file = await fetchDriveFile(fileId);

  if (!isSupportedMedia(file)) {
    throw new Error("Arquivo não é uma mídia suportada.");
  }

  return mapDriveFile(file, "todos");
}

export async function getDriveFolders(category: Category): Promise<PortfolioFolder[]> {
  const folders = await getChildFolders(category);

  return Promise.all(
    folders.map(async (folder) => {
      const items = await getDriveFilesFromFolder(category, folder.id);

      return {
        id: folder.id,
        name: folder.name,
        description: folder.description,
        coverUrl: items[0]?.thumbnailUrl,
        itemCount: items.length,
        category
      };
    })
  );
}

export async function getRandomDriveMediaFromFolders(category: Category, limit: number): Promise<MediaItem[]> {
  const folders = await getChildFolders(category);
  const sampledFolders = folders
    .map((folder) => ({ folder, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ folder }) => folder)
    .slice(0, Math.max(limit * 2, limit));
  const mediaGroups = await Promise.all(sampledFolders.map((folder) => getDriveFilesFromFolder(category, folder.id)));
  const shuffled = mediaGroups
    .flat()
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);

  return shuffled.slice(0, limit);
}
