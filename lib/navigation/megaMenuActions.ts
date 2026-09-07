"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { getPrisma } from "@/lib/db/prisma";
import {
  getDefaultMegaMenuCategories,
  normalizeMegaMenuCategories,
} from "@/lib/navigation/getMegaMenu";
import type { MegaServiceCategory } from "@/lib/navigation/services-mega-menu";

export type MegaMenuActionResult =
  | { ok: true; message: string; categories: MegaServiceCategory[] }
  | { ok: false; message: string };

async function requireEditor() {
  const session = await auth();
  if (!session?.user?.role) {
    return { ok: false as const, message: "Unauthorized" };
  }
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "EDITOR" && role !== "DEVELOPER") {
    return { ok: false as const, message: "Forbidden" };
  }
  return { ok: true as const, session };
}

export async function saveMegaMenuAction(
  raw: unknown,
): Promise<MegaMenuActionResult> {
  const gate = await requireEditor();
  if (!gate.ok) return { ok: false, message: gate.message };

  const categories = normalizeMegaMenuCategories(raw);
  if (!categories) {
    return {
      ok: false,
      message: "Invalid menu data. Each link needs a label and URL.",
    };
  }

  try {
    const prisma = getPrisma();
    await prisma.siteMegaMenu.upsert({
      where: { key: "default" },
      create: { key: "default", categories },
      update: { categories },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/menu");

    return {
      ok: true,
      message: "Services menu saved. Changes apply on the next page load.",
      categories,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to save mega menu",
    };
  }
}

export async function resetMegaMenuAction(): Promise<MegaMenuActionResult> {
  const gate = await requireEditor();
  if (!gate.ok) return { ok: false, message: gate.message };

  const categories = getDefaultMegaMenuCategories();

  try {
    const prisma = getPrisma();
    await prisma.siteMegaMenu.upsert({
      where: { key: "default" },
      create: { key: "default", categories },
      update: { categories },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/menu");

    return {
      ok: true,
      message: "Reset to default menu links.",
      categories,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to reset mega menu",
    };
  }
}
