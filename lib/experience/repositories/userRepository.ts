import "server-only";

import { prisma } from "@/lib/experience/db";

/**
 * User repository — Experience Studio auth identities only.
 */
export function createUserRepository() {
  return {
    findByEmail(email: string) {
      return prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { role: true },
      });
    },

    findById(id: string) {
      return prisma.user.findUnique({
        where: { id },
        include: { role: true },
      });
    },

    list() {
      return prisma.user.findMany({
        include: { role: true },
        orderBy: { createdAt: "desc" },
      });
    },
  };
}

export type UserRepository = ReturnType<typeof createUserRepository>;
