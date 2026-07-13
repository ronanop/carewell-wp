# Tailwind CSS Skill — Care Well Medical Centre

## When to Use

Apply when styling components, configuring design tokens, or working with `globals.css`.

## Core Rules

- **Tailwind CSS 4 only** — no CSS Modules, no styled-components, no inline styles.
- Use **semantic design tokens** from CSS variables — never hardcode hex colors.
- Use **`cn()` utility** from `lib/utils.ts` for conditional class merging.
- Use **CVA** (class-variance-authority) for component variants.
- **Mobile-first** responsive classes: base → `sm:` → `md:` → `lg:` → `xl:`.

## Design Tokens

Use CSS variables defined in `app/globals.css`:

```
bg-background, bg-primary, bg-secondary, bg-muted, bg-accent
text-foreground, text-primary-foreground, text-muted-foreground
border-border, ring-ring
```

Brand colors: teal primary (`--primary: #0D4F4F`), gold accent (`--accent: #C4A882`).

## Common Patterns

```tsx
// Conditional classes
<div className={cn('base-classes', isActive && 'active-classes', className)} />

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" />

// Section spacing
<section className="py-16 md:py-20 lg:py-28" />

// Container
<div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8" />
```

## Do's

- Use Tailwind spacing scale exclusively (no arbitrary px values unless justified).
- Apply `focus-visible:ring-2 focus-visible:ring-ring` on interactive elements.
- Use `sr-only` for screen-reader-only text.
- Keep Shadcn component styling in `components/ui/` — customize via CSS variables.

## Don'ts

- Do not use `@apply` extensively — prefer utility classes in JSX.
- Do not hardcode colors — use semantic tokens.
- Do not mix Tailwind with other CSS approaches.
- Do not use `!important` overrides.

## Reference

Read `docs/07_DESIGN_SYSTEM.md` and `docs/17_RESPONSIVE_GUIDELINES.md`.
