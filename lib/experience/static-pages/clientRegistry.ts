"use client";

/**
 * Client-safe static page view map — Studio canvas resolves by slug (ADR-015).
 * Server cannot pass component functions into Client Components.
 */

import type { ComponentType } from "react";

import { AboutPageView } from "@/components/pages/about/AboutPageView";
import { ContactPageView } from "@/components/pages/contact/ContactPageView";
import { DisclaimerPageView } from "@/components/pages/legal/DisclaimerPageView";
import { PrivacyPageView } from "@/components/pages/legal/PrivacyPageView";
import { TermsPageView } from "@/components/pages/legal/TermsPageView";
import { HomePageView } from "@/components/pages/home/HomePageView";
import { NotFoundPageView } from "@/components/pages/system/NotFoundPageView";
import { ThankYouPageView } from "@/components/pages/system/ThankYouPageView";
import type { StaticPageViewProps } from "@/types/static-page-descriptor";
import type { StaticPageSlug } from "@/types/static-page";

const STATIC_PAGE_VIEWS: Record<
  StaticPageSlug,
  ComponentType<StaticPageViewProps>
> = {
  home: HomePageView,
  about: AboutPageView,
  contact: ContactPageView,
  "privacy-policy": PrivacyPageView,
  disclaimer: DisclaimerPageView,
  terms: TermsPageView,
  "not-found": NotFoundPageView,
  "thank-you": ThankYouPageView,
};

export function getClientStaticPageView(
  slug: string,
): ComponentType<StaticPageViewProps> | null {
  if (!(slug in STATIC_PAGE_VIEWS)) return null;
  return STATIC_PAGE_VIEWS[slug as StaticPageSlug];
}
