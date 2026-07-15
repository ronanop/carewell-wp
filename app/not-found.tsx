import type { Metadata } from "next";

import { NotFoundPageView } from "@/components/pages/system/NotFoundPageView";
import { getCachedPublishedStaticPageConfig } from "@/lib/experience/services/staticPageService";

export const metadata: Metadata = {
  title: "Page Not Found | Care Well Medical Centre",
  description:
    "The page you are looking for could not be found. Return to Care Well Medical Centre or contact our clinic for help.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function NotFound() {
  const studioConfig = await getCachedPublishedStaticPageConfig("not-found");
  return <NotFoundPageView mode="public" config={studioConfig} />;
}
