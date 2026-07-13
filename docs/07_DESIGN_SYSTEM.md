# Care Well Medical Centre — Design System

## Purpose

Establish the visual design tokens, typography scale, color palette, spacing system, and component styling foundations for the Editorial Luxury Minimalism aesthetic.

## Responsibilities

The design system ensures visual consistency across all pages, components, and breakpoints while conveying premium healthcare trust.

## Architecture

### Design Language: Editorial Luxury Minimalism

- **Premium** — generous whitespace, refined typography, subtle animations.
- **Minimal** — no visual clutter, purposeful elements only.
- **Elegant** — serif/sans-serif pairing, muted palette with strategic accent.
- **Corporate** — professional, authoritative, high-trust.
- **Modern** — clean lines, contemporary layout grids.
- **Accessible** — WCAG AA contrast ratios on all text/background pairs.

### Color Palette

| Token | Light Mode | Usage |
|-------|------------|-------|
| `--background` | `#FFFFFF` | Page background |
| `--foreground` | `#1A1A2E` | Primary text |
| `--primary` | `#0D4F4F` | Brand teal — CTAs, links, accents |
| `--primary-foreground` | `#FFFFFF` | Text on primary |
| `--secondary` | `#F5F0EB` | Warm off-white sections |
| `--secondary-foreground` | `#1A1A2E` | Text on secondary |
| `--muted` | `#F1F5F9` | Subtle backgrounds |
| `--muted-foreground` | `#64748B` | Secondary text, captions |
| `--accent` | `#C4A882` | Gold accent — highlights, borders |
| `--accent-foreground` | `#1A1A2E` | Text on accent |
| `--destructive` | `#DC2626` | Error states |
| `--border` | `#E2E8F0` | Borders, dividers |
| `--ring` | `#0D4F4F` | Focus rings |

### Typography Scale

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `display-xl` | 4.5rem / 72px | 300 | Hero headlines |
| `display-lg` | 3.75rem / 60px | 300 | Section heroes |
| `heading-1` | 3rem / 48px | 400 | Page titles |
| `heading-2` | 2.25rem / 36px | 400 | Section titles |
| `heading-3` | 1.875rem / 30px | 500 | Subsection titles |
| `heading-4` | 1.5rem / 24px | 500 | Card titles |
| `body-lg` | 1.125rem / 18px | 400 | Lead paragraphs |
| `body` | 1rem / 16px | 400 | Body text |
| `body-sm` | 0.875rem / 14px | 400 | Captions, meta |
| `label` | 0.75rem / 12px | 500 | Labels, overlines |

### Font Pairing

- **Headings:** Serif font (e.g., Playfair Display or similar editorial serif via `next/font/google`).
- **Body:** Sans-serif (e.g., Inter or DM Sans via `next/font/google`).
- **Monospace:** Geist Mono for code blocks (if needed in blog content).

### Spacing Scale

Base unit: 4px. Use Tailwind spacing scale exclusively.

| Token | Value | Usage |
|-------|-------|-------|
| `section-y` | `py-20 md:py-28 lg:py-32` | Vertical section padding |
| `container-x` | `px-4 md:px-6 lg:px-8` | Horizontal container padding |
| `gap-grid` | `gap-6 md:gap-8` | Grid/flex gaps |
| `stack-sm` | `space-y-4` | Tight vertical stacks |
| `stack-md` | `space-y-8` | Standard vertical stacks |
| `stack-lg` | `space-y-12` | Loose vertical stacks |

## Best Practices

- Define all design tokens as CSS custom properties in `app/globals.css`.
- Use Tailwind `@theme inline` to map CSS variables to Tailwind utilities.
- Never hardcode hex colors in components — always use semantic tokens.
- Maintain 4.5:1 contrast ratio minimum for normal text (WCAG AA).
- Use consistent border-radius: `rounded-lg` for cards, `rounded-md` for buttons.

## Folder Examples

```
app/globals.css              # Design tokens + Tailwind imports
components/ui/               # Shadcn components styled with tokens
styles/                      # Supplementary CSS (print styles, etc.)
```

## Naming Conventions

- CSS variables: `--{category}-{name}` (e.g., `--primary`, `--heading-1`)
- Tailwind classes: semantic tokens (e.g., `bg-primary`, `text-muted-foreground`)
- Component variants via CVA: `variant`, `size` props

## Production Recommendations

- Load fonts via `next/font/google` with `display: swap` and subset optimization.
- Define dark mode tokens even if not launching dark mode — future-proofing.
- Create a living style reference page at `/design-system` (development only, excluded from production).
- Audit color contrast with automated tools during CI.

## Common Mistakes

- Using default Shadcn zinc/slate theme without customizing to brand palette.
- Mixing px values with Tailwind spacing utilities.
- Using too many font weights — limit to 3-4 weights maximum.
- Applying gradients or shadows excessively — contradicts minimalism principle.

## Scalability Considerations

- Token-based system allows global rebrand by updating CSS variables only.
- CVA variants scale component API without prop explosion.
- Design tokens documented here should match `components.json` Shadcn theme config.

## Do's

- Use generous whitespace — luxury feels spacious.
- Apply gold accent sparingly for premium feel.
- Maintain consistent heading hierarchy (one h1 per page).
- Use subtle border and shadow treatments on cards.

## Don'ts

- Do not use stock gradient backgrounds or generic hero patterns.
- Do not use more than 2 font families.
- Do not use bright, saturated colors — healthcare demands calm trust.
- Do not feel template-based — every section should feel custom-designed.

## Future Expansion

- Dark mode variant with adjusted contrast tokens.
- Animation design tokens (duration, easing) in CSS variables.
- Component density variants (compact for admin, spacious for public).
- Figma-to-code token sync pipeline.
