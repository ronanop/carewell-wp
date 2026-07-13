# Care Well Medical Centre — Caching & Revalidation

## Purpose

Define the complete caching strategy across Next.js ISR, data cache, CDN, and on-demand revalidation for the headless WordPress frontend.

## Responsibilities

- Specify revalidation intervals per route and content type.
- Document cache tag strategy for granular invalidation.
- Define on-demand revalidation webhook contract (future).
- Prevent stale content beyond acceptable thresholds.

## Architecture

### Caching Stack

```
Browser Cache
  ↓
Cloudflare CDN (static assets: 1 year; HTML: respect Cache-Control)
  ↓
Vercel Edge Network (ISR pages)
  ↓
Next.js Data Cache (fetch with revalidate option)
  ↓
React cache() (per-request deduplication)
  ↓
WordPress GraphQL (origin)
```

---

## ISR Revalidation Schedule

| Route | Strategy | Revalidate (seconds) | Rationale |
|-------|----------|---------------------|-----------|
| `/` | ISR | 3600 | Homepage features change occasionally |
| `/about` | SSG | On deploy | Rarely changes |
| `/contact` | SSG | On deploy | Rarely changes |
| `/gallery` | ISR | 3600 | New images added periodically |
| `/doctors` | ISR | 3600 | Staff changes infrequently |
| `/services` | ISR | 3600 | Service list stable |
| `/services/[slug]` | ISR | 3600 | Individual service updates |
| `/blogs` | ISR | 1800 | New posts more frequent |
| `/blogs/[slug]` | ISR | 3600 | Post content stable after publish |
| `/404` | Static | On deploy | Never changes |
| `sitemap.ts` | ISR | 3600 | Reflects new content |
| `robots.ts` | Static | On deploy | Rarely changes |

---

## Implementation Patterns

### Route Segment Config

```typescript
// app/services/page.tsx
export const revalidate = 3600;
```

### Fetch-Level Caching

```typescript
// lib/wordpress/client.ts — when using fetch wrapper
const response = await fetch(WORDPRESS_GRAPHQL_URL, {
  method: 'POST',
  body: JSON.stringify({ query, variables }),
  next: { revalidate: 3600, tags: ['services'] },
});
```

### React cache() for Deduplication

```typescript
import { cache } from 'react';

export const getServiceBySlug = cache(async (slug: string) => {
  // Deduped within single server render
});
```

---

## Cache Tags

| Tag | Invalidates |
|-----|------------|
| `homepage` | `/` |
| `services` | `/services`, all `/services/[slug]` |
| `blogs` | `/blogs`, all `/blogs/[slug]` |
| `doctors` | `/doctors` |
| `gallery` | `/gallery` |
| `pages` | `/about`, `/contact` |
| `sitemap` | `sitemap.ts` |

### Tag Usage

```typescript
next: { tags: ['services', `service-${slug}`] }
```

---

## On-Demand Revalidation (Future)

### Webhook Endpoint

`app/api/revalidate/route.ts`

### Request Contract

```http
POST /api/revalidate
Authorization: Bearer {REVALIDATION_SECRET}
Content-Type: application/json

{
  "tag": "services",
  "slug": "laser-hair-removal"  // optional, for specific path
}
```

### WordPress Trigger

WordPress plugin or webhook on `publish_post`, `save_post` fires revalidation request.

### Security

- Validate `REVALIDATION_SECRET` header.
- Rate limit endpoint via Cloudflare.
- Log all revalidation requests.

---

## Static Generation

### generateStaticParams

Pre-build at deploy time:

- Top 50 service slugs (by traffic or recency).
- Top 50 blog slugs.
- All static pages.

Remaining slugs generated on first request (ISR).

---

## CDN Configuration (Cloudflare)

| Asset Type | Cache TTL | Notes |
|-----------|-----------|-------|
| `/_next/static/*` | 1 year | Immutable hashed assets |
| `/images/*` (public) | 1 year | Static public assets |
| HTML pages | Respect `Cache-Control` from Vercel | Do not override |
| `/api/*` | No cache | Bypass CDN |

---

## Cache Invalidation Scenarios

| Event | Action |
|-------|--------|
| New blog published | Revalidate `blogs` tag + specific slug |
| Service updated | Revalidate `services` tag + specific slug |
| Homepage hero changed | Revalidate `homepage` |
| Deploy to production | Full rebuild; SSG pages refreshed |
| WordPress down during revalidation | Serve stale cache (stale-while-revalidate) |

---

## Stale Content Thresholds

| Content Type | Max Acceptable Staleness |
|-------------|------------------------|
| Blog posts | 30 minutes (listing), 1 hour (detail) |
| Services | 1 hour |
| Static pages | Until next deploy |
| Homepage | 1 hour |

If on-demand revalidation is implemented, thresholds become guidelines not hard limits.

---

## Do's

- Set `revalidate` on every WordPress data fetch.
- Use cache tags for content types.
- Pre-build popular pages via `generateStaticParams`.
- Monitor cache hit rates in Vercel analytics.

## Don'ts

- Do not use `cache: 'no-store'` unless truly dynamic (preview mode).
- Do not fetch WordPress on every request without caching.
- Do not expose revalidation endpoint without secret validation.
- Do not set revalidate to 0 in production without justification.

## Future Expansion

- Partial Prerendering (PPR) for mixed static/dynamic pages.
- Edge-configured revalidation intervals per environment.
- Cache warming on deploy.
