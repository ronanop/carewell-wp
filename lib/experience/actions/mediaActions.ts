"use server";

import { auth } from "@/auth";
import { getAssetService } from "@/lib/assets/services/assetService";
import type {
  MediaAsset,
  MediaAssetConnection,
  MediaRef,
} from "@/types/wordpress-media";

export type MediaActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

/**
 * Legacy media actions — delegate to AssetService (ADR-018).
 */
export async function listWordPressImagesAction(input: {
  after?: string | null;
  first?: number;
}): Promise<MediaActionResult<MediaAssetConnection>> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    const data = await getAssetService().list({
      after: input.after,
      first: input.first ?? 40,
      kind: "image",
      mimePrefix: "image/",
    });
    return {
      ok: true,
      data: {
        items: data.items,
        pageInfo: data.pageInfo,
      },
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to load WordPress media",
    };
  }
}

export async function getWordPressMediaByIdAction(
  id: number,
): Promise<MediaActionResult<MediaAsset>> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    const data = await getAssetService().getById(id);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Media item not found",
    };
  }
}

export async function refreshMediaRefAction(
  ref: MediaRef,
): Promise<MediaActionResult<MediaRef>> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Unauthorized" };
  }

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

/** @deprecated Use listWordPressImagesAction */
export async function searchWordPressMediaAction(input: {
  after?: string | null;
  first?: number;
  search?: string;
}): Promise<MediaActionResult<MediaAssetConnection>> {
  return listWordPressImagesAction(input);
}
