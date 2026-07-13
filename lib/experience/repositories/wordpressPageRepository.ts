import "server-only";

import type { PagePresentation, Template, WordPressPage } from "@prisma/client";

import { prisma } from "@/lib/experience/db";

export type WordPressPageWithPresentation = WordPressPage & {
  presentation: (PagePresentation & { template: Template | null }) | null;
};

export function createWordPressPageRepository() {
  return {
    list(siteId: string): Promise<WordPressPageWithPresentation[]> {
      return prisma.wordPressPage.findMany({
        where: { siteId },
        include: {
          presentation: { include: { template: true } },
        },
        orderBy: [{ title: "asc" }],
      });
    },

    findById(id: string): Promise<WordPressPageWithPresentation | null> {
      return prisma.wordPressPage.findUnique({
        where: { id },
        include: {
          presentation: { include: { template: true } },
        },
      });
    },

    findByUri(
      siteId: string,
      uri: string,
    ): Promise<WordPressPageWithPresentation | null> {
      return prisma.wordPressPage.findUnique({
        where: { siteId_uri: { siteId, uri } },
        include: {
          presentation: { include: { template: true } },
        },
      });
    },

    findByDatabaseIds(siteId: string, databaseIds: number[]) {
      return prisma.wordPressPage.findMany({
        where: { siteId, databaseId: { in: databaseIds } },
      });
    },

    upsertMeta(
      siteId: string,
      data: {
        databaseId: number;
        uri: string;
        slug: string;
        title: string;
        status: string;
        wpTemplate: string | null;
        featuredImageUrl: string | null;
        seoTitle: string | null;
        parentDatabaseId: number | null;
        lastWordPressModified: Date;
        lastSyncedAt: Date;
      },
    ) {
      return prisma.wordPressPage.upsert({
        where: {
          siteId_databaseId: {
            siteId,
            databaseId: data.databaseId,
          },
        },
        create: {
          siteId,
          ...data,
        },
        update: {
          uri: data.uri,
          slug: data.slug,
          title: data.title,
          status: data.status,
          wpTemplate: data.wpTemplate,
          featuredImageUrl: data.featuredImageUrl,
          seoTitle: data.seoTitle,
          parentDatabaseId: data.parentDatabaseId,
          lastWordPressModified: data.lastWordPressModified,
          lastSyncedAt: data.lastSyncedAt,
        },
      });
    },

    count(siteId: string) {
      return prisma.wordPressPage.count({ where: { siteId } });
    },
  };
}

export type WordPressPageRepository = ReturnType<
  typeof createWordPressPageRepository
>;
