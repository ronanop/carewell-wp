# Care Well Medical Centre — Visual Language

**Document Type:** Permanent Creative Reference  
**Audience:** Designers, frontend developers, AI agents generating UI  
**Design Direction:** Editorial Luxury Minimalism · Enterprise Healthcare  
**Cross-reference:** `docs/07_DESIGN_SYSTEM.md`, `reference/brand.md`, `reference/typography.md`

---

## Overall Design Philosophy

Care Well Medical Centre's visual language is built on a single principle: **editorial authority through restraint**. Every pixel serves trust, clarity, or conversion. Nothing decorative exists without function. The site should feel like opening a premium health journal — not a hospital brochure or a SaaS landing page.

### Three Visual Pillars

1. **Editorial** — Typography and whitespace lead the design. Content is the hero.
2. **Luxury** — Generous spacing, refined palette, subtle material treatments.
3. **Clinical Trust** — Precision, consistency, accessibility, and calm confidence.

### Design Influences (What We Take, Not Copy)

| Reference | What We Adopt |
|-----------|---------------|
| **Apple** | Product-page clarity, generous whitespace, precise alignment, photography-forward heroes |
| **Stripe** | Structured grids, subtle borders, confident typography, minimal colour |
| **Linear** | Hairline borders, muted palette with single accent, dark-on-light precision |
| **Vercel** | Clean section rhythm, monospace accents for labels, fast visual hierarchy |
| **Premium healthcare (Mayo, Cleveland Clinic editorial)** | Trust signals, doctor credibility, calm palette, educational tone |
| **Luxury editorial (Kinfolk, Cereal)** | Serif headlines, warm neutrals, photography with breathing room |

---

## Editorial Luxury Minimalism

### Definition

A design approach combining magazine-quality typography and layout with the precision requirements of enterprise healthcare. "Editorial" = content-first, typographically rich. "Luxury" = spacious, refined, unhurried. "Minimalism" = nothing extraneous.

### Manifestation Rules

- One focal point per viewport
- Maximum two visual weights per section (e.g., heading + body, or image + caption)
- Gold accent appears on no more than one element per section
- Photography or typography carries sections — not icons, not illustrations, not gradients
- Every section must answer: "What does the patient learn or do here?"

---

## Enterprise Healthcare UI

### Requirements Beyond Aesthetics

- WCAG 2.1 AA contrast on all text
- Touch targets minimum 44×44px
- Readable body text minimum 16px (1rem)
- No information conveyed by colour alone
- Critical actions (call, book, contact) reachable within two interactions on mobile
- Consistent patterns across hundreds of service and blog pages

### Enterprise vs. Template

| Template Healthcare Site | Care Well Medical Centre |
|--------------------------|--------------------------|
| Icon-heavy feature grids | Photography and typography-led sections |
| Three-column icon cards | Full-width editorial sections with restrained cards |
| Bright blue and white | Teal, warm off-white, gold accent |
| Stock imagery | WordPress clinic photography |
| Multiple CTAs per screen | One primary CTA per viewport |
| Carousel heroes | Static, confident hero statements |

---

## White Space Philosophy

**Whitespace is not empty space — it is structure.**

| Level | Token | Usage |
|-------|-------|-------|
| Micro | 4–8px | Icon-to-label, badge padding |
| Component | 16–24px | Card internal padding, form field gaps |
| Group | 32–48px | Between cards in a grid, stacked content blocks |
| Section | 64–96px | Between major page sections (`py-16` to `py-28`) |
| Macro | 96–128px | Between homepage major narrative blocks |

### Rules

- Never reduce section padding below `py-16` on mobile to "fit more content"
- When content feels cramped, remove an element — do not reduce spacing
- Hero sections require minimum `py-20` even on mobile
- Text blocks need minimum 24px padding from container edges

---

## Grid System

### Base Grid

- **12-column grid** on desktop (≥1024px)
- **4-column grid** on tablet (768–1023px)
- **Single column** on mobile (<768px)
- **Gutter:** 24px mobile, 32px desktop
- **Max content width:** 1280px (`max-w-7xl`)

### Column Usage

| Layout | Desktop Columns | Example |
|--------|----------------|---------|
| Full-width hero | 12 | Homepage hero |
| Centered content | 8 centred (cols 3–10) | About narrative |
| Reading width | 7 centred | Blog article body |
| Two-column split | 6 + 6 | Hero with image |
| Three-card grid | 4 + 4 + 4 | Service cards |
| Four-card grid | 3 + 3 + 3 + 3 | Doctor grid |
| Sidebar layout | 8 + 4 | Blog with categories (future) |

---

## Container Widths

| Container | Class | Width | Usage |
|-----------|-------|-------|-------|
| Full | `max-w-7xl` | 1280px | Default page container |
| Reading | `max-w-3xl` | 768px | Blog body, long-form text |
| Narrow | `max-w-2xl` | 672px | Contact form, centred CTAs |
| Wide hero | `max-w-7xl` | 1280px | Hero sections with background |

Horizontal padding: `px-4 md:px-6 lg:px-8` on all containers.

---

## Visual Hierarchy

### Priority Order (Highest to Lowest)

1. Page headline (h1) — one per page
2. Primary CTA button
3. Hero image or key photograph
4. Section headings (h2)
5. Body text and card titles (h3/h4)
6. Supporting text, captions, meta
7. Decorative elements (lowest — use sparingly)

### Weight Through

- **Size** — display type for heroes, body for paragraphs
- **Weight** — light (300) for display, regular (400) for body, medium (500) for emphasis
- **Colour** — `foreground` for primary, `muted-foreground` for secondary
- **Space** — more space above than below headings

---

## Section Rhythm

### Alternating Background Pattern

```
Section 1: bg-background (white)
Section 2: bg-secondary (warm off-white #F5F0EB)
Section 3: bg-background
Section 4: bg-secondary
...continues
```

### Section Anatomy

```
┌─────────────────────────────────────────────────┐
│  SECTION PADDING (py-16 md:py-20 lg:py-28)      │
│  ┌───────────────────────────────────────────┐  │
│  │  CONTAINER (max-w-7xl mx-auto px-4)       │  │
│  │                                           │  │
│  │  [Overline label]                         │  │
│  │  Section Heading                          │  │
│  │  Optional description paragraph           │  │
│  │                                           │  │
│  │  [Content: grid / cards / prose]          │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Overline Labels

- Small caps or uppercase tracking
- `text-xs` or `text-sm`, `text-muted-foreground`, `letter-spacing: 0.1em`
- Placed 8–12px above section heading
- Examples: "OUR SERVICES", "MEET THE TEAM", "LATEST ARTICLES"

---

## Card Design Rules

### Standard Card

```
┌─────────────────────────────────┐
│  border: 1px solid border       │
│  border-radius: rounded-lg      │
│  background: bg-background      │
│  shadow: none (border only)     │
│  padding: p-0 (image flush top) │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Image (aspect-ratio 4:3) │  │
│  └───────────────────────────┘  │
│  p-6                            │
│  Card Title (heading-4)         │
│  Excerpt (body-sm, muted)       │
│  [Optional link/button]         │
└─────────────────────────────────┘
```

### Card Rules

- No drop shadows on default state — border defines the card
- Hover: `border-primary/30` transition, subtle `translate-y-[-2px]` optional (see `motion-system.md`)
- Image top, content below — consistent across ServiceCard, BlogCard
- Doctor cards: 1:1 image aspect ratio
- Entire card clickable via wrapping `<Link>` — not just the title
- Minimum card height in grids: use CSS grid `auto-rows` for alignment

---

## Border Radius Rules

| Element | Radius | Class |
|---------|--------|-------|
| Buttons | 6px | `rounded-md` |
| Cards | 8px | `rounded-lg` |
| Images in cards | 8px top only | `rounded-t-lg` |
| Input fields | 6px | `rounded-md` |
| Modals | 12px | `rounded-xl` |
| Avatars / doctor photos | 8px or full | `rounded-lg` or `rounded-full` |
| Gallery thumbnails | 8px | `rounded-lg` |

**Never:** `rounded-full` on cards. **Never:** mixed radius within same component type.

---

## Shadow System

| Level | Class | Usage |
|-------|-------|-------|
| None | — | Default cards, sections (preferred) |
| Subtle | `shadow-sm` | Dropdowns, mobile menu panel |
| Medium | `shadow-md` | Modals, elevated popovers |
| Never | `shadow-lg`, `shadow-xl` | Prohibited — too heavy for brand |

**Philosophy:** Borders over shadows. Shadows only for floating/interactive overlay elements.

---

## Border Usage

- **Colour:** `border-border` (#E2E8F0)
- **Width:** 1px always — no 2px borders except focus rings
- **Cards:** full border on all sides
- **Dividers:** `border-t border-border` between footer columns
- **Inputs:** `border border-input` default, `border-ring` on focus
- **Sections:** no borders between sections — use background alternation instead

---

## Divider Usage

- Horizontal dividers only — no vertical dividers between columns
- Style: `border-t border-border my-8`
- Use between distinct content blocks within a section, not between sections
- Footer column separators: border-top on mobile, border-left on desktop

---

## Background Usage

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | #FFFFFF | Primary page background |
| `secondary` | #F5F0EB | Alternating sections, warm contrast |
| `muted` | #F1F5F9 | Subtle inset areas, input backgrounds |
| `primary` | #0D4F4F | CTA buttons, links, active states |
| `accent` | #C4A882 | Overline labels, decorative lines, hover accents |

**Never:** coloured backgrounds behind body text except `secondary` and `muted`. **Never:** pattern backgrounds or textures.

---

## Glass Effects

**Not used in this brand.** No glassmorphism, no `backdrop-blur` on navigation or cards. Navigation uses solid `bg-background/95` with subtle bottom border if scroll-aware — not frosted glass.

---

## Gradient Usage

| Allowed | Prohibited |
|---------|-----------|
| Subtle hero image overlay: `bg-gradient-to-t from-background/80 to-transparent` | Decorative background gradients |
| Text-on-image readability overlay | Gradient buttons |
| | Gradient borders |
| | Multi-colour gradient sections |

Maximum gradient opacity: 80% to transparent. Direction: bottom-to-top on hero images only.

---

## Typography Hierarchy

See `reference/typography.md` for complete specification. Summary:

| Level | Element | Desktop Size | Weight |
|-------|---------|-------------|--------|
| Display | Hero h1 | 48–72px | 300 (light) |
| H1 | Page title | 48px | 400 |
| H2 | Section title | 36px | 400 |
| H3 | Subsection | 30px | 500 |
| H4 | Card title | 24px | 500 |
| Body | Paragraph | 16–18px | 400 |
| Small | Caption, meta | 14px | 400 |
| Label | Overline | 12px | 500, tracked |

---

## Button Styles

### Primary Button

- Background: `bg-primary` (#0D4F4F)
- Text: `text-primary-foreground` (white)
- Padding: `px-6 py-3` (minimum 44px height)
- Radius: `rounded-md`
- Font: body size, medium weight
- Hover: `bg-primary/90` — no scale, no shadow increase
- Focus: `ring-2 ring-ring ring-offset-2`

### Secondary Button

- Background: transparent
- Border: `border border-primary`
- Text: `text-primary`
- Hover: `bg-primary/5`

### Ghost Button

- No border, no background
- Text: `text-primary`
- Hover: `bg-muted`

### Link Button

- Underline on hover only
- `text-primary`, no padding block

**Never:** gradient buttons, pill-shaped buttons (`rounded-full`), icon-only buttons without `aria-label`.

---

## Hover States

| Element | Hover Treatment |
|---------|----------------|
| Buttons | Background opacity shift (90%), 150ms ease |
| Cards | Border colour to `primary/30`, optional 2px upward translate |
| Links | Underline appearance, colour stays `primary` |
| Nav items | `text-primary` colour shift |
| Images in cards | Subtle scale `scale-[1.02]` on image only, 300ms ease |
| Gallery thumbnails | Opacity 0.9 + `ring-2 ring-accent` |

**Duration:** 150–200ms for interactive elements. **Never:** colour flash, bounce, or shadow explosion on hover.

---

## Empty States

```
┌─────────────────────────────────┐
│                                 │
│     [Lucide icon, 32px, muted]  │
│                                 │
│     No services found           │
│     body-sm, muted-foreground   │
│                                 │
│     [Optional action button]    │
│                                 │
└─────────────────────────────────┘
```

- Centred in container
- Icon + message + optional CTA
- No illustration characters
- Copy from `reference/brand.md` microcopy guidelines

---

## Loading States

### Skeleton

- Background: `bg-muted animate-pulse`
- Shape matches final content dimensions exactly (prevent CLS)
- Border-radius matches final element
- No shimmer gradient — simple pulse only

### Page Loading

- `loading.tsx` skeleton mirrors section layout
- Hero skeleton: rectangle for image + lines for text
- Card grid skeleton: 3–6 card-shaped pulses

### Button Loading

- Spinner icon (Lucide `Loader2`, `animate-spin`) + "Sending..." text
- Button disabled during load

---

## Error States

### Inline Field Error

- Border: `border-destructive`
- Message below field: `text-sm text-destructive`
- Icon: none (text is sufficient)

### Section Error

- Muted banner: `bg-destructive/5 border border-destructive/20 rounded-lg p-4`
- Message + retry action
- Never red background at full saturation

### Page Error

- Centre-aligned, calm copy from brand bible
- "Try again" button (secondary style)
- Phone number as fallback

---

## Success States

- Inline: `text-sm text-primary` with check icon (Lucide `Check`, 16px)
- Form success: replace form with success message in same container width
- No confetti, no green flash, no celebration animation
- Copy: warm, specific, brief (see `reference/brand.md`)

---

## Responsive Visual Rules

| Element | Mobile (<768px) | Desktop (≥1024px) |
|---------|----------------|-------------------|
| Section padding | `py-16` | `py-28` |
| Hero layout | Stacked (text above image) | Split or centred |
| Grid columns | 1 | 2–4 depending on content |
| Typography | −1 step from desktop scale | Full scale |
| Navigation | Hamburger menu | Horizontal links |
| Card padding | `p-4` | `p-6` |
| Hero image | Full width, `aspect-[4/3]` | Half width or background |

---

## Visual Consistency Rules

1. Every card of the same type (service, blog, doctor) uses identical structure and spacing.
2. Section headers always follow overline → heading → description pattern when description exists.
3. Primary CTA button style is identical across all pages.
4. Photography aspect ratios are consistent within component types.
5. Border radius values do not vary within component categories.
6. Spacing tokens are from the defined scale — no arbitrary `mt-[13px]`.
7. Colour usage is semantic — always via tokens, never hardcoded hex in components.

---

## Anti-Patterns

### Visual Anti-Patterns (Never Implement)

| Anti-Pattern | Why |
|-------------|-----|
| Hero carousel/slider | Hides content, bad for SEO and a11y |
| Parallax scrolling | Disorienting, performance cost |
| Floating action button | Conflicts with premium calm |
| Stock medical imagery | Destroys trust |
| Multiple border radii on same page section | Looks unpolished |
| Gradient text | Not brand-appropriate |
| Neon or saturated accent colours | Undermines healthcare trust |
| Drop shadow on everything | Cheapens luxury positioning |
| Icon-only feature grid (6+ icons) | Template pattern, not editorial |
| Testimonial carousel | Use static grid instead |
| Sticky pop-up CTA bar | Aggressive, not premium |

### Layout Anti-Patterns

- Three equal CTAs side by side
- Full-width coloured banner between every section
- Sidebar on homepage
- Text centred for entire page (left-align body, centre only heroes)
- Images smaller than 40% viewport width in hero

---

## Design Principles Summary

1. **Content is the design** — typography and photography lead
2. **Restraint signals premium** — fewer elements, better executed
3. **Trust is visual** — consistency, precision, accessibility
4. **Space is material** — whitespace communicates confidence
5. **Calm converts** — healthcare patients need reassurance, not excitement
6. **Every page is intentional** — no filler sections, no template blocks

---

*This visual language governs all UI decisions. When building components, consult this document alongside `reference/typography.md` and `reference/motion-system.md`.*
