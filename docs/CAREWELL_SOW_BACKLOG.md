# Care Well SOW Backlog

**Source:** CareWell Brief Compact v1.0 (March 2026)  
**Repo reality:** WordPress + Experience Studio is live/public; Sanity holds migrated content (`ndeeiwkw` / `production`).  
**Updated:** 2026-07-28 (Phase 1 implemented)

This backlog tracks remaining work against the redevelopment brief. Items marked **Done** are already in the repo or completed in the Sanity import phase.

---

## Status legend

| Status | Meaning |
|--------|---------|
| Done | Implemented or completed |
| Partial | Exists but does not fully match the brief |
| Todo | Not started / must-have from brief |
| Later | In brief but can follow core cutover |

---

## Phase 0 — Content migration (Sanity)

| ID | Item | Status | Notes |
|----|------|--------|-------|
| P0.1 | Export WP (WXR + media + media-urls) | Done | Local backup zip |
| P0.2 | Structure WXR → page/post JSON | Done | `scripts/structure-wordpress-backup.mjs` |
| P0.3 | Upload media to Sanity | Done | ~1420 image assets |
| P0.4 | Import pages + posts + SEO | Done | 132 pages, 199 posts |
| P0.5 | Deploy Studio schemas (`page`, `post`, `seo`, blocks) | Done | `schemaTypes/`, schema deploy |
| P0.6 | Local Studio (`npx sanity dev`) | Done | http://localhost:3333 |
| P0.7 | Smoke-test frontend from Sanity | Done | `/sanity-test`, `/sanity-test/[slug]` |

---

## Phase 1 — Sanity as CMS of record

| ID | Item | Status | Notes |
|----|------|--------|-------|
| P1.1 | Define structured `service` document schema (hero, facts, how-it-works, B&A, candidate, pricing, FAQ, related, CTAs) | Done | `schemaTypes/service.ts` |
| P1.2 | Keep/refine `post` + listing fields for blog template | Done | Featured, read time, author, mid-CTA, related posts |
| P1.3 | Schemas: gallery, testimonials, nav, site settings | Done | `schemaTypes/cms.ts` |
| P1.4 | Redirects manager document (from → to → 301/302) | Done | `redirect` type + `lib/sanity/redirects.ts` (wire to Next in Phase 6) |
| P1.5 | Required image alt validation | Done | `imageWithAlt` + bodyImage alt required |
| P1.6 | Roles: Admin / Editor / SEO Manager | Done | Ops guide: `docs/SANITY_ROLES.md` (configure in Manage) |
| P1.7 | Draft + live preview (Presentation / draft mode) | Done | Presentation tool + `/api/draft-mode/enable|disable` |
| P1.8 | Map migrated page content into `service` sections (one pilot, then batch) | Done | Pilot: gynecomastia via `scripts/pilot-service-from-page.mjs` |
| P1.9 | Public Next.js read path for Sanity services (beyond `/sanity-test`) | Done | Original WP URI via catch-all; `/sanity/service/[slug]` redirects |

---

## Phase 2 — Service page template (one reusable template)

| ID | Item | Status | Notes |
|----|------|--------|-------|
| P2.1 | Hero (photo, H1, CTAs, Quick Facts card) | Partial | WP/Experience hero exists; not Sanity-driven |
| P2.2 | Sticky sidebar 3-field lead form (desktop) + mobile bottom bar | Partial | Consultation sidebar exists; not strict 3-field |
| P2.3 | What is [service] + insight callout | Partial | Semantic medical sections |
| P2.4 | How it works timeline + lite-youtube | Partial | Process sections; YouTube still often iframe |
| P2.5 | Before & after drag sliders (4–6) | Todo | Results grid exists; not sliders |
| P2.6 | Am I a candidate? (good vs not ideal) | Partial | WhenDoctorsRecommend / semantic |
| P2.7 | Pricing range + EMI + quote CTA | Partial | Cost snapshot + EMI (hair-scoped) |
| P2.8 | FAQ accordion + FAQPage JSON-LD | Done | Service `FaqAccordionSection` + CMS eyebrow/heading + optional JSON-LD toggle |
| P2.9 | Related services cards | Done | `related.eyebrow` / `heading` / `services[]->`; auto-fit grid |
| P2.10 | Final CTA strip | Partial | Various CTAs exist |
| P2.11 | Drive template 100% from Sanity `service` doc | Todo | Cutover goal |

---

## Phase 3 — Category hubs, blog, gallery

| ID | Item | Status | Notes |
|----|------|--------|-------|
| P3.1 | Service category hubs (Hair / Face / Body / Skin / Therapies) | Todo | Brief §5B |
| P3.2 | Blog listing (filters, featured, cards, load more) | Partial | `/blogs` WP-driven |
| P3.3 | Blog article (TOC, mid-CTA, sticky form, author box, related) | Partial | Strong WP/Experience pipeline |
| P3.4 | BlogPosting + BreadcrumbList + Author JSON-LD | Partial | `lib/seo/blogSchema.ts` |
| P3.5 | Public `/gallery` with B&A + filters | Todo | Admin gallery shell only |
| P3.6 | Topic cluster internal linking model | Later | Editorial + CMS fields |

---

## Phase 4 — Global chrome & design system

| ID | Item | Status | Notes |
|----|------|--------|-------|
| P4.1 | Brand colors `#1557A0` / `#0A2E52` / `#0B7B6B` / `#FAFBFE` | Todo | Current tokens differ |
| P4.2 | Plus Jakarta Sans + Inter via `next/font` | Partial | Jakarta only |
| P4.3 | Navbar mega menu + Book CTA | Done | `ServicesMegaMenu`, etc. |
| P4.4 | Hello / promo bar | Done | `PromoStrip` |
| P4.5 | Floating WhatsApp bubble (all pages) | Todo | Brief §4 |
| P4.6 | Fixed mobile call button | Todo | Brief §4 |
| P4.7 | Footer 4-col + disclaimer + reg no | Partial | Footer exists; verify brief layout |

---

## Phase 5 — Lead generation & conversion

| ID | Item | Status | Notes |
|----|------|--------|-------|
| P5.1 | Max 3 fields on primary forms (Name, Mobile, Treatment) | Partial | Extra fields today |
| P5.2 | CTA copy: “Claim My Free Slot” / similar (not “Submit”) | Partial | Copy varies |
| P5.3 | Trust line under forms | Partial | |
| P5.4 | Thank-you + Continue on WhatsApp | Partial | Thank-you page; no WhatsApp handoff |
| P5.5 | Source URL + UTM on every lead | Partial | Lead Engine; verify UTM |
| P5.6 | Exit-intent popup | Todo | Brief §7 |
| P5.7 | Treatment Finder Quiz (gate result behind phone) | Todo | Brief §7 / §12 |
| P5.8 | Cost Estimator page `/cost-estimator/` | Todo | Brief §7 / §12 |
| P5.9 | EMI calculator (surgical pages) | Partial | Hair-scoped widget |
| P5.10 | Alerts: Google Sheets + email + WhatsApp to clinic | Todo | Publisher stub only |
| P5.11 | WhatsApp auto-bot (WATI/AiSensy) | Later | External product |

---

## Phase 6 — SEO, redirects, CWV

| ID | Item | Status | Notes |
|----|------|--------|-------|
| P6.1 | `app/sitemap.ts` auto sitemap | Todo | |
| P6.2 | `app/robots.ts` | Todo | |
| P6.3 | Self-referencing canonicals everywhere | Partial | Many routes; audit |
| P6.4 | JSON-LD: LocalBusiness, Physician, MedicalProcedure, FAQ, Breadcrumb, AggregateRating | Partial | Blog/home stronger; services incomplete |
| P6.5 | 301 map old → new (Screaming Frog + Sanity redirects + Next) | Todo | Docs exist; not live manager |
| P6.6 | Hindi pages + hreflang (`en-IN` / `hi-IN`) | Later | Brief §8 / §12 |
| P6.7 | Hyperlocal area pages | Later | Brief §12 |
| P6.8 | CWV: LCP &lt; 2.5s, CLS &lt; 0.1, INP &lt; 200ms; Mobile &gt; 85 | Partial | Targets documented; evidence at handover |
| P6.9 | lite-youtube embeds (no heavy iframes by default) | Todo | |
| P6.10 | Google reviews at build time (Places API → static) | Partial | Static/UI section; not API build fetch |

---

## Phase 7 — Cutover & handover

| ID | Item | Status | Notes |
|----|------|--------|-------|
| P7.1 | Switch public services/blogs from WPGraphQL → Sanity | In progress | Public catch-all is Sanity-only; WP GraphQL + Experience Studio admin removed |
| P7.2 | Retain or retire Experience Studio / WP after cutover | Done | Retired for public site; Sanity CMS + React pages only |
| P7.3 | GA4 + GTM conversion events verified | Todo | Brief §13 |
| P7.4 | PageSpeed screenshots (Mobile/Desktop) before handover | Todo | |
| P7.5 | CMS training (2h recorded) | Todo | |
| P7.6 | 3 months post-launch support plan | Todo | |
| P7.7 | GitHub branching (dev/staging/main) + deploy docs | Partial | Deploy docs exist |

---

## Recommended next 5 (execute in order)

1. **P2.x** — Flesh service template UI (B&A sliders, live lead form) on original WP URIs  
2. **P1.8 batch** — Run `npm run pilot:sanity-service -- --slug <slug>` for top services  
3. **P6.1 + P6.2 + wire P1.4** — Sitemap, robots, apply Sanity redirects in Next middleware  
4. **P4.1 + P4.5** — Brand tokens + floating WhatsApp bubble  
5. **P5.1 + P5.4 + P5.10** — 3-field forms, WhatsApp thank-you, first alert adapter  

~~Previous Phase 1 next-5 completed 2026-07-28.~~

---

## Out of scope for this backlog file

- Day-to-day WP content edits on the live site  
- Changing hosting DNS until Phase 7 cutover is approved  

---

## Related paths

| Area | Path |
|------|------|
| Brief extraction (local) | `C:\Users\risha\Downloads\CareWell_Brief_Compact (1).docx` |
| Section templates doc | `docs/SERVICE_SECTION_TEMPLATES.md` |
| Section React components | `components/service/sections/` |
| Sanity schemas | `schemaTypes/` |
| Sanity test UI | `app/sanity-test/`; services at original WP URI (`app/[...uri]`); legacy `/sanity/service/[slug]` redirects |
| Import scripts | `scripts/structure-wordpress-backup.mjs`, `scripts/import-wordpress-to-sanity.mjs` |
| WP service renderer | `components/service/ServiceExperienceRenderer.tsx` |
| Leads | `lib/leads/**` |
| Architecture | `docs/25_ARCHITECTURE_DECISIONS.md` |
