# Care Well Medical Centre — SEO Strategy

## Purpose

Define the complete SEO implementation for the CWMC headless frontend, preserving existing search rankings while leveraging Next.js metadata capabilities.

## Responsibilities

- Preserve all existing WordPress SEO metadata (Yoast/RankMath).
- Implement Next.js Metadata API on every page.
- Generate structured data (JSON-LD schema).
- Produce XML sitemap and robots.txt dynamically.
- Maintain canonical URLs and Open Graph tags.

## Architecture

### Metadata Flow

```
WordPress SEO Plugin (Yoast/RankMath)
  → WPGraphQL SEO fields
    → lib/wordpress/mappers/map-seo.ts
      → generateMetadata() in page.tsx
        → Next.js Metadata API
          → HTML <head> output
```

### Metadata Implementation Pattern

```typescript
// Reference pattern for generateMetadata
import type { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await getServiceBySlug(params.slug);
  return {
    title: data.seo.title || `${data.title} | Care Well Medical Centre`,
    description: data.seo.description,
    alternates: {
      canonical: data.seo.canonicalUrl || `${SITE_URL}/services/${data.slug}`,
    },
    openGraph: {
      title: data.seo.openGraphTitle,
      description: data.seo.openGraphDescription,
      images: data.seo.openGraphImage ? [{ url: data.seo.openGraphImage }] : [],
      type: 'website',
      siteName: 'Care Well Medical Centre',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.seo.openGraphTitle,
      description: data.seo.openGraphDescription,
      images: data.seo.openGraphImage ? [data.seo.openGraphImage] : [],
    },
  };
}
```

### JSON-LD Schema Types

| Page | Schema Type | Key Properties |
|------|------------|----------------|
| All pages | `Organization` | name, url, logo, contactPoint |
| Home | `MedicalBusiness` | name, address, telephone, openingHours |
| Service detail | `MedicalProcedure` or `Service` | name, description, provider |
| Blog detail | `Article` or `BlogPosting` | headline, author, datePublished, image |
| Doctors | `Physician` | name, medicalSpecialty, image |
| All pages | `BreadcrumbList` | itemListElement with position, name, item |

### Sitemap & Robots

```typescript
// app/sitemap.ts — dynamic sitemap generation
// Fetches all service slugs, blog slugs, static pages from WordPress
// Returns MetadataRoute.Sitemap array

// app/robots.ts
// Allow all crawlers, point to sitemap URL
```

## Best Practices

- Use WordPress SEO fields as primary source; Next.js defaults as fallback only.
- One `<h1>` per page containing the primary keyword/title.
- Implement breadcrumb navigation with matching `BreadcrumbList` schema.
- Set `metadataBase` in root layout for absolute URL resolution.
- Use ISR to keep sitemap current without full rebuilds.

## Folder Examples

```
lib/seo/
├── metadata.ts              # Shared metadata helpers
├── schema.ts                # JSON-LD schema generators
└── constants.ts             # SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE

app/
├── sitemap.ts               # Dynamic XML sitemap
├── robots.ts                # Robots.txt
└── layout.tsx               # metadataBase, default metadata
```

## Naming Conventions

- Schema generator functions: `generate{Type}Schema(data)`.
- Metadata helpers: `buildPageMetadata(seo, fallback)`.
- Constants: `SITE_URL`, `SITE_NAME`, `DEFAULT_DESCRIPTION`.

## Production Recommendations

- Submit sitemap to Google Search Console after launch.
- Set up 301 redirects for any changed URLs from the old WordPress theme.
- Monitor Core Web Vitals — SEO and performance are intertwined.
- Preserve existing WordPress slug URLs exactly.
- Test with Google Rich Results Test and Schema Markup Validator.

## Common Mistakes

- Generating metadata client-side instead of via `generateMetadata`.
- Missing `canonical` tags causing duplicate content issues.
- Not including `metadataBase` leading to relative OG image URLs.
- Hardcoding meta descriptions instead of using WordPress SEO fields.
- Forgetting `noindex` on development/staging environments.

## Scalability Considerations

- Dynamic sitemap handles hundreds of services and blogs automatically.
- Schema generators are reusable functions accepting typed content props.
- SEO metadata caching via ISR prevents WordPress query on every crawl.

## Do's

- Fetch SEO data from WordPress for every content page.
- Implement structured data on all page types.
- Use semantic HTML (`article`, `header`, `main`, `footer`, `nav`).
- Include alt text on all images from WordPress media fields.

## Don'ts

- Do not noindex pages that were indexed on the old WordPress site.
- Do not change URL slugs without 301 redirects.
- Do not duplicate title tags across pages.
- Do not rely on client-side rendering for SEO-critical content.

## Future Expansion

- Hreflang tags for multi-language support.
- FAQ schema on service pages.
- Review/rating schema for testimonials.
- Local SEO schema with Google Business Profile integration.
- Automated SEO audit in CI pipeline.
