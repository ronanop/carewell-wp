import "server-only";

import type { Prisma, PresentationStatus, VersionStatus } from "@prisma/client";

import { prisma } from "@/lib/experience/db";
import type { PresentationConfig } from "@/types/presentation-config";

export function createPagePresentationRepository() {
  return {
    findByPageId(pageId: string) {
      return prisma.pagePresentation.findUnique({
        where: { pageId },
        include: { template: true, page: true },
      });
    },

    upsertForPage(
      pageId: string,
      data: {
        templateId: string | null;
        status: PresentationStatus;
        config: PresentationConfig;
        publishedAt: Date | null;
      },
    ) {
      return prisma.pagePresentation.upsert({
        where: { pageId },
        create: {
          pageId,
          templateId: data.templateId,
          status: data.status,
          config: data.config as unknown as Prisma.InputJsonValue,
          publishedAt: data.publishedAt,
        },
        update: {
          templateId: data.templateId,
          status: data.status,
          config: data.config as unknown as Prisma.InputJsonValue,
          publishedAt: data.publishedAt,
        },
        include: { template: true, page: true },
      });
    },

    async createVersion(input: {
      presentationId: string;
      snapshot: PresentationConfig;
      status: VersionStatus;
      createdById?: string | null;
      note?: string | null;
    }) {
      const latest = await prisma.presentationVersion.findFirst({
        where: { presentationId: input.presentationId },
        orderBy: { version: "desc" },
        select: { version: true },
      });

      return prisma.presentationVersion.create({
        data: {
          presentationId: input.presentationId,
          version: (latest?.version ?? 0) + 1,
          status: input.status,
          snapshot: input.snapshot as unknown as Prisma.InputJsonValue,
          createdById: input.createdById ?? null,
          note: input.note ?? null,
        },
      });
    },

    /**
     * Archives prior published versions — never overwrites historical rows.
     */
    async archivePublishedVersions(presentationId: string) {
      return prisma.presentationVersion.updateMany({
        where: {
          presentationId,
          status: "PUBLISHED",
        },
        data: { status: "ARCHIVED" },
      });
    },

    listVersions(presentationId: string) {
      return prisma.presentationVersion.findMany({
        where: { presentationId },
        orderBy: { version: "desc" },
      });
    },

    findVersion(presentationId: string, version: number) {
      return prisma.presentationVersion.findUnique({
        where: {
          presentationId_version: { presentationId, version },
        },
      });
    },
  };
}

export type PagePresentationRepository = ReturnType<
  typeof createPagePresentationRepository
>;
