# Care Well Medical Centre — WordPress Field Mapping

## Purpose

Provide the authoritative field-by-field mapping from WordPress/WPGraphQL to TypeScript types to UI components. This document must be validated against the live GraphQL schema before implementation begins.

## Responsibilities

- Document every content field consumed by the frontend.
- Map GraphQL field paths to TypeScript properties to component props.
- Record discovery status (verified vs assumed) for each field.
- Serve as the contract between WordPress editors and frontend developers.

## Discovery Protocol

Before implementation:

1. Access WordPress GraphiQL IDE at `{WORDPRESS_GRAPHQL_URL}`.
2. Run introspection or query each content type.
3. Update this document with verified field names.
4. Mark fields as `VERIFIED` or `ASSUMED` in the Status column.
5. Log schema discrepancies in `25_ARCHITECTURE_DECISIONS.md` if structural.

---

## Global Shared Fields

### Featured Image

| GraphQL Path | TypeScript Property | Type | Component Usage | Status |
|-------------|-------------------|------|-----------------|--------|
| `featuredImage.node.sourceUrl` | `featuredImage.sourceUrl` | `string` | `next/image` src | ASSUMED |
| `featuredImage.node.altText` | `featuredImage.altText` | `string` | `next/image` alt | ASSUMED |
| `featuredImage.node.mediaDetails.width` | `featuredImage.width` | `number` | `next/image` width | ASSUMED |
| `featuredImage.node.mediaDetails.height` | `featuredImage.height` | `number` | `next/image` height | ASSUMED |

### SEO Fields (Yoast/RankMath via WPGraphQL SEO)

| GraphQL Path | TypeScript Property | Type | Component Usage | Status |
|-------------|-------------------|------|-----------------|--------|
| `seo.title` | `seo.title` | `string` | `generateMetadata` title | ASSUMED |
| `seo.metaDesc` | `seo.description` | `string` | `generateMetadata` description | ASSUMED |
| `seo.opengraphTitle` | `seo.openGraphTitle` | `string` | Open Graph title | ASSUMED |
| `seo.opengraphDescription` | `seo.openGraphDescription` | `string` | Open Graph description | ASSUMED |
| `seo.opengraphImage.sourceUrl` | `seo.openGraphImage` | `string \| null` | OG image | ASSUMED |
| `seo.canonical` | `seo.canonicalUrl` | `string` | Canonical URL | ASSUMED |

---

## Page (WordPress Pages)

**GraphQL Type:** `Page` (verify root query: `page`, `pages`, or `pageBy`)

| GraphQL Path | TypeScript Property | Type | UI Location | Status |
|-------------|-------------------|------|-------------|--------|
| `databaseId` | `id` | `string` | Internal key | ASSUMED |
| `slug` | `slug` | `string` | Route segment | ASSUMED |
| `title` | `title` | `string` | Page h1, metadata | ASSUMED |
| `content` | `content` | `string` (HTML) | `ContentRenderer` | ASSUMED |
| `excerpt` | `excerpt` | `string` | Listing cards | ASSUMED |
| `date` | `date` | `string` (ISO) | Meta display | ASSUMED |
| `modified` | `modified` | `string` (ISO) | Cache invalidation | ASSUMED |
| `featuredImage` | `featuredImage` | `FeaturedImage \| null` | Hero image | ASSUMED |
| `seo` | `seo` | `SeoMetadata` | `generateMetadata` | ASSUMED |

### Page Slug → Route Mapping

| WordPress Page Slug | Next.js Route | Query Function |
|--------------------|---------------|----------------|
| `home` or front-page setting | `/` | `getHomepage()` |
| `about` | `/about` | `getPageBySlug('about')` |
| `contact` | `/contact` | `getPageBySlug('contact')` |
| `gallery` | `/gallery` | `getPageBySlug('gallery')` or CPT query |

---

## Post (Blog)

**GraphQL Type:** `Post` — Root query: `posts`, `post`, `postBy`

| GraphQL Path | TypeScript Property | Type | UI Location | Status |
|-------------|-------------------|------|-------------|--------|
| `databaseId` | `id` | `string` | Internal key | ASSUMED |
| `slug` | `slug` | `string` | `/blogs/[slug]` | ASSUMED |
| `title` | `title` | `string` | Card, h1, metadata | ASSUMED |
| `excerpt` | `excerpt` | `string` | BlogCard, listing | ASSUMED |
| `content` | `content` | `string` (HTML) | `ContentRenderer` | ASSUMED |
| `date` | `date` | `string` (ISO) | BlogCard, article meta | ASSUMED |
| `modified` | `modified` | `string` (ISO) | Cache invalidation | ASSUMED |
| `author.node.name` | `author.name` | `string` | Blog detail byline | ASSUMED |
| `author.node.slug` | `author.slug` | `string` | Author link (future) | ASSUMED |
| `author.node.avatar.url` | `author.avatarUrl` | `string \| null` | Author avatar | ASSUMED |
| `categories.nodes[].name` | `categories[].name` | `string` | Category badges | ASSUMED |
| `categories.nodes[].slug` | `categories[].slug` | `string` | Filter links | ASSUMED |
| `featuredImage` | `featuredImage` | `FeaturedImage \| null` | BlogCard, hero | ASSUMED |
| `seo` | `seo` | `SeoMetadata` | `generateMetadata` | ASSUMED |

---

## Service (Custom Post Type)

**GraphQL Type:** `Service` — **VERIFY CPT slug and GraphQL single/plural names in WordPress admin**

| GraphQL Path | TypeScript Property | Type | UI Location | Status |
|-------------|-------------------|------|-------------|--------|
| `databaseId` | `id` | `string` | Internal key | ASSUMED |
| `slug` | `slug` | `string` | `/services/[slug]` | ASSUMED |
| `title` | `title` | `string` | ServiceCard, h1 | ASSUMED |
| `excerpt` | `excerpt` | `string` | ServiceCard, listing | ASSUMED |
| `content` | `content` | `string` (HTML) | `ContentRenderer` | ASSUMED |
| `date` | `date` | `string` (ISO) | Meta | ASSUMED |
| `featuredImage` | `featuredImage` | `FeaturedImage \| null` | ServiceCard, hero | ASSUMED |
| `seo` | `seo` | `SeoMetadata` | `generateMetadata` | ASSUMED |
| ACF/taxonomy fields | TBD | TBD | Discover via GraphiQL | UNVERIFIED |

---

## Doctor (Custom Post Type)

**GraphQL Type:** `Doctor` — **VERIFY CPT slug and field names**

| GraphQL Path | TypeScript Property | Type | UI Location | Status |
|-------------|-------------------|------|-------------|--------|
| `databaseId` | `id` | `string` | Internal key | ASSUMED |
| `slug` | `slug` | `string` | Future `/doctors/[slug]` | ASSUMED |
| `title` | `name` | `string` | DoctorCard name | ASSUMED |
| `content` or ACF `bio` | `bio` | `string` | Doctor detail | UNVERIFIED |
| ACF `specialty` | `specialty` | `string` | DoctorCard | UNVERIFIED |
| ACF `qualifications` | `qualifications` | `string[]` | DoctorCard, detail | UNVERIFIED |
| ACF `title` (e.g., MD) | `title` | `string` | DoctorCard subtitle | UNVERIFIED |
| `featuredImage` | `featuredImage` | `FeaturedImage \| null` | DoctorCard photo | ASSUMED |

---

## Menu / Navigation

**GraphQL Type:** `Menu`, `MenuItem`

| GraphQL Path | TypeScript Property | Type | UI Location | Status |
|-------------|-------------------|------|-------------|--------|
| `menu(id: "primary")` | — | — | Navbar | ASSUMED |
| `menuItems.nodes[].label` | `label` | `string` | Nav link text | ASSUMED |
| `menuItems.nodes[].url` | `href` | `string` | Nav link (map to Next.js path) | ASSUMED |
| `menuItems.nodes[].parentId` | `parentId` | `string \| null` | Nested menu (future) | ASSUMED |
| `menuItems.nodes[].target` | `target` | `string` | `_blank` for external | ASSUMED |

See `34_NAVIGATION_MENU_CONTRACT.md` for URL transformation rules.

---

## Media (Embedded in Content)

| Source | Handling | Component |
|--------|----------|-----------|
| `<img>` in Gutenberg HTML | Rewrite src if needed; style via ContentRenderer CSS | `ContentRenderer` |
| YouTube oEmbed `<iframe>` | Wrap in responsive container | `ContentRenderer` |
| WordPress `[gallery]` shortcode | Must render server-side in WP; if raw shortcode appears, log warning | `ContentRenderer` |

---

## Mapper Function Contract

Each mapper in `lib/wordpress/mappers/` must:

1. Accept raw GraphQL response type (prefixed `Wp` e.g., `WpServiceResponse`).
2. Return typed interface from `types/`.
3. Handle null/undefined for every optional field.
4. Normalize dates to ISO strings.
5. Strip HTML from excerpt fields if needed.
6. Log warnings for unexpected nulls on required fields.

---

## Verification Checklist

- [ ] GraphiQL accessible at WordPress GraphQL endpoint
- [ ] All CPT names confirmed (services, doctors, gallery)
- [ ] SEO plugin fields exposed via WPGraphQL
- [ ] ACF fields exposed (if used) via WPGraphQL for ACF
- [ ] Menu locations registered and queryable
- [ ] Sample query run for each content type
- [ ] All ASSUMED fields updated to VERIFIED
- [ ] TypeScript interfaces in `types/` match verified fields

---

## Common Mistakes

- Assuming CPT GraphQL names match WordPress admin slugs (they often differ).
- Assuming ACF field names without GraphiQL verification.
- Mapping `title` to `name` for doctors without documenting the transform.
- Using WordPress absolute URLs in navigation without converting to Next.js paths.

## Future Expansion

- Auto-generate this mapping from GraphQL introspection.
- Contract tests validating mappers against fixture responses.
