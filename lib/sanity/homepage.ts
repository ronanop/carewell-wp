import { cache } from "react";

import { getSanityClient, urlFor } from "@/lib/sanity/client";
import type { ElementOverrides } from "@/types/element-descriptor";
import type { PresentationConfig } from "@/types/presentation-config";
import type { RepeaterItem } from "@/types/repeater-descriptor";

export type HomepageLink = {
  label: string;
  href: string;
};

export type HomepageFooter = {
  quickLinks: HomepageLink[];
  serviceLinks: HomepageLink[];
  socialLinks: HomepageLink[];
};

type SanityImageField = {
  alt?: string | null;
  asset?: { _ref?: string; _id?: string; url?: string } | null;
} | null;

type HomepageCta = {
  label?: string | null;
  href?: string | null;
} | null;

type HomepageServiceCard = {
  title?: string | null;
  description?: string | null;
  href?: string | null;
  image?: SanityImageField;
  objectPosition?: string | null;
} | null;

export type SanityHomepageDoc = {
  _id: string;
  heroImage?: SanityImageField;
  heroBackground?: SanityImageField;
  doctorPhoto?: SanityImageField;
  whyDoctorImage?: SanityImageField;
  heroPrimary?: HomepageCta;
  heroSecondary?: HomepageCta;
  doctorsPrimary?: HomepageCta;
  doctorsSecondary?: HomepageCta;
  aboutButton?: HomepageCta;
  aiButton?: HomepageCta;
  ctaBook?: HomepageCta;
  ctaCall?: HomepageCta;
  ctaWhatsapp?: HomepageCta;
  reviewsCta?: HomepageCta;
  serviceCards?: HomepageServiceCard[] | null;
  footerQuickLinks?: HomepageLink[] | null;
  footerServiceLinks?: HomepageLink[] | null;
  footerSocialLinks?: HomepageLink[] | null;
};

const HOMEPAGE_QUERY = `*[_type == "homepage" && _id == "homepage"][0]{
  _id,
  heroImage{ alt, asset->{ _id, url } },
  heroBackground{ asset->{ _id, url } },
  doctorPhoto{ alt, asset->{ _id, url } },
  whyDoctorImage{ alt, asset->{ _id, url } },
  heroPrimary,
  heroSecondary,
  doctorsPrimary,
  doctorsSecondary,
  aboutButton,
  aiButton,
  ctaBook,
  ctaCall,
  ctaWhatsapp,
  reviewsCta,
  serviceCards[]{
    title,
    description,
    href,
    objectPosition,
    image{ alt, asset->{ _id, url } }
  },
  footerQuickLinks[]{ label, href },
  footerServiceLinks[]{ label, href },
  footerSocialLinks[]{ label, href }
}`;

function imageUrl(
  image: SanityImageField | undefined,
  width = 1400,
): string | undefined {
  if (!image?.asset) return undefined;
  try {
    return urlFor(image).width(width).url();
  } catch {
    return image.asset.url || undefined;
  }
}

function setCta(
  overrides: ElementOverrides,
  elementId: string,
  cta: HomepageCta | undefined,
) {
  if (!cta) return;
  const patch: Record<string, string> = {};
  const label = cta.label?.trim();
  const href = cta.href?.trim();
  if (label) patch.label = label;
  if (href) patch.href = href;
  if (Object.keys(patch).length) overrides[elementId] = patch;
}

function setImage(
  overrides: ElementOverrides,
  elementId: string,
  image: SanityImageField | undefined,
  width?: number,
) {
  const src = imageUrl(image, width);
  if (!src) return;
  const patch: Record<string, string> = { src };
  const alt = image?.alt?.trim();
  if (alt) patch.alt = alt;
  overrides[elementId] = patch;
}

function normalizeLinks(
  links: HomepageLink[] | null | undefined,
): HomepageLink[] {
  if (!links?.length) return [];
  return links
    .map((link) => ({
      label: link.label?.trim() ?? "",
      href: link.href?.trim() ?? "",
    }))
    .filter((link) => link.label && link.href);
}

/** Map Sanity homepage singleton → PresentationConfig element/repeater overrides. */
export function homepageToPresentationConfig(
  doc: SanityHomepageDoc | null,
): PresentationConfig | null {
  if (!doc) return null;

  const elementOverrides: ElementOverrides = {};

  setImage(elementOverrides, "home.hero.heroImage", doc.heroImage, 1200);
  setImage(elementOverrides, "home.hero.background", doc.heroBackground, 1920);
  setImage(elementOverrides, "home.doctors.photo", doc.doctorPhoto, 900);
  setImage(elementOverrides, "home.why.doctorImage", doc.whyDoctorImage, 900);

  setCta(elementOverrides, "home.hero.primaryButton", doc.heroPrimary);
  setCta(elementOverrides, "home.hero.secondaryButton", doc.heroSecondary);
  setCta(elementOverrides, "home.doctors.primaryButton", doc.doctorsPrimary);
  setCta(elementOverrides, "home.doctors.secondaryButton", doc.doctorsSecondary);
  setCta(elementOverrides, "home.about.button", doc.aboutButton);
  setCta(elementOverrides, "home.ai-skin.button", doc.aiButton);
  setCta(elementOverrides, "home.cta.button", doc.ctaBook);
  setCta(elementOverrides, "home.cta.callButton", doc.ctaCall);
  setCta(elementOverrides, "home.cta.whatsapp", doc.ctaWhatsapp);
  setCta(elementOverrides, "home.reviews.cta", doc.reviewsCta);

  const serviceItems: RepeaterItem[] = [];
  for (const card of doc.serviceCards ?? []) {
    if (!card?.title?.trim() || !card.href?.trim()) continue;
    const imageSrc = imageUrl(card.image, 800);
    serviceItems.push({
      title: card.title.trim(),
      description: card.description?.trim() ?? "",
      href: card.href.trim(),
      imageSrc: imageSrc ?? "",
      imageAlt: card.image?.alt?.trim() || card.title.trim(),
      objectPosition: card.objectPosition?.trim() || "center center",
    });
  }

  const hasOverrides =
    Object.keys(elementOverrides).length > 0 || serviceItems.length > 0;
  if (!hasOverrides) return null;

  return {
    schemaVersion: 1,
    templateSlug: "home",
    elementOverrides,
    ...(serviceItems.length
      ? { repeaterOverrides: { "home.services": { items: serviceItems } } }
      : {}),
  } as PresentationConfig;
}

export function homepageToFooter(
  doc: SanityHomepageDoc | null,
): HomepageFooter | null {
  if (!doc) return null;
  const quickLinks = normalizeLinks(doc.footerQuickLinks);
  const serviceLinks = normalizeLinks(doc.footerServiceLinks);
  const socialLinks = normalizeLinks(doc.footerSocialLinks);
  if (!quickLinks.length && !serviceLinks.length && !socialLinks.length) {
    return null;
  }
  return { quickLinks, serviceLinks, socialLinks };
}

export const getSanityHomepage = cache(
  async (): Promise<SanityHomepageDoc | null> => {
    try {
      const client = await getSanityClient();
      return await client.fetch<SanityHomepageDoc | null>(HOMEPAGE_QUERY);
    } catch (error) {
      console.error("[CWMC]", {
        context: "getSanityHomepage",
        message: error instanceof Error ? error.message : "fetch failed",
      });
      return null;
    }
  },
);

export async function getHomepagePresentationConfig(): Promise<PresentationConfig | null> {
  const doc = await getSanityHomepage();
  return homepageToPresentationConfig(doc);
}

export async function getHomepageFooter(): Promise<HomepageFooter | null> {
  const doc = await getSanityHomepage();
  return homepageToFooter(doc);
}
