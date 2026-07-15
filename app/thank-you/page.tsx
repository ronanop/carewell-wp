import type { Metadata } from "next";

import { ThankYouPageView } from "@/components/pages/system/ThankYouPageView";
import { getCachedPublishedStaticPageConfig } from "@/lib/experience/services/staticPageService";

export const metadata: Metadata = {
  title: "Thank You | Care Well Medical Centre",
  description:
    "Thank you for contacting Care Well Medical Centre. We will respond shortly.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ThankYouPage() {
  const studioConfig = await getCachedPublishedStaticPageConfig("thank-you");
  return <ThankYouPageView mode="public" config={studioConfig} />;
}
