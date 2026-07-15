import type { Metadata } from "next";

import { DisclaimerPageView } from "@/components/pages/legal/DisclaimerPageView";
import { getCachedPublishedStaticPageConfig } from "@/lib/experience/services/staticPageService";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";

const title = "Disclaimer | Care Well Medical Centre";
const description =
  "Read the Care Well Medical Centre website disclaimer covering medical information, accuracy, external links, and user responsibility.";
const canonical = `${SITE_URL}/disclaimer`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default async function DisclaimerPage() {
  const jsonLd = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Disclaimer", path: "/disclaimer" },
  ]);
  const studioConfig = await getCachedPublishedStaticPageConfig("disclaimer");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <DisclaimerPageView mode="public" config={studioConfig} />
    </>
  );
}
