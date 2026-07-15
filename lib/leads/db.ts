import "server-only";

/**
 * Lead Engine DB access (ADR-013).
 * Re-exports shared Prisma client — never import from public components or lib/wordpress.
 */

export { getPrisma, prisma, type PrismaClient } from "@/lib/db/prisma";
