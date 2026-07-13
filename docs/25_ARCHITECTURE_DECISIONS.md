# Care Well Medical Centre — Architecture Decision Records (ADR)

## Purpose

Document significant architectural decisions with context, rationale, and consequences. This log prevents revisiting settled decisions and gives future contributors the reasoning behind the system design.

## Responsibilities

- Record every decision that affects structure, technology, or integration boundaries.
- Reference ADRs from implementation docs when relevant.
- Supersede ADRs explicitly when decisions change — never delete history.

## ADR Format

Each entry follows this structure:

```
## ADR-NNN: Title
- **Status:** Accepted | Proposed | Superseded
- **Date:** YYYY-MM-DD
- **Context:** What problem or constraint drove the decision
- **Decision:** What was chosen
- **Rationale:** Why this option over alternatives
- **Consequences:** Positive and negative outcomes
- **Alternatives Considered:** Options rejected and why
```

---

## ADR-001: Headless WordPress with Next.js Frontend

- **Status:** Accepted
- **Date:** 2026-07-09
- **Context:** Client has hundreds of blog posts, service pages, images, and SEO metadata in an existing WordPress installation. Full CMS replacement would risk content loss and SEO damage.
- **Decision:** Retain WordPress as the sole content store. Build a new Next.js 15 frontend that consumes content via WPGraphQL.
- **Rationale:** Preserves editorial workflow, protects SEO equity, enables modern frontend performance without content migration.
- **Consequences:** (+) No migration risk; editors unchanged. (−) Two systems to operate; GraphQL schema dependency; CORS and caching complexity.
- **Alternatives Considered:** Full WordPress theme rebuild (rejected: limited performance gains); Content migration to MDX/files (rejected: duplicates CMS); Custom CMS in Next.js (rejected: out of scope).

---

## ADR-002: WPGraphQL with graphql-request

- **Status:** Accepted
- **Date:** 2026-07-09
- **Context:** Need a GraphQL client for server-side WordPress data fetching in Server Components.
- **Decision:** Use `graphql-request` with a singleton client in `lib/wordpress/client.ts`. No Apollo Client, no client-side GraphQL.
- **Rationale:** Minimal bundle footprint; sufficient for read-only server fetches; edge-compatible; no need for normalized cache on client.
- **Consequences:** (+) Small dependency; simple API. (−) No built-in caching (handled by Next.js ISR); manual query organization required.
- **Alternatives Considered:** Apollo Client (rejected: overkill for read-only server fetches); urql (rejected: unnecessary); REST via WP REST API (rejected: over-fetching, no typed schema).

---

## ADR-003: Server Components First

- **Status:** Accepted
- **Date:** 2026-07-09
- **Context:** Performance budget targets <100KB initial JS. Healthcare site is content-heavy with limited interactivity.
- **Decision:** Default all components to Server Components. Promote to Client Components only for event handlers, hooks, browser APIs, or Framer Motion.
- **Rationale:** Aligns with Next.js 15 best practices; minimizes hydration; WordPress data stays server-side.
- **Consequences:** (+) Better CWV; smaller bundles. (−) Requires careful component boundary design; some patterns need `next/dynamic`.
- **Alternatives Considered:** Client-heavy SPA pattern (rejected: poor SEO and performance); Full SSG export (rejected: no ISR).

---

## ADR-004: ISR over Pure SSG for Dynamic Content

- **Status:** Accepted
- **Date:** 2026-07-09
- **Context:** Hundreds of blog posts and service pages change periodically. Full rebuild on every content update is impractical.
- **Decision:** Use ISR with route-level revalidation intervals. Homepage, services, blogs: 1800–3600s. Static pages (about, contact): SSG on deploy.
- **Rationale:** Balances freshness with performance. Avoids rebuilding entire site on single post publish.
- **Consequences:** (+) Scales to hundreds of pages; fast delivery. (−) Content may be stale up to revalidation window; requires webhook for instant updates (future).
- **Alternatives Considered:** Pure SSG (rejected: rebuild cost at scale); SSR on every request (rejected: WordPress load and TTFB).

---

## ADR-005: Shadcn UI as Component Primitive Layer

- **Status:** Accepted
- **Date:** 2026-07-09
- **Context:** Need accessible, composable UI primitives without a heavy component library dependency.
- **Decision:** Use Shadcn UI (copied into `components/ui/`) styled with project design tokens.
- **Rationale:** Own the code; tree-shakeable; accessible defaults; integrates with Tailwind CSS 4 and CVA.
- **Consequences:** (+) No runtime library lock-in; customizable. (−) Components must be added individually via CLI; manual sync on Shadcn updates.
- **Alternatives Considered:** MUI/Chakra (rejected: bundle size, style conflicts); Radix only without Shadcn (rejected: more boilerplate); Custom primitives from scratch (rejected: accessibility burden).

---

## ADR-006: Editorial Luxury Minimalism Design Language

- **Status:** Accepted
- **Date:** 2026-07-09
- **Context:** Healthcare brand must convey premium trust without feeling template-based or clinical-cold.
- **Decision:** Adopt Editorial Luxury Minimalism: serif/sans pairing, teal primary (#0D4F4F), gold accent (#C4A882), generous whitespace, subtle motion.
- **Rationale:** Differentiates from generic medical templates; aligns with client's premium positioning.
- **Consequences:** (+) Distinct brand identity. (−) Requires custom design token work; stock imagery prohibited.
- **Alternatives Considered:** Generic healthcare template (rejected: low trust signal); Bold/colorful medical (rejected: wrong tone).

---

## ADR-007: No Custom Backend or Database (Public Website)

- **Status:** Superseded by ADR-011 for Experience Studio only; remains in force for the public website
- **Date:** 2026-07-09
- **Context:** Scope is a marketing/content website. No patient portal, auth, or transactional features at launch.
- **Decision:** Prohibit Express, Prisma, MongoDB, Supabase, Firebase, authentication, and custom API routes for content on the public website.
- **Rationale:** Reduces attack surface, operational complexity, and scope creep.
- **Consequences:** (+) Simple architecture; clear boundaries. (−) Contact form must use external service; no server-side user data.
- **Alternatives Considered:** Next.js API routes for forms with DB (rejected: scope); Serverless functions for CMS (rejected: duplicates WordPress).
- **Supersession note:** ADR-011 introduces a bounded Experience Studio (`/admin`) that may use Prisma and Auth.js for presentation management only. ADR-007 continues to govern all public routes and WordPress content flows.

---

## ADR-008: Vercel + Cloudflare + Hostinger Deployment Topology

- **Status:** Accepted
- **Date:** 2026-07-09
- **Context:** Need global CDN, serverless Next.js hosting, and existing WordPress on Hostinger.
- **Decision:** Vercel for Next.js (region: `bom1`), Cloudflare for DNS/CDN/WAF, Hostinger for WordPress/MySQL.
- **Rationale:** Vercel optimizes Next.js ISR; Cloudflare adds DDoS protection; WordPress stays on existing host.
- **Consequences:** (+) Best-in-class Next.js deployment. (−) Three platforms to configure; cross-origin image and CORS setup required.
- **Alternatives Considered:** Self-hosted Next.js (rejected: ops burden); WordPress and Next.js on same server (rejected: resource contention).

---

## ADR-009: Gutenberg HTML Rendering via ContentRenderer

- **Status:** Accepted
- **Date:** 2026-07-09
- **Context:** WordPress content is authored in Gutenberg and delivered as HTML via GraphQL. Cannot convert to MDX or React components at scale.
- **Decision:** Render Gutenberg HTML through a dedicated `ContentRenderer` Server Component with sanitization. Style via scoped CSS targeting WordPress block classes.
- **Rationale:** Faithful content reproduction; no migration of hundreds of posts; editors retain full Gutenberg capability.
- **Consequences:** (+) Content fidelity. (−) Must handle varied block HTML; sanitization required; styling complexity.
- **Alternatives Considered:** Parse blocks to React components (rejected: unsustainable at scale); MDX migration (rejected: duplicates CMS).

---

## ADR-010: Zod Validation at System Boundaries

- **Status:** Accepted
- **Date:** 2026-07-09
- **Context:** WordPress GraphQL responses and form inputs are external data that may not match TypeScript interfaces at runtime.
- **Decision:** Validate form inputs and critical WordPress response shapes with Zod schemas at system boundaries.
- **Rationale:** Runtime safety beyond compile-time types; consistent error messages for forms.
- **Consequences:** (+) Catches schema drift. (−) Additional schema maintenance alongside TypeScript interfaces.
- **Alternatives Considered:** TypeScript-only (rejected: no runtime guarantee); io-ts (rejected: less ecosystem fit with react-hook-form).

---

## ADR-011: Experience Studio Bounded Context

- **Status:** Accepted
- **Date:** 2026-07-11
- **Context:** The public Next.js site renders WordPress content but needs a non-technical Presentation Management System (templates, heroes, CTAs, theme, section visibility) without becoming a CMS or duplicating WordPress content. ADR-007 prohibited databases and auth for the public website; Experience Studio requires both.
- **Decision:** Introduce Experience Studio as a bounded context under `/admin` in the same Next.js app. Permit Prisma (PostgreSQL), Auth.js (credentials), RBAC, and `/api/auth/*` exclusively for this context. WordPress remains the sole source of truth for pages, blogs, media, SEO, categories, tags, and doctor articles. Experience Studio stores only presentation configuration.
- **Rationale:** Keeps one deployable app while isolating operational complexity. Editors continue in WordPress; marketers configure presentation in Studio. Avoids Builder.io-style page builders and Gutenberg clones.
- **Consequences:** (+) Clear product boundary; public architecture unchanged. (−) Two data systems (WP + Postgres); auth surface limited to `/admin`; must enforce import boundaries so public routes never depend on Prisma.
- **Alternatives Considered:** Separate Studio Next.js app (rejected for this phase: operational overhead); Store presentation in WordPress ACF (rejected: couples presentation to CMS, harder RBAC/audit); Full CMS replacement (rejected: out of scope, SEO risk).
- **Import boundary:** `app/admin/**`, `lib/experience/**`, `prisma/**`, and `auth.ts` may use Prisma/Auth. Public `app/**` (except `/admin`) and `lib/wordpress/**` must not import Prisma or Auth session APIs for content rendering.

---

## ADR-012: Experience Studio Platform Foundation (Plugin SDK)

- **Status:** Accepted
- **Date:** 2026-07-11
- **Context:** Page Studio presentation toggles work, but hardcoding React sections into the builder would block medical/corporate/marketplace packs, CMS-agnostic bindings, theme tokens, visibility rules, nested composition, events, and future AI layout generation.
- **Decision:** Introduce an additive platform layer under `lib/experience/platform/` with: Plugin SDK (`registerBlock`), Block Manifests, Binding Engine, Design Token Engine, Visual Rule Engine, Block Composition tree, Event Bus, AI layout contract, and a PresentationConfig ↔ BlockDocument bridge. PresentationEngine and Page Studio remain the live path; the platform projects into BlockDocuments without replacing public render yet.
- **Rationale:** Platform-first design avoids a future rewrite. Packs register blocks dynamically. Components receive resolved props only (never WordPress). Tokens/rules/events unlock themes, targeting, analytics, and AI without core changes.
- **Consequences:** (+) Marketplace-ready architecture; backward compatible. (−) Dual model (PresentationConfig + BlockDocument) during migration; Phase 2 must ship block renderer + Page Studio inspector wiring.
- **Alternatives Considered:** Rewrite Page Studio as a full page builder immediately (rejected: regression risk); Store blocks only in WordPress Gutenberg (rejected: couples presentation to CMS); Embed Builder.io (rejected: vendor lock-in, healthcare UX mismatch).
- **Phases:** Phase 1 (this ADR) = foundation + medical pack manifests + bridge. Phase 2 = block renderer in public site + Studio inspector UI. Phase 3 = marketplace pack loading + AI provider.

---

## Best Practices

- Propose new ADRs before implementing significant architectural changes.
- Reference ADR numbers in PR descriptions when relevant.
- Mark superseded ADRs with replacement ADR number.

## Do's

- Add ADR entries for dependency additions that affect architecture.
- Review ADRs during onboarding.

## Don'ts

- Do not delete superseded ADRs — mark status as Superseded with link to replacement.
- Do not implement architecture changes without recording the decision.

## Future Expansion

- ADR-012: On-demand revalidation webhook (when implemented)
- ADR-013: Multi-language routing (if i18n added)
- ADR-014: Search implementation (WordPress vs Algolia)
