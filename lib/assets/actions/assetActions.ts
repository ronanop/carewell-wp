"use server";

import { auth } from "@/auth";
import { getAssetService } from "@/lib/assets/services/assetService";
import { requirePermission, hasPermission } from "@/lib/experience/rbac";
import type {
  Asset,
  AssetConnection,
  AssetFolder,
  AssetKind,
  AssetMetadataUpdate,
  AssetRef,
  AssetUsage,
} from "@/types/assets";

export type AssetActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session;
}

export async function listAssetsAction(input: {
  after?: string | null;
  first?: number;
  search?: string;
  kind?: AssetKind | "all";
  folderSlug?: string | null;
  favoritesOnly?: boolean;
  recentlyUploaded?: boolean;
  mimePrefix?: string;
}): Promise<AssetActionResult<AssetConnection>> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Unauthorized" };
  if (!hasPermission(session.user.role, "media:read")) {
    return { ok: false, message: "Missing media:read permission" };
  }

  try {
    const data = await getAssetService().list({
      ...input,
      userId: session.user.id,
    });
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to list assets",
    };
  }
}

export async function getAssetByIdAction(
  id: number,
): Promise<AssetActionResult<Asset>> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Unauthorized" };

  try {
    const data = await getAssetService().getById(id);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Asset not found",
    };
  }
}

export async function uploadAssetAction(input: {
  dataBase64: string;
  filename: string;
  mimeType: string;
  title?: string;
  alt?: string;
  caption?: string;
  description?: string;
  folderSlug?: string | null;
}): Promise<AssetActionResult<AssetRef>> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Unauthorized" };

  try {
    requirePermission(session.user.role, "media:write");
  } catch {
    return { ok: false, message: "Missing media:write permission" };
  }

  try {
    const bytes = Buffer.from(input.dataBase64, "base64");
    const asset = await getAssetService().upload(
      {
        bytes,
        filename: input.filename,
        mimeType: input.mimeType,
        title: input.title,
        alt: input.alt,
        caption: input.caption,
        description: input.description,
        folderSlug: input.folderSlug,
      },
      { userId: session.user.id },
    );
    return { ok: true, data: getAssetService().toRef(asset) };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export async function replaceAssetAction(input: {
  id: number;
  dataBase64: string;
  filename: string;
  mimeType: string;
  alt?: string;
}): Promise<AssetActionResult<{ ref: AssetRef; idChanged: boolean; previousId: number }>> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Unauthorized" };

  try {
    requirePermission(session.user.role, "media:write");
  } catch {
    return { ok: false, message: "Missing media:write permission" };
  }

  try {
    const bytes = Buffer.from(input.dataBase64, "base64");
    const result = await getAssetService().replace(
      input.id,
      {
        bytes,
        filename: input.filename,
        mimeType: input.mimeType,
        alt: input.alt,
      },
      { userId: session.user.id },
    );
    return {
      ok: true,
      data: {
        ref: getAssetService().toRef(result.asset),
        idChanged: result.idChanged,
        previousId: result.previousId,
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Replace failed",
    };
  }
}

export async function updateAssetMetadataAction(input: {
  id: number;
  patch: AssetMetadataUpdate;
}): Promise<AssetActionResult<Asset>> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Unauthorized" };

  try {
    requirePermission(session.user.role, "media:write");
  } catch {
    return { ok: false, message: "Missing media:write permission" };
  }

  try {
    const data = await getAssetService().updateMetadata(input.id, input.patch, {
      userId: session.user.id,
    });
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Update failed",
    };
  }
}

export async function trashAssetAction(
  id: number,
): Promise<AssetActionResult<{ usages: AssetUsage[] }>> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Unauthorized" };

  try {
    requirePermission(session.user.role, "media:write");
  } catch {
    return { ok: false, message: "Missing media:write permission" };
  }

  try {
    const usages = await getAssetService().listUsages(id);
    if (usages.length > 0) {
      // Still allow trash after client confirms — server re-checks.
    }
    const data = await getAssetService().trash(id, { userId: session.user.id });
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Trash failed",
    };
  }
}

export async function restoreAssetAction(
  id: number,
): Promise<AssetActionResult<Asset>> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Unauthorized" };

  try {
    requirePermission(session.user.role, "media:write");
  } catch {
    return { ok: false, message: "Missing media:write permission" };
  }

  try {
    const data = await getAssetService().restore(id, { userId: session.user.id });
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Restore failed",
    };
  }
}

export async function listAssetFoldersAction(): Promise<
  AssetActionResult<AssetFolder[]>
> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Unauthorized" };

  try {
    const data = await getAssetService().listFolders();
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to load folders",
    };
  }
}

export async function createAssetFolderAction(input: {
  slug: string;
  name: string;
}): Promise<AssetActionResult<AssetFolder>> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Unauthorized" };

  try {
    requirePermission(session.user.role, "media:write");
  } catch {
    return { ok: false, message: "Missing media:write permission" };
  }

  try {
    const slug = input.slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!slug) return { ok: false, message: "Invalid folder slug" };
    const data = await getAssetService().createFolder({
      slug,
      name: input.name.trim() || slug,
    });
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create folder",
    };
  }
}

export async function moveAssetToFolderAction(input: {
  mediaId: number;
  folderSlug: string;
}): Promise<AssetActionResult<{ ok: true }>> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Unauthorized" };

  try {
    requirePermission(session.user.role, "media:write");
    await getAssetService().addToFolder(input.folderSlug, input.mediaId);
    return { ok: true, data: { ok: true } };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to move asset",
    };
  }
}

export async function setAssetFavoriteAction(input: {
  mediaId: number;
  favorite: boolean;
}): Promise<AssetActionResult<{ ok: true }>> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Unauthorized" };

  try {
    await getAssetService().setFavorite(
      session.user.id,
      input.mediaId,
      input.favorite,
    );
    return { ok: true, data: { ok: true } };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update favorite",
    };
  }
}

export async function listAssetUsagesAction(
  mediaId: number,
): Promise<AssetActionResult<AssetUsage[]>> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Unauthorized" };

  try {
    const data = await getAssetService().listUsages(mediaId);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to load usages",
    };
  }
}

export async function rebuildAssetUsageIndexAction(): Promise<
  AssetActionResult<{ usageCount: number; assetCount: number }>
> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Unauthorized" };

  try {
    requirePermission(session.user.role, "media:write");
    const data = await getAssetService().rebuildUsageIndex();
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Usage index rebuild failed",
    };
  }
}

export async function syncAssetsFromWordPressAction(): Promise<
  AssetActionResult<{ scanned: number; cursor: string | null }>
> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Unauthorized" };

  try {
    requirePermission(session.user.role, "media:write");
    const data = await getAssetService().syncFromWordPress();
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Sync failed",
    };
  }
}

export async function refreshAssetRefAction(
  ref: AssetRef,
): Promise<AssetActionResult<AssetRef>> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Unauthorized" };

  try {
    const asset = await getAssetService().getById(ref.mediaId);
    return { ok: true, data: getAssetService().toRef(asset) };
  } catch {
    return {
      ok: true,
      data: {
        ...ref,
        missing: true,
        lastSyncedAt: new Date().toISOString(),
      },
    };
  }
}
