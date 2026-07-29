import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

import {
  getSanityServiceBySlug,
  servicePublicPath,
} from "@/lib/sanity/service";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Legacy preview path. Permanent-redirect to the original WordPress URI
 * so SEO URLs stay `/hair-transplant-in-delhi/` (no `/sanity/service/`).
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getSanityServiceBySlug(slug);
  if (!service) return { title: "Not found", robots: { index: false } };
  const path = servicePublicPath(service);
  return {
    title: service.seo?.title || service.title,
    alternates: { canonical: path.replace(/\/$/, "") || "/" },
    robots: { index: false, follow: true },
  };
}

export default async function SanityServiceLegacyRedirect({
  params,
}: PageProps) {
  const { slug } = await params;
  const service = await getSanityServiceBySlug(slug);
  const path = service
    ? servicePublicPath(service)
    : `/${slug.replace(/^\/+|\/+$/g, "")}/`;
  permanentRedirect(path);
}
