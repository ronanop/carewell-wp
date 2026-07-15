import type { Metadata } from "next";

import { HomePageView } from "@/components/pages/home/HomePageView";
import { getCachedPublishedStaticPageConfig } from "@/lib/experience/services/staticPageService";

export const metadata: Metadata = {
  title: "Care Well Medical Centre",
  description:
    "Advanced care, thoughtfully delivered. A premium medical centre offering specialist consultations and personalised treatment.",
};

/**
 * Homepage — thin route. Single implementation lives in HomePageView (ADR-015).
 */
export default async function HomePage() {
  const studioConfig = await getCachedPublishedStaticPageConfig("home");
  return <HomePageView mode="public" config={studioConfig} />;
}
