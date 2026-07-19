/**
 * ExperienceContentProvider — every content kind implements this interface.
 * WordPress remains the content source; providers only resolve presentation overlays.
 */

import type { ExperienceDocument } from "@/types/experience-document";
import type { BlogPostSummary } from "@/types/blog";
import type { ExperienceConfig } from "@/types/experience-document";
import type { BlogSidebarConfig } from "@/types/blog-document";

export type ExperienceDocumentMetadata = {
  uri: string;
  title: string;
  kind: ExperienceDocument["kind"];
  presentationStatus: ExperienceDocument["presentationStatus"];
};

export type ExperienceSeoPayload = ExperienceDocument["seo"];

export interface ExperienceContentProvider {
  readonly kind: ExperienceDocument["kind"];
  getDocument(uri: string): Promise<ExperienceDocument | null>;
  getMetadata(uri: string): Promise<ExperienceDocumentMetadata | null>;
  getSidebar(uri: string): Promise<BlogSidebarConfig | null>;
  getSeo(uri: string): Promise<ExperienceSeoPayload | null>;
  getSchema(uri: string): Promise<object[]>;
  getRelated(uri: string): Promise<BlogPostSummary[]>;
  getPresentation(uri: string): Promise<ExperienceConfig | null>;
}
