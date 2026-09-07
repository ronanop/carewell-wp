import "server-only";

import { getPrisma } from "@/lib/db/prisma";

export type VisitorDashboardStats = {
  pageviewsToday: number;
  pageviews7d: number;
  pageviews30d: number;
  visitorsToday: number;
  visitors7d: number;
  visitors30d: number;
  topPages: { path: string; views: number }[];
};

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function daysAgo(n: number) {
  const x = startOfDay();
  x.setDate(x.getDate() - n);
  return x;
}

function emptyStats(): VisitorDashboardStats {
  return {
    pageviewsToday: 0,
    pageviews7d: 0,
    pageviews30d: 0,
    visitorsToday: 0,
    visitors7d: 0,
    visitors30d: 0,
    topPages: [],
  };
}

async function distinctVisitorsSince(since: Date): Promise<number> {
  const prisma = getPrisma();
  const rows = await prisma.$queryRaw<[{ count: bigint | number }]>`
    SELECT COUNT(DISTINCT "visitorId")::bigint AS count
    FROM "SitePageView"
    WHERE "createdAt" >= ${since}
  `;
  return Number(rows[0]?.count ?? 0);
}

export async function getVisitorDashboardStats(): Promise<VisitorDashboardStats> {
  const prisma = getPrisma();

  // Hot-reload / stale client after schema add — fail soft with zeros
  if (!prisma.sitePageView) {
    console.error(
      "[analytics] prisma.sitePageView missing — restart Next after prisma generate",
    );
    return emptyStats();
  }

  const today = startOfDay();
  const d7 = daysAgo(7);
  const d30 = daysAgo(30);

  try {
    const [
      pageviewsToday,
      pageviews7d,
      pageviews30d,
      visitorsToday,
      visitors7d,
      visitors30d,
      topGroups,
    ] = await Promise.all([
      prisma.sitePageView.count({ where: { createdAt: { gte: today } } }),
      prisma.sitePageView.count({ where: { createdAt: { gte: d7 } } }),
      prisma.sitePageView.count({ where: { createdAt: { gte: d30 } } }),
      distinctVisitorsSince(today),
      distinctVisitorsSince(d7),
      distinctVisitorsSince(d30),
      prisma.sitePageView.groupBy({
        by: ["path"],
        where: { createdAt: { gte: d7 } },
        _count: { _all: true },
        orderBy: { _count: { path: "desc" } },
        take: 8,
      }),
    ]);

    return {
      pageviewsToday,
      pageviews7d,
      pageviews30d,
      visitorsToday,
      visitors7d,
      visitors30d,
      topPages: topGroups.map((g) => ({
        path: g.path,
        views: g._count._all,
      })),
    };
  } catch (err) {
    console.error("[analytics] getVisitorDashboardStats failed", err);
    // Retry once with a simple path in case the pooled connection was closed
    try {
      const pageviewsToday = await prisma.sitePageView.count({
        where: { createdAt: { gte: today } },
      });
      return { ...emptyStats(), pageviewsToday };
    } catch (err2) {
      console.error("[analytics] retry failed", err2);
      return emptyStats();
    }
  }
}
