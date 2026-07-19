import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

import { staticPageTag } from "@/lib/experience/cache/tags";
import { createStaticPageRepository } from "@/lib/experience/repositories/staticPageRepository";
import { writeAuditLog } from "@/lib/experience/services/auditService";
import { getDefaultSite } from "@/lib/experience/services/siteService";
import { STATIC_PAGE_CATALOG } from "@/lib/experience/static-pages/catalog";
import { createStaticPageDefaultConfig } from "@/lib/experience/static-pages/defaults";
import { migrateStaticSectionIds } from "@/lib/experience/static-pages/applyOverrides";
import { getStaticPageDescriptor } from "@/lib/experience/static-pages/registry";
import {
  parsePresentationConfig,
  presentationConfigSchema,
  type PresentationConfigInput,
} from "@/lib/experience/validations/presentationConfig";
import type { PresentationConfig } from "@/types/presentation-config";
import type {
  StaticPageListItem,
  StaticPageSlug,
} from "@/types/static-page";

function migrateLoadedStaticConfig(
  slug: string,
  config: PresentationConfig,
): PresentationConfig {
  const descriptor = getStaticPageDescriptor(slug);
  return migrateStaticSectionIds(
    config,
    descriptor?.sections.map((section) => ({
      id: section.id,
      type: section.type,
      label: section.displayName,
      variant: section.defaultVariant,
    })),
  );
}

function revalidateStaticPage(slug: StaticPageSlug, path: string) {
  revalidateTag(staticPageTag(slug));
  revalidatePath(path === "/" ? "/" : path.replace(/\/$/, "") || "/");
  revalidatePath("/admin/static-pages");
  revalidatePath(`/admin/static-pages/${slug}`);
}

/**
 * Ensures catalog static pages exist in Postgres for the default site.
 */
export async function ensureStaticPagesBootstrap() {
  const site = await getDefaultSite();
  const repo = createStaticPageRepository();

  for (const page of STATIC_PAGE_CATALOG) {
    await repo.upsertPage({
      siteId: site.id,
      slug: page.slug,
      path: page.path,
      title: page.title,
    });
  }
}

export async function listStaticStudioPages(): Promise<StaticPageListItem[]> {
  await ensureStaticPagesBootstrap();
  const site = await getDefaultSite();
  const repo = createStaticPageRepository();
  const rows = await repo.listBySite(site.id);
  const bySlug = new Map(rows.map((row) => [row.slug, row]));

  return STATIC_PAGE_CATALOG.map((def) => {
    const row = bySlug.get(def.slug);
    return {
      slug: def.slug,
      path: def.path,
      title: def.title,
      description: def.description,
      category: def.category,
      sectionCount: def.sections.length,
      pageId: row?.id ?? null,
      status: row?.presentation?.status ?? "NOT_CONFIGURED",
      updatedAt: row?.presentation?.updatedAt?.toISOString() ?? null,
    };
  });
}

export async function getStaticStudioPage(slug: string) {
  await ensureStaticPagesBootstrap();
  const site = await getDefaultSite();
  const repo = createStaticPageRepository();
  const page = await repo.findBySlug(site.id, slug);
  if (!page) return null;

  const def = STATIC_PAGE_CATALOG.find((item) => item.slug === slug);
  const rawConfig = page.presentation
    ? parsePresentationConfig(page.presentation.config)
    : createStaticPageDefaultConfig(slug as StaticPageSlug);
  const initialConfig = migrateLoadedStaticConfig(slug, rawConfig);

  return {
    page,
    def,
    initialConfig,
    status: page.presentation?.status ?? ("NOT_CONFIGURED" as const),
  };
}

/**
 * Published config for public handcrafted routes (null → use component defaults).
 * Returns null if Postgres is unavailable so public pages keep rendering.
 */
export async function getPublishedStaticPageConfig(
  slug: StaticPageSlug,
): Promise<PresentationConfig | null> {
  try {
    const site = await getDefaultSite();
    const repo = createStaticPageRepository();
    const page = await repo.findBySlug(site.id, slug);
    if (!page?.presentation || page.presentation.status !== "PUBLISHED") {
      return null;
    }
    return migrateLoadedStaticConfig(
      slug,
      parsePresentationConfig(page.presentation.config),
    );
  } catch (error) {
    // Soft failure — public routes must render without Studio overlays.
    // Use a string warn so Next.js Dev Overlay does not show "[CWMC] {}".
    const message =
      error instanceof Error ? error.message : "Database unavailable";
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[CWMC] getPublishedStaticPageConfig(${slug}): ${message}`,
      );
    }
    return null;
  }
}

export function getCachedPublishedStaticPageConfig(slug: StaticPageSlug) {
  return unstable_cache(
    async () => getPublishedStaticPageConfig(slug),
    [`static-page-config-${slug}`],
    {
      revalidate: 3600,
      tags: [staticPageTag(slug)],
    },
  )();
}

export async function saveStaticPagePresentation(input: {
  pageId: string;
  data: PresentationConfigInput;
  publish?: boolean;
  note?: string;
  userId?: string;
}): Promise<{ presentationId: string }> {
  const parsed = presentationConfigSchema.parse(input.data);
  const repo = createStaticPageRepository();
  const page = await repo.findById(input.pageId);
  if (!page) {
    throw new Error("Static page not found");
  }

  const status = input.publish ? "PUBLISHED" : "DRAFT";
  const presentation = await repo.upsertPresentation({
    pageId: page.id,
    config: parsed,
    status,
    publishedAt: input.publish ? new Date() : page.presentation?.publishedAt,
  });

  const nextVersion = (await repo.latestVersionNumber(presentation.id)) + 1;
  await repo.createVersion({
    presentationId: presentation.id,
    version: nextVersion,
    status: input.publish ? "PUBLISHED" : "DRAFT",
    snapshot: parsed,
    note: input.note ?? null,
    createdById: input.userId ?? null,
  });

  await writeAuditLog({
    action: input.publish
      ? "static_page.presentation.publish"
      : "static_page.presentation.save",
    entityType: "StaticPagePresentation",
    entityId: presentation.id,
    userId: input.userId,
    summary: `${page.slug} v${nextVersion}${input.publish ? " published" : " draft"}`,
  });

  revalidateStaticPage(page.slug as StaticPageSlug, page.path);
  return { presentationId: presentation.id };
}
