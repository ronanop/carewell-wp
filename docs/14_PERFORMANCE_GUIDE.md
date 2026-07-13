# Care Well Medical Centre — Performance Guide

## Purpose

Define performance targets, optimization strategies, and monitoring practices to deliver a fast, Core Web Vitals-compliant healthcare website.

## Responsibilities

- Achieve Core Web Vitals "Good" ratings on all page types.
- Minimize JavaScript bundle size through Server Components.
- Optimize images, fonts, and third-party scripts.
- Implement effective caching with ISR and CDN.

## Architecture

### Performance Budget

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse, CrUX |
| INP (Interaction to Next Paint) | < 200ms | Lighthouse, CrUX |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse, CrUX |
| TTFB (Time to First Byte) | < 800ms | WebPageTest |
| Total JS Bundle (initial) | < 100KB gzipped | Bundle analyzer |
| Total Page Weight | < 1.5MB | Lighthouse |

### Rendering Strategy for Performance

```
Server Components (default)
  ├── Data fetching at build/request time (zero client JS)
  ├── Static HTML streaming
  └── Minimal hydration footprint

Client Components (selective)
  ├── Navbar mobile menu
  ├── Contact form
  ├── Framer Motion animations
  ├── Gallery lightbox (Modal)
  └── Pagination controls
```

### Caching Layers

```
Browser Cache
  ↓
Cloudflare CDN (static assets, cached HTML)
  ↓
Vercel Edge Network (ISR pages)
  ↓
Next.js Data Cache (fetch cache with revalidate)
  ↓
WordPress GraphQL (origin)
```

## Best Practices

### Server Components

- Fetch WordPress data in Server Components — zero client-side GraphQL.
- Use React `cache()` to deduplicate requests within a render.
- Stream page content with Suspense boundaries and `loading.tsx`.

### Image Optimization

- Use `next/image` for all images with explicit `width`, `height`, `sizes`.
- Serve WordPress images through Next.js Image Optimization API.
- Use `placeholder="blur"` with `blurDataURL` for above-fold images.
- Configure `remotePatterns` in `next.config.ts` for WordPress domain.

### Code Splitting

- Lazy load Client Components with `next/dynamic` and `{ ssr: false }` where appropriate.
- Import Framer Motion components dynamically on pages that use animation.
- Never import entire icon libraries — use individual Lucide icon imports.

### Font Optimization

- Load fonts via `next/font/google` with `display: 'swap'`.
- Limit to 2 font families with 3-4 weights total.
- Preload primary heading font in root layout.

### ISR Configuration

| Content Type | Revalidate Interval |
|-------------|-------------------|
| Homepage | 3600s (1 hour) |
| Static pages | On deploy (SSG) |
| Service pages | 3600s |
| Blog posts | 3600s |
| Blog listing | 1800s (30 min) |

## Folder Examples

```
app/
├── loading.tsx                # Suspense fallback
next.config.ts                 # Image domains, headers, compression
lib/wordpress/client.ts        # Fetch with next.revalidate option
```

## Naming Conventions

- Dynamic imports: `const MotionDiv = dynamic(() => import('...'))`.
- Loading components: `loading.tsx` per route segment.
- Cache tags: `'services'`, `'blogs'`, `'doctors'` for on-demand revalidation.

## Production Recommendations

- Enable Vercel Analytics and Speed Insights.
- Configure Cloudflare caching rules for static assets (1 year TTL).
- Enable Brotli compression on Cloudflare.
- Pre-render top 50 service and blog pages at build time via `generateStaticParams`.
- Run Lighthouse CI on every PR against performance budget.

## Common Mistakes

- Making entire pages Client Components unnecessarily.
- Loading all blog posts in one GraphQL query without pagination.
- Using unoptimized `<img>` tags instead of `next/image`.
- Importing the full Framer Motion library instead of specific modules.
- Not setting explicit image dimensions causing CLS.

## Scalability Considerations

- ISR scales to thousands of pages without full rebuilds.
- Cursor-based GraphQL pagination prevents memory issues with large datasets.
- Edge caching reduces WordPress GraphQL load as traffic grows.

## Do's

- Measure before optimizing — use Lighthouse and WebPageTest.
- Set `fetch` cache options on every WordPress GraphQL request.
- Use Suspense boundaries for progressive page loading.
- Prefetch navigation links with Next.js `<Link prefetch>`.

## Don'ts

- Do not fetch data in `useEffect` — use Server Components.
- Do not add client-side state management libraries for server data.
- Do not load third-party scripts synchronously.
- Do not disable Next.js image optimization.

## Future Expansion

- Partial Prerendering (PPR) when stable in Next.js.
- Service Worker for offline blog reading.
- Resource hints (`preconnect` to WordPress CDN).
- Automated performance regression testing in CI.
