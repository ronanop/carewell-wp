# Care Well Medical Centre — Project Overview

## Purpose

This document defines the strategic foundation for the Care Well Medical Centre (CWMC) digital platform. It establishes what the project is, why it exists, and the boundaries every contributor must respect. The existing WordPress installation remains the authoritative content store; Next.js becomes the sole presentation layer.

## Responsibilities

| Stakeholder | Responsibility |
|-------------|----------------|
| WordPress CMS | Content authoring, media library, SEO metadata, categories, Gutenberg blocks |
| Next.js Frontend | Rendering, layout, performance, accessibility, design system, routing |
| WPGraphQL | Read-only content API between WordPress and Next.js |
| Vercel / Cloudflare | Frontend hosting, CDN, edge caching, SSL |
| Hostinger | WordPress hosting, MySQL, admin access |
| Development Team | Headless integration, component library, documentation adherence |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js 15 (App Router) — Vercel               │
│  Server Components │ Client Components │ ISR │ Metadata API   │
└───────────────────────────┬─────────────────────────────────┘
                            │ GraphQL (graphql-request)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              WPGraphQL — Existing WordPress CMS              │
│  Posts │ Pages │ Services │ Doctors │ Media │ Categories     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL (Hostinger)                         │
└─────────────────────────────────────────────────────────────┘
```

**Core principle:** WordPress owns content. React owns presentation. No duplicate CMS. No content migration.

## Best Practices

- Treat WordPress as a read-only content source from the Next.js perspective.
- Design every page as a Server Component first; promote to Client Component only when interactivity requires it.
- Preserve existing URL slugs where possible to protect SEO equity.
- Document every architectural decision in the relevant `docs/` file before implementation.
- Use ISR for content that changes periodically (blogs, services); use SSG for stable pages (about, contact).

## Folder Examples

```
carewell-next/
├── app/                    # Routes and layouts
├── components/             # UI and feature components
├── lib/                    # WordPress client, utilities
├── docs/                   # This knowledge base
├── skills/                 # Agent skill files
└── .cursor/rules/          # Cursor AI rules
```

## Naming Conventions

| Entity | Convention | Example |
|--------|------------|---------|
| Project | `carewell-next` | package.json name |
| Routes | kebab-case | `/services/laser-hair-removal` |
| Components | PascalCase | `ServiceCard.tsx` |
| Hooks | camelCase with `use` prefix | `useMediaQuery.ts` |
| Types | PascalCase interfaces | `BlogPost`, `ServicePage` |
| GraphQL files | kebab-case | `get-all-services.ts` |

## Production Recommendations

- Set `WORDPRESS_GRAPHQL_URL` in Vercel environment variables; never hardcode production URLs.
- Enable Cloudflare in front of Vercel for DDoS protection and additional caching.
- Configure WordPress CORS and rate limiting for the GraphQL endpoint.
- Use `next/image` with WordPress media URLs whitelisted in `next.config.ts`.
- Establish a staging WordPress + staging Next.js environment before production cutover.

## Common Mistakes

- Building a second CMS or admin dashboard in Next.js.
- Migrating or duplicating WordPress content into a new database.
- Fetching WordPress data in Client Components instead of Server Components.
- Ignoring existing slug structures and breaking inbound links.
- Adding Express, Prisma, MongoDB, Supabase, or Firebase — all prohibited.

## Scalability Considerations

- GraphQL queries should be paginated; never fetch all posts in a single request.
- Use Next.js `revalidate` tags for granular cache invalidation when WordPress content updates.
- Component library should be atomic and composable to support future page types (appointments, patient portal).
- Type definitions in `types/` should mirror WordPress content models for safe refactoring at scale.

## Do's

- Read all documentation in `docs/` before writing code.
- Follow the Editorial Luxury Minimalism design language.
- Render Gutenberg HTML through a dedicated sanitizer/parser component.
- Implement WCAG AA accessibility from the first component.
- Use strict TypeScript with zero `any` types.

## Don'ts

- Do not replace, migrate, or duplicate the WordPress CMS.
- Do not create backend APIs, authentication, or dashboards in Next.js.
- Do not use inline styles or template-based generic UI patterns.
- Do not ship pages without metadata, schema, and Open Graph tags.
- Do not proceed to implementation without consulting this knowledge base.

## Future Expansion

- Online appointment booking (external integration, not custom CMS).
- Multi-language support via WordPress Polylang/WPML + Next.js i18n routing.
- Patient testimonials and review aggregation.
- Doctor profile deep-dives with structured MedicalOrganization schema.
- Progressive Web App (PWA) capabilities for mobile engagement.
- Webhook-driven on-demand revalidation when WordPress content is published.
