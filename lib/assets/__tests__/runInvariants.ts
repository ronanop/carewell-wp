/**
 * AMS invariants — run with: npx tsx lib/assets/__tests__/runInvariants.ts
 */
import {
  classifyAssetKind,
  isAllowedUploadMime,
  matchesAssetSearch,
  toAsset,
} from "@/lib/assets/domain";
import {
  extractMediaIdsFromValue,
  rewriteMediaIdsInValue,
} from "@/lib/assets/usage/extractMediaIds";
import type { MediaAsset } from "@/types/wordpress-media";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
  console.log(`OK: ${message}`);
}

assert(classifyAssetKind("image/webp") === "image", "webp is image");
assert(classifyAssetKind("application/pdf") === "pdf", "pdf classified");
assert(
  classifyAssetKind(
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ) === "document",
  "docx classified",
);
assert(classifyAssetKind("video/mp4") === "video", "mp4 is video");
assert(classifyAssetKind("application/zip") === "archive", "zip is archive");
assert(isAllowedUploadMime("image/png"), "png allowed");
assert(!isAllowedUploadMime("application/x-msdownload"), "exe blocked");

const sample: MediaAsset = {
  id: 42,
  title: "Clinic Hero",
  alt: "Reception desk",
  url: "https://example.com/uploads/clinic-hero.jpg",
  thumbnailUrl: "https://example.com/uploads/clinic-hero-150.jpg",
  mimeType: "image/jpeg",
  width: 1600,
  height: 900,
  createdAt: "2026-01-01",
  updatedAt: "2026-01-02",
  mediaType: "image",
};

const asset = toAsset(sample);
assert(asset.kind === "image", "toAsset sets kind");
assert(matchesAssetSearch(asset, "hero"), "search title");
assert(matchesAssetSearch(asset, "reception"), "search alt");
assert(matchesAssetSearch(asset, "42"), "search id");
assert(!matchesAssetSearch(asset, "zzz"), "search miss");

const config = {
  hero: {
    media: {
      mediaId: 42,
      sourceUrl: "https://example.com/a.jpg",
      title: "A",
      alt: "",
      mimeType: "image/jpeg",
      width: 1,
      height: 1,
      lastSyncedAt: "2026-01-01",
    },
  },
  elementOverrides: {
    "home.hero.image": {
      mediaId: 99,
      sourceUrl: "https://example.com/b.jpg",
    },
  },
};

const extracted = extractMediaIdsFromValue(config);
assert(
  extracted.some((e) => e.mediaId === 42),
  "extracts hero mediaId",
);
assert(
  extracted.some((e) => e.mediaId === 99),
  "extracts override mediaId",
);

const rewritten = rewriteMediaIdsInValue(config, 42, 100, {
  sourceUrl: "https://example.com/new.jpg",
  title: "New",
}) as typeof config;

assert(rewritten.hero.media.mediaId === 100, "rewrites mediaId 42→100");
assert(
  rewritten.hero.media.sourceUrl === "https://example.com/new.jpg",
  "rewrites snapshot url",
);
assert(
  (rewritten.elementOverrides["home.hero.image"] as { mediaId: number })
    .mediaId === 99,
  "leaves unrelated mediaId untouched",
);

console.log("\nAll AMS invariants passed.");
