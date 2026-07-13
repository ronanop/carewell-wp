import type { Metadata } from "next";

import { PrivacyBreadcrumb } from "@/components/privacy/PrivacyBreadcrumb";
import { PrivacyContent } from "@/components/privacy/PrivacyContent";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";

const title = "Privacy Policy | Care Well Medical Centre";
const description =
  "Read how Care Well Medical Centre collects, uses, stores, and protects personal information when you visit our website and use our services.";
const canonical = `${SITE_URL}/privacy-policy`;

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

export default function PrivacyPolicyPage() {
  const jsonLd = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy-policy" },
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
        <PrivacyBreadcrumb />
        <PrivacyContent />
      </main>
      <FooterPlaceholder />
    </>
  );
}
