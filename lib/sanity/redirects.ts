/**
 * Fetch enabled Sanity redirects for Next.js config / middleware.
 * Used once Phase 6 wires live redirects; schema exists from Phase 1.
 */
import { sanityClient } from "@/lib/sanity/client";
import { SANITY_REDIRECTS } from "@/lib/sanity/queries";

export type SanityRedirect = {
  from: string;
  to: string;
  permanent?: boolean;
};

export async function fetchSanityRedirects(): Promise<SanityRedirect[]> {
  try {
    const rows = await sanityClient.fetch<SanityRedirect[]>(SANITY_REDIRECTS);
    return (rows || []).filter((r) => r.from && r.to);
  } catch {
    return [];
  }
}
