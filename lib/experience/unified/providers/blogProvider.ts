/**
 * Blog ExperienceContentProvider — adapts Blog Presentation Engine.
 */

import "server-only";

import { getBlogDocument } from "@/lib/experience/engine/blogPresentationEngine";
import { blogDocumentToExperience } from "@/lib/experience/unified/adapters";
import type { ExperienceContentProvider } from "@/lib/experience/unified/provider";
import { generateBlogJsonLd } from "@/lib/seo/blogSchema";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";

export function createBlogExperienceProvider(): ExperienceContentProvider {
  return {
    kind: "blog",

    async getDocument(uri) {
      const doc = await getBlogDocument(uri);
      if (!doc) return null;
      return blogDocumentToExperience(doc);
    },

    async getMetadata(uri) {
      const doc = await this.getDocument(uri);
      if (!doc) return null;
      return {
        uri: doc.uri,
        title: doc.title,
        kind: doc.kind,
        presentationStatus: doc.presentationStatus,
      };
    },

    async getSidebar(uri) {
      const doc = await this.getDocument(uri);
      return doc?.sidebar ?? null;
    },

    async getSeo(uri) {
      const doc = await this.getDocument(uri);
      return doc?.seo ?? null;
    },

    async getSchema(uri) {
      const blog = await getBlogDocument(uri);
      if (!blog || !blog.config.seo.schemaEnabled) return [];
      const fromBlog = generateBlogJsonLd(blog).filter(
        (item): item is NonNullable<typeof item> => item != null,
      );
      return [
        generateBreadcrumbSchema(
          blog.breadcrumbs.map((item) => ({
            name: item.label,
            path: item.href === "/" ? "/" : item.href.replace(/\/$/, ""),
          })),
        ),
        ...fromBlog,
      ];
    },

    async getRelated(uri) {
      const doc = await this.getDocument(uri);
      return doc?.related ?? [];
    },

    async getPresentation(uri) {
      const doc = await this.getDocument(uri);
      return doc?.config ?? null;
    },
  };
}
