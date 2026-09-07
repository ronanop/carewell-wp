import { sanityDataset, sanityProjectId } from "@/lib/sanity/client";

/** Deep-link to a document in Sanity Manage. */
export function sanityDocumentManageUrl(docId: string): string {
  const id = encodeURIComponent(docId);
  return `https://www.sanity.io/manage/project/${sanityProjectId}/dataset/${sanityDataset}/document/${id}`;
}

export function sanityProjectManageUrl(): string {
  return `https://www.sanity.io/manage/project/${sanityProjectId}`;
}
