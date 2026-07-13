import "server-only";

import { prisma } from "@/lib/experience/db";

export function createTemplateRepository() {
  return {
    list(siteId: string) {
      return prisma.template.findMany({
        where: { siteId, active: true },
        orderBy: { sortOrder: "asc" },
      });
    },

    findBySlug(siteId: string, slug: string) {
      return prisma.template.findUnique({
        where: { siteId_slug: { siteId, slug } },
      });
    },

    count(siteId: string) {
      return prisma.template.count({ where: { siteId } });
    },
  };
}

export type TemplateRepository = ReturnType<typeof createTemplateRepository>;
