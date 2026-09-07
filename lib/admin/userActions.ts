"use server";

import { hash } from "bcryptjs";
import type { RoleName } from "@prisma/client";
import { z } from "zod";

import { auth } from "@/auth";
import { getPrisma } from "@/lib/db/prisma";
import { requireLeadPermission } from "@/lib/leads/rbac";
import type { ActionResult } from "@/lib/leads/types";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(1).max(120).optional(),
  password: z.string().min(8).max(128),
  role: z.enum(["ADMIN", "EDITOR", "MARKETING", "DEVELOPER"]),
});

const updateUserSchema = z.object({
  userId: z.string().min(1),
  active: z.boolean().optional(),
  role: z.enum(["ADMIN", "EDITOR", "MARKETING", "DEVELOPER"]).optional(),
  name: z.string().trim().max(120).nullable().optional(),
});

async function requireAdminWrite() {
  const session = await auth();
  if (!session?.user?.role) {
    throw new Error("Unauthorized");
  }
  // Only ADMIN manages staff accounts
  if (session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return session;
}

export type AdminUserRow = {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  role: RoleName;
  createdAt: string;
  lastLoginAt: string | null;
};

export async function listAdminUsers(): Promise<AdminUserRow[]> {
  const session = await auth();
  if (!session?.user?.role) {
    throw new Error("Unauthorized");
  }
  requireLeadPermission(session.user.role, "leads:read");

  const prisma = getPrisma();
  const users = await prisma.user.findMany({
    include: { role: true },
    orderBy: { createdAt: "desc" },
  });

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    active: u.active,
    role: u.role.name,
    createdAt: u.createdAt.toISOString(),
    lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
  }));
}

export async function createAdminUserAction(
  raw: unknown,
): Promise<ActionResult<{ userId: string }>> {
  try {
    await requireAdminWrite();
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unauthorized",
    };
  }

  const parsed = createUserSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const prisma = getPrisma();
  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, message: "A user with this email already exists" };
  }

  const role = await prisma.role.findUniqueOrThrow({
    where: { name: parsed.data.role },
  });
  const passwordHash = await hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      name: parsed.data.name || null,
      passwordHash,
      roleId: role.id,
      active: true,
    },
  });

  return {
    ok: true,
    data: { userId: user.id },
    message: "User created",
  };
}

export async function updateAdminUserAction(
  raw: unknown,
): Promise<ActionResult<{ userId: string }>> {
  try {
    await requireAdminWrite();
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unauthorized",
    };
  }

  const parsed = updateUserSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const prisma = getPrisma();
  const data: {
    active?: boolean;
    name?: string | null;
    roleId?: string;
  } = {};

  if (parsed.data.active !== undefined) data.active = parsed.data.active;
  if (parsed.data.name !== undefined) data.name = parsed.data.name;
  if (parsed.data.role) {
    const role = await prisma.role.findUniqueOrThrow({
      where: { name: parsed.data.role },
    });
    data.roleId = role.id;
  }

  const user = await prisma.user.update({
    where: { id: parsed.data.userId },
    data,
  });

  return {
    ok: true,
    data: { userId: user.id },
    message: "User updated",
  };
}
