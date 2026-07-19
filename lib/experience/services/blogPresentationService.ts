import "server-only";

import { unstable_cache } from "next/cache";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/experience/db";
import { getDefaultSite } from "@/lib/experience/services/siteService";
import {
  createDefaultBlogPresentationConfig,
  parseBlogPresentationConfig,
  type BlogPresentationConfig,
} from "@/lib/experience/validations/blogPresentationConfig";
import { createWordPressPostRepository } from "@/lib/experience/repositories/wordpressPostRepository";
import { normalizePageUri } from "@/lib/wordpress/repositories/pageRepository";

function asJson(value: BlogPresentationConfig): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue;
}

export async function getCachedBlogPresentation(
  uri: string,
): Promise<BlogPresentationConfig | null> {
  const normalizedUri = normalizePageUri(uri);

  return unstable_cache(
    async () => {
      const site = await getDefaultSite();
      const local = await createWordPressPostRepository().findByUri(
        site.id,
        normalizedUri,
      );
      if (!local?.presentation || local.presentation.status !== "PUBLISHED") {
        return null;
      }
      return parseBlogPresentationConfig(local.presentation.config);
    },
    ["blog-presentation", normalizedUri],
    { tags: ["blogs", `blog:${normalizedUri}`], revalidate: 3600 },
  )();
}

export async function saveBlogPresentationDraft(
  postId: string,
  config: BlogPresentationConfig,
  userId?: string | null,
) {
  const posts = createWordPressPostRepository();
  const local = await posts.findById(postId);
  if (!local) throw new Error("Post not found");

  const parsed = parseBlogPresentationConfig(config);

  const presentation = await prisma.blogPresentation.upsert({
    where: { postId },
    create: {
      postId,
      config: asJson(parsed),
      status: "DRAFT",
    },
    update: {
      config: asJson(parsed),
      status: "DRAFT",
    },
  });

  const lastVersion = await prisma.blogPresentationVersion.findFirst({
    where: { presentationId: presentation.id },
    orderBy: { version: "desc" },
  });

  await prisma.blogPresentationVersion.create({
    data: {
      presentationId: presentation.id,
      version: (lastVersion?.version ?? 0) + 1,
      status: "DRAFT",
      snapshot: asJson(parsed),
      createdById: userId ?? null,
      note: "Autosave",
    },
  });

  return presentation;
}

export async function publishBlogPresentation(
  postId: string,
  config: BlogPresentationConfig,
  userId?: string | null,
) {
  const parsed = parseBlogPresentationConfig(config);

  const presentation = await prisma.blogPresentation.upsert({
    where: { postId },
    create: {
      postId,
      config: asJson(parsed),
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
    update: {
      config: asJson(parsed),
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  const lastVersion = await prisma.blogPresentationVersion.findFirst({
    where: { presentationId: presentation.id },
    orderBy: { version: "desc" },
  });

  await prisma.blogPresentationVersion.create({
    data: {
      presentationId: presentation.id,
      version: (lastVersion?.version ?? 0) + 1,
      status: "PUBLISHED",
      snapshot: asJson(parsed),
      createdById: userId ?? null,
      note: "Published",
    },
  });

  return presentation;
}

export function getDefaultBlogConfig() {
  return createDefaultBlogPresentationConfig();
}
