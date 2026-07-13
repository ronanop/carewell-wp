# Care Well Medical Centre — Product Requirements

## Purpose

Define the functional and non-functional requirements for the CWMC headless frontend. This document translates business goals into actionable specifications for developers, designers, and QA.

## Responsibilities

### Business Goals

- Present Care Well Medical Centre as a premium, trustworthy healthcare brand.
- Preserve hundreds of existing blog posts, service pages, images, and SEO metadata.
- Improve page speed, Core Web Vitals, and mobile experience over the current WordPress theme.
- Enable content editors to continue using WordPress without retraining.

### Product Scope (In Scope)

| Area | Requirement |
|------|-------------|
| Static pages | Home, About, Contact, Gallery, Doctors, Services listing, Blogs listing, 404 |
| Dynamic pages | `/services/[slug]`, `/blogs/[slug]` |
| Content source | Existing WordPress via WPGraphQL |
| Media | Featured images, gallery images, embedded YouTube videos |
| SEO | Metadata, Open Graph, Twitter Cards, JSON-LD schema, sitemap, robots |
| Forms | Contact form with validation (React Hook Form + Zod) |
| Design | Editorial Luxury Minimalism — premium healthcare aesthetic |

### Out of Scope

- WordPress replacement or migration
- Custom CMS or admin dashboard
- User authentication or patient portals
- E-commerce or payment processing
- Custom backend APIs (Express, tRPC, etc.)
- Database layers (Prisma, MongoDB, Supabase, Firebase)

## Architecture

Content flows one direction: WordPress → WPGraphQL → Next.js → Browser. Editors publish in WordPress; the frontend revalidates on a schedule or via webhook.

## Best Practices

- Match or improve upon existing URL structures for SEO continuity.
- Every page must have a defined content fallback when WordPress data is unavailable.
- Contact form submissions should integrate with an existing email/CRM service — not a custom database.
- Gallery must support lazy-loaded images with blur placeholders.

## Folder Examples

```
app/
├── page.tsx                 # Home
├── about/page.tsx
├── contact/page.tsx
├── gallery/page.tsx
├── doctors/page.tsx
├── services/
│   ├── page.tsx             # Services listing
│   └── [slug]/page.tsx      # Service detail
├── blogs/
│   ├── page.tsx             # Blog listing
│   └── [slug]/page.tsx      # Blog detail
└── not-found.tsx            # 404
```

## Naming Conventions

- Page titles: `[Page Name] | Care Well Medical Centre`
- Service slugs: mirror WordPress `slug` field exactly
- Blog slugs: mirror WordPress post `slug` field exactly
- CTA copy: action-oriented, healthcare-appropriate ("Book Consultation", "View Services")

## Production Recommendations

- Launch with a redirect map from any changed URLs to preserve link equity.
- Implement analytics (Google Analytics 4 or Plausible) via Next.js Script component.
- Contact form must include honeypot or CAPTCHA for spam protection.
- All external links open in new tab with `rel="noopener noreferrer"`.

## Common Mistakes

- Rebuilding content in MDX or local files instead of fetching from WordPress.
- Omitting pagination on blog and services listing pages.
- Hardcoding doctor or service data that already exists in WordPress.
- Shipping without 404 page and proper error boundaries.

## Scalability Considerations

- Blog listing must support pagination (cursor-based via GraphQL).
- Services listing may grow; design grid/list views to scale to 100+ items.
- Search functionality may be added later; structure routes to accommodate `/search`.
- Gallery should support category filtering without full page reloads.

## Do's

- Prioritize trust signals: credentials, certifications, patient testimonials.
- Ensure every service page has clear CTAs (call, book, contact).
- Display doctor credentials, specializations, and photos consistently.
- Support embedded YouTube videos from WordPress content.

## Don'ts

- Do not reduce content available on the current WordPress site.
- Do not use stock medical imagery that conflicts with brand photography.
- Do not hide contact information behind multiple clicks.
- Do not use aggressive pop-ups or dark patterns.

## Future Expansion

- Site search powered by WordPress search or Algolia.
- FAQ sections per service with accordion components.
- Before/after gallery with lightbox modal.
- Live chat integration (Intercom, Tidio).
- Appointment scheduling widget (Calendly, custom WP plugin).
