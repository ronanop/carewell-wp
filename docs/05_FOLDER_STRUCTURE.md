# Care Well Medical Centre — Folder Structure

## Purpose

Define the complete directory layout for the `carewell-next` project. Every file has a designated location; no ad-hoc folder creation without updating this document.

## Responsibilities

This structure supports feature-based architecture, clear separation of concerns, and scalability for an enterprise healthcare website with hundreds of content pages.

## Architecture

```
carewell-next/
├── .cursor/
│   └── rules/                    # Cursor AI agent rules
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Global styles + Tailwind
│   ├── not-found.tsx             # 404 page
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── gallery/
│   │   └── page.tsx
│   ├── doctors/
│   │   └── page.tsx
│   ├── services/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   └── blogs/
│       ├── page.tsx
│       └── [slug]/
│           └── page.tsx
├── components/
│   ├── ui/                       # Shadcn UI primitives
│   ├── layout/                   # Navbar, Footer, Container, Section
│   ├── features/                 # Feature-specific components
│   │   ├── home/
│   │   ├── services/
│   │   ├── blog/
│   │   ├── doctors/
│   │   ├── gallery/
│   │   └── contact/
│   └── shared/                   # Cross-feature reusables
│       ├── ContentRenderer.tsx
│       ├── SEOHead.tsx
│       └── BreadcrumbNav.tsx
├── lib/
│   ├── utils.ts                  # cn() and shared utilities
│   ├── wordpress/
│   │   ├── client.ts
│   │   ├── queries/
│   │   └── fragments/
│   ├── validations/
│   │   └── contact-form.ts
│   └── constants/
│       └── site.ts
├── hooks/
│   ├── useMediaQuery.ts
│   └── useReducedMotion.ts
├── types/
│   ├── wordpress.ts
│   ├── service.ts
│   ├── blog.ts
│   └── doctor.ts
├── styles/
│   └── (supplementary CSS if needed)
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── docs/                         # Project knowledge base
├── skills/                       # Agent skill files
├── components.json               # Shadcn configuration
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env.local                    # Local environment (gitignored)
```

## Best Practices

- One component per file; file name matches default export name.
- Feature folders mirror route structure where applicable.
- Shared components used by 2+ features go in `components/shared/`.
- GraphQL queries live in `lib/wordpress/queries/`, never inline in components.
- Types mirror WordPress content models in `types/`.

## Folder Examples

### Adding a New Feature (e.g., Testimonials)

```
components/features/testimonials/
├── TestimonialCard.tsx
├── TestimonialGrid.tsx
└── index.ts                    # Barrel export

lib/wordpress/queries/
└── get-testimonials.ts

types/
└── testimonial.ts
```

### Adding a Shadcn Component

```bash
npx shadcn@latest add accordion
# Creates: components/ui/accordion.tsx
```

## Naming Conventions

| Location | File Naming | Export |
|----------|-------------|--------|
| `components/ui/` | kebab-case.tsx | Named exports (Shadcn convention) |
| `components/features/` | PascalCase.tsx | Default export |
| `components/layout/` | PascalCase.tsx | Default export |
| `lib/wordpress/queries/` | kebab-case.ts | Named export (query string + fetcher) |
| `hooks/` | camelCase.ts | Named export (`use*`) |
| `types/` | kebab-case.ts | Named type exports |

## Production Recommendations

- Keep `components/ui/` limited to Shadcn primitives — no business logic.
- Use barrel exports (`index.ts`) sparingly; prefer direct imports for tree-shaking.
- Store static assets in `public/`; WordPress media stays on WordPress CDN.
- Never commit `.env.local`; provide `.env.example` with required variable names.

## Common Mistakes

- Creating `src/` directory — project uses root-level folders (no src dir).
- Placing page-specific components in `components/ui/`.
- Scattering GraphQL queries across component files.
- Creating `utils/` at root when `lib/` is the designated utility folder.

## Scalability Considerations

- `components/features/` subfolders prevent flat directory bloat.
- `types/` files can split by domain as models grow.
- `lib/wordpress/fragments/` enables GraphQL field reuse across queries.
- `docs/` grows with each architectural decision — keep it current.

## Do's

- Follow this structure exactly when adding new files.
- Update this document when introducing a new top-level directory.
- Co-locate feature components with their domain folder.
- Use `@/` import alias for all internal imports.

## Don'ts

- Do not create `pages/` directory (App Router only).
- Do not create `api/` routes unless explicitly required.
- Do not nest components deeper than 3 levels without justification.
- Do not mix test files into component directories (future: `__tests__/` or separate test folder).

## Future Expansion

```
app/
├── (marketing)/                  # Route group for shared marketing layout
├── api/
│   └── revalidate/route.ts       # WordPress webhook handler
└── sitemap.ts                    # Dynamic sitemap generation

lib/
├── analytics/
└── seo/
    ├── metadata.ts
    └── schema.ts
```
