/**
 * Walks PresentationConfig JSON (and related Studio blobs) for mediaId references.
 * Client-safe — no Prisma.
 */

export type ExtractedMediaRef = {
  mediaId: number;
  fieldPath: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Recursively finds `{ mediaId: number }` objects and numeric fields named mediaId.
 */
export function extractMediaIdsFromValue(
  value: unknown,
  path = "",
): ExtractedMediaRef[] {
  const found: ExtractedMediaRef[] = [];

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      found.push(...extractMediaIdsFromValue(item, `${path}[${index}]`));
    });
    return found;
  }

  if (!isPlainObject(value)) {
    return found;
  }

  if (typeof value.mediaId === "number" && Number.isFinite(value.mediaId) && value.mediaId > 0) {
    found.push({ mediaId: value.mediaId, fieldPath: path || "mediaId" });
  }

  for (const [key, child] of Object.entries(value)) {
    if (key === "mediaId" && typeof child === "number") continue;
    const nextPath = path ? `${path}.${key}` : key;
    found.push(...extractMediaIdsFromValue(child, nextPath));
  }

  return found;
}

/**
 * Rewrites every MediaRef / mediaId matching `fromId` to `toId` inside a JSON tree.
 * Also refreshes sourceUrl/title/alt when `snapshot` is provided.
 */
export function rewriteMediaIdsInValue(
  value: unknown,
  fromId: number,
  toId: number,
  snapshot?: {
    sourceUrl?: string;
    title?: string;
    alt?: string;
    mimeType?: string;
    width?: number | null;
    height?: number | null;
  },
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => rewriteMediaIdsInValue(item, fromId, toId, snapshot));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    next[key] = rewriteMediaIdsInValue(child, fromId, toId, snapshot);
  }

  if (typeof next.mediaId === "number" && next.mediaId === fromId) {
    next.mediaId = toId;
    if (snapshot) {
      if (snapshot.sourceUrl !== undefined) next.sourceUrl = snapshot.sourceUrl;
      if (snapshot.title !== undefined) next.title = snapshot.title;
      if (snapshot.alt !== undefined) next.alt = snapshot.alt;
      if (snapshot.mimeType !== undefined) next.mimeType = snapshot.mimeType;
      if (snapshot.width !== undefined) next.width = snapshot.width;
      if (snapshot.height !== undefined) next.height = snapshot.height;
      next.lastSyncedAt = new Date().toISOString();
      next.missing = false;
    }
  }

  return next;
}
