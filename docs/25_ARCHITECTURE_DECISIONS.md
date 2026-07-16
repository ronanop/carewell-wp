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

- **Status:** Superseded in part by ADR-011 / ADR-013 for bounded application domains; remains in force for the public website content surface
- **Date:** 2026-07-09
- **Context:** Scope is a marketing/content website. No patient portal, auth, or transactional features at launch.
- **Decision:** Prohibit Express, Prisma, MongoDB, Supabase, Firebase, authentication, and custom API routes for content on the public website.
- **Rationale:** Reduces attack surface, operational complexity, and scope creep.
- **Consequences:** (+) Simple architecture; clear boundaries. (−) Contact form historically expected external services; bounded domains may store operational data in Postgres under ADR-011 / ADR-013.
- **Alternatives Considered:** Next.js API routes for forms with DB (rejected at launch: scope); Serverless functions for CMS (rejected: duplicates WordPress).
- **Supersession note:** ADR-011 (Experience Studio) and ADR-013 (Lead Engine) permit Prisma and Auth.js only inside named bounded contexts. ADR-007 continues to govern all public content routes and WordPress flows: public UI and `lib/wordpress/**` must never import Prisma.

---

## ADR-008: Vercel + Render + Cloudflare + Hostinger Deployment Topology

- **Status:** Accepted (amended)
- **Date:** 2026-07-09 (amended 2026-07-15)
- **Context:** Need serverless Next.js hosting, bounded-domain Postgres for Studio/leads, and existing WordPress on Hostinger.
- **Decision:** Vercel for Next.js (region: `bom1`); Render for PostgreSQL (`render.yaml`); Cloudflare for DNS/CDN/WAF (optional); Hostinger for WordPress/MySQL. Do not deploy a separate “API backend” on Render for this app.
- **Rationale:** Vercel optimizes Next.js ISR and Server Actions; Render supplies managed Postgres without coupling to WordPress; WordPress stays on existing host.
- **Consequences:** (+) Clear app / CMS / app-DB split. (−) Multiple platforms; Vercel must use Render’s External Database URL; CORS/image domains still required.
- **Alternatives Considered:** Self-hosted Next.js (ops burden); Next + WP on same server (contention); Netlify static frontend + separate API (incompatible with App Router Studio/auth).

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

- **Status:** Accepted (amended 2026-07-13 by ADR-013)
- **Date:** 2026-07-11
- **Context:** The public Next.js site renders WordPress content but needs a non-technical Presentation Management System (templates, heroes, CTAs, theme, section visibility) without becoming a CMS or duplicating WordPress content. ADR-007 prohibited databases and auth for the public website; Experience Studio requires both.
- **Decision:** Introduce Experience Studio as a bounded context under `/admin` in the same Next.js app. Permit Prisma (PostgreSQL), Auth.js (credentials), RBAC, and `/api/auth/*` for **named bounded application domains only**. Experience Studio remains one such domain and stores **presentation configuration only**. WordPress remains the sole source of truth for pages, blogs, media, SEO, categories, tags, and doctor articles.
- **Prisma policy (amended):** Prisma may be used solely by:
  1. **Experience Studio** — presentation configuration (`lib/experience/**`, Studio admin UI).
  2. **Lead Engine** — patient enquiry / CRM operational data (`lib/leads/**`, Lead admin UI) per ADR-013.
  No other domain may introduce Prisma without a new ADR. Public website routes and `lib/wordpress/**` must never import Prisma or Auth session APIs.
- **Rationale:** Keeps one deployable app while isolating operational complexity. Editors continue in WordPress; marketers configure presentation in Studio. Avoids Builder.io-style page builders and Gutenberg clones. Explicitly enumerating Prisma-allowed domains prevents accidental “Postgres for everything” scope creep.
- **Consequences:** (+) Clear product boundary; public architecture unchanged; room for additional bounded domains via ADR. (−) Multiple schemas/concerns in one Postgres database; must enforce import boundaries and avoid cyclic dependencies between domains.
- **Alternatives Considered:** Separate Studio Next.js app (rejected for this phase: operational overhead); Store presentation in WordPress ACF (rejected: couples presentation to CMS, harder RBAC/audit); Full CMS replacement (rejected: out of scope, SEO risk); Allow Prisma anywhere under `/admin` without domain boundaries (rejected: blurs presentation vs operational CRM data).
- **Import boundary:**
  - May use Prisma/Auth: `app/admin/**`, `lib/experience/**`, `lib/leads/**` (ADR-013), `prisma/**`, `auth.ts`, `app/api/auth/**`.
  - Must not use Prisma/Auth: public `app/**` (except `/admin`), `lib/wordpress/**`, and any public feature component that renders WordPress content.
  - Experience Studio must not import Lead Engine internals (and vice versa) except through documented, unidirectional facades if a future ADR requires cross-domain reads.

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

## ADR-013: Lead Engine Bounded Context

- **Status:** Accepted
- **Date:** 2026-07-13
- **Context:** Service and landing pages require a high-converting patient consultation capture flow that can evolve into a lightweight medical CRM (lead list, assignment, status, immutable activity history). Product docs historically directed forms to external email/CRM services (ADR-007 / forms architecture). Experience Studio (ADR-011) owns presentation only and must not store patient enquiries. Storing leads in WordPress or coupling Lead logic to WPGraphQL would blur content vs operational concerns and block future CRM/WhatsApp/SMS/AI adapters.
- **Decision:** Introduce **Lead Engine** as a new bounded application domain, peer to Experience Studio:

  | Concern | Owner |
  |---------|--------|
  | Page/post HTML, media, SEO | WordPress |
  | Templates, heroes, CTAs, theme, section visibility | Experience Studio |
  | Patient enquiries, lead CRM, timeline, lead analytics events | Lead Engine |

  **Isolation**
  - Lead Engine code lives under `lib/leads/**` (repositories, services, validators, events, timeline, analytics publishers, notification adapters).
  - Admin CRM UI lives under `app/admin/**` lead routes (e.g. `/admin/leads`) and `components/admin/leads/**` (or equivalent), authenticated via existing Auth.js/RBAC.
  - Lead Engine **must not** import `lib/wordpress/**` or `lib/experience/**`.
  - WordPress and Experience Studio **must not** import `lib/leads/**` internals.
  - Public UI may call Lead Engine **only** through Server Actions / thin facades that live in the Lead Engine boundary (e.g. `lib/leads/actions/**`). Those actions may accept page attribution fields as plain inputs (slug, URI, title, IDs) captured by the client — they must not query WPGraphQL or Prisma from public components.

  **Exposure pattern**
  - Persistence only via repositories → services → Server Actions (or admin loaders).
  - UI (public or admin) never imports `@prisma/client` or `lib/experience/db`.
  - No cyclic dependencies across WordPress ↔ Experience Studio ↔ Lead Engine.

  **Event-driven, timeline-first**
  - Every meaningful lead mutation appends an immutable `LeadTimeline` event (append-only; never edit/delete historical events for audit rewriting).
  - Domain events (`LeadCreated`, `LeadStatusChanged`, `LeadAssigned`, `LeadTimelineCreated`, etc.) are published through a Lead Event Publisher for future CRM, WhatsApp, email, SMS, analytics, and AI journey summarization subscribers.
  - Timeline is the source of truth for activity history; status/priority fields on `Lead` are projections optimized for listing/filters.

  **Data**
  - Lead records and timeline events are stored in the shared PostgreSQL database via Prisma models owned by this domain (same `prisma/schema.prisma`, clearly namespaced/commented as Lead Engine).
  - Leads permanently retain originating page attribution (title, slug, URI, WordPress page id, presentation ids when provided) as denormalized fields — not as live WordPress fetches.

  **Non-goals (this ADR)**
  - Does not replace WordPress content or Experience Studio presentation.
  - Does not authorize patient portals or medical-record storage.
  - Does not require a separate `packages/` monorepo package in the first implementation; `lib/leads/**` is the canonical module boundary (a future ADR may extract `packages/lead-engine` without changing public contracts).

- **Rationale:** Matches the product need for a sticky consultation capture + mini CRM while preserving headless WordPress and Studio boundaries. Timeline-first design enables audit, AI summaries, and external CRM sync without rewriting history. Explicit isolation prevents Prisma leakage into content rendering and avoids cyclic domain imports.
- **Consequences:** (+) Clear Lead ownership; future adapters subscribe to events; public site stays Prisma-free. (−) Another Postgres-backed domain to operate; attribution fields must be passed in at submit time; RBAC must cover lead admin routes.
- **Alternatives Considered:** External-only Formspree/HubSpot (rejected for primary path: no first-party timeline/CRM control); Store leads in WordPress CPT (rejected: mixes content CMS with operational CRM); Fold leads into Experience Studio schema (rejected: violates presentation-only Studio charter); Allow public routes to import Prisma (rejected: ADR-007 / security boundary).
- **Amends:** ADR-011 Prisma policy (bounded domains list). ADR-007 remains in force for public content surfaces.
- **Implementation guidance:** Follow repository → service → Server Action layering; Zod at boundaries; rate limiting / honeypot / duplicate detection in Lead services; admin list/detail/timeline UIs consume Lead services only.

---

## ADR-014: Static Experience Studio (Universal Presentation Layer)

- **Status:** Accepted (Amended by ADR-015)
- **Date:** 2026-07-14
- **Context:** Experience Studio originally configured presentation only for WordPress-origin pages. Handcrafted Next.js routes (Home, About, Contact, Legal, 404, Thank You, future landings) still needed the same visual builder and PresentationConfig contract without a second editor or WordPress CPT duplication.
- **Decision:**
  1. Introduce a **StaticPageRegistry** (`lib/experience/static-pages/catalog.ts`) that registers every static/marketing page (slug, path, category, default sections).
  2. Persist presentation in Postgres via `StaticPage` + `StaticPagePresentation` + `StaticPresentationVersion` (mirror of WordPress `PagePresentation`, **no** FK to WordPress).
  3. Expose a **PageProvider** interface with `WordPressPageProvider` and `StaticPageProvider` so Studio loaders never call WPGraphQL from the editor shell.
  4. Reuse the **same** `VisualBuilder` / `PresentationPage` / Plugin SDK with `persistenceKind: "static" | "wordpress"`.
  5. Admin IA: `/admin/static-pages` list + `/admin/static-pages/[slug]` opens Visual Builder.
  6. Public handcrafted routes optionally consume published config (e.g. homepage section `enabled` flags) via cached Experience facades — never duplicate renderers.
- **Rationale:** One universal presentation platform; WordPress remains one content provider; static pages gain Studio without CMS migration or duplicate builders.
- **Consequences:** (+) Shared editor/renderer; landing pages creatable from catalog/templates. (−) Handcrafted React sections still need incremental prop wiring for full field-level editing; keep `HANDCRAFTED_PATHS` aligned with the catalog.
- **Alternatives Considered:** Separate static-page editor (rejected: duplication); Store static HTML in Postgres (rejected: ADR-011); Fold static pages into `WordPressPage` (rejected: false WP coupling); Force all static routes through `PresentationPage` immediately (deferred: keep bespoke compositions while enabling Studio progressively).
- **Amends:** ADR-011 (Studio covers static + WordPress presentation). Does not change ADR-007 for WordPress article bodies.
- **Amended by:** ADR-015 (Static Studio mounts real React page views; no synthetic PresentationPage canvas).

---

## ADR-015: Static Component Descriptors (Eliminate Dual Rendering)

- **Status:** Accepted
- **Date:** 2026-07-14
- **Context:** ADR-014 reused Visual Builder for static pages by synthesizing an empty `PresentationPage` shell from the catalog. That produced a second, generic render tree that was visually and structurally different from the handcrafted public routes (`HomePageView`, `AboutPageView`, etc.), breaking WYSIWYG.
- **Decision:**
  1. Each static page registers a **StaticPageModule** (`descriptor` + React `component`) in `lib/experience/static-pages/registry.ts`.
  2. Public routes and Static Studio mount the **same** page view (`mode: "public" | "editor"`). There is one React implementation per page.
  3. **SectionDescriptor** / **StaticPageDescriptor** declare editable sections, prop schemas, supports, and inspector panels. Inspectors are generated from descriptors.
  4. `PresentationConfig` for static pages stores **overrides only** (`sections[]` visibility/order/spacing + `propOverrides`). Unbound props keep handcrafted defaults.
  5. Static Studio canvas **must not** render `PresentationPage` / generic Hero-Content-CTA synthesizers. WordPress Studio continues to use `PresentationPage`.
  6. Studio static routes load exclusively through **StaticPageProvider** (`loadStatic`).
  7. `buildStaticPresentationPage` is deprecated for canvas use.
- **Rationale:** Pixel-perfect editor parity; single source of truth; PresentationConfig remains storage-compatible for WP while serving static as overrides.
- **Consequences:** (+) True WYSIWYG for static pages; descriptors scale props incrementally. (−) Page views must stay free of `server-only` imports so Studio client canvas can mount them; data fetching stays in thin route wrappers.
- **Alternatives Considered:** iframe preview of public URL (rejected: weak overlay tooling); Force static pages through PresentationPage (rejected: dual trees); Separate static-only editor (rejected: duplication).
- **Amends:** ADR-014 (replaces synthetic static PresentationPage canvas). Does not change WordPress presentation (ADR-011) or Lead Engine (ADR-013).

---

## ADR-016: Universal Content Editing (Element Descriptors)

- **Status:** Accepted
- **Date:** 2026-07-14
- **Context:** ADR-015 mounted real page components in Studio, but editors could only toggle sections or a few section props. True no-code editing requires every visible heading, image, button, statistic, and card surface to be selectable and overridable without mutating React source or WordPress HTML.
- **Decision:**
  1. Introduce **ElementDescriptor** (`types/element-descriptor.ts`) for each editable surface (id path like `home.hero.heading`).
  2. Wrap handcrafted surfaces with **EditableElement** — public mode is transparent; editor mode enables hover/select + double-click inline edit via a controlled portal (not contentEditable HTML mutation).
  3. Persist all edits in `PresentationConfig.elementOverrides` (field map per element id). Never modify component source or WordPress.
  4. Generate inspectors and image toolbars from element descriptors (`ElementInspector`, `ElementImageToolbar`).
  5. Progressive wiring: Homepage Hero, Trust stats, and CTA are fully wired first; remaining sections register elements incrementally using the same pattern.
  6. WordPress media remains authoritative for uploads (`mediaId` + `sourceUrl` snapshots).
- **Rationale:** Builder.io / Framer-like editing while preserving one React tree and override-only storage.
- **Consequences:** (+) Canvas-level content editing; same production render path. (−) Each section must opt surfaces into EditableElement + descriptors over time.
- **Alternatives Considered:** contentEditable DOM mutation (rejected: unstable + mutates tree); Duplicate Studio components (rejected: ADR-015); Edit WordPress HTML for static pages (rejected: ADR-007 / static pages are React-owned).
- **Amends:** ADR-015 (adds element-level override system). WordPress PresentationPage content AST editing remains for WP pages.

---

## ADR-017: Complete Universal Editability (Repeaters, Bindings, Responsive)

- **Status:** Accepted
- **Date:** 2026-07-14
- **Context:** ADR-016 delivered element editing for Hero/Trust/CTA. Remaining homepage sections (services, doctors, FAQ-like cards, journey, blogs, location/form, specialties, AI) and About/Contact heroes still needed the same override path, plus list mutation, WordPress binding mode, and per-device field patches.
- **Decision:**
  1. Introduce **RepeaterDescriptor** + `repeaterOverrides` for add/duplicate/hide/reorder of list data without mutating React defaults.
  2. Store per-item fields as element paths (`home.services.item.0.title`) merged via `resolveRepeaterItems`.
  3. Add `elementBindings` (static | wordpress | api | ai) and `elementResponsive` (desktop/tablet/mobile patches).
  4. Auto-register all element + repeater descriptors in `elementRegistry` — new sections register by exporting descriptors; Studio discovers them on import.
  5. Floating element toolbar + inspector Bindings/Responsive panels generated from descriptors (no hand-coded inspectors per section).
  6. Wire every homepage section and About/Contact heroes onto EditableElement; WordPress Studio path unchanged.
- **Rationale:** One architecture for all static surfaces; progressive CPT hydration later without a second editor.
- **Consequences:** (+) Full homepage canvas editability; (−) WordPress CPT live resolution remaining for future when GraphQL entities are bound at runtime (binding mode is stored now).
- **Amends:** ADR-016.

---

## ADR-018: Enterprise Asset Management System (AMS)

- **Status:** Accepted
- **Date:** 2026-07-16
- **Context:** Editors still needed WordPress Admin for media. Experience Studio had a read-only MediaBrowser and occasional local `/public/studio-uploads` fallback, which duplicated storage and broke the “WordPress is the media source of truth” rule.
- **Decision:**
  1. Introduce AMS under `lib/assets/**` with **AssetProvider** (default **WordPressAssetProvider**). Future S3/Cloudinary/Azure/GCS providers plug in without changing editor UI.
  2. **Reads** via WPGraphQL; **writes** (upload/replace/rename/alt/caption/trash/restore) via WordPress REST — credentials only on the server (Server Actions → AssetService → provider).
  3. Never store uploaded bytes in Next.js or PostgreSQL. Prisma holds Studio metadata only: virtual folders, favorites, usage index, version snapshots (URLs + metadata), sync cursor.
  4. Admin route is `/admin/assets` (not `/admin/media`). Legacy `/admin/media` redirects.
  5. Replace MediaPicker with universal **AssetPicker** / **AssetPickerField** across Experience Studio.
  6. **Asset Usage Index** scans PresentationConfig JSON on WordPress + static pages; delete warns when usages exist.
  7. Background **AssetSyncService** refreshes from WordPress so direct WP uploads appear in Studio.
- **Rationale:** Editors never open WordPress Admin for media; zero duplicated libraries; provider-swappable storage later.
- **Consequences:** (+) Single DAM UX; (−) Core WP REST cannot always rewrite attachment binaries in place — replace uploads a new media item, rewrites Studio refs, and trashes the old ID.
- **Amends:** ADR-011 / ADR-016 (media remains WP-authoritative; Studio becomes the management UI).

---

## Best Practices

- Propose new ADRs before implementing significant architectural changes.
- Reference ADR numbers in PR descriptions when relevant.
- Mark superseded ADRs with replacement ADR number.

## Do's

- Add ADR entries for dependency additions that affect architecture.
- Review ADRs during onboarding.
- Keep bounded contexts acyclic: WordPress content ≠ Experience presentation ≠ Lead operations.

## Don'ts

- Do not delete superseded ADRs — mark status as Superseded with link to replacement.
- Do not implement architecture changes without recording the decision.
- Do not import Prisma from public routes or `lib/wordpress/**`.
- Do not create cyclic imports between `lib/wordpress`, `lib/experience`, and `lib/leads`.

## Future Expansion

- ADR-015: On-demand revalidation webhook (when implemented)
- ADR-019: Search implementation (WordPress vs Algolia)
- ADR-020: Extract `packages/lead-engine` monorepo package (optional)
- ADR-021: Pluggable CDN providers for AMS (Cloudflare Images / Cloudinary / Bunny)
