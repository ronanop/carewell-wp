# Care Well Medical Centre — GraphQL Structure

## Purpose

Define the GraphQL query organization, fragment strategy, pagination patterns, and type mapping conventions for WPGraphQL integration.

## Responsibilities

- Organize all GraphQL operations in `lib/wordpress/`.
- Define reusable fragments for common field selections.
- Establish pagination, filtering, and error handling patterns.
- Map GraphQL schema types to TypeScript interfaces.

## Architecture

### Query Organization

Each query file exports two things:
1. The GraphQL query/mutation string constant.
2. An async fetcher function that executes the query and returns typed data.

```typescript
// lib/wordpress/queries/get-all-services.ts (reference pattern)

import { gql } from 'graphql-request';
import { wpClient } from '../client';
import { FEATURED_IMAGE_FRAGMENT } from '../fragments/featured-image';
import { SEO_FIELDS_FRAGMENT } from '../fragments/seo-fields';
import type { Service } from '@/types/service';
import { mapService } from '../mappers/map-service';

export const GET_ALL_SERVICES_QUERY = gql`
  ${FEATURED_IMAGE_FRAGMENT}
  ${SEO_FIELDS_FRAGMENT}
  query GetAllServices($first: Int!, $after: String) {
    services(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        slug
        title
        excerpt
        featuredImage {
          ...FeaturedImageFields
        }
        seo {
          ...SeoFields
        }
      }
    }
  }
`;

export async function getAllServices(
  first = 100,
  after?: string
): Promise<{ services: Service[]; pageInfo: PageInfo }> {
  const data = await wpClient.request(GET_ALL_SERVICES_QUERY, { first, after });
  return {
    services: data.services.nodes.map(mapService),
    pageInfo: data.services.pageInfo,
  };
}
```

### Fragment Strategy

| Fragment | Fields | Used In |
|----------|--------|---------|
| `FeaturedImageFields` | sourceUrl, altText, mediaDetails (width, height) | Services, blogs, doctors |
| `SeoFields` | title, metaDesc, opengraphTitle, opengraphDescription, opengraphImage | All content types |
| `AuthorFields` | name, slug, avatar | Blog posts |
| `ContentFields` | content (HTML), excerpt | Detail pages |
| `CategoryFields` | name, slug, count | Blog listing, filters |

### Expected WordPress Schema Types

| GraphQL Type | WordPress Source | Next.js Route |
|-------------|-----------------|---------------|
| `Page` | WordPress Pages | `/about`, `/contact` |
| `Post` | WordPress Posts | `/blogs/[slug]` |
| `Service` (CPT) | Custom Post Type | `/services/[slug]` |
| `Doctor` (CPT) | Custom Post Type | `/doctors` |
| `MediaItem` | Media Library | Image components |
| `Category` | Post Categories | Blog filtering |
| `Menu` / `MenuItem` | Navigation Menus | Navbar, Footer |

## Best Practices

- Always use fragments for field sets used in 2+ queries.
- Request only fields needed for the specific view (listing vs detail).
- Use cursor-based pagination (`first`/`after`) over offset pagination.
- Wrap all fetcher functions with error handling and logging.
- Use React `cache()` to deduplicate identical queries in one render pass.

## Folder Examples

```
lib/wordpress/
├── client.ts
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
│   ├── content-fields.ts
│   └── category-fields.ts
└── mappers/
    ├── map-service.ts
    ├── map-blog-post.ts
    ├── map-doctor.ts
    ├── map-page.ts
    └── map-seo.ts
```

## Naming Conventions

- Query constants: `GET_{ACTION}_{ENTITY}_QUERY` (e.g., `GET_ALL_SERVICES_QUERY`).
- Fetcher functions: `get{Entity}(params)` (e.g., `getServiceBySlug(slug)`).
- Fragments: `{NAME}_FRAGMENT` (e.g., `SEO_FIELDS_FRAGMENT`).
- GraphQL fragment names: PascalCase (e.g., `fragment SeoFields on PostTypeSEO`).

## Production Recommendations

- Validate WordPress schema against queries using GraphiQL before deployment.
- Set `next.revalidate` on fetch calls aligned with content update frequency.
- Log query execution time server-side for performance monitoring.
- Handle GraphQL errors with typed error responses, not generic catches.

## Common Mistakes

- Inline GraphQL strings in page components instead of dedicated query files.
- Fetching full HTML content in listing/archive queries.
- Not using variables for dynamic values (slug, pagination cursor).
- Duplicating field selections across queries instead of using fragments.
- Assuming WordPress field names without verifying in GraphiQL.

## Scalability Considerations

- Fragment composition scales query maintenance as field requirements grow.
- Cursor pagination handles datasets of any size without performance degradation.
- Separate listing and detail queries optimize payload size per view.
- Mapper functions isolate WordPress schema changes from component props.

## Do's

- Test every query in WordPress GraphiQL IDE before adding to codebase.
- Type all GraphQL responses with TypeScript interfaces.
- Use `gql` tag from `graphql-request` for query parsing.
- Document expected WordPress plugins needed for each query.

## Don'ts

- Do not use GraphQL mutations — read-only integration.
- Do not fetch WordPress data in Client Components.
- Do not use inline GraphQL in JSX or component files.
- Do not assume custom post type names — verify with WordPress admin.

## Future Expansion

- GraphQL query complexity budgeting.
- Persisted queries for production optimization.
- Automated schema introspection and TypeScript type generation.
- Query batching for pages requiring multiple content types.
