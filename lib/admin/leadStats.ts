import "server-only";

import { getPrisma } from "@/lib/db/prisma";
import type { LeadStatus } from "@/lib/leads/types";
import { LEAD_STATUSES } from "@/lib/leads/types";

export type LeadDashboardStats = {
  total: number;
  newCount: number;
  todayCount: number;
  weekCount: number;
  unassignedCount: number;
  byStatus: { status: LeadStatus; count: number }[];
};

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function getLeadDashboardStats(): Promise<LeadDashboardStats> {
  const prisma = getPrisma();
  const today = startOfDay();
  const week = startOfDay();
  week.setDate(week.getDate() - 7);

  const [total, newCount, todayCount, weekCount, unassignedCount, groups] =
    await Promise.all([
      prisma.lead.count({ where: { deletedAt: null } }),
      prisma.lead.count({ where: { deletedAt: null, status: "NEW" } }),
      prisma.lead.count({
        where: { deletedAt: null, createdAt: { gte: today } },
      }),
      prisma.lead.count({
        where: { deletedAt: null, createdAt: { gte: week } },
      }),
      prisma.lead.count({
        where: {
          deletedAt: null,
          OR: [{ assignedStaff: null }, { assignedStaff: "" }],
          status: { notIn: ["ARCHIVED", "SPAM", "LOST", "CONVERTED"] },
        },
      }),
      prisma.lead.groupBy({
        by: ["status"],
        where: { deletedAt: null },
        _count: { _all: true },
      }),
    ]);

  const countMap = new Map(
    groups.map((g) => [g.status as LeadStatus, g._count._all]),
  );

  return {
    total,
    newCount,
    todayCount,
    weekCount,
    unassignedCount,
    byStatus: LEAD_STATUSES.map((status) => ({
      status,
      count: countMap.get(status) ?? 0,
    })).filter((row) => row.count > 0),
  };
}
