/**
 * resolveExperienceDocument — unified facade.
 * Tries WordPress Page first (services/landings), then Post (blogs).
 * Applies Layout Intelligence + Design Quality Validator (non-blocking).
 */

import "server-only";

import { cache } from "react";

import { createBlogExperienceProvider } from "@/lib/experience/unified/providers/blogProvider";
import { createServiceExperienceProvider } from "@/lib/experience/unified/providers/serviceProvider";
import { scoreExperienceIntelligence } from "@/lib/experience/unified/intelligence";
import { validateExperienceQuality } from "@/lib/experience/quality/validator";
import { buildExperienceReviewReport } from "@/lib/experience/quality/reviewMode";
import { applyContextAwareMessaging } from "@/lib/experience/unified/context";
import type { ExperienceDocument } from "@/types/experience-document";

const serviceProvider = createServiceExperienceProvider();
const blogProvider = createBlogExperienceProvider();

export const resolveExperienceDocument = cache(
  async (uri: string): Promise<ExperienceDocument | null> => {
    // Phase 8.0: service/page provider first (WordPress Pages + editorial pipeline)
    const pageDoc = await serviceProvider.getDocument(uri);
    if (pageDoc) {
      return enrichExperienceDocument(pageDoc);
    }

    const blogDoc = await blogProvider.getDocument(uri);
    if (blogDoc) {
      return enrichExperienceDocument(blogDoc);
    }

    return null;
  },
);

export async function resolveExperienceSchemas(uri: string): Promise<object[]> {
  const page = await serviceProvider.getDocument(uri);
  if (page) return serviceProvider.getSchema(uri);
  return blogProvider.getSchema(uri);
}

function enrichExperienceDocument(doc: ExperienceDocument): ExperienceDocument {
  const withContext = applyContextAwareMessaging(doc);
  const intelligence = scoreExperienceIntelligence(withContext);
  const qualityWarnings = validateExperienceQuality(withContext);
  const review = buildExperienceReviewReport({
    ...withContext,
    intelligence,
    qualityWarnings,
  });

  return {
    ...withContext,
    intelligence,
    qualityWarnings,
    review,
  };
}
