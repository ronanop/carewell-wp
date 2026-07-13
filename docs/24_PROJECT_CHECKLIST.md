# Care Well Medical Centre — Project Checklist

## Purpose

Master checklist tracking project initialization, implementation phases, and launch readiness for the CWMC headless frontend.

## Responsibilities

Serve as the definitive progress tracker for developers and AI agents. Check off items as completed; do not skip phases.

---

## Phase 0: Project Bootstrap (COMPLETE)

- [x] Initialize Next.js 15 project with TypeScript, App Router, Tailwind CSS, ESLint, Turbopack
- [x] Install production dependencies (framer-motion, lucide-react, graphql-request, react-hook-form, zod, cva, clsx, tailwind-merge, tailwindcss-animate)
- [x] Initialize Shadcn UI (components.json, lib/utils.ts)
- [x] Create enterprise folder structure (app, components, lib, hooks, types, styles, public, docs, skills, .cursor/rules)
- [x] Generate complete project documentation (24 docs)
- [x] Create agent skills (12 skills)
- [x] Create Cursor rules (9 rules)
- [x] Configure import alias `@/*`

---

## Phase 1: Foundation Setup

- [ ] Configure `.env.example` with required environment variables
- [ ] Configure `next.config.ts` (WordPress image domains, security headers, redirects)
- [ ] Customize design tokens in `app/globals.css` (brand colors, typography)
- [ ] Configure fonts via `next/font/google` (serif headings + sans body)
- [ ] Set up WordPress GraphQL client (`lib/wordpress/client.ts`)
- [ ] Inspect WordPress GraphQL schema via GraphiQL
- [ ] Define TypeScript types for all content models (`types/`)
- [ ] Create GraphQL fragments (`lib/wordpress/fragments/`)
- [ ] Create GraphQL queries (`lib/wordpress/queries/`)
- [ ] Create data mappers (`lib/wordpress/mappers/`)
- [ ] Add required Shadcn UI components (button, card, accordion, tabs, input, textarea, dialog)

---

## Phase 2: Layout & Shared Components

- [ ] Root layout with fonts, metadata base, skip-to-content link
- [ ] Container component
- [ ] Section component
- [ ] SectionHeader component
- [ ] Navbar with responsive mobile menu
- [ ] Footer with links, contact info, social
- [ ] Hero component (variants)
- [ ] Heading / Typography components
- [ ] Breadcrumb component
- [ ] CTA component
- [ ] ContentRenderer (Gutenberg HTML)
- [ ] Pagination component
- [ ] 404 not-found page

---

## Phase 3: Static Pages

- [ ] Homepage (`/`)
- [ ] About page (`/about`)
- [ ] Contact page (`/contact`) with form validation
- [ ] Gallery page (`/gallery`)
- [ ] Doctors page (`/doctors`)

---

## Phase 4: Dynamic Pages

- [ ] Services listing (`/services`) with pagination
- [ ] Service detail (`/services/[slug]`) with ISR
- [ ] Blog listing (`/blogs`) with pagination
- [ ] Blog detail (`/blogs/[slug]`) with ISR

---

## Phase 5: SEO & Performance

- [ ] `generateMetadata` on all pages
- [ ] JSON-LD schema on all page types
- [ ] Dynamic sitemap (`app/sitemap.ts`)
- [ ] Robots.txt (`app/robots.ts`)
- [ ] Breadcrumb schema
- [ ] Open Graph and Twitter Card metadata
- [ ] ISR revalidation configured per route
- [ ] Image optimization with next/image
- [ ] Core Web Vitals passing on all pages

---

## Phase 6: Accessibility & Polish

- [ ] WCAG 2.1 AA audit on all pages
- [ ] Keyboard navigation verified
- [ ] Screen reader testing
- [ ] Reduced motion support
- [ ] Focus states on all interactive elements
- [ ] Form accessibility (labels, errors, ARIA)
- [ ] Framer Motion animations with reduced-motion fallback

---

## Phase 7: Testing & QA

- [ ] Unit tests for mappers and validators
- [ ] Integration tests for GraphQL queries
- [ ] E2E tests for critical user flows
- [ ] Accessibility tests (axe-core)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing
- [ ] Production build succeeds without errors

---

## Phase 8: Deployment & Launch

- [ ] Vercel project configured with environment variables
- [ ] Cloudflare DNS and CDN configured
- [ ] Custom domain connected
- [ ] SSL certificate active
- [ ] 301 redirects configured for changed URLs
- [ ] Google Search Console sitemap submitted
- [ ] Analytics configured
- [ ] Uptime monitoring active
- [ ] WordPress CORS configured for Vercel domains
- [ ] Security headers verified
- [ ] Staging environment tested end-to-end
- [ ] Production launch

---

## Architecture

This checklist follows the phased implementation plan defined across all project documentation. Each phase builds on the previous and must be completed sequentially.

## Best Practices

- Check off items only when fully complete and verified.
- Do not skip Phase 1 foundation — all pages depend on WordPress integration.
- Run `npm run build` after each phase to catch errors early.
- Update this checklist if new requirements emerge.

## Do's

- Reference specific docs for each checklist item during implementation.
- Verify each item against acceptance criteria before checking off.
- Report blockers (WordPress access, schema issues) immediately.

## Don'ts

- Do not start Phase 2 before Phase 1 WordPress integration is working.
- Do not deploy to production before Phase 7 testing is complete.
- Do not skip accessibility audit (Phase 6).

## Future Expansion

- Phase 9: Search functionality
- Phase 10: Multi-language support
- Phase 11: Appointment booking integration
- Phase 12: Performance optimization sprint
