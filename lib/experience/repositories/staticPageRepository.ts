import "server-only";

import type { Prisma, PresentationStatus, VersionStatus } from "@prisma/client";

import { prisma } from "@/lib/experience/db";
import type { PresentationConfig } from "@/types/presentation-config";

export function createStaticPageRepository() {
  return {
    upsertPage(input: {
      siteId: string;
      slug: string;
      path: string;
      title: string;
    }) {
      return prisma.staticPage.upsert({
        where: {
          siteId_slug: { siteId: input.siteId, slug: input.slug },
        },
        create: {
          siteId: input.siteId,
          slug: input.slug,
          path: input.path,
          title: input.title,
        },
        update: {
          path: input.path,
          title: input.title,
        },
      });
    },

    listBySite(siteId: string) {
      return prisma.staticPage.findMany({
        where: { siteId },
        include: { presentation: true },
        orderBy: { title: "asc" },
      });
    },

    findBySlug(siteId: string, slug: string) {
      return prisma.staticPage.findUnique({
        where: { siteId_slug: { siteId, slug } },
        include: { presentation: true },
      });
    },

    findById(pageId: string) {
      return prisma.staticPage.findUnique({
        where: { id: pageId },
        include: { presentation: true },
      });
    },

    upsertPresentation(input: {
      pageId: string;
      config: PresentationConfig;
      status: PresentationStatus;
      publishedAt?: Date | null;
    }) {
      return prisma.staticPagePresentation.upsert({
        where: { pageId: input.pageId },
        create: {
          pageId: input.pageId,
          config: input.config as unknown as Prisma.InputJsonValue,
          status: input.status,
          publishedAt: input.publishedAt ?? null,
        },
        update: {
          config: input.config as unknown as Prisma.InputJsonValue,
          status: input.status,
          publishedAt: input.publishedAt ?? undefined,
        },
      });
    },

    async latestVersionNumber(presentationId: string) {
      const latest = await prisma.staticPresentationVersion.findFirst({
        where: { presentationId },
        orderBy: { version: "desc" },
        select: { version: true },
      });
      return latest?.version ?? 0;
    },

    createVersion(input: {
      presentationId: string;
      version: number;
      status: VersionStatus;
      snapshot: PresentationConfig;
      note?: string | null;
      createdById?: string | null;
    }) {
      return prisma.staticPresentationVersion.create({
        data: {
          presentationId: input.presentationId,
          version: input.version,
          status: input.status,
          snapshot: input.snapshot as unknown as Prisma.InputJsonValue,
          note: input.note ?? null,
          createdById: input.createdById ?? null,
        },
      });
    },
  };
}

export type StaticPageRepository = ReturnType<typeof createStaticPageRepository>;
