import type {
  Asset,
  AssetKind,
  AssetRef,
} from "@/types/assets";
import type { MediaAsset, MediaRef } from "@/types/wordpress-media";
import { toMediaRef } from "@/lib/media/mediaDomain";

/**
 * Client-safe AMS domain helpers (no server / Prisma / WP credentials).
 */

const KIND_MIME: Array<{ kind: AssetKind; test: (mime: string) => boolean }> = [
  { kind: "image", test: (m) => m.startsWith("image/") },
  { kind: "video", test: (m) => m.startsWith("video/") },
  {
    kind: "pdf",
    test: (m) => m === "application/pdf" || m.endsWith("/pdf"),
  },
  {
    kind: "spreadsheet",
    test: (m) =>
      m.includes("spreadsheet") ||
      m.includes("excel") ||
      m === "application/vnd.ms-excel" ||
      m.includes("officedocument.spreadsheetml"),
  },
  {
    kind: "presentation",
    test: (m) =>
      m.includes("presentation") ||
      m.includes("powerpoint") ||
      m === "application/vnd.ms-powerpoint" ||
      m.includes("officedocument.presentationml"),
  },
  {
    kind: "document",
    test: (m) =>
      m.includes("msword") ||
      m.includes("officedocument.wordprocessingml") ||
      m === "application/rtf" ||
      m === "text/plain",
  },
  {
    kind: "archive",
    test: (m) =>
      m.includes("zip") ||
      m.includes("x-rar") ||
      m.includes("x-7z") ||
      m.includes("gzip") ||
      m === "application/x-tar",
  },
];

export function classifyAssetKind(mimeType: string | null | undefined): AssetKind {
  const mime = (mimeType ?? "").toLowerCase().trim();
  if (!mime) return "other";
  for (const entry of KIND_MIME) {
    if (entry.test(mime)) return entry.kind;
  }
  return "other";
}

export function toAsset(media: MediaAsset, extras?: Partial<Asset>): Asset {
  return {
    ...media,
    kind: extras?.kind ?? classifyAssetKind(media.mimeType),
    caption: extras?.caption,
    description: extras?.description,
    fileSize: extras?.fileSize ?? null,
    authorName: extras?.authorName ?? null,
  };
}

export function toAssetRef(asset: Asset | MediaAsset, syncedAt = new Date()): AssetRef {
  return toMediaRef(asset, syncedAt);
}

export function assetRefEquals(a: AssetRef | MediaRef | null, b: AssetRef | MediaRef | null): boolean {
  if (!a || !b) return a === b;
  return a.mediaId === b.mediaId;
}

export function matchesAssetSearch(asset: Asset | MediaAsset, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const filename = asset.url.split("/").pop()?.toLowerCase() ?? "";
  const caption = "caption" in asset ? String(asset.caption ?? "") : "";
  const description = "description" in asset ? String(asset.description ?? "") : "";

  return (
    asset.title.toLowerCase().includes(q) ||
    asset.alt.toLowerCase().includes(q) ||
    asset.mimeType.toLowerCase().includes(q) ||
    filename.includes(q) ||
    caption.toLowerCase().includes(q) ||
    description.toLowerCase().includes(q) ||
    String(asset.id).includes(q)
  );
}

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const DEFAULT_VIRTUAL_FOLDERS: ReadonlyArray<{ slug: string; name: string }> = [
  { slug: "doctors", name: "Doctors" },
  { slug: "gallery", name: "Gallery" },
  { slug: "services", name: "Services" },
  { slug: "homepage", name: "Homepage" },
  { slug: "blog", name: "Blog" },
  { slug: "downloads", name: "Downloads" },
  { slug: "marketing", name: "Marketing" },
] as const;

/** MIME allow-list for Studio uploads. */
export const UPLOAD_MIME_ALLOWLIST = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-zip-compressed",
]);

export function isAllowedUploadMime(mimeType: string): boolean {
  return UPLOAD_MIME_ALLOWLIST.has(mimeType.toLowerCase().trim());
}
