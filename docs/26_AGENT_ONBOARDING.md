# Care Well Medical Centre — Agent Onboarding

## Purpose

Define the mandatory startup protocol for AI agents (Cursor and similar) working on this repository. Ensures consistent, documentation-driven implementation with zero scope creep.

## Responsibilities

Every agent session must follow this protocol before writing or modifying application code.

---

## Session Startup Protocol

### Step 1: Orient

Read in order:

1. `docs/00_KNOWLEDGE_BASE_INDEX.md` — locate relevant docs
2. `docs/01_PROJECT_OVERVIEW.md` — boundaries and prohibited actions
3. `docs/25_ARCHITECTURE_DECISIONS.md` — settled decisions (do not relitigate)

### Step 2: Load Domain Context

Read docs specific to the task:

| Task Type | Required Reading |
|-----------|-----------------|
| New page/route | `06_ROUTING.md`, `02_PRODUCT_REQUIREMENTS.md`, `12_CONTENT_MODEL.md` |
| WordPress integration | `10_WORDPRESS_INTEGRATION.md`, `11_GRAPHQL_STRUCTURE.md`, `27_WORDPRESS_FIELD_MAPPING.md` |
| New component | `09_COMPONENT_ARCHITECTURE.md`, `35_COMPONENT_API_CONTRACTS.md`, `07_DESIGN_SYSTEM.md` |
| Styling/UI | `07_DESIGN_SYSTEM.md`, `08_UI_GUIDELINES.md`, `17_RESPONSIVE_GUIDELINES.md` |
| Forms | `31_FORMS_ARCHITECTURE.md`, `23_SECURITY_GUIDE.md` |
| SEO | `13_SEO_STRATEGY.md` |
| Performance | `14_PERFORMANCE_GUIDE.md`, `30_CACHING_AND_REVALIDATION.md` |
| Deployment | `18_DEPLOYMENT.md`, `33_ENVIRONMENT_VARIABLES.md` |

### Step 3: Load Skills

Read applicable skill files from `skills/`:

- Always: `coding-standards.md`
- Domain-specific: match task (e.g., `wordpress.md` for GraphQL work)

### Step 4: Confirm Scope

Before implementing, verify:

- [ ] Task does not require building a CMS, backend API, auth, or database
- [ ] Task does not migrate or duplicate WordPress content
- [ ] Task aligns with `24_PROJECT_CHECKLIST.md` current phase
- [ ] Required WordPress schema/fields are documented or will be discovered via GraphiQL

### Step 5: Implement

- Follow `19_CODE_STANDARDS.md` and `21_FOLDER_CONVENTIONS.md`
- Obey `.cursor/rules/` (architecture rule always applies)
- Server Components by default
- WordPress data fetched only in Server Components

### Step 6: Verify

```bash
npm run lint
npm run build
```

Report any failures before marking task complete.

---

## Prohibited Agent Behaviors

| Action | Reason |
|--------|--------|
| Build CMS, admin dashboard, auth | ADR-007 |
| Create Express, Prisma, MongoDB, Supabase, Firebase | ADR-007 |
| Migrate or duplicate WordPress content | ADR-001 |
| Fetch WordPress in Client Components | ADR-003 |
| Add dependencies without justification | `03_TECH_STACK.md` |
| Skip documentation reading | This protocol |
| Implement undeclared pages or features | `02_PRODUCT_REQUIREMENTS.md` |
| Modify `.cursor/rules/` without approval | `20_DEVELOPMENT_WORKFLOW.md` |

---

## Decision Escalation

Stop and ask the user when:

- WordPress GraphQL schema differs from documented field mapping
- A new dependency is required
- URL slugs must change from WordPress originals
- Task requires scope outside product requirements
- Architecture decision contradicts an existing ADR

---

## Output Standards

- Minimal, focused diffs — no unrelated changes
- Match existing code conventions
- No placeholders or TODOs in production code
- No inline styles — Tailwind only
- No `any` types

---

## Checklist Integration

Track progress in `docs/24_PROJECT_CHECKLIST.md`. Do not skip phases. Phase 1 (WordPress foundation) must complete before page implementation.

---

## Do's

- Read docs before coding — every session
- Reference ADR numbers when making architectural choices
- Update field mapping doc after GraphiQL discovery
- Keep PRs focused under 400 lines

## Don'ts

- Do not assume WordPress CPT names or field names without verification
- Do not generate pages, components, or APIs unless explicitly requested
- Do not overwrite documentation without approval
