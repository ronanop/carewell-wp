import "server-only";

import { publishAssetEvent } from "@/lib/assets/events";
import type { AssetProvider } from "@/lib/assets/providers/types";
import { getWordPressAssetProvider } from "@/lib/assets/providers/wordpressAssetProvider";
import {
  getAssetMetadataRepository,
  type AssetMetadataRepository,
} from "@/lib/assets/repository/assetMetadataRepository";
import {
  getAssetUsageIndex,
  type AssetUsageIndex,
} from "@/lib/assets/usage/assetUsageIndex";
import {
  getAssetSyncService,
  type AssetSyncService,
} from "@/lib/assets/sync/assetSyncService";
import { writeAuditLog } from "@/lib/experience/services/auditService";
import { isAllowedUploadMime, matchesAssetSearch, toAssetRef } from "@/lib/assets/domain";
import type {
  Asset,
  AssetConnection,
  AssetFolder,
  AssetListFilter,
  AssetMetadataUpdate,
  AssetRef,
  AssetUploadInput,
  AssetUsage,
} from "@/types/assets";

/**
 * AssetService — Experience Studio domain API for AMS.
 * UI / Server Actions call this; never call WordPress REST/GraphQL from React.
 */
export function createAssetService(deps?: {
  provider?: AssetProvider;
  meta?: AssetMetadataRepository;
  usage?: AssetUsageIndex;
  sync?: AssetSyncService;
}) {
  const provider = deps?.provider ?? getWordPressAssetProvider();
  const meta = deps?.meta ?? getAssetMetadataRepository();
  const usage = deps?.usage ?? getAssetUsageIndex();
  const sync = deps?.sync ?? getAssetSyncService();

  return {
    providerName: provider.name,

    async list(filter: AssetListFilter & { userId?: string }): Promise<AssetConnection> {
      await meta.ensureDefaultFolders();

      let folderIds: number[] | null = null;
      if (filter.folderSlug) {
        folderIds = await meta.listMediaIdsInFolder(filter.folderSlug);
      }

      let favoriteIds: number[] | null = null;
      if (filter.favoritesOnly && filter.userId) {
        favoriteIds = await meta.listFavoriteIds(filter.userId);
      }

      const connection = await provider.list({
        first: filter.first ?? 40,
        after: filter.after,
        search: filter.search,
        kind: filter.kind,
        mimePrefix: filter.mimePrefix,
        recentlyUploaded: filter.recentlyUploaded,
      });

      let items = connection.items;

      if (folderIds) {
        const set = new Set(folderIds);
        items = items.filter((item) => set.has(item.id));
      }
      if (favoriteIds) {
        const set = new Set(favoriteIds);
        items = items.filter((item) => set.has(item.id));
      }
      if (filter.search?.trim()) {
        items = items.filter((item) => matchesAssetSearch(item, filter.search!));
      }

      return { items, pageInfo: connection.pageInfo };
    },

    getById(id: number): Promise<Asset> {
      return provider.getById(id);
    },

    getByIds(ids: number[]): Promise<Asset[]> {
      return provider.getByIds(ids);
    },

    async upload(
      input: AssetUploadInput,
      actor?: { userId?: string | null },
    ): Promise<Asset> {
      if (!isAllowedUploadMime(input.mimeType)) {
        throw new Error(`Unsupported file type: ${input.mimeType}`);
      }
      if (input.bytes.byteLength > 64 * 1024 * 1024) {
        throw new Error("File exceeds 64MB limit");
      }

      const asset = await provider.upload(input);

      if (input.folderSlug) {
        await meta.addToFolder(input.folderSlug, asset.id);
      }

      await publishAssetEvent({
        type: "AssetUploaded",
        assetId: asset.id,
        actorUserId: actor?.userId,
      });
      await writeAuditLog({
        userId: actor?.userId,
        action: "asset.upload",
        entityType: "asset",
        entityId: String(asset.id),
        summary: `Uploaded ${asset.title}`,
      });

      return asset;
    },

    async replace(
      id: number,
      input: AssetUploadInput,
      actor?: { userId?: string | null },
    ): Promise<{ asset: Asset; idChanged: boolean; previousId: number }> {
      const previous = await provider.getById(id);
      await meta.recordVersion({
        wordpressMediaId: id,
        previousSourceUrl: previous.url,
        title: previous.title,
        alt: previous.alt,
        mimeType: previous.mimeType,
        width: previous.width,
        height: previous.height,
        createdById: actor?.userId,
        metadata: { caption: previous.caption, description: previous.description },
      });

      const result = await provider.replace(id, input);

      if (result.idChanged) {
        await sync.rewritePresentationMediaIds(id, result.asset.id, result.asset);
        if (input.folderSlug) {
          await meta.addToFolder(input.folderSlug, result.asset.id);
        }
      }

      await publishAssetEvent({
        type: "AssetReplaced",
        assetId: result.asset.id,
        actorUserId: actor?.userId,
        payload: { previousId: id, idChanged: result.idChanged },
      });
      await writeAuditLog({
        userId: actor?.userId,
        action: "asset.replace",
        entityType: "asset",
        entityId: String(result.asset.id),
        summary: `Replaced media #${id} → #${result.asset.id}`,
      });

      return result;
    },

    async updateMetadata(
      id: number,
      patch: AssetMetadataUpdate,
      actor?: { userId?: string | null },
    ): Promise<Asset> {
      const before = await provider.getById(id);
      const asset = await provider.updateMetadata(id, patch);
      const renamed = patch.title !== undefined && patch.title !== before.title;

      await publishAssetEvent({
        type: renamed ? "AssetRenamed" : "AssetUpdated",
        assetId: id,
        actorUserId: actor?.userId,
        payload: patch as Record<string, unknown>,
      });
      await writeAuditLog({
        userId: actor?.userId,
        action: renamed ? "asset.rename" : "asset.update",
        entityType: "asset",
        entityId: String(id),
        summary: renamed
          ? `Renamed to ${asset.title}`
          : `Updated metadata for #${id}`,
      });

      return asset;
    },

    async trash(
      id: number,
      actor?: { userId?: string | null },
    ): Promise<{ usages: AssetUsage[] }> {
      const usages = await meta.listUsages(id);
      await provider.trash(id);
      await publishAssetEvent({
        type: "AssetDeleted",
        assetId: id,
        actorUserId: actor?.userId,
        payload: { usageCount: usages.length },
      });
      await writeAuditLog({
        userId: actor?.userId,
        action: "asset.trash",
        entityType: "asset",
        entityId: String(id),
        summary: `Moved media #${id} to trash`,
      });
      return { usages };
    },

    async restore(id: number, actor?: { userId?: string | null }): Promise<Asset> {
      const asset = await provider.restore(id);
      await publishAssetEvent({
        type: "AssetRestored",
        assetId: id,
        actorUserId: actor?.userId,
      });
      await writeAuditLog({
        userId: actor?.userId,
        action: "asset.restore",
        entityType: "asset",
        entityId: String(id),
        summary: `Restored media #${id}`,
      });
      return asset;
    },

    listFolders(): Promise<AssetFolder[]> {
      return meta.ensureDefaultFolders();
    },

    createFolder(input: { slug: string; name: string; parentId?: string | null }) {
      return meta.createFolder(input);
    },

    addToFolder(folderSlug: string, mediaId: number) {
      return meta.addToFolder(folderSlug, mediaId);
    },

    async setFavorite(
      userId: string,
      mediaId: number,
      favorite: boolean,
    ): Promise<void> {
      await meta.setFavorite(userId, mediaId, favorite);
      await publishAssetEvent({
        type: favorite ? "AssetFavorited" : "AssetUnfavorited",
        assetId: mediaId,
        actorUserId: userId,
      });
    },

    listFavoriteIds(userId: string) {
      return meta.listFavoriteIds(userId);
    },

    listUsages(mediaId: number) {
      return usage.listUsages(mediaId);
    },

    rebuildUsageIndex() {
      return usage.rebuild();
    },

    syncFromWordPress(input?: { first?: number }) {
      return sync.syncFromWordPress(input);
    },

    listVersions(mediaId: number) {
      return meta.listVersions(mediaId);
    },

    toRef(asset: Asset): AssetRef {
      return toAssetRef(asset);
    },
  };
}

export type AssetService = ReturnType<typeof createAssetService>;

let defaultService: AssetService | undefined;

export function getAssetService(): AssetService {
  if (!defaultService) {
    defaultService = createAssetService();
  }
  return defaultService;
}
