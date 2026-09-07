import type { NextAuthConfig } from "next-auth";

import { syncProductionAuthUrl } from "@/lib/auth/syncAuthUrl";

syncProductionAuthUrl();

/**
 * Edge-compatible Auth.js config for middleware.
 * Credentials + Prisma live in `auth.ts` (Node runtime only).
 */
export const authConfig = {
  providers: [],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;
      if (!pathname.startsWith("/admin")) {
        return true;
      }
      if (pathname.startsWith("/admin/login")) {
        return true;
      }
      return Boolean(session?.user);
    },
    /**
     * Keep post-login redirects on the current host.
     * Relative /admin paths only — never bounce to a misconfigured AUTH_URL host.
     */
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        if (url.startsWith("//")) return baseUrl;
        return `${baseUrl}${url}`;
      }
      try {
        const target = new URL(url);
        if (target.origin === new URL(baseUrl).origin) {
          return url;
        }
        // Absolute URL to another host (e.g. localhost AUTH_URL) — keep path if /admin
        if (target.pathname.startsWith("/admin")) {
          return `${baseUrl}${target.pathname}${target.search}`;
        }
      } catch {
        /* fall through */
      }
      return `${baseUrl}/admin/leads`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as typeof session.user.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
