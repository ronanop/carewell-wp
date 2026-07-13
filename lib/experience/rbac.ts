import "server-only";

import type { RoleName } from "@prisma/client";

/**
 * RBAC helpers for Experience Studio.
 */

export const ROLE_PERMISSIONS = {
  ADMIN: [
    "dashboard:read",
    "pages:read",
    "pages:write",
    "experience:read",
    "experience:write",
    "templates:read",
    "templates:write",
    "doctors:read",
    "doctors:write",
    "gallery:read",
    "gallery:write",
    "testimonials:read",
    "testimonials:write",
    "cta:read",
    "cta:write",
    "media:read",
    "media:write",
    "theme:read",
    "theme:write",
    "users:read",
    "users:write",
    "settings:read",
    "settings:write",
  ],
  EDITOR: [
    "dashboard:read",
    "pages:read",
    "pages:write",
    "experience:read",
    "experience:write",
    "templates:read",
    "doctors:read",
    "doctors:write",
    "gallery:read",
    "gallery:write",
    "testimonials:read",
    "testimonials:write",
    "cta:read",
    "cta:write",
    "media:read",
    "media:write",
    "theme:read",
  ],
  MARKETING: [
    "dashboard:read",
    "pages:read",
    "experience:read",
    "templates:read",
    "doctors:read",
    "gallery:read",
    "testimonials:read",
    "testimonials:write",
    "cta:read",
    "cta:write",
    "media:read",
    "theme:read",
  ],
  DEVELOPER: [
    "dashboard:read",
    "pages:read",
    "experience:read",
    "templates:read",
    "templates:write",
    "settings:read",
    "settings:write",
    "users:read",
  ],
} as const satisfies Record<RoleName, readonly string[]>;

export type Permission =
  (typeof ROLE_PERMISSIONS)[keyof typeof ROLE_PERMISSIONS][number];

export function hasPermission(
  role: RoleName,
  permission: Permission,
): boolean {
  return (ROLE_PERMISSIONS[role] as readonly string[]).includes(permission);
}

export function requirePermission(
  role: RoleName,
  permission: Permission,
): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Forbidden: missing permission ${permission}`);
  }
}
