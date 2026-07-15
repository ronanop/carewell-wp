import "server-only";

/**
 * Experience Studio DB access (ADR-011).
 * Re-exports shared Prisma client — do not import from public routes.
 */

export { getPrisma, prisma, type PrismaClient } from "@/lib/db/prisma";
