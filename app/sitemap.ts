import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo/constants";
import { getSanityPostsList, postPublicPath } from "@/lib/sanity/post";
import {
  getSanityServicesList,
  servicePublicPath,
} from "@/lib/sanity/service";

const STATIC_PATHS = [
  "/",
  "/about/",
  "/about/dr-sandeep-bhasin/",
  "/blogs/",
  "/contact/",
  "/disclaimer/",
  "/privacy-policy/",
  "/terms/",
] as const;

function toPath(path: string): string {
  const trimmed = path.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const pathname = url.pathname || "/";
      return pathname.endsWith("/") ? pathname : `${pathname}/`;
    } catch {
      return "/";
    }
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function absoluteUrl(path: string): string {
  const base = SITE_URL.replace(/\/$/, "");
  return `${base}${toPath(path)}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  try {
    const [services, posts] = await Promise.all([
      getSanityServicesList(),
      getSanityPostsList(),
    ]);

    for (const service of services) {
      const path = servicePublicPath(service);
      if (path === "/") continue;
      entries.push({
        url: absoluteUrl(path),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const post of posts) {
      const path = postPublicPath(post);
      if (path === "/" || path === "/blogs/") continue;
      entries.push({
        url: absoluteUrl(path),
        changeFrequency: "monthly",
        priority: 0.6,
        lastModified: post.publishedAt
          ? new Date(post.publishedAt)
          : undefined,
      });
    }
  } catch {
    // Fail soft — static routes still publish if Sanity is unreachable.
  }

  return entries;
}
