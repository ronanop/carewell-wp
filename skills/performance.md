# Performance Skill — Care Well Medical Centre

## When to Use

Apply when optimizing page speed, bundle size, caching, images, or Core Web Vitals.

## Core Rules

- **Server Components first** — minimize client JavaScript.
- **ISR caching** for WordPress content with appropriate revalidation intervals.
- **`next/image`** for all images with explicit dimensions and `sizes`.
- **Lazy load** Client Components and Framer Motion with `next/dynamic`.
- **Individual imports** — never import entire icon or animation libraries.

## Performance Budget

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| Initial JS | < 100KB gzipped |

## Caching Strategy

| Content | Revalidate |
|---------|-----------|
| Homepage | 3600s |
| Static pages | On deploy |
| Services | 3600s |
| Blogs listing | 1800s |
| Blog detail | 3600s |

## Do's

- Fetch WordPress data in Server Components with `next.revalidate`.
- Use React `cache()` to deduplicate GraphQL requests.
- Add `loading.tsx` Suspense fallbacks for data-fetching routes.
- Use `next/font/google` with `display: 'swap'`.
- Run Lighthouse before merging performance-sensitive changes.

## Don'ts

- Do not fetch data in `useEffect`.
- Do not use unoptimized `<img>` tags.
- Do not import full `framer-motion` — use specific exports.
- Do not load third-party scripts synchronously.

## Reference

Read `docs/14_PERFORMANCE_GUIDE.md`.
