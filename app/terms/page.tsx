import type { Metadata } from "next";

import { TermsPageView } from "@/components/pages/legal/TermsPageView";
import { getCachedPublishedStaticPageConfig } from "@/lib/experience/services/staticPageService";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";

const title = "Terms of Use | Care Well Medical Centre";
const description =
  "Terms of use for the Care Well Medical Centre website.";
const canonical = `${SITE_URL}/terms`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: SITE_NAME,
    type: "website",
  },
};

export default async function TermsPage() {
  const jsonLd = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Terms of Use", path: "/terms" },
  ]);
  const studioConfig = await getCachedPublishedStaticPageConfig("terms");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <TermsPageView mode="public" config={studioConfig} />
    </>
  );
}
