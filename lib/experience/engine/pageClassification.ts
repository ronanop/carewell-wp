/**
 * Page Classification Engine (Phase 4.6A).
 * Renderer decisions depend on pageType — never raw URL string checks in UI.
 */

export type PageType =
  | "HOME"
  | "SERVICE"
  | "DOCTOR"
  | "BLOG"
  | "LANDING"
  | "LEGAL"
  | "CONTACT"
  | "ABOUT"
  | "GALLERY"
  | "GENERIC";

export type PageClassificationInput = {
  uri: string;
  slug?: string | null;
  title?: string | null;
  templateSlug?: string | null;
  /** Optional explicit override from presentation config. */
  pageTypeOverride?: PageType | null;
};

const SERVICE_TEMPLATE_SLUGS = new Set([
  "hair-treatment",
  "plastic-surgery",
  "skin",
  "wellness",
  "urology",
  "cosmetic",
  "weight-loss",
  "service",
]);

const SERVICE_URI_HINTS = [
  "transplant",
  "surgery",
  "treatment",
  "urology",
  "wellness",
  "cosmetic",
  "weight-loss",
  "weightloss",
  "liposuction",
  "rhinoplasty",
  "hair-",
  "skin-",
  "dermat",
  "laser",
  "botox",
  "filler",
  "gynecomastia",
  "aesthetic",
];

function normalizeUri(uri: string): string {
  const trimmed = uri.trim().toLowerCase();
  if (!trimmed || trimmed === "/") return "/";
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

function looksLikeService(uri: string, title?: string | null, slug?: string | null): boolean {
  const haystack = `${uri} ${slug ?? ""} ${title ?? ""}`.toLowerCase();
  return SERVICE_URI_HINTS.some((hint) => haystack.includes(hint));
}

/**
 * Classifies a page into a stable pageType for chrome / widget decisions.
 */
export function classifyPage(input: PageClassificationInput): PageType {
  if (input.pageTypeOverride) {
    return input.pageTypeOverride;
  }

  const uri = normalizeUri(input.uri);
  const template = input.templateSlug?.trim().toLowerCase() || null;

  if (uri === "/") return "HOME";
  if (uri.startsWith("/contact")) return "CONTACT";
  if (uri.startsWith("/about")) return "ABOUT";
  if (
    uri.startsWith("/privacy") ||
    uri.startsWith("/terms") ||
    uri.startsWith("/disclaimer")
  ) {
    return "LEGAL";
  }
  if (uri.startsWith("/gallery")) return "GALLERY";
  if (uri.startsWith("/doctors") || uri.startsWith("/doctor") || template === "doctor") {
    return "DOCTOR";
  }
  if (uri.includes("/blog") || template === "blog") return "BLOG";
  if (template === "landing") return "LANDING";

  if (template && SERVICE_TEMPLATE_SLUGS.has(template)) {
    return "SERVICE";
  }

  if (looksLikeService(uri, input.title, input.slug)) {
    return "SERVICE";
  }

  return "GENERIC";
}

/** Default chrome visibility by page type (before global/page overrides). */
export function defaultConsultationVisibility(pageType: PageType): boolean {
  return pageType === "SERVICE";
}
