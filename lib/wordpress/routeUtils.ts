/**
 * URI helpers for the WordPress dynamic routing layer.
 * Pure utilities — no I/O, safe to import from Server Components.
 */

/**
 * Handcrafted App Router paths that must never be resolved via WordPress.
 * Next.js already prefers static routes; this list is defense-in-depth.
 * Keep in sync with `lib/experience/static-pages/catalog.ts` StaticPageRegistry.
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
  "/debug/content-renderer/",
  "/gallery/",
  "/doctors/",
  "/faq/",
  // /blog and /blogs are handled by app/blogs (+ catch-all archive fallback).
  // Do not 404 them via isHandcraftedPath in the catch-all.
]);

/**
 * Decodes a single URI segment safely (invalid sequences left unchanged).
 *
 * @param segment - Raw path segment.
 * @returns Decoded segment.
 */
function safeDecodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/**
 * Builds a WordPress-style URI from catch-all route segments.
 *
 * @param segments - `params.uri` from `app/[...uri]`.
 * @returns Normalized URI with leading and trailing slashes.
 *
 * @example
 * normalizeUri(["hair-transplant-in-delhi"])
 * // → "/hair-transplant-in-delhi/"
 *
 * @example
 * normalizeUri(["plastic-surgery-in-delhi", "rhinoplasty", "closed"])
 * // → "/plastic-surgery-in-delhi/rhinoplasty/closed/"
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
 *
 * @param uri - Normalized URI (`/about/`, etc.).
 * @returns `true` when WordPress resolution must be skipped.
 */
export function isHandcraftedPath(uri: string): boolean {
  return HANDCRAFTED_PATHS.has(uri);
}

/**
 * Humanizes a slug segment for breadcrumb labels.
 *
 * @param segment - URL slug segment.
 * @returns Title-cased label.
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
 *
 * @param uri - Normalized URI (e.g. `/urology/circumcision/zsr/`).
 * @param pageTitle - Optional final crumb label (WordPress page title).
 * @returns Breadcrumb items including Home.
 */
export function buildUriBreadcrumbs(
  uri: string,
  pageTitle?: string,
): UriBreadcrumbItem[] {
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
      label: isLast && pageTitle ? pageTitle : humanizeSegment(segment),
      href,
      current: isLast,
    });
  });

  return items;
}
