/**
 * Service ExperienceContentProvider — editorial intelligence for treatment pages.
 */

import "server-only";

import { getServiceDocument } from "@/lib/experience/engine/servicePresentationEngine";
import { getPresentationPage } from "@/lib/experience/engine/presentationEngine";
import {
  presentationPageToExperience,
  serviceDocumentToExperience,
} from "@/lib/experience/unified/adapters";
import type { ExperienceContentProvider } from "@/lib/experience/unified/provider";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";
import type { ExperienceDocument } from "@/types/experience-document";

export function createServiceExperienceProvider(): ExperienceContentProvider {
  return {
    kind: "service",

    async getDocument(uri) {
      const service = await getServiceDocument(uri);
      if (service) {
        return {
          ...serviceDocumentToExperience(service),
          useLegacyPresentationFallback: service.useLegacyPresentationFallback,
          semanticConfidence: service.semanticConfidence,
        };
      }

      // Non-service / short pages: plain presentation adapter
      const page = await getPresentationPage(uri);
      if (!page) return null;
      return {
        ...presentationPageToExperience(page),
        useLegacyPresentationFallback: true,
        semanticConfidence: "low",
      };
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
      const page = await getPresentationPage(uri);
      if (!page || !page.config.seo.schemaEnabled) return [];
      return [
        generateBreadcrumbSchema(
          page.breadcrumbs.map((item) => ({
            name: item.label,
            path: item.href === "/" ? "/" : item.href.replace(/\/$/, ""),
          })),
        ),
      ];
    },

    async getRelated() {
      return [];
    },

    async getPresentation(uri) {
      const doc = await this.getDocument(uri);
      return doc?.config ?? null;
    },
  };
}
