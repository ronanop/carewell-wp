import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible Auth.js config for middleware.
 * Credentials + Prisma live in `auth.ts` (Node runtime only).
 */
export const authConfig = {
  providers: [],
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
  trustHost: true,
} satisfies NextAuthConfig;
