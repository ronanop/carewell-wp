import "server-only";

import { prisma } from "@/lib/experience/db";
import { DEFAULT_VIRTUAL_FOLDERS } from "@/lib/assets/domain";
import type { AssetFolder, AssetUsage } from "@/types/assets";

/**
 * Studio-side AMS metadata repository.
 * Stores favorites, virtual folders, usage index, versions — never file bytes.
 */
export function createAssetMetadataRepository() {
  return {
    async ensureDefaultFolders(): Promise<AssetFolder[]> {
      for (const [index, folder] of DEFAULT_VIRTUAL_FOLDERS.entries()) {
        await prisma.assetFolder.upsert({
          where: { slug: folder.slug },
          create: {
            slug: folder.slug,
            name: folder.name,
            sortOrder: index,
          },
          update: { name: folder.name },
        });
      }
      return this.listFolders();
    },

    async listFolders(): Promise<AssetFolder[]> {
      const rows = await prisma.assetFolder.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      });
      return rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        parentId: row.parentId,
        sortOrder: row.sortOrder,
      }));
    },

    async createFolder(input: {
      slug: string;
      name: string;
      parentId?: string | null;
    }): Promise<AssetFolder> {
      const count = await prisma.assetFolder.count();
      const row = await prisma.assetFolder.create({
        data: {
          slug: input.slug,
          name: input.name,
          parentId: input.parentId ?? null,
          sortOrder: count,
        },
      });
      return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        parentId: row.parentId,
        sortOrder: row.sortOrder,
      };
    },

    async addToFolder(folderSlug: string, wordpressMediaId: number): Promise<void> {
      const folder = await prisma.assetFolder.findUnique({ where: { slug: folderSlug } });
      if (!folder) throw new Error(`Unknown folder: ${folderSlug}`);
      await prisma.assetFolderMember.upsert({
        where: {
          folderId_wordpressMediaId: {
            folderId: folder.id,
            wordpressMediaId,
          },
        },
        create: { folderId: folder.id, wordpressMediaId },
        update: {},
      });
    },

    async removeFromFolder(folderSlug: string, wordpressMediaId: number): Promise<void> {
      const folder = await prisma.assetFolder.findUnique({ where: { slug: folderSlug } });
      if (!folder) return;
      await prisma.assetFolderMember.deleteMany({
        where: { folderId: folder.id, wordpressMediaId },
      });
    },

    async listMediaIdsInFolder(folderSlug: string): Promise<number[]> {
      const folder = await prisma.assetFolder.findUnique({
        where: { slug: folderSlug },
        include: { members: { select: { wordpressMediaId: true } } },
      });
      return folder?.members.map((m) => m.wordpressMediaId) ?? [];
    },

    async listFavoriteIds(userId: string): Promise<number[]> {
      const rows = await prisma.assetFavorite.findMany({
        where: { userId },
        select: { wordpressMediaId: true },
        orderBy: { createdAt: "desc" },
      });
      return rows.map((r) => r.wordpressMediaId);
    },

    async setFavorite(userId: string, wordpressMediaId: number, favorite: boolean): Promise<void> {
      if (favorite) {
        await prisma.assetFavorite.upsert({
          where: {
            userId_wordpressMediaId: { userId, wordpressMediaId },
          },
          create: { userId, wordpressMediaId },
          update: {},
        });
        return;
      }
      await prisma.assetFavorite.deleteMany({
        where: { userId, wordpressMediaId },
      });
    },

    async replaceUsagesForMedia(
      wordpressMediaId: number,
      usages: Omit<AssetUsage, "wordpressMediaId">[],
    ): Promise<void> {
      await prisma.$transaction([
        prisma.assetUsage.deleteMany({ where: { wordpressMediaId } }),
        ...(usages.length
          ? [
              prisma.assetUsage.createMany({
                data: usages.map((u) => ({
                  wordpressMediaId,
                  contextType: u.contextType,
                  contextId: u.contextId,
                  contextLabel: u.contextLabel,
                  fieldPath: u.fieldPath,
                  editorHref: u.editorHref,
                  lastSeenAt: new Date(),
                })),
              }),
            ]
          : []),
      ]);
    },

    async replaceAllUsages(usages: AssetUsage[]): Promise<void> {
      await prisma.$transaction(async (tx) => {
        await tx.assetUsage.deleteMany();
        if (usages.length === 0) return;
        await tx.assetUsage.createMany({
          data: usages.map((u) => ({
            wordpressMediaId: u.wordpressMediaId,
            contextType: u.contextType,
            contextId: u.contextId,
            contextLabel: u.contextLabel,
            fieldPath: u.fieldPath,
            editorHref: u.editorHref,
            lastSeenAt: new Date(),
          })),
        });
      });
    },

    async listUsages(wordpressMediaId: number): Promise<AssetUsage[]> {
      const rows = await prisma.assetUsage.findMany({
        where: { wordpressMediaId },
        orderBy: { contextLabel: "asc" },
      });
      return rows.map((row) => ({
        wordpressMediaId: row.wordpressMediaId,
        contextType: row.contextType as AssetUsage["contextType"],
        contextId: row.contextId,
        contextLabel: row.contextLabel,
        fieldPath: row.fieldPath,
        editorHref: row.editorHref,
      }));
    },

    async rewriteUsagesMediaId(fromId: number, toId: number): Promise<number> {
      const result = await prisma.assetUsage.updateMany({
        where: { wordpressMediaId: fromId },
        data: { wordpressMediaId: toId, lastSeenAt: new Date() },
      });
      return result.count;
    },

    async nextVersionNumber(wordpressMediaId: number): Promise<number> {
      const latest = await prisma.assetVersion.findFirst({
        where: { wordpressMediaId },
        orderBy: { version: "desc" },
        select: { version: true },
      });
      return (latest?.version ?? 0) + 1;
    },

    async recordVersion(input: {
      wordpressMediaId: number;
      previousMediaId?: number | null;
      previousSourceUrl: string;
      title?: string | null;
      alt?: string | null;
      mimeType?: string | null;
      width?: number | null;
      height?: number | null;
      metadata?: Record<string, unknown> | null;
      createdById?: string | null;
    }): Promise<void> {
      const version = await this.nextVersionNumber(input.wordpressMediaId);
      await prisma.assetVersion.create({
        data: {
          wordpressMediaId: input.wordpressMediaId,
          version,
          previousMediaId: input.previousMediaId ?? null,
          previousSourceUrl: input.previousSourceUrl,
          title: input.title ?? null,
          alt: input.alt ?? null,
          mimeType: input.mimeType ?? null,
          width: input.width ?? null,
          height: input.height ?? null,
          metadata: (input.metadata as object | undefined) ?? undefined,
          createdById: input.createdById ?? null,
        },
      });
    },

    async listVersions(wordpressMediaId: number) {
      return prisma.assetVersion.findMany({
        where: { wordpressMediaId },
        orderBy: { version: "desc" },
      });
    },

    async getSyncState() {
      return prisma.assetSyncState.upsert({
        where: { key: "default" },
        create: { key: "default", status: "idle" },
        update: {},
      });
    },

    async markSync(input: {
      status: string;
      lastCursor?: string | null;
      lastMediaModified?: Date | null;
      lastError?: string | null;
    }) {
      return prisma.assetSyncState.upsert({
        where: { key: "default" },
        create: {
          key: "default",
          status: input.status,
          lastSyncedAt: new Date(),
          lastCursor: input.lastCursor ?? null,
          lastMediaModified: input.lastMediaModified ?? null,
          lastError: input.lastError ?? null,
        },
        update: {
          status: input.status,
          lastSyncedAt: new Date(),
          lastCursor: input.lastCursor ?? undefined,
          lastMediaModified: input.lastMediaModified ?? undefined,
          lastError: input.lastError ?? null,
        },
      });
    },
  };
}

export type AssetMetadataRepository = ReturnType<typeof createAssetMetadataRepository>;

let defaultMetaRepo: AssetMetadataRepository | undefined;

export function getAssetMetadataRepository(): AssetMetadataRepository {
  if (!defaultMetaRepo) {
    defaultMetaRepo = createAssetMetadataRepository();
  }
  return defaultMetaRepo;
}
