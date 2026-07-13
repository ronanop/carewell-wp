# WordPress Skill — Care Well Medical Centre

## When to Use

Apply when integrating with WordPress, writing GraphQL queries, mapping content, or rendering Gutenberg HTML.

## Core Rules

- WordPress is the **ONLY content source** — read-only from Next.js.
- **Never** build another CMS, migrate content, or duplicate data.
- **Never** create Express, Prisma, MongoDB, Supabase, Firebase, auth, or dashboards.
- Fetch data via **WPGraphQL** using `graphql-request` in Server Components only.
- All queries live in `lib/wordpress/queries/` — never inline in components.
- Map raw GraphQL responses to typed interfaces via `lib/wordpress/mappers/`.
- Render Gutenberg HTML through `ContentRenderer` with sanitization.

## Architecture

```
WordPress (Hostinger) → WPGraphQL → lib/wordpress/client.ts → Server Components
```

## Environment

```
WORDPRESS_GRAPHQL_URL=https://cms.carewellmedical.com/graphql
```

## Query Pattern

```typescript
// lib/wordpress/queries/get-all-services.ts
export const GET_ALL_SERVICES_QUERY = gql`...`;
export async function getAllServices(first = 100, after?: string) {
  const data = await wpClient.request(GET_ALL_SERVICES_QUERY, { first, after });
  return { services: data.services.nodes.map(mapService), pageInfo: data.services.pageInfo };
}
```

## Content Types

| WordPress | GraphQL Type | Route |
|-----------|-------------|-------|
| Pages | Page | /about, /contact |
| Posts | Post | /blogs/[slug] |
| Services CPT | Service | /services/[slug] |
| Doctors CPT | Doctor | /doctors |
| Media | MediaItem | Images |

## Do's

- Inspect schema in GraphiQL before writing queries.
- Use GraphQL fragments for reusable field selections.
- Paginate all list queries with cursor-based pagination.
- Preserve WordPress slugs exactly — do not transform.
- Handle null/missing fields gracefully.

## Don'ts

- Do not mutate WordPress data from Next.js.
- Do not expose GraphQL endpoint to client-side code.
- Do not fetch full HTML content in listing queries.
- Do not hardcode WordPress URLs — use environment variables.

## Reference

Read `docs/10_WORDPRESS_INTEGRATION.md`, `docs/11_GRAPHQL_STRUCTURE.md`, and `docs/12_CONTENT_MODEL.md`.
