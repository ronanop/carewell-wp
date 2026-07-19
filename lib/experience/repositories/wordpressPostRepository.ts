import "server-only";

import type { BlogPresentation, PresentationStatus, WordPressPost } from "@prisma/client";

import { prisma } from "@/lib/experience/db";

export type WordPressPostWithPresentation = WordPressPost & {
  presentation: BlogPresentation | null;
};

export function createWordPressPostRepository() {
  return {
    findById(id: string): Promise<WordPressPostWithPresentation | null> {
      return prisma.wordPressPost.findUnique({
        where: { id },
        include: { presentation: true },
      });
    },

    findByUri(
      siteId: string,
      uri: string,
    ): Promise<WordPressPostWithPresentation | null> {
      return prisma.wordPressPost.findUnique({
        where: { siteId_uri: { siteId, uri } },
        include: { presentation: true },
      });
    },

    listBySite(siteId: string): Promise<WordPressPostWithPresentation[]> {
      return prisma.wordPressPost.findMany({
        where: { siteId },
        include: { presentation: true },
        orderBy: { lastWordPressModified: "desc" },
      });
    },

    upsertMeta(
      siteId: string,
      meta: {
        databaseId: number;
        uri: string;
        slug: string;
        title: string;
        status: string;
        excerpt: string | null;
        featuredImageUrl: string | null;
        seoTitle: string | null;
        authorName: string | null;
        authorSlug: string | null;
        categorySlugs: string;
        categoryNames: string;
        modifiedAt: Date;
      },
    ) {
      return prisma.wordPressPost.upsert({
        where: {
          siteId_databaseId: { siteId, databaseId: meta.databaseId },
        },
        create: {
          siteId,
          databaseId: meta.databaseId,
          uri: meta.uri,
          slug: meta.slug,
          title: meta.title,
          status: meta.status,
          excerpt: meta.excerpt,
          featuredImageUrl: meta.featuredImageUrl,
          seoTitle: meta.seoTitle,
          authorName: meta.authorName,
          authorSlug: meta.authorSlug,
          categorySlugs: meta.categorySlugs,
          categoryNames: meta.categoryNames,
          lastWordPressModified: meta.modifiedAt,
          lastSyncedAt: new Date(),
        },
        update: {
          uri: meta.uri,
          slug: meta.slug,
          title: meta.title,
          status: meta.status,
          excerpt: meta.excerpt,
          featuredImageUrl: meta.featuredImageUrl,
          seoTitle: meta.seoTitle,
          authorName: meta.authorName,
          authorSlug: meta.authorSlug,
          categorySlugs: meta.categorySlugs,
          categoryNames: meta.categoryNames,
          lastWordPressModified: meta.modifiedAt,
          lastSyncedAt: new Date(),
        },
        include: { presentation: true },
      });
    },

    async ensurePresentation(
      postId: string,
      config: object,
      status: PresentationStatus = "DRAFT",
    ) {
      return prisma.blogPresentation.upsert({
        where: { postId },
        create: {
          postId,
          config,
          status,
        },
        update: {},
      });
    },
  };
}
