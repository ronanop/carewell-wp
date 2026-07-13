import type { Metadata } from "next";

import { DisclaimerBreadcrumb } from "@/components/disclaimer/DisclaimerBreadcrumb";
import { DisclaimerContent } from "@/components/disclaimer/DisclaimerContent";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
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

export default function DisclaimerPage() {
  const jsonLd = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Disclaimer", path: "/disclaimer" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <NavbarPlaceholder />
      <main className="flex-1">
        <DisclaimerBreadcrumb />
        <DisclaimerContent />
      </main>
      <FooterPlaceholder />
    </>
  );
}
