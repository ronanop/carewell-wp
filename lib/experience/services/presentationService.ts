import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

import {
  PRESENTATION_HOME_TAG,
  PRESENTATION_NAV_TAG,
  presentationPageTag,
  presentationTemplateTag,
} from "@/lib/experience/cache/tags";
import { createPagePresentationRepository } from "@/lib/experience/repositories/pagePresentationRepository";
import { createTemplateRepository } from "@/lib/experience/repositories/templateRepository";
import { createWordPressPageRepository } from "@/lib/experience/repositories/wordpressPageRepository";
import { writeAuditLog } from "@/lib/experience/services/auditService";
import { getDefaultSite } from "@/lib/experience/services/siteService";
import {
  createDefaultPresentationConfig,
  emptyToNull,
  parsePresentationConfig,
  presentationConfigSchema,
  type PresentationConfigInput,
} from "@/lib/experience/validations/presentationConfig";
import type { PresentationConfig } from "@/types/presentation-config";

function revalidatePresentation(uri: string, config: PresentationConfig) {
  revalidateTag(presentationPageTag(uri));
  revalidatePath(uri === "/" ? "/" : uri.replace(/\/$/, "") || "/");

  if (config.templateSlug) {
    revalidateTag(presentationTemplateTag(config.templateSlug));
  }

  if (config.advanced.cacheTag) {
    revalidateTag(config.advanced.cacheTag);
  }

  if (uri === "/" || uri === "") {
    revalidateTag(PRESENTATION_HOME_TAG);
  }

  // Sticky CTA / nav presentation can affect chrome.
  if (config.navigation.stickyCta || config.navigation.stickyMobileCta) {
    revalidateTag(PRESENTATION_NAV_TAG);
  }
}

/**
 * Loads PresentationConfig for a URI (cached). Returns defaults when not configured.
 */
export async function getPagePresentation(
  uri: string,
): Promise<PresentationConfig | null> {
  const site = await getDefaultSite();
  const pages = createWordPressPageRepository();
  const page = await pages.findByUri(site.id, uri);
  if (!page) return null;

  if (!page.presentation) {
    return createDefaultPresentationConfig();
  }

  return parsePresentationConfig(page.presentation.config);
}

/**
 * Cached PresentationConfig for public rendering.
 */
export function getCachedPagePresentation(uri: string) {
  const cached = unstable_cache(
    async () => getPagePresentation(uri),
    [`presentation-config-${uri}`],
    {
      revalidate: 3600,
      tags: [presentationPageTag(uri), "presentation-config"],
    },
  );
  return cached();
}

export async function savePagePresentation(input: {
  pageId: string;
  data: PresentationConfigInput;
  userId?: string | null;
  publish?: boolean;
  note?: string | null;
}) {
  const parsed = presentationConfigSchema.parse({
    ...input.data,
    advanced: {
      ...input.data.advanced,
      customCssClass: emptyToNull(input.data.advanced.customCssClass),
      cacheTag: emptyToNull(input.data.advanced.cacheTag),
      notes: emptyToNull(input.data.advanced.notes),
    },
    seo: {
      ...input.data.seo,
      canonicalOverride: emptyToNull(input.data.seo.canonicalOverride),
    },
    hero: {
      ...input.data.hero,
      media:
        input.data.hero.imageSource === "wordpress-media"
          ? input.data.hero.media
          : null,
    },
  });

  const pages = createWordPressPageRepository();
  const presentations = createPagePresentationRepository();
  const templates = createTemplateRepository();
  const site = await getDefaultSite();

  const page = await pages.findById(input.pageId);
  if (!page) {
    throw new Error("WordPress page not found in Studio");
  }

  let templateId: string | null = null;
  if (parsed.templateSlug) {
    const template = await templates.findBySlug(site.id, parsed.templateSlug);
    templateId = template?.id ?? null;
  }

  const status = input.publish ? "PUBLISHED" : "DRAFT";
  const previousPublishedAt = page.presentation?.publishedAt ?? null;

  const saved = await presentations.upsertForPage(page.id, {
    templateId,
    status,
    config: parsed,
    publishedAt:
      status === "PUBLISHED" ? new Date() : previousPublishedAt,
  });

  if (input.publish) {
    await presentations.archivePublishedVersions(saved.id);
  }

  await presentations.createVersion({
    presentationId: saved.id,
    snapshot: parsed,
    status: input.publish ? "PUBLISHED" : "DRAFT",
    createdById: input.userId,
    note:
      input.note ??
      (input.publish ? "Published presentation" : "Saved draft"),
  });

  await writeAuditLog({
    userId: input.userId,
    action: input.publish ? "presentation.publish" : "presentation.save",
    entityType: "PagePresentation",
    entityId: saved.id,
    summary: `${page.title} (${page.uri})`,
  });

  if (input.publish) {
    revalidatePresentation(page.uri, parsed);
    const { emitStudioEvent } = await import("@/lib/experience/platform/events");
    emitStudioEvent("PresentationPublished", {
      pageId: page.id,
      uri: page.uri,
      presentationId: saved.id,
    });
  }

  revalidatePath("/admin/pages");
  revalidatePath(`/admin/page-studio/${page.id}`);

  return saved;
}

export async function rollbackPresentationVersion(input: {
  pageId: string;
  version: number;
  userId?: string | null;
}) {
  const pages = createWordPressPageRepository();
  const presentations = createPagePresentationRepository();
  const page = await pages.findById(input.pageId);
  if (!page?.presentation) {
    throw new Error("Presentation not found");
  }

  const versionRow = await presentations.findVersion(
    page.presentation.id,
    input.version,
  );
  if (!versionRow) {
    throw new Error("Version not found");
  }

  const config = parsePresentationConfig(versionRow.snapshot);
  return savePagePresentation({
    pageId: page.id,
    data: config,
    userId: input.userId,
    publish: false,
    note: `Rolled back to version ${input.version}`,
  });
}
