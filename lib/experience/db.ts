import "server-only";

import { PrismaClient } from "@prisma/client";

/**
 * Experience Studio Prisma client (ADR-011).
 * Lazy-initialized so public builds succeed without DATABASE_URL.
 * Do not import from public website routes or `lib/wordpress/**`.
 */

const globalForPrisma = globalThis as unknown as {
  experiencePrisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not configured. Experience Studio requires PostgreSQL.",
    );
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.experiencePrisma) {
    globalForPrisma.experiencePrisma = createPrismaClient();
  }
  return globalForPrisma.experiencePrisma;
}

/** @deprecated Prefer getPrisma() for explicit failure when DB is unset. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export type { PrismaClient };
