/**
 * Blog SEO schemas — Article, FAQ, Breadcrumb, MedicalWebPage, Author.
 */

import { ORGANIZATION, SITE_URL } from "@/lib/seo/constants";
import type { BlogDocument } from "@/types/blog-document";

export function generateBlogPostingSchema(doc: BlogDocument) {
  const image = doc.seo.openGraphImage || doc.hero.featuredImage?.sourceUrl;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: doc.title,
    description: doc.seo.description ?? undefined,
    image: image ? [image] : undefined,
    datePublished: doc.hero.publishedAt ?? undefined,
    dateModified: doc.hero.modifiedAt ?? doc.hero.publishedAt ?? undefined,
    author: doc.author
      ? {
          "@type": "Person",
          name: doc.author.name,
          url: `${SITE_URL}/about/dr-sandeep-bhasin/`,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": doc.seo.canonicalUrl ?? doc.hero.shareUrl,
    },
    timeRequired: `PT${doc.hero.readingTimeMinutes}M`,
    articleSection: doc.categories.map((c) => c.name),
    keywords: doc.tags.map((t) => t.name).join(", "),
  };
}

export function generateMedicalWebPageSchema(doc: BlogDocument) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: doc.title,
    url: doc.seo.canonicalUrl ?? doc.hero.shareUrl,
    description: doc.seo.description ?? undefined,
    lastReviewed: doc.hero.modifiedAt ?? doc.hero.publishedAt ?? undefined,
    about: {
      "@type": "MedicalBusiness",
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
  };
}

export function generateFaqSchema(doc: BlogDocument) {
  if (!doc.faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: doc.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answerText,
      },
    })),
  };
}

export function generateBlogJsonLd(doc: BlogDocument) {
  const schemas = [
    generateBlogPostingSchema(doc),
    generateMedicalWebPageSchema(doc),
    generateFaqSchema(doc),
  ].filter(Boolean);
  return schemas;
}
