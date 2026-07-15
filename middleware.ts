import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

import { authConfig } from "@/auth.config";

/**
 * Protects Experience Studio routes only (Edge-compatible).
 * Public website routes are never intercepted.
 */
const { auth } = NextAuth(authConfig);

const studioAuth = auth((request) => {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) {
    if (request.auth?.user) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!request.auth?.user) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
});

export default function middleware(request: NextRequest) {
  // Auth.js throws in production without AUTH_SECRET — avoid blank 500s.
  if (!process.env.AUTH_SECRET) {
    const { pathname } = request.nextUrl;
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.next();
    }
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  return studioAuth(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
