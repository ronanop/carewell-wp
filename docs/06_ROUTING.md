# Care Well Medical Centre — Routing

## Purpose

Define all routes, their rendering strategies, metadata requirements, and dynamic segment behavior for the CWMC frontend.

## Responsibilities

| Route | Type | Content Source |
|-------|------|----------------|
| `/` | Static/ISR | WordPress homepage fields + featured content |
| `/about` | SSG/ISR | WordPress page slug `about` |
| `/contact` | SSG/ISR | WordPress page slug `contact` |
| `/gallery` | ISR | WordPress gallery custom post type or page |
| `/doctors` | ISR | WordPress doctors custom post type |
| `/services` | ISR | WordPress services archive |
| `/services/[slug]` | Dynamic ISR | WordPress service by slug |
| `/blogs` | ISR | WordPress posts archive (paginated) |
| `/blogs/[slug]` | Dynamic ISR | WordPress post by slug |
| `/404` | Static | Hardcoded not-found page |

## Architecture

### App Router File Mapping

```
URL                          File
─────────────────────────────────────────────────
/                            app/page.tsx
/about                       app/about/page.tsx
/contact                     app/contact/page.tsx
/gallery                     app/gallery/page.tsx
/doctors                     app/doctors/page.tsx
/services                    app/services/page.tsx
/services/laser-hair-removal app/services/[slug]/page.tsx
/blogs                       app/blogs/page.tsx
/blogs/skincare-tips-2026    app/blogs/[slug]/page.tsx
(any unknown)                app/not-found.tsx
```

### Dynamic Route Implementation Pattern

```typescript
// app/services/[slug]/page.tsx (reference pattern — do not implement yet)

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Fetch all service slugs from WordPress
  // Return array of { slug: string }
}

export async function generateMetadata({ params }: PageProps) {
  // Fetch service SEO fields by slug
  // Return Metadata object
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  // Fetch service data, render page
}
```

## Best Practices

- Use `generateStaticParams` for dynamic routes to pre-build popular pages at deploy time.
- Implement `generateMetadata` on every page for SEO.
- Add `loading.tsx` in route segments that fetch WordPress data.
- Add `error.tsx` with retry capability for failed GraphQL requests.
- Use Next.js 15 async `params` and `searchParams` patterns.

## Folder Examples

```
app/
├── layout.tsx
├── page.tsx
├── loading.tsx                   # Global loading (optional)
├── not-found.tsx
├── about/
│   └── page.tsx
├── services/
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── [slug]/
│       ├── page.tsx
│       └── loading.tsx
└── blogs/
    ├── page.tsx
    └── [slug]/
        └── page.tsx
```

## Naming Conventions

- Route folders: kebab-case matching URL segments.
- Dynamic segments: `[slug]`, `[...slug]` for catch-all (if needed).
- Route groups: `(marketing)` for shared layouts without URL impact.
- Parallel routes: `@modal` for future modal-based navigation.

## Production Recommendations

- Configure ISR revalidation per content type (blogs revalidate more frequently).
- Implement `sitemap.ts` at app root for dynamic sitemap generation.
- Implement `robots.ts` for crawl directives.
- Preserve WordPress slug conventions exactly — do not transform slugs.
- Set up 301 redirects in `next.config.ts` for any URL changes from old site.

## Common Mistakes

- Using Pages Router conventions (`getStaticProps`, `pages/` directory).
- Forgetting to await `params` in Next.js 15 async dynamic APIs.
- Not handling `notFound()` when WordPress returns null for a slug.
- Hardcoding routes instead of deriving navigation from WordPress menus.

## Scalability Considerations

- Blog pagination via `searchParams`: `/blogs?page=2`.
- Category filtering: `/blogs?category=skincare` (future).
- Service category pages: `/services/category/[category]` (future).
- Breadcrumb generation from route segments + WordPress hierarchy.

## Do's

- Call `notFound()` from `next/navigation` when content doesn't exist.
- Use `revalidate` export or `next.revalidate` option on fetch calls.
- Document new routes in this file before implementation.
- Test all dynamic slugs against WordPress slug inventory.

## Don'ts

- Do not create catch-all routes unless WordPress has nested page hierarchies.
- Do not use middleware for routing logic that belongs in page components.
- Do not expose internal WordPress IDs in URLs — use slugs only.
- Do not create `/api/*` routes for content delivery — use Server Components.

## Future Expansion

- `/search` route with client-side search UI.
- `/services/category/[category]` for service taxonomy pages.
- `/doctors/[slug]` for individual doctor profile pages.
- Preview route: `/api/preview` for WordPress draft preview.
- Internationalized routes: `/en/about`, `/hi/about` via `next-intl`.
