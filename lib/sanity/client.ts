import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { draftMode } from "next/headers";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "ndeeiwkw";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  "production";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  useCdn: true,
});

/** Token client for draft/preview reads. */
export const sanityPreviewClient = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: "previewDrafts",
});

export async function getSanityClient() {
  const { isEnabled } = await draftMode();
  if (isEnabled && process.env.SANITY_API_TOKEN) {
    return sanityPreviewClient;
  }
  return sanityClient;
}

const builder = imageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export { projectId as sanityProjectId, dataset as sanityDataset };
