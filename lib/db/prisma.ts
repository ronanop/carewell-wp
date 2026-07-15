/**
 * Shared Prisma client for bounded application domains (ADR-011 / ADR-013).
 * Public website and `lib/wordpress/**` must never import this module.
 */

import "server-only";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  appPrisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not configured. Bounded domains require PostgreSQL.",
    );
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/**
 * Returns the shared Prisma client (lazy).
 */
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.appPrisma) {
    globalForPrisma.appPrisma = createPrismaClient();
  }
  return globalForPrisma.appPrisma;
}

/** Proxy for ergonomic `prisma.model` access. Prefer `getPrisma()` in new code. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export type { PrismaClient };
