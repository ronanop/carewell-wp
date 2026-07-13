# Care Well Medical Centre — Architecture

## Purpose

Define the system architecture, data flow patterns, rendering strategies, and integration boundaries for the headless WordPress + Next.js platform.

## Responsibilities

### Next.js Layer

- Route resolution via App Router file-system conventions.
- Server Component data fetching from WPGraphQL at request or build time.
- Client Component islands for interactivity (forms, modals, animations).
- Metadata generation via `generateMetadata` for SEO.
- Static generation, ISR, and dynamic rendering per route segment.

### WordPress Layer

- Content storage and authoring (posts, pages, custom post types).
- Media management (images, videos).
- SEO plugin metadata (Yoast/RankMath fields exposed via WPGraphQL).
- Category and tag taxonomy.
- Gutenberg block content as HTML in GraphQL responses.

### Integration Layer

- WPGraphQL exposes typed GraphQL schema.
- `graphql-request` client in `lib/wordpress/client.ts`.
- Environment variable `WORDPRESS_GRAPHQL_URL` for endpoint configuration.

## Architecture

### High-Level Data Flow

```
Request → Next.js Middleware (optional) → App Router
  → Layout (Server Component)
    → Page (Server Component)
      → fetch WordPress data (GraphQL)
      → render with React components
      → stream HTML to client
  → Client Component hydration (forms, motion, modals)
```

### Rendering Strategy by Route

| Route | Strategy | Revalidation |
|-------|----------|--------------|
| `/` | ISR | 3600s (1 hour) |
| `/about`, `/contact` | SSG | On deploy |
| `/services` | ISR | 3600s |
| `/services/[slug]` | ISR | 3600s |
| `/blogs` | ISR | 1800s (30 min) |
| `/blogs/[slug]` | ISR | 3600s |
| `/doctors`, `/gallery` | ISR | 3600s |
| `/404` | Static | On deploy |

### Component Architecture Layers

```
┌─────────────────────────────────────┐
│           Page Components           │  app/**/page.tsx
├─────────────────────────────────────┤
│         Feature Components          │  components/features/
├─────────────────────────────────────┤
│          Layout Components          │  components/layout/
├─────────────────────────────────────┤
│           UI Primitives             │  components/ui/
├─────────────────────────────────────┤
│         Utilities & Types           │  lib/, types/, hooks/
└─────────────────────────────────────┘
```

## Best Practices

- Default to Server Components; add `"use client"` only when necessary.
- Colocate data fetching in page components or dedicated `lib/wordpress/queries/`.
- Use React `cache()` to deduplicate GraphQL requests within a single render.
- Separate Gutenberg HTML rendering into a dedicated `ContentRenderer` component.
- Never expose WordPress admin credentials or internal URLs to the client.

## Folder Examples

```
lib/wordpress/
├── client.ts
├── queries/
│   ├── get-homepage.ts
│   ├── get-all-services.ts
│   ├── get-service-by-slug.ts
│   ├── get-all-posts.ts
│   └── get-post-by-slug.ts
├── fragments/
│   ├── seo-fields.ts
│   ├── featured-image.ts
│   └── author-fields.ts
└── mappers/
    ├── map-service.ts
    └── map-blog-post.ts

components/
├── layout/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── features/
│   ├── services/
│   │   └── ServiceCard.tsx
│   └── blog/
│       └── BlogCard.tsx
└── shared/
    ├── ContentRenderer.tsx
    └── SEOHead.tsx
```

## Naming Conventions

- Query files: `get-{entity}-{modifier}.ts` (e.g., `get-all-services.ts`)
- Fragment files: `{entity}-fields.ts` (e.g., `seo-fields.ts`)
- Mapper functions: `map{Entity}` (e.g., `mapService`, `mapBlogPost`)
- Server actions (if any): `{verb}{Entity}Action` (e.g., `submitContactAction`)

## Production Recommendations

- Configure `next.config.ts` with WordPress image domain allowlist.
- Set appropriate `Cache-Control` headers via Next.js caching APIs.
- Implement error boundaries at layout and page levels.
- Log GraphQL errors server-side; show user-friendly fallback UI.
- Use Vercel Preview Deployments for PR-based staging.

## Common Mistakes

- Fetching data in layout when only specific pages need it (over-fetching).
- Using Client Components for entire pages when only a button needs interactivity.
- Not handling GraphQL null responses (deleted WordPress content).
- Mixing WordPress HTML rendering with React component rendering inconsistently.

## Scalability Considerations

- Implement GraphQL query fragments to reuse field selections across queries.
- Use Next.js `generateStaticParams` for pre-rendering top N service/blog slugs.
- Consider edge caching for frequently accessed pages via Cloudflare.
- Plan for WordPress schema changes with versioned TypeScript types.

## Do's

- Document rendering strategy for each new route in `06_ROUTING.md`.
- Use parallel data fetching with `Promise.all` for independent queries.
- Implement loading.tsx and error.tsx for each route segment.
- Keep GraphQL queries focused — fetch only required fields.

## Don'ts

- Do not create API routes that proxy WordPress unless required for security.
- Do not store WordPress content in local files or databases.
- Do not use `getServerSideProps` or Pages Router patterns — App Router only.
- Do not bypass TypeScript types when mapping GraphQL responses.

## Future Expansion

- On-demand revalidation via WordPress webhook → Next.js `/api/revalidate`.
- Edge middleware for geo-based content or A/B testing.
- GraphQL query complexity analysis and rate limiting.
- Separate preview mode for WordPress draft content.
