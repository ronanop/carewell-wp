import "server-only";

import { prisma } from "@/lib/experience/db";
import {
  getAssetMetadataRepository,
  type AssetMetadataRepository,
} from "@/lib/assets/repository/assetMetadataRepository";
import type { AssetProvider } from "@/lib/assets/providers/types";
import { getWordPressAssetProvider } from "@/lib/assets/providers/wordpressAssetProvider";
import { rewriteMediaIdsInValue } from "@/lib/assets/usage/extractMediaIds";
import type { Asset } from "@/types/assets";

/**
 * Background WordPress → Studio synchronization + replace-time config rewrite.
 */
export function createAssetSyncService(
  provider: AssetProvider = getWordPressAssetProvider(),
  meta: AssetMetadataRepository = getAssetMetadataRepository(),
) {
  return {
    /**
     * Pulls a page of WordPress media to keep Studio caches warm / detect drift.
     */
    async syncFromWordPress(input?: { first?: number }): Promise<{
      scanned: number;
      cursor: string | null;
    }> {
      await meta.markSync({ status: "running" });
      try {
        const state = await meta.getSyncState();
        const connection = await provider.list({
          first: input?.first ?? 50,
          after: state.lastCursor,
        });

        let latestModified: Date | null = null;
        for (const asset of connection.items) {
          if (!asset.updatedAt) continue;
          const d = new Date(asset.updatedAt);
          if (!Number.isNaN(d.getTime())) {
            if (!latestModified || d > latestModified) latestModified = d;
          }
        }

        await meta.markSync({
          status: "idle",
          lastCursor: connection.pageInfo.hasNextPage
            ? connection.pageInfo.endCursor
            : null,
          lastMediaModified: latestModified,
          lastError: null,
        });

        return {
          scanned: connection.items.length,
          cursor: connection.pageInfo.endCursor,
        };
      } catch (error) {
        await meta.markSync({
          status: "error",
          lastError: error instanceof Error ? error.message : "sync failed",
        });
        throw error;
      }
    },

    /**
     * After a replace that changes WordPress media IDs, rewrite PresentationConfig JSON.
     */
    async rewritePresentationMediaIds(
      fromId: number,
      toId: number,
      snapshot: Asset,
    ): Promise<{ pagesUpdated: number; staticUpdated: number }> {
      const snap = {
        sourceUrl: snapshot.url,
        title: snapshot.title,
        alt: snapshot.alt,
        mimeType: snapshot.mimeType,
        width: snapshot.width,
        height: snapshot.height,
      };

      let pagesUpdated = 0;
      let staticUpdated = 0;

      const wpRows = await prisma.pagePresentation.findMany({
        select: { id: true, config: true },
      });
      for (const row of wpRows) {
        const next = rewriteMediaIdsInValue(row.config, fromId, toId, snap);
        const changed = JSON.stringify(next) !== JSON.stringify(row.config);
        if (!changed) continue;
        await prisma.pagePresentation.update({
          where: { id: row.id },
          data: { config: next as object },
        });
        pagesUpdated += 1;
      }

      const staticRows = await prisma.staticPagePresentation.findMany({
        select: { id: true, config: true },
      });
      for (const row of staticRows) {
        const next = rewriteMediaIdsInValue(row.config, fromId, toId, snap);
        const changed = JSON.stringify(next) !== JSON.stringify(row.config);
        if (!changed) continue;
        await prisma.staticPagePresentation.update({
          where: { id: row.id },
          data: { config: next as object },
        });
        staticUpdated += 1;
      }

      await meta.rewriteUsagesMediaId(fromId, toId);
      return { pagesUpdated, staticUpdated };
    },
  };
}

export type AssetSyncService = ReturnType<typeof createAssetSyncService>;

let defaultSync: AssetSyncService | undefined;

export function getAssetSyncService(): AssetSyncService {
  if (!defaultSync) {
    defaultSync = createAssetSyncService();
  }
  return defaultSync;
}
