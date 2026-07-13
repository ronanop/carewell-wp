# Care Well Medical Centre — URL Migration & Redirects

## Purpose

Define the strategy for preserving SEO equity during the transition from the existing WordPress theme to the Next.js frontend, including URL mapping, 301 redirects, and canonical URL rules.

## Responsibilities

- Maintain or improve search rankings during migration.
- Map legacy WordPress URLs to new Next.js routes.
- Configure 301 redirects for any changed URL patterns.
- Prevent duplicate content and broken inbound links.

## Architecture

```
Legacy WordPress Theme URLs
  → URL Audit (crawl existing site)
    → Mapping Table (old → new)
      → next.config.ts redirects
        → 301 Permanent Redirect
          → New Next.js Route
```

---

## URL Preservation Rules

### Default Rule

**Preserve existing slugs exactly.** If WordPress serves `/services/laser-hair-removal/`, Next.js must serve `/services/laser-hair-removal`.

### Slug Matching

| Content Type | WordPress Pattern | Next.js Route | Action |
|-------------|------------------|---------------|--------|
| Homepage | `/` | `/` | Direct match |
| Pages | `/{page-slug}/` | `/{page-slug}` | Strip trailing slash |
| Services | `/services/{slug}/` or `/{slug}/` | `/services/{slug}` | Verify legacy pattern |
| Blog posts | `/blog/{slug}/` or `/{slug}/` | `/blogs/{slug}` | Map if prefix changes |
| Categories | `/category/{slug}/` | `/blogs?category={slug}` | Query param redirect |
| Authors | `/author/{slug}/` | Future route or `/blogs` | 301 to blogs |

**Critical:** Audit the live WordPress site to confirm actual URL patterns before launch.

---

## Redirect Configuration

### Location

`next.config.ts` → `redirects()` async function

### Pattern

```typescript
// Reference pattern
async redirects() {
  return [
    {
      source: '/blog/:slug',
      destination: '/blogs/:slug',
      permanent: true, // 301
    },
    {
      source: '/:slug',
      destination: '/services/:slug',
      permanent: true,
      // Only if legacy site served services at root — verify before adding
    },
  ];
}
```

### Redirect Rules

| Type | Status Code | When |
|------|------------|------|
| Permanent URL change | 301 | Slug or path structure changed |
| Trailing slash normalization | 301 or middleware | `/about/` → `/about` |
| Deprecated pages | 301 | Page removed; redirect to nearest equivalent |
| Temporary maintenance | 302 | Rare; maintenance page only |

---

## Trailing Slash Policy

**Decision:** No trailing slashes on Next.js routes.

| Incoming | Redirect To |
|----------|------------|
| `/about/` | `/about` |
| `/services/laser/` | `/services/laser` |
| `/blogs/post-slug/` | `/blogs/post-slug` |

Configure in `next.config.ts`:

```typescript
trailingSlash: false,
```

---

## Canonical URLs

- Every page sets canonical via `generateMetadata` → `alternates.canonical`.
- Canonical always points to `NEXT_PUBLIC_SITE_URL + path`.
- Paginated pages: canonical to page 1 or self-referencing with `?page=N` (decide per SEO audit).
- WWW vs non-WWW: pick one; redirect the other at Cloudflare/DNS level.

---

## Sitemap Transition

1. Export existing WordPress sitemap URLs.
2. Generate new sitemap from `app/sitemap.ts`.
3. Compare — every indexed URL must resolve (200 or 301).
4. Submit new sitemap to Google Search Console.
5. Monitor 404 errors in Search Console for 4 weeks post-launch.

---

## Migration Checklist

- [ ] Crawl existing WordPress site (Screaming Frog or similar).
- [ ] Export all indexed URLs from Google Search Console.
- [ ] Document URL pattern differences in mapping table below.
- [ ] Configure 301 redirects in `next.config.ts`.
- [ ] Test every redirect with `curl -I` (expect 301/308).
- [ ] Verify no redirect chains (max 1 hop).
- [ ] Update internal links in WordPress content if paths change.
- [ ] Submit new sitemap post-launch.
- [ ] Monitor 404 rate for 30 days.

---

## URL Mapping Table (Template)

Populate after WordPress URL audit:

| Legacy URL | New URL | Redirect Type | Notes |
|-----------|---------|---------------|-------|
| `/` | `/` | None | Direct |
| `/about-us/` | `/about` | 301 | Slug change |
| `/blog/:slug/` | `/blogs/:slug` | 301 | Prefix change |
| `/contact-us/` | `/contact` | 301 | Slug change |
| TBD | TBD | TBD | Complete after audit |

---

## External Links & Backlinks

- 301 redirects pass ~90-99% link equity.
- Avoid redirect chains that degrade equity.
- Update Google Business Profile URL if domain changes (not expected).
- Notify partners of URL changes only if paths change.

---

## Do's

- Audit before implementing redirects.
- Test all redirects before production launch.
- Keep redirect map in version control.
- Monitor Search Console for crawl errors post-launch.

## Don'ts

- Do not change slugs without 301 redirects.
- Do not create redirect chains (A → B → C).
- Do not use 302 for permanent URL changes.
- Do not launch without testing top 50 traffic URLs.

## Future Expansion

- Automated redirect testing in CI.
- Search Console API integration for 404 monitoring.
- Regex-based redirects for complex legacy patterns.
