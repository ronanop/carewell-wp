/**
 * Static Experience Studio — catalog + list contracts (Phase 4.7 / ADR-014).
 * Presentation config reuses PresentationConfig — never WordPress page HTML.
 */

import type { SectionType } from "@/types/presentation-config";

export type StaticPageCategory =
  | "Marketing"
  | "About"
  | "Contact"
  | "Legal"
  | "System"
  | "Landing";

export type StaticPageSlug =
  | "home"
  | "about"
  | "contact"
  | "privacy-policy"
  | "disclaimer"
  | "terms"
  | "not-found"
  | "thank-you";

export type StaticPageSectionDef = {
  id: string;
  type: SectionType;
  label: string;
  enabled?: boolean;
  variant?: string;
};

export type StaticPageDefinition = {
  /** Stable registry id / slug */
  slug: StaticPageSlug;
  title: string;
  /** Public route path (leading slash; home is `/`) */
  path: string;
  category: StaticPageCategory;
  description: string;
  templateSlug: string;
  sections: StaticPageSectionDef[];
};

export type StaticPageListItem = {
  slug: StaticPageSlug;
  path: string;
  title: string;
  description: string;
  category: StaticPageCategory;
  sectionCount: number;
  pageId: string | null;
  status: "DRAFT" | "PUBLISHED" | "NOT_CONFIGURED";
  updatedAt: string | null;
};

/**
 * PageProvider — universal page loading contract.
 * Studio and public renderers consume providers; never WordPress GraphQL directly.
 */
export type PageSourceKind = "wordpress" | "static" | "api" | "markdown" | "database";

export type PageDefinition = {
  id: string;
  source: PageSourceKind;
  title: string;
  route: string;
  category?: string;
};
