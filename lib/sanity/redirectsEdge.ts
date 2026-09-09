/**
 * Edge-safe Sanity redirects fetch for middleware (no next/headers).
 */
import { createClient } from "@sanity/client";

import { SANITY_REDIRECTS } from "@/lib/sanity/queries";

export type SanityRedirect = {
  from: string;
  to: string;
  permanent?: boolean;
};

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "ndeeiwkw";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  "production";

const edgeClient = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  // Bypass the CDN so Studio edits show up within the middleware cache window.
  useCdn: false,
});

export async function fetchSanityRedirectsEdge(): Promise<SanityRedirect[]> {
  try {
    const rows = await edgeClient.fetch<SanityRedirect[]>(SANITY_REDIRECTS);
    return (rows || []).filter((r) => r.from && r.to);
  } catch {
    return [];
  }
}
