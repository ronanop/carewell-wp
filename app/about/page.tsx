import type { Metadata } from "next";

import { AboutPageView } from "@/components/pages/about/AboutPageView";
import { getCachedPublishedStaticPageConfig } from "@/lib/experience/services/staticPageService";

export const metadata: Metadata = {
  title: "About Us | Care Well Medical Centre",
  description:
    "About Care Well Medical Centre — our vision, team, and commitment to advanced cosmetic and aesthetic treatments in South Delhi, led by Dr. Sandeep Bhasin.",
};

export default async function AboutPage() {
  const studioConfig = await getCachedPublishedStaticPageConfig("about");
  return <AboutPageView mode="public" config={studioConfig} />;
}
