# Care Well Medical Centre — Component Architecture

## Purpose

Define the component hierarchy, composition patterns, and specifications for every reusable UI element in the CWMC design system.

## Responsibilities

Document all planned components, their props interfaces, composition rules, and Server vs Client Component classification before implementation.

## Architecture

### Component Tiers

```
Tier 1: UI Primitives (components/ui/)
  Shadcn-based, styled with design tokens, no business logic

Tier 2: Layout Components (components/layout/)
  Structural: Container, Section, Navbar, Footer

Tier 3: Shared Components (components/shared/)
  Cross-feature: Hero, Heading, Typography, Breadcrumb, Pagination, ContentRenderer

Tier 4: Feature Components (components/features/)
  Domain-specific: ServiceCard, BlogCard, DoctorCard, Gallery
```

### Component Inventory

| Component | Tier | Type | Description |
|-----------|------|------|-------------|
| Button | UI | Client | Primary, secondary, outline, ghost, link variants |
| Card | UI | Server | Container with header, content, footer slots |
| Section | Layout | Server | Page section with padding and background |
| Container | Layout | Server | Max-width wrapper with horizontal padding |
| Navbar | Layout | Client | Responsive navigation with mobile menu |
| Footer | Layout | Server | Site footer with links, contact, social |
| Hero | Shared | Server | Page hero with title, subtitle, CTA, image |
| Heading | Shared | Server | Semantic heading with typography scale |
| Typography | Shared | Server | Text variants (body, lead, caption, overline) |
| Accordion | UI | Client | Expandable content sections |
| Tabs | UI | Client | Tabbed content navigation |
| CTA | Shared | Server | Call-to-action block with button |
| Gallery | Feature | Client | Image grid with lightbox |
| DoctorCard | Feature | Server | Doctor photo, name, specialty, link |
| ServiceCard | Feature | Server | Service image, title, excerpt, link |
| BlogCard | Feature | Server | Blog thumbnail, title, date, excerpt, link |
| Input | UI | Client | Form text input |
| Textarea | UI | Client | Form textarea |
| Breadcrumb | Shared | Server | Navigation breadcrumb trail |
| Pagination | Shared | Client | Page number navigation |
| Modal | UI | Client | Dialog overlay for lightbox, confirmations |
| ContentRenderer | Shared | Server | Safe Gutenberg HTML renderer |

### Composition Pattern

```typescript
// Composition over inheritance — slot-based API

<Card>
  <CardHeader>
    <CardTitle>Service Name</CardTitle>
    <CardDescription>Brief description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    <Button variant="outline">Learn More</Button>
  </CardFooter>
</Card>
```

## Best Practices

- Server Components by default; Client Components only for event handlers, hooks, or browser APIs.
- Use CVA (class-variance-authority) for variant management on UI primitives.
- Accept `className` prop on all components for composition flexibility.
- Use `React.forwardRef` on interactive UI primitives.
- Export prop types alongside components for external consumption.

## Folder Examples

```
components/
├── ui/
│   ├── button.tsx             # npx shadcn add button
│   ├── card.tsx
│   ├── accordion.tsx
│   ├── tabs.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   └── dialog.tsx             # Modal
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Container.tsx
│   └── Section.tsx
├── shared/
│   ├── Hero.tsx
│   ├── Heading.tsx
│   ├── Typography.tsx
│   ├── Breadcrumb.tsx
│   ├── Pagination.tsx
│   ├── CTA.tsx
│   └── ContentRenderer.tsx
└── features/
    ├── services/ServiceCard.tsx
    ├── blog/BlogCard.tsx
    ├── doctors/DoctorCard.tsx
    └── gallery/Gallery.tsx
```

## Naming Conventions

- UI primitives: lowercase file, named exports (Shadcn convention).
- All other components: PascalCase file, default export.
- Props interface: `{ComponentName}Props` (e.g., `ServiceCardProps`).
- Variant definitions: `{component}Variants` via CVA.

## Production Recommendations

- Add Shadcn components via CLI: `npx shadcn@latest add {component}`.
- Tree-shake by importing individual components, not barrel files.
- Lazy load Client Components with `next/dynamic` when below fold.
- Test components in isolation before page integration.

## Common Mistakes

- Putting business logic or GraphQL fetching inside UI primitives.
- Creating monolithic page components instead of composing smaller pieces.
- Duplicating Card layouts instead of using the shared Card primitive.
- Making entire pages Client Components for one interactive element.

## Scalability Considerations

- Feature components accept typed data props from WordPress mappers.
- Shared components are domain-agnostic and reusable across features.
- New page types require only new feature components + page.tsx wiring.

## Do's

- Build bottom-up: UI primitives → layout → shared → feature → page.
- Document props interface before implementing each component.
- Use semantic HTML elements (`article`, `section`, `nav`, `aside`).
- Include `aria-*` attributes on interactive components.

## Don'ts

- Do not create wrapper components that only pass props through unchanged.
- Do not use CSS-in-JS libraries — Tailwind only.
- Do not inline component styles — use CVA variants or Tailwind classes.
- Do not implement components before reading this architecture document.

## Future Expansion

- Storybook for component documentation and visual testing.
- Compound component patterns for complex UI (DataTable, CommandMenu).
- Animated component variants using Framer Motion wrappers.
- Theme-aware components with CSS variable switching.
