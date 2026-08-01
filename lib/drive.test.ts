import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DriveAccessError, getDriveFiles, getDriveFilesFromAllowedFolder } from "@/lib/drive";

function driveResponse(data: unknown): Response {
  return new Response(JSON.stringify(data), { status: 200, headers: { "content-type": "application/json" } });
}

describe("Google Drive portfolio", () => {
  beforeEach(() => {
    vi.stubEnv("GOOGLE_DRIVE_API_KEY", "test-key");
    vi.stubEnv("DRIVE_FOLDER_FOTOGRAFIA", "root-photo");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("pagina pastas e preserva a raiz da categoria consultada", async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = new URL(String(input));
      const query = url.searchParams.get("q");
      const token = url.searchParams.get("pageToken");

      if (query?.includes("'root-photo'")) {
        return token
          ? driveResponse({ files: [{ id: "project-b", name: "Projeto B", mimeType: "application/vnd.google-apps.folder" }] })
          : driveResponse({
              nextPageToken: "page-2",
              files: [{ id: "project-a", name: "Projeto A", mimeType: "application/vnd.google-apps.folder" }]
            });
      }

      const folderId = query?.includes("project-a") ? "a" : "b";
      return driveResponse({
        files: [{ id: `photo-${folderId}`, name: `foto_${folderId}.jpg`, mimeType: "image/jpeg", parents: [`project-${folderId}`] }]
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const items = await getDriveFiles("fotografia");

    expect(items.map((item) => item.id).sort()).toEqual(["photo-a", "photo-b"]);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("root-photo"), expect.any(Object));
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("pageToken=page-2"), expect.any(Object));
  });

  it("bloqueia um folderId que não pertence à categoria", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => driveResponse({ files: [] })));

    await expect(getDriveFilesFromAllowedFolder("fotografia", "folder-alheio")).rejects.toBeInstanceOf(
      DriveAccessError
    );
  });
});
