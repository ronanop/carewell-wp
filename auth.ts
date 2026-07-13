import type { RoleName } from "@prisma/client";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

import { authConfig } from "@/auth.config";
import { createUserRepository } from "@/lib/experience/repositories/userRepository";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * Auth.js for Experience Studio (ADR-011) — Node runtime.
 * Middleware uses `auth.config.ts` only (no Prisma / bcrypt on Edge).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) {
          return null;
        }

        if (!process.env.DATABASE_URL) {
          return null;
        }

        try {
          const users = createUserRepository();
          const user = await users.findByEmail(parsed.data.email);
          if (!user || !user.active) {
            return null;
          }

          const valid = await compare(
            parsed.data.password,
            user.passwordHash,
          );
          if (!valid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.name as RoleName,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
