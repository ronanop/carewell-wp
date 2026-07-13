# SEO Skill — Care Well Medical Centre

## When to Use

Apply when implementing metadata, structured data, sitemaps, or any search engine optimization work.

## Core Rules

- Use **Next.js Metadata API** via `generateMetadata()` on every page.
- Source SEO data from **WordPress SEO fields** (Yoast/RankMath via WPGraphQL).
- Set `metadataBase` in root layout for absolute URL resolution.
- Implement **JSON-LD schema** on all page types.
- Generate **dynamic sitemap** (`app/sitemap.ts`) and **robots.txt** (`app/robots.ts`).
- One `<h1>` per page with primary keyword/title.
- Preserve existing WordPress slug URLs exactly.

## Metadata Pattern

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await getContentBySlug(slug);
  return {
    title: data.seo.title || `${data.title} | Care Well Medical Centre`,
    description: data.seo.description,
    alternates: { canonical: data.seo.canonicalUrl },
    openGraph: { title, description, images, type: 'website' },
    twitter: { card: 'summary_large_image', title, description, images },
  };
}
```

## Schema Types

| Page | Schema |
|------|--------|
| All | Organization, BreadcrumbList |
| Home | MedicalBusiness |
| Service | MedicalProcedure / Service |
| Blog | BlogPosting |
| Doctors | Physician |

## Do's

- Include breadcrumb navigation with matching BreadcrumbList schema.
- Use semantic HTML for crawlability.
- Submit sitemap to Google Search Console after launch.
- Set up 301 redirects for any changed URLs.

## Don'ts

- Do not generate metadata client-side.
- Do not change URL slugs without 301 redirects.
- Do not noindex pages indexed on the old WordPress site.
- Do not duplicate title tags across pages.

## Reference

Read `docs/13_SEO_STRATEGY.md`.
