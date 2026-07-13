# Next.js Skill — Care Well Medical Centre

## When to Use

Apply this skill when working on Next.js App Router pages, layouts, routing, metadata, caching, or deployment configuration.

## Core Rules

- Use **App Router only** — no Pages Router (`pages/` directory).
- Default to **Server Components**; add `"use client"` only for interactivity, hooks, or browser APIs.
- Use **Next.js 15 async APIs**: `params` and `searchParams` are Promises — always `await`.
- Fetch WordPress data in Server Components via `lib/wordpress/queries/`.
- Use `generateMetadata()` on every page for SEO.
- Use `generateStaticParams()` for dynamic routes to pre-build popular pages.
- Call `notFound()` from `next/navigation` when WordPress content is missing.
- Use `next/image` for all images; `next/link` for all internal navigation.
- Use `next/font/google` for font loading — never `@import` in CSS.
- Configure ISR with `revalidate` on fetch calls or route segment config.

## Rendering Strategy

| Route | Strategy |
|-------|----------|
| Static pages (about, contact) | SSG |
| Homepage, listings | ISR (3600s) |
| Dynamic slugs (services, blogs) | ISR (3600s) + generateStaticParams |
| 404 | Static |

## File Patterns

```
app/{route}/page.tsx          # Page component
app/{route}/layout.tsx        # Route layout (if needed)
app/{route}/loading.tsx       # Suspense fallback
app/{route}/error.tsx         # Error boundary
app/sitemap.ts                # Dynamic sitemap
app/robots.ts                 # Robots.txt
```

## Do's

- Add `loading.tsx` and `error.tsx` for data-fetching routes.
- Use React `cache()` to deduplicate GraphQL requests in one render.
- Set `metadataBase` in root layout.
- Run `npm run build` to verify SSR/SSG before pushing.

## Don'ts

- Do not use `getServerSideProps`, `getStaticProps`, or Pages Router APIs.
- Do not fetch WordPress data in Client Components.
- Do not use `output: 'export'` — ISR requires server runtime.
- Do not create API routes for content delivery.

## Reference

Read `docs/04_ARCHITECTURE.md`, `docs/06_ROUTING.md`, and `docs/14_PERFORMANCE_GUIDE.md`.
