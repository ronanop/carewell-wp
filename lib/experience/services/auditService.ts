import "server-only";

import { prisma } from "@/lib/experience/db";
import type { RoleName } from "@prisma/client";

/**
 * Audit log writer for Experience Studio mutations.
 */
export async function writeAuditLog(input: {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary?: string | null;
}): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: input.userId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      summary: input.summary ?? null,
    },
  });
}

export async function ensureRolesSeeded(): Promise<void> {
  const roles: RoleName[] = ["ADMIN", "EDITOR", "MARKETING", "DEVELOPER"];
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      create: { name },
      update: {},
    });
  }
}
