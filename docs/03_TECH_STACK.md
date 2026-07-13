# Care Well Medical Centre — Tech Stack

## Purpose

Document every technology used in the CWMC project, its role, version constraints, and integration points. This is the single source of truth for dependency decisions.

## Responsibilities

| Technology | Role |
|------------|------|
| Next.js 15 | App framework, routing, SSR/SSG/ISR, metadata API |
| React 19 | UI rendering, Server/Client Components |
| TypeScript | Type safety across the entire codebase |
| Tailwind CSS 4 | Utility-first styling, design tokens |
| Framer Motion | Page transitions, scroll animations, micro-interactions |
| Shadcn UI | Accessible, composable component primitives |
| React Hook Form | Form state management |
| Zod | Schema validation for forms and API responses |
| GraphQL Request | Lightweight GraphQL client for WPGraphQL |
| Lucide React | Consistent icon system |
| CVA + clsx + tailwind-merge | Component variant management and class merging |
| tailwindcss-animate | Animation utilities for Shadcn components |
| WordPress + WPGraphQL | Headless CMS content API |
| Vercel | Frontend deployment and edge functions |
| Cloudflare | CDN, DNS, DDoS protection |
| Hostinger | WordPress hosting |

## Architecture

```
Frontend Stack                    CMS Stack
─────────────                    ─────────
Next.js 15                       WordPress (existing)
  ├── React 19                     ├── WPGraphQL plugin
  ├── TypeScript                   ├── Gutenberg editor
  ├── Tailwind CSS 4               ├── Media library
  ├── Framer Motion                └── MySQL
  ├── Shadcn UI
  ├── graphql-request  ──────────► WPGraphQL endpoint
  ├── react-hook-form + zod
  └── lucide-react

Deployment Stack
────────────────
Vercel (Next.js) + Cloudflare (CDN) + Hostinger (WordPress)
```

## Best Practices

- Pin major versions in `package.json`; use caret for patch updates only.
- Install production dependencies with `npm install <pkg>`; dev tools with `npm install -D <pkg>`.
- Never add ORMs, backend frameworks, or alternative databases.
- Use `graphql-request` exclusively for WordPress data fetching — no Apollo Client unless justified.
- Shadcn components are copied into `components/ui/` — they are owned code, not node_modules.

## Folder Examples

```
lib/
├── utils.ts                 # cn() helper (Shadcn)
├── wordpress/
│   ├── client.ts            # GraphQL client instance
│   └── queries/             # GraphQL query strings
└── validations/
    └── contact-form.ts      # Zod schemas

components/
├── ui/                      # Shadcn primitives
└── ...                      # Feature components
```

## Naming Conventions

- Environment variables: `WORDPRESS_GRAPHQL_URL`, `NEXT_PUBLIC_SITE_URL`
- Config files: `next.config.ts`, `components.json`, `tailwind.config.ts`
- No `.js` config files — TypeScript only

## Production Recommendations

- Enable Turbopack for development (`next dev --turbopack`).
- Use `sharp` (bundled with Next.js) for image optimization.
- Set `NODE_ENV=production` on Vercel; never commit `.env.local`.
- Run `npm run build` in CI before every merge to main.
- Monitor bundle size with `@next/bundle-analyzer` during development sprints.

## Common Mistakes

- Adding unnecessary state management (Redux, Zustand) when Server Components suffice.
- Installing Apollo Client when `graphql-request` handles all needs.
- Using CSS Modules alongside Tailwind — pick Tailwind exclusively.
- Adding Moment.js — use native `Intl` and `Date` APIs.
- Installing authentication libraries (NextAuth, Clerk) — out of scope.

## Scalability Considerations

- GraphQL Request is stateless and edge-compatible — scales horizontally with Vercel.
- Tailwind CSS 4 with `@import "tailwindcss"` reduces build complexity.
- Framer Motion should be lazy-loaded on pages that need animation.
- TypeScript strict mode catches breaking changes when WordPress schema evolves.

## Do's

- Keep dependencies minimal and justified.
- Use Server Components for data fetching — zero client-side GraphQL libraries needed.
- Leverage Next.js built-in Image, Font, and Script optimizations.
- Document any new dependency addition in this file with justification.

## Don'ts

- Do not add Express, Fastify, or custom API servers.
- Do not add Prisma, Drizzle, or any ORM.
- Do do not add MongoDB, Supabase, Firebase, or PlanetScale.
- Do not install UI libraries that conflict with Shadcn (MUI, Chakra, Ant Design).

## Future Expansion

- `@next/bundle-analyzer` for production bundle audits.
- `next-intl` if multi-language support is required.
- `@vercel/analytics` and `@vercel/speed-insights` for monitoring.
- WordPress webhook plugin for on-demand ISR revalidation.
