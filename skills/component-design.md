# Component Design Skill — Care Well Medical Centre

## When to Use

Apply when creating new UI components, choosing component tier, or designing component APIs.

## Core Rules

- Follow the **4-tier component hierarchy**: UI → Layout → Shared → Feature.
- **Server Components by default**; Client only for interactivity.
- Use **CVA** for variant management on UI primitives.
- Use **composition** (slot-based API) over prop explosion.
- Accept **`className` prop** on all components for Tailwind composition.

## Component Inventory

| Component | Tier | Type |
|-----------|------|------|
| Button, Card, Input, Accordion, Tabs, Dialog | UI | Client |
| Container, Section, Navbar, Footer | Layout | Server/Client |
| Hero, Heading, Typography, Breadcrumb, CTA, ContentRenderer | Shared | Server |
| ServiceCard, BlogCard, DoctorCard, Gallery | Feature | Server |

## Design Principles

- **Editorial Luxury Minimalism** — generous whitespace, refined typography.
- Cards: subtle border, no heavy shadows.
- One primary CTA per viewport section.
- Consistent spacing via Section and Container components.

## Component API Pattern

```typescript
interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}
```

## Do's

- Build bottom-up: UI primitives → layout → shared → feature → page.
- Add Shadcn components via CLI: `npx shadcn@latest add {name}`.
- Document props interface before implementing.
- Use semantic HTML elements.

## Don'ts

- Do not put business logic in UI primitives.
- Do not create monolithic page components.
- Do not duplicate card layouts — use shared Card primitive.
- Do not implement components before reading `docs/09_COMPONENT_ARCHITECTURE.md`.

## Reference

Read `docs/09_COMPONENT_ARCHITECTURE.md`, `docs/08_UI_GUIDELINES.md`, and `docs/07_DESIGN_SYSTEM.md`.
