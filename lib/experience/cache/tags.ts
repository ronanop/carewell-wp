/**
 * Cache tag helpers for presentation revalidation.
 * Never invalidate the entire website.
 */

export function presentationPageTag(uri: string): string {
  const normalized = uri.replace(/\/+$/, "") || "/";
  return `presentation-page:${normalized}`;
}

export function presentationTemplateTag(slug: string): string {
  return `presentation-template:${slug}`;
}

export const PRESENTATION_NAV_TAG = "presentation-navigation";
export const PRESENTATION_HOME_TAG = "presentation-home";

/** Cache tag for a catalog static page (home, about, …). */
export function staticPageTag(slug: string): string {
  return `static-page:${slug}`;
}
