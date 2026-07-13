import "server-only";

import { prisma } from "@/lib/experience/db";

const DEFAULT_SITE_KEY = "default";

export const DEFAULT_TEMPLATES = [
  {
    slug: "generic",
    name: "Generic",
    description: "Flexible layout for standard WordPress pages.",
    sortOrder: 0,
  },
  {
    slug: "hair-treatment",
    name: "Hair Treatment",
    description: "Service pages for hair transplant and restoration.",
    sortOrder: 1,
  },
  {
    slug: "plastic-surgery",
    name: "Plastic Surgery",
    description: "Surgical aesthetic procedure pages.",
    sortOrder: 2,
  },
  {
    slug: "skin",
    name: "Skin",
    description: "Dermatology and skin treatment pages.",
    sortOrder: 3,
  },
  {
    slug: "wellness",
    name: "Wellness",
    description: "Wellness and anti-aging consultation pages.",
    sortOrder: 4,
  },
  {
    slug: "doctor",
    name: "Doctor",
    description: "Doctor profile presentation.",
    sortOrder: 5,
  },
  {
    slug: "blog",
    name: "Blog",
    description: "Editorial blog article presentation.",
    sortOrder: 6,
  },
] as const;

/**
 * Ensures the default site and presentation templates exist.
 */
export async function ensureSiteBootstrap() {
  const site = await prisma.site.upsert({
    where: { key: DEFAULT_SITE_KEY },
    create: {
      key: DEFAULT_SITE_KEY,
      name: "Care Well Medical Centre",
    },
    update: {},
  });

  for (const template of DEFAULT_TEMPLATES) {
    await prisma.template.upsert({
      where: {
        siteId_slug: { siteId: site.id, slug: template.slug },
      },
      create: {
        siteId: site.id,
        slug: template.slug,
        name: template.name,
        description: template.description,
        sortOrder: template.sortOrder,
      },
      update: {
        name: template.name,
        description: template.description,
        sortOrder: template.sortOrder,
        active: true,
      },
    });
  }

  return site;
}

export async function getDefaultSite() {
  return ensureSiteBootstrap();
}
