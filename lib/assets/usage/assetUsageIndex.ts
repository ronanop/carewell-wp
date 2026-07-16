import "server-only";

import { prisma } from "@/lib/experience/db";
import {
  getAssetMetadataRepository,
  type AssetMetadataRepository,
} from "@/lib/assets/repository/assetMetadataRepository";
import { extractMediaIdsFromValue } from "@/lib/assets/usage/extractMediaIds";
import type { AssetUsage } from "@/types/assets";

/**
 * Builds the Asset Usage Index from Studio presentation configs.
 * Scans WordPress page presentations + static page presentations.
 */
export function createAssetUsageIndex(
  meta: AssetMetadataRepository = getAssetMetadataRepository(),
) {
  return {
    async rebuild(): Promise<{ usageCount: number; assetCount: number }> {
      const usages: AssetUsage[] = [];

      const wpPresentations = await prisma.pagePresentation.findMany({
        include: {
          page: { select: { id: true, title: true, uri: true, databaseId: true } },
        },
      });

      for (const row of wpPresentations) {
        const refs = extractMediaIdsFromValue(row.config);
        for (const ref of refs) {
          usages.push({
            wordpressMediaId: ref.mediaId,
            contextType: "wordpress_page",
            contextId: row.page.id,
            contextLabel: row.page.title || row.page.uri,
            fieldPath: ref.fieldPath,
            editorHref: `/admin/page-studio/${row.page.databaseId}`,
          });
        }
      }

      const staticPresentations = await prisma.staticPagePresentation.findMany({
        include: {
          page: { select: { id: true, title: true, slug: true, path: true } },
        },
      });

      for (const row of staticPresentations) {
        const refs = extractMediaIdsFromValue(row.config);
        for (const ref of refs) {
          usages.push({
            wordpressMediaId: ref.mediaId,
            contextType: "static_page",
            contextId: row.page.id,
            contextLabel: row.page.title || row.page.slug,
            fieldPath: ref.fieldPath,
            editorHref: `/admin/static-pages/${row.page.slug}`,
          });
        }
      }

      await meta.replaceAllUsages(usages);
      const assetCount = new Set(usages.map((u) => u.wordpressMediaId)).size;
      return { usageCount: usages.length, assetCount };
    },

    listUsages(wordpressMediaId: number) {
      return meta.listUsages(wordpressMediaId);
    },
  };
}

export type AssetUsageIndex = ReturnType<typeof createAssetUsageIndex>;

let defaultIndex: AssetUsageIndex | undefined;

export function getAssetUsageIndex(): AssetUsageIndex {
  if (!defaultIndex) {
    defaultIndex = createAssetUsageIndex();
  }
  return defaultIndex;
}
