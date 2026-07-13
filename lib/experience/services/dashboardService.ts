import "server-only";

import { prisma } from "@/lib/experience/db";
import { createTemplateRepository } from "@/lib/experience/repositories/templateRepository";
import { createUserRepository } from "@/lib/experience/repositories/userRepository";
import { createWordPressPageRepository } from "@/lib/experience/repositories/wordpressPageRepository";
import { getDefaultSite } from "@/lib/experience/services/siteService";

export type DashboardSummary = {
  pageExperiences: number;
  templates: number;
  users: number;
  reviews: number;
  galleries: number;
  databaseConfigured: boolean;
};

/**
 * Aggregates Studio health metrics for the dashboard shell.
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const databaseConfigured = Boolean(process.env.DATABASE_URL);

  if (!databaseConfigured) {
    return {
      pageExperiences: 0,
      templates: 0,
      users: 0,
      reviews: 0,
      galleries: 0,
      databaseConfigured: false,
    };
  }

  try {
    const site = await getDefaultSite();
    const pages = createWordPressPageRepository();
    const templates = createTemplateRepository();
    const users = createUserRepository();

    const [pageExperiences, templateCount, userCount, reviews, galleries] =
      await Promise.all([
        pages.count(site.id),
        templates.count(site.id),
        users.list().then((rows) => rows.length),
        prisma.review.count(),
        prisma.gallery.count(),
      ]);

    return {
      pageExperiences,
      templates: templateCount,
      users: userCount,
      reviews,
      galleries,
      databaseConfigured: true,
    };
  } catch {
    return {
      pageExperiences: 0,
      templates: 0,
      users: 0,
      reviews: 0,
      galleries: 0,
      databaseConfigured: true,
    };
  }
}
