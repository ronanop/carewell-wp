# React Skill — Care Well Medical Centre

## When to Use

Apply when building React components, hooks, or managing component composition.

## Core Rules

- **Functional components only** — no class components.
- **Server Components by default** — `"use client"` only when needed.
- **Composition over inheritance** — build complex UIs from simple, composable pieces.
- **One component per file** — file name matches default export.
- Props destructuring in function signature with typed interface.
- Use `React.forwardRef` on interactive UI primitives.
- Accept `className` prop on all components for Tailwind composition.

## Server vs Client Decision

Add `"use client"` when the component needs:
- Event handlers (`onClick`, `onChange`)
- React hooks (`useState`, `useEffect`, `useRef`)
- Browser APIs (`window`, `document`, `localStorage`)
- Framer Motion animations
- React Hook Form

Keep as Server Component when the component:
- Fetches data from WordPress
- Renders static content
- Has no interactivity

## Component Tiers

1. `components/ui/` — Shadcn primitives (Client where interactive)
2. `components/layout/` — Container, Section, Navbar, Footer
3. `components/shared/` — Hero, Typography, Breadcrumb, ContentRenderer
4. `components/features/` — ServiceCard, BlogCard, DoctorCard

## Do's

- Extract reusable logic into custom hooks in `hooks/`.
- Use semantic HTML (`article`, `section`, `nav`, `main`, `header`, `footer`).
- Keep components under 200 lines — split if exceeded.
- Use early returns over deep nesting.

## Don'ts

- Do not use inline styles (`style={{}}`).
- Do not create wrapper components that only pass props through.
- Do not make entire pages Client Components for one interactive element.
- Do not use `dangerouslySetInnerHTML` outside ContentRenderer.

## Reference

Read `docs/09_COMPONENT_ARCHITECTURE.md` and `docs/19_CODE_STANDARDS.md`.
