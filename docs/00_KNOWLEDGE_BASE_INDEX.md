# Care Well Medical Centre — Knowledge Base Index

## Purpose

Provide a single navigation entry point for all project documentation, skills, and Cursor rules. Every contributor and AI agent should start here to locate authoritative guidance before implementation.

## How to Use This Knowledge Base

### For Human Developers

1. Read `01_PROJECT_OVERVIEW.md` for strategic context and boundaries.
2. Read the doc(s) relevant to your task using the index below.
3. Run implementation against `24_PROJECT_CHECKLIST.md`.
4. Follow `19_CODE_STANDARDS.md` and `21_FOLDER_CONVENTIONS.md` while coding.

### For AI Agents

1. Read `01_PROJECT_OVERVIEW.md` and `26_AGENT_ONBOARDING.md`.
2. Load applicable files from `skills/` for the task domain.
3. Obey rules in `.cursor/rules/` (architecture rule always applies).
4. Implement only what is requested; verify with `npm run lint` and `npm run build`.

## Canonical Source Hierarchy

When guidance conflicts, resolve in this order:

1. **Product requirements** — `02_PRODUCT_REQUIREMENTS.md`
2. **Architecture decisions** — `25_ARCHITECTURE_DECISIONS.md`
3. **Domain docs** — numbered docs `03`–`24` and expansion docs `26`–`36`
4. **Skills** — `skills/` (operational summaries for agents)
5. **Cursor rules** — `.cursor/rules/` (enforcement layer)

Skills and rules must not contradict domain docs. Update the domain doc first, then sync skills/rules.

---

## Documentation Map

### Foundation

| Doc | Title | Use When |
|-----|-------|----------|
| `01` | Project Overview | Starting any work; understanding boundaries |
| `02` | Product Requirements | Defining scope, pages, acceptance criteria |
| `03` | Tech Stack | Adding dependencies, choosing libraries |
| `04` | Architecture | System design, data flow, rendering strategy |
| `05` | Folder Structure | Locating files, planning new features |
| `06` | Routing | Adding routes, dynamic segments, ISR per route |

### Design & Frontend

| Doc | Title | Use When |
|-----|-------|----------|
| `07` | Design System | Tokens, colors, typography, spacing |
| `08` | UI Guidelines | Page templates, layout patterns, section structure |
| `09` | Component Architecture | Component tiers, inventory, composition |
| `35` | Component API Contracts | Implementing component props and behavior |
| `16` | Animation Guidelines | Framer Motion, motion tokens, reduced motion |
| `17` | Responsive Guidelines | Breakpoints, mobile-first patterns |

### WordPress & Data

| Doc | Title | Use When |
|-----|-------|----------|
| `10` | WordPress Integration | WPGraphQL setup, plugins, client config |
| `11` | GraphQL Structure | Queries, fragments, pagination |
| `12` | Content Model | TypeScript interfaces, entity mapping |
| `27` | WordPress Field Mapping | Field-by-field GraphQL → TypeScript → UI mapping |
| `28` | Gutenberg Rendering Contract | ContentRenderer, HTML sanitization, embeds |
| `34` | Navigation Menu Contract | WordPress menus → Navbar/Footer |

### Quality & Operations

| Doc | Title | Use When |
|-----|-------|----------|
| `13` | SEO Strategy | Metadata, schema, sitemap, redirects |
| `14` | Performance Guide | Core Web Vitals, bundle, image optimization |
| `15` | Accessibility | WCAG AA, ARIA, keyboard, screen readers |
| `19` | Code Standards | TypeScript, imports, naming |
| `21` | Folder Conventions | Import boundaries, file placement |
| `22` | Testing Guide | Unit, integration, E2E, a11y testing |
| `23` | Security Guide | Threat model, headers, sanitization |
| `29` | Error Handling & Resilience | Error boundaries, fallbacks, degraded mode |
| `30` | Caching & Revalidation | ISR, cache tags, on-demand revalidation |
| `31` | Forms Architecture | Contact form, validation, submission |
| `32` | Observability & Monitoring | Logging, analytics, alerting |
| `33` | Environment Variables | Complete env var reference |
| `36` | URL Migration & Redirects | Legacy URL continuity, 301 map |

### Process & Delivery

| Doc | Title | Use When |
|-----|-------|----------|
| `18` | Deployment | Vercel, Cloudflare, Hostinger, env setup |
| `20` | Development Workflow | Branching, PRs, agent workflow |
| `24` | Project Checklist | Phase tracking, launch readiness |
| `25` | Architecture Decisions | ADR log — **ADR-011 Experience Studio**, **ADR-013 Lead Engine**, **ADR-014–017 Static/Universal Edit**, **ADR-018 AMS**, **ADR-019 Unified Editorial Experience Engine**, **ADR-020 Service Editorial Intelligence** |
| `26` | Agent Onboarding | AI agent session startup protocol |

---

## Skills Index (`skills/`)

| Skill | Domain |
|-------|--------|
| `nextjs.md` | App Router, ISR, metadata, routing |
| `react.md` | Components, Server/Client split |
| `typescript.md` | Types, mappers, strict mode |
| `tailwind.md` | Styling, tokens, responsive |
| `wordpress.md` | WPGraphQL integration |
| `graphql.md` | Queries, fragments, pagination |
| `seo.md` | Metadata, schema, sitemap |
| `performance.md` | CWV, bundle, caching |
| `accessibility.md` | WCAG, ARIA, keyboard |
| `framer-motion.md` | Animation patterns |
| `component-design.md` | Component tiers, APIs |
| `healthcare-ui.md` | Brand tone, trust signals |
| `coding-standards.md` | Imports, naming, quality |
| `forms.md` | Form validation, submission |
| `error-handling.md` | Errors, fallbacks, resilience |

---

## Cursor Rules Index (`.cursor/rules/`)

| Rule | Scope | Always Apply |
|------|-------|--------------|
| `architecture.mdc` | Project-wide boundaries | Yes |
| `frontend.mdc` | `**/*.{tsx,jsx}` | No |
| `wordpress.mdc` | `lib/wordpress/**` | No |
| `coding-standards.mdc` | `**/*.{ts,tsx}` | No |
| `performance.mdc` | `app/**` | No |
| `accessibility.mdc` | `**/*.{tsx,jsx}` | No |
| `seo.mdc` | `app/**` | No |
| `responsive-design.mdc` | `**/*.{tsx,css}` | No |
| `animations.mdc` | `**/*.{tsx,ts}` | No |
| `forms.mdc` | Form-related files | No |
| `error-handling.mdc` | App and lib layers | No |

---

## Quick Reference: Prohibited Actions

**Public website**
- Replace, migrate, or duplicate WordPress content
- Create Express, MongoDB, Supabase, Firebase
- Fetch WordPress data in Client Components
- Use inline styles or non-Tailwind CSS approaches
- Import Prisma or Auth into public routes / `lib/wordpress/**`

**Bounded Prisma domains — ADR-011 / ADR-013**
- Prisma + Auth.js only for Experience Studio (`lib/experience/**`) and Lead Engine (`lib/leads/**`)
- Public UI must never import Prisma; Lead capture uses Lead Server Actions only
- No cyclic imports among `lib/wordpress`, `lib/experience`, and `lib/leads`

**Experience Studio (`/admin`) — ADR-011 / ADR-012**
- Presentation management only (templates, heroes, CTAs, theme, visibility)
- Never edit WordPress article HTML from Studio
- Never use Studio as a CMS replacement
- Blocks register via Plugin SDK (`lib/experience/platform/`) — do not hardcode packs into core

**Lead Engine — ADR-013**
- Owns patient enquiries, mini CRM, append-only timeline, lead domain events
- Isolated from WordPress and Experience Studio modules
- Timeline-first; future CRM / messaging / AI adapters subscribe to events

---

## Maintenance

- Add a new numbered doc when introducing a new cross-cutting concern.
- Record architectural decisions in `25_ARCHITECTURE_DECISIONS.md`.
- Update this index when docs, skills, or rules are added.
- Sync skills and rules after updating canonical domain docs.
