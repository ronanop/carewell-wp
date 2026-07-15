import "server-only";

import type { RoleName } from "@prisma/client";

/**
 * Lead Engine RBAC (ADR-013) — isolated from Experience Studio permissions map.
 */

export const LEAD_ROLE_PERMISSIONS = {
  ADMIN: ["leads:read", "leads:write"],
  EDITOR: ["leads:read", "leads:write"],
  MARKETING: ["leads:read", "leads:write"],
  DEVELOPER: ["leads:read"],
} as const satisfies Record<RoleName, readonly string[]>;

export type LeadPermission =
  (typeof LEAD_ROLE_PERMISSIONS)[keyof typeof LEAD_ROLE_PERMISSIONS][number];

export function hasLeadPermission(
  role: RoleName,
  permission: LeadPermission,
): boolean {
  return (LEAD_ROLE_PERMISSIONS[role] as readonly string[]).includes(
    permission,
  );
}

export function requireLeadPermission(
  role: RoleName,
  permission: LeadPermission,
): void {
  if (!hasLeadPermission(role, permission)) {
    throw new Error(`Forbidden: missing permission ${permission}`);
  }
}
