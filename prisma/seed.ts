/**
 * Seed Experience Studio roles, site, templates, and optional bootstrap admin.
 */

import { hash } from "bcryptjs";
import { PrismaClient, type RoleName } from "@prisma/client";

const prisma = new PrismaClient();

const ROLES: RoleName[] = ["ADMIN", "EDITOR", "MARKETING", "DEVELOPER"];

const TEMPLATES = [
  { slug: "generic", name: "Generic", description: "Flexible layout for standard WordPress pages.", sortOrder: 0 },
  { slug: "hair-treatment", name: "Hair Treatment", description: "Service pages for hair transplant and restoration.", sortOrder: 1 },
  { slug: "plastic-surgery", name: "Plastic Surgery", description: "Surgical aesthetic procedure pages.", sortOrder: 2 },
  { slug: "skin", name: "Skin", description: "Dermatology and skin treatment pages.", sortOrder: 3 },
  { slug: "wellness", name: "Wellness", description: "Wellness and anti-aging consultation pages.", sortOrder: 4 },
  { slug: "doctor", name: "Doctor", description: "Doctor profile presentation.", sortOrder: 5 },
  { slug: "blog", name: "Blog", description: "Editorial blog article presentation.", sortOrder: 6 },
] as const;

async function main(): Promise<void> {
  for (const name of ROLES) {
    await prisma.role.upsert({
      where: { name },
      create: { name },
      update: {},
    });
  }

  const site = await prisma.site.upsert({
    where: { key: "default" },
    create: { key: "default", name: "Care Well Medical Centre" },
    update: {},
  });

  for (const template of TEMPLATES) {
    await prisma.template.upsert({
      where: { siteId_slug: { siteId: site.id, slug: template.slug } },
      create: {
        siteId: site.id,
        slug: template.slug,
        name: template.name,
        description: template.description,
        sortOrder: template.sortOrder,
      },
      update: {
        name: template.name,
        description: template.description,
        sortOrder: template.sortOrder,
        active: true,
      },
    });
  }

  const email = process.env.STUDIO_BOOTSTRAP_EMAIL?.toLowerCase();
  const password = process.env.STUDIO_BOOTSTRAP_PASSWORD;

  if (email && password && password.length >= 8) {
    const adminRole = await prisma.role.findUniqueOrThrow({
      where: { name: "ADMIN" },
    });
    const passwordHash = await hash(password, 12);
    await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: "Studio Admin",
        passwordHash,
        roleId: adminRole.id,
      },
      update: {
        passwordHash,
        roleId: adminRole.id,
        active: true,
      },
    });
    console.log(`[seed] Admin user ready: ${email}`);
  } else {
    console.log(
      "[seed] Roles ready. Set STUDIO_BOOTSTRAP_EMAIL / STUDIO_BOOTSTRAP_PASSWORD to create an admin.",
    );
  }

  await prisma.themeConfiguration.upsert({
    where: { key: "default" },
    create: { key: "default" },
    update: {},
  });

  console.log(`[seed] Site + ${TEMPLATES.length} templates ready`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
