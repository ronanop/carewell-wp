"use server";

import { auth } from "@/auth";
import { getMediaService } from "@/lib/wordpress/services/mediaService";
import type {
  MediaAsset,
  MediaAssetConnection,
  MediaRef,
} from "@/types/wordpress-media";

export type MediaActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

/**
 * Loads the next page of WordPress images (repository filters mimeType).
 * Search is intentionally client-side — no GraphQL search assumptions.
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
    const data = await getMediaService().listImages({
      after: input.after,
      first: input.first ?? 40,
    });
    return { ok: true, data };
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
    const data = await getMediaService().getById(id);
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
    const data = await getMediaService().refreshMediaRef(ref);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to refresh media",
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
