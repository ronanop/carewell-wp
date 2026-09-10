import type { Metadata } from "next";

import {
  faqAnswerPlainText,
  flattenFaqItems,
} from "@/components/faq/content";
import { FaqPageView } from "@/components/pages/faq/FaqPageView";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";

const title = "Frequently Asked Questions (FAQs)";
const description =
  "Answers about Care Well Medical Centre treatments, appointments, laser care, payment options, and how to contact the clinic in CR Park, South Delhi.";
const canonical = `${SITE_URL}/faq`;
const ogTitle = `${title} | ${SITE_NAME}`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical,
  },
  openGraph: {
    title: ogTitle,
    description,
    url: canonical,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: ogTitle,
    description,
  },
};

export default async function FaqPage() {
  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: flattenFaqItems().map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faqAnswerPlainText(item),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <FaqPageView />
    </>
  );
}
