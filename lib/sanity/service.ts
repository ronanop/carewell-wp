import type { SanityServiceDoc } from "@/components/service/SanityServiceTemplate";
import { getSanityClient } from "@/lib/sanity/client";
import {
  SANITY_SERVICE_BY_SLUG,
  SANITY_SERVICE_BY_URI,
  SANITY_SERVICES_LIST,
} from "@/lib/sanity/queries";

/** Lightweight service row for QA / review lists. */
export type SanityServiceListItem = {
  _id: string;
  title: string;
  slug?: string | null;
  uri?: string | null;
  category?: string | null;
  faqCount?: number | null;
  hasHero?: boolean | null;
};

/** Public path for a service — prefers stored WP `uri`, else `/{slug}/`. */
export function servicePublicPath(service: {
  uri?: string | null;
  slug?: string | null;
}): string {
  const uri = service.uri?.trim();
  if (uri) {
    const path = uri.startsWith("/") ? uri : `/${uri}`;
    return path.endsWith("/") ? path : `${path}/`;
  }
  const slug = service.slug?.trim();
  if (!slug) return "/";
  return `/${slug.replace(/^\/+|\/+$/g, "")}/`;
}

/** All Sanity service docs (title/uri/slug + light QA metadata). */
export async function getSanityServicesList(): Promise<SanityServiceListItem[]> {
  const client = await getSanityClient();
  return client.fetch<SanityServiceListItem[]>(SANITY_SERVICES_LIST);
}

export async function getSanityServiceBySlug(
  slug: string,
): Promise<SanityServiceDoc | null> {
  const client = await getSanityClient();
  return client.fetch<SanityServiceDoc | null>(SANITY_SERVICE_BY_SLUG, {
    slug,
  });
}

/**
 * Resolve a Sanity service for a WordPress-style URI (SEO-preserving path).
 * Prefers exact `uri` match; falls back to slug only for single-segment URIs.
 */
export async function getSanityServiceByUri(
  normalizedUri: string,
): Promise<SanityServiceDoc | null> {
  const uri = normalizedUri.endsWith("/")
    ? normalizedUri
    : `${normalizedUri}/`;
  const uriNoSlash = uri.replace(/\/$/, "") || "/";
  const parts = uriNoSlash.split("/").filter(Boolean);
  const slug = parts[parts.length - 1] || "";

  const client = await getSanityClient();

  // Pass a non-matching slug sentinel so we only hit uri clauses in GROQ
  const byUri = await client.fetch<SanityServiceDoc | null>(
    SANITY_SERVICE_BY_URI,
    { uri, uriNoSlash, slug: "__no_slug_fallback__" },
  );
  if (byUri) return byUri;

  // Single-segment only — avoid nested path colliding with another service's slug
  if (parts.length === 1 && slug) {
    return getSanityServiceBySlug(slug);
  }

  return null;
}
