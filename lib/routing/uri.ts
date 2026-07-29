/**
 * URI helpers for App Router catch-all and breadcrumbs.
 * Pure utilities — no I/O, safe to import from Server Components.
 */

/**
 * Handcrafted App Router paths that must never be resolved via CMS catch-all.
 * Next.js already prefers static routes; this list is defense-in-depth.
 */
const HANDCRAFTED_PATHS = new Set<string>([
  "/",
  "/about/",
  "/about/dr-sandeep-bhasin/",
  "/contact/",
  "/disclaimer/",
  "/privacy-policy/",
  "/terms/",
  "/thank-you/",
  "/404/",
  "/design/",
  "/gallery/",
  "/doctors/",
  "/faq/",
  "/sanity-test/",
  "/sanity/",
  "/dev/",
]);

/**
 * Decodes a single URI segment safely (invalid sequences left unchanged).
 */
function safeDecodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/**
 * Builds a normalized URI from catch-all route segments.
 *
 * @example
 * normalizeUri(["hair-transplant-in-delhi"])
 * // → "/hair-transplant-in-delhi/"
 */
export function normalizeUri(
  segments: readonly string[] | undefined | null,
): string {
  if (!segments || segments.length === 0) {
    return "/";
  }

  const cleaned = segments
    .flatMap((segment) => segment.split("/"))
    .map((segment) => safeDecodeSegment(segment).trim())
    .filter((segment) => segment.length > 0)
    .map((segment) => segment.toLowerCase());

  if (cleaned.length === 0) {
    return "/";
  }

  return `/${cleaned.join("/")}/`;
}

/**
 * Returns whether a normalized URI is reserved for a handcrafted React page.
 */
export function isHandcraftedPath(uri: string): boolean {
  if (HANDCRAFTED_PATHS.has(uri)) return true;
  // Prefix matches for nested handcrafted trees
  if (uri.startsWith("/sanity-test/")) return true;
  if (uri.startsWith("/sanity/")) return true;
  if (uri.startsWith("/dev/")) return true;
  return false;
}

/**
 * Humanizes a slug segment for breadcrumb labels.
 */
export function humanizeSegment(segment: string): string {
  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * Breadcrumb crumb derived from a hierarchical URI.
 */
export interface UriBreadcrumbItem {
  label: string;
  href: string;
  current: boolean;
}

/**
 * Builds breadcrumb items from a normalized hierarchical URI.
 * Labels are always derived from path segments (humanized slugs).
 */
export function buildUriBreadcrumbs(uri: string): UriBreadcrumbItem[] {
  if (uri === "/") {
    return [{ label: "Home", href: "/", current: true }];
  }

  const segments = uri.split("/").filter(Boolean);
  const items: UriBreadcrumbItem[] = [
    { label: "Home", href: "/", current: false },
  ];

  segments.forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}/`;
    const isLast = index === segments.length - 1;
    items.push({
      label: humanizeSegment(segment),
      href,
      current: isLast,
    });
  });

  return items;
}
