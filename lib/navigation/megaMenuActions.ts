"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { revalidatePath, revalidateTag } from "next/cache";

import { auth } from "@/auth";
import { getPrisma } from "@/lib/db/prisma";
import {
  getDefaultMegaMenuCategories,
  MEGA_MENU_CACHE_TAG,
  normalizeMegaMenuCategories,
} from "@/lib/navigation/getMegaMenu";
import { MEGA_MENU_PANEL_IMAGE_SIZE } from "@/lib/navigation/megaMenuImage";
import type { MegaServiceCategory } from "@/lib/navigation/services-mega-menu";

export type MegaMenuActionResult =
  | { ok: true; message: string; categories: MegaServiceCategory[] }
  | { ok: false; message: string };

export type MegaMenuImageUploadResult =
  | { ok: true; message: string; imageSrc: string }
  | { ok: false; message: string };

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

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

    revalidateTag(MEGA_MENU_CACHE_TAG);
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

    revalidateTag(MEGA_MENU_CACHE_TAG);
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

/**
 * Saves a category panel photo already resized to MEGA_MENU_PANEL_IMAGE_SIZE.
 * Returns a public path under `/images/mega-menu/`.
 */
export async function uploadMegaMenuImageAction(
  categoryId: string,
  formData: FormData,
): Promise<MegaMenuImageUploadResult> {
  const gate = await requireEditor();
  if (!gate.ok) return { ok: false, message: gate.message };

  const id = categoryId.trim().replace(/[^a-z0-9_-]/gi, "");
  if (!id) {
    return { ok: false, message: "Invalid category id." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Choose an image file to upload." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, message: "Image must be 8MB or smaller." };
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return { ok: false, message: "Use a JPEG, PNG, or WebP image." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type === "image/png" ? "png" : "jpg";
    const dir = path.join(process.cwd(), "public", "images", "mega-menu");
    await mkdir(dir, { recursive: true });
    const filename = `${id}-${Date.now()}.${ext}`;
    await writeFile(path.join(dir, filename), buffer);

    const imageSrc = `/images/mega-menu/${filename}`;
    revalidatePath("/admin/menu");
    revalidatePath("/", "layout");

    return {
      ok: true,
      message: `Saved at ${MEGA_MENU_PANEL_IMAGE_SIZE.width}×${MEGA_MENU_PANEL_IMAGE_SIZE.height}px.`,
      imageSrc,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to upload image",
    };
  }
}
