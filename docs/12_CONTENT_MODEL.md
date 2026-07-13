# Care Well Medical Centre — Content Model

## Purpose

Map WordPress content types, fields, taxonomies, and relationships to TypeScript interfaces and Next.js page routes.

## Responsibilities

Document every content entity in WordPress, its GraphQL representation, TypeScript type, and frontend rendering location.

## Architecture

### Content Type Mapping

| WordPress Entity | Post Type | GraphQL Type | Route | Listing |
|-----------------|-----------|-------------|-------|---------|
| Homepage | Page (front-page) | `Page` | `/` | — |
| About | Page | `Page` | `/about` | — |
| Contact | Page | `Page` | `/contact` | — |
| Gallery | Page or CPT | `Page` / `GalleryItem` | `/gallery` | Grid |
| Service | Custom Post Type | `Service` | `/services/[slug]` | `/services` |
| Blog Post | Post | `Post` | `/blogs/[slug]` | `/blogs` |
| Doctor | Custom Post Type | `Doctor` | `/doctors` | Grid on `/doctors` |
| Media | Attachment | `MediaItem` | — | Embedded in content |
| Navigation | Menu | `Menu` / `MenuItem` | Navbar/Footer | — |
| Category | Category | `Category` | Filter param | Blog sidebar/filter |

### TypeScript Interfaces

```typescript
// types/service.ts
interface Service {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;           // Gutenberg HTML
  featuredImage: FeaturedImage | null;
  seo: SeoMetadata;
  categories: Category[];
  date: string;
  modified: string;
}

// types/blog.ts
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: FeaturedImage | null;
  author: Author;
  categories: Category[];
  seo: SeoMetadata;
  date: string;
  modified: string;
}

// types/doctor.ts
interface Doctor {
  id: string;
  slug: string;
  name: string;
  title: string;             // e.g., "MD, Dermatologist"
  specialty: string;
  bio: string;
  featuredImage: FeaturedImage | null;
  qualifications: string[];
}

// types/wordpress.ts
interface FeaturedImage {
  sourceUrl: string;
  altText: string;
  width: number;
  height: number;
}

interface SeoMetadata {
  title: string;
  description: string;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImage: string | null;
  canonicalUrl: string;
}

interface Author {
  name: string;
  slug: string;
  avatarUrl: string | null;
}

interface Category {
  name: string;
  slug: string;
  count: number;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}
```

### Gutenberg Content Handling

WordPress Gutenberg stores content as HTML with block comments. The frontend receives rendered HTML via the `content` field in GraphQL.

- **Paragraphs, headings, lists:** Rendered directly in `ContentRenderer`.
- **Images:** Already rendered as `<img>` tags; rewrite URLs if needed.
- **Embedded YouTube:** Rendered as `<iframe>` via oEmbed; ensure responsive wrapper.
- **Columns/group blocks:** Rendered as `<div>` with WordPress block classes; style via `ContentRenderer` CSS.
- **Shortcodes:** Must be processed server-side in WordPress; if unprocessed, handle in mapper.

## Best Practices

- Define types in `types/` before writing mappers or components.
- Use strict null checks — WordPress fields are frequently optional.
- Map GraphQL `databaseId` to `id` for consistency.
- Strip or sanitize HTML in mappers if WordPress content includes scripts.
- Date fields: parse ISO strings; format with `Intl.DateTimeFormat`.

## Folder Examples

```
types/
├── wordpress.ts             # Shared types (FeaturedImage, SeoMetadata, etc.)
├── service.ts               # Service interface
├── blog.ts                  # BlogPost interface
├── doctor.ts                # Doctor interface
└── navigation.ts            # Menu, MenuItem interfaces
```

## Naming Conventions

- Interfaces: PascalCase singular (`Service`, `BlogPost`, `Doctor`).
- Shared types: grouped in `wordpress.ts`.
- Mapper output types must match interface definitions exactly.
- GraphQL field names (camelCase) mapped to consistent TypeScript properties.

## Production Recommendations

- Validate content model against live WordPress GraphiQL schema before coding.
- Handle missing featured images with placeholder component.
- Handle empty excerpts by truncating content field.
- Log content mapping warnings for fields that return unexpected nulls.

## Common Mistakes

- Assuming all services have featured images — always nullable.
- Not handling WordPress auto-formatting (wpautop) in content HTML.
- Using WordPress `ID` (integer) instead of `slug` (string) for routing.
- Ignoring `modified` date for cache invalidation decisions.

## Scalability Considerations

- Content model supports adding new CPTs without restructuring types/.
- Shared types (FeaturedImage, SeoMetadata) prevent duplication across entities.
- Category taxonomy can expand to service categories without model changes.

## Do's

- Inspect actual WordPress content in GraphiQL to verify field availability.
- Support all existing content — hundreds of blogs and services must render.
- Preserve WordPress category and tag relationships.
- Handle embedded media (YouTube) with responsive containers.

## Don'ts

- Do not create local content files (MDX, JSON) as content source.
- Do not transform slugs — use WordPress slugs verbatim.
- Do not strip HTML tags from Gutenberg content — render faithfully.
- Do not hardcode content that exists in WordPress.

## Future Expansion

- Custom fields via ACF exposed through WPGraphQL for ACF.
- Service-doctor relationship mapping.
- Testimonial custom post type.
- FAQ blocks per service page.
- Related content recommendations based on shared categories.
