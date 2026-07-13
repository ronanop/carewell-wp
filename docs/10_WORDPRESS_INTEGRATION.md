# Care Well Medical Centre — WordPress Integration

## Purpose

Define how the existing WordPress installation connects to the Next.js frontend via WPGraphQL, including configuration, data fetching patterns, content rendering, and operational rules.

## Responsibilities

| WordPress | Next.js |
|-----------|---------|
| Content authoring | Content consumption |
| Media storage | Media display via URLs |
| SEO metadata storage | Metadata rendering |
| Gutenberg block editing | HTML rendering |
| Category/taxonomy management | Taxonomy display and filtering |
| User management (editors) | No user management |

## Architecture

```
WordPress (Hostinger)
  ├── WPGraphQL Plugin
  │   ├── WPGraphQL for Custom Post Types
  │   ├── WPGraphQL for ACF (if ACF used)
  │   └── WPGraphQL SEO (Yoast/RankMath)
  ├── Custom Post Types: Services, Doctors
  ├── Standard Posts: Blogs
  ├── Pages: About, Contact, Gallery
  └── Media Library

        ↓ HTTPS POST (GraphQL)

Next.js (Vercel)
  ├── lib/wordpress/client.ts
  ├── lib/wordpress/queries/
  ├── lib/wordpress/fragments/
  └── lib/wordpress/mappers/
```

### WordPress Plugin Requirements

- **WPGraphQL** — Core GraphQL API.
- **WPGraphQL for Custom Post Types** — Expose services, doctors CPTs.
- **WPGraphQL SEO** or equivalent — Expose Yoast/RankMath fields.
- **WPGraphQL for ACF** — If Advanced Custom Fields are used on the site.

### Environment Configuration

```env
# .env.local
WORDPRESS_GRAPHQL_URL=https://cms.carewellmedical.com/graphql
NEXT_PUBLIC_SITE_URL=https://www.carewellmedical.com
REVALIDATION_SECRET=your-secret-token
```

## Best Practices

- Fetch data exclusively in Server Components or server-side functions.
- Use `graphql-request` with a singleton client instance.
- Implement request caching with Next.js `fetch` options or React `cache()`.
- Map raw GraphQL responses to typed interfaces in `lib/wordpress/mappers/`.
- Render Gutenberg HTML through a sanitized `ContentRenderer` component.
- Never mutate WordPress data from the frontend — read-only integration.

## Folder Examples

```
lib/wordpress/
├── client.ts
│   // GraphQL client singleton
├── queries/
│   ├── get-homepage.ts
│   ├── get-page-by-slug.ts
│   ├── get-all-services.ts
│   ├── get-service-by-slug.ts
│   ├── get-all-posts.ts
│   ├── get-post-by-slug.ts
│   ├── get-all-doctors.ts
│   └── get-menu-items.ts
├── fragments/
│   ├── seo-fields.ts
│   ├── featured-image.ts
│   ├── author-fields.ts
│   └── content-fields.ts
└── mappers/
    ├── map-service.ts
    ├── map-blog-post.ts
    ├── map-doctor.ts
    └── map-seo.ts
```

## Naming Conventions

- Client file: `client.ts` with exported `wpClient` or `graphqlClient`.
- Query exports: `GET_ALL_SERVICES_QUERY` (string) + `getAllServices()` (fetcher function).
- Fragment exports: `SEO_FIELDS_FRAGMENT`, `FEATURED_IMAGE_FRAGMENT`.
- Mapper exports: `mapService(raw): Service`, `mapBlogPost(raw): BlogPost`.

## Production Recommendations

- Whitelist WordPress domain in `next.config.ts` `images.remotePatterns`.
- Set GraphQL request timeout (10 seconds) with graceful error handling.
- Implement retry logic for transient WordPress failures (1 retry max).
- Monitor WordPress GraphQL endpoint uptime independently.
- Use WordPress Application Passwords only for server-side webhook authentication.

## Common Mistakes

- Hardcoding WordPress URLs instead of environment variables.
- Fetching entire post content in listing queries (use excerpts).
- Not handling WordPress HTML entities and shortcodes in content.
- Exposing WordPress GraphQL endpoint directly to client-side code.
- Attempting to write/update WordPress content from Next.js.

## Scalability Considerations

- Paginate all list queries with cursor-based pagination.
- Use GraphQL fragments to minimize query duplication.
- Cache WordPress responses with ISR — do not fetch on every request.
- Plan for WordPress schema evolution with flexible mapper functions.

## Do's

- Inspect the live WordPress GraphQL schema (GraphiQL IDE) before writing queries.
- Preserve WordPress slug, date, author, and category data faithfully.
- Handle embedded YouTube videos in Gutenberg content (oEmbed).
- Support WordPress featured images at all required sizes.

## Don'ts

- **Never** build another CMS.
- **Never** migrate or duplicate WordPress content.
- **Never** create Express, Prisma, MongoDB, Supabase, or Firebase integrations.
- **Never** create authentication or admin dashboards.
- **Never** create custom backend APIs for content delivery.
- Do not install WordPress PHP plugins from the Next.js project.

## Future Expansion

- WordPress webhook → Next.js on-demand revalidation endpoint.
- WordPress preview mode for draft content review.
- WPGraphQL query caching plugin on WordPress side.
- Content sync monitoring dashboard (read-only health check).
