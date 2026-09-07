import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { getPrisma } from "@/lib/db/prisma";
import {
  MEGA_SERVICE_CATEGORIES,
  type MegaServiceCategory,
  type MegaServiceGroup,
  type MegaServiceLink,
} from "@/lib/navigation/services-mega-menu";

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeHref(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "/";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  let path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (!path.includes("?") && !path.includes("#") && !path.endsWith("/")) {
    path = `${path}/`;
  }
  return path;
}

function parseLink(raw: unknown): MegaServiceLink | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const label = asString(row.label).trim();
  const href = asString(row.href).trim();
  if (!label || !href) return null;
  return { label, href: normalizeHref(href) };
}

function parseGroup(raw: unknown): MegaServiceGroup | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const linksRaw = Array.isArray(row.links) ? row.links : [];
  const links = linksRaw
    .map(parseLink)
    .filter((link): link is MegaServiceLink => link !== null);
  if (!links.length) return null;
  const title = asString(row.title).trim() || undefined;
  const hrefRaw = asString(row.href).trim();
  return {
    title,
    href: hrefRaw ? normalizeHref(hrefRaw) : undefined,
    links,
  };
}

function parseCategory(raw: unknown): MegaServiceCategory | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const id = asString(row.id).trim();
  const title = asString(row.title).trim();
  const href = asString(row.href).trim();
  if (!id || !title || !href) return null;
  const groupsRaw = Array.isArray(row.groups) ? row.groups : [];
  const groups = groupsRaw
    .map(parseGroup)
    .filter((group): group is MegaServiceGroup => group !== null);
  if (!groups.length) return null;
  return {
    id,
    title,
    href: normalizeHref(href),
    description: asString(row.description).trim() || "",
    accent: asString(row.accent).trim() || "from-primary/20 via-primary/5 to-secondary",
    groups,
  };
}

/** Validate / normalize a categories payload from admin or DB. */
export function normalizeMegaMenuCategories(
  input: unknown,
): MegaServiceCategory[] | null {
  if (!Array.isArray(input)) return null;
  const categories = input
    .map(parseCategory)
    .filter((cat): cat is MegaServiceCategory => cat !== null);
  return categories.length ? categories : null;
}

/** Deep clone of code defaults (safe to mutate in admin forms). */
export function getDefaultMegaMenuCategories(): MegaServiceCategory[] {
  return structuredClone(MEGA_SERVICE_CATEGORIES);
}

/**
 * Public + admin: resolved mega menu (DB override or code defaults).
 * Uses noStore so admin edits show on the next request without waiting for ISR.
 */
export async function getMegaMenuCategories(): Promise<MegaServiceCategory[]> {
  noStore();
  try {
    const prisma = getPrisma();
    const row = await prisma.siteMegaMenu.findUnique({
      where: { key: "default" },
    });
    if (!row) return getDefaultMegaMenuCategories();
    const parsed = normalizeMegaMenuCategories(row.categories);
    return parsed ?? getDefaultMegaMenuCategories();
  } catch {
    return getDefaultMegaMenuCategories();
  }
}
