# Care Well Medical Centre — Typography Bible

**Document Type:** Permanent Creative Reference  
**Audience:** Designers, frontend developers, AI agents generating UI  
**Cross-reference:** `docs/07_DESIGN_SYSTEM.md`, `reference/visual-language.md`, `reference/brand.md`

---

## Font Selection

### Primary — Headings (Serif)

**Font:** Playfair Display  
**Source:** `next/font/google`  
**Character:** Editorial, refined, authoritative  
**Usage:** h1–h4, hero headlines, section titles, card titles  
**Weights loaded:** 400 (regular), 500 (medium)  
**Display:** `swap`

```typescript
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-heading',
  display: 'swap',
});
```

### Secondary — Body (Sans-Serif)

**Font:** DM Sans  
**Source:** `next/font/google`  
**Character:** Clean, modern, highly legible at small sizes  
**Usage:** Body text, navigation, buttons, labels, forms, captions  
**Weights loaded:** 400 (regular), 500 (medium)  
**Display:** `swap`

```typescript
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});
```

### Monospace — Code (Optional)

**Font:** Geist Mono (already in project)  
**Usage:** Code blocks in blog content only  
**Never:** navigation, buttons, or headings

### Fallbacks

```css
--font-heading: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
--font-body: 'DM Sans', 'Inter', 'system-ui', '-apple-system', sans-serif;
```

---

## Type Scale

### Display & Headings

| Token | Element | Mobile | Tablet | Desktop | Weight | Font | Line Height |
|-------|---------|--------|--------|---------|--------|------|-------------|
| `display-xl` | Hero h1 | 36px / 2.25rem | 48px / 3rem | 72px / 4.5rem | 300 | Serif | 1.1 |
| `display-lg` | Section hero | 30px / 1.875rem | 40px / 2.5rem | 60px / 3.75rem | 300 | Serif | 1.15 |
| `heading-1` | Page h1 | 30px / 1.875rem | 36px / 2.25rem | 48px / 3rem | 400 | Serif | 1.2 |
| `heading-2` | Section h2 | 24px / 1.5rem | 30px / 1.875rem | 36px / 2.25rem | 400 | Serif | 1.25 |
| `heading-3` | Subsection h3 | 20px / 1.25rem | 24px / 1.5rem | 30px / 1.875rem | 500 | Serif | 1.3 |
| `heading-4` | Card title h4 | 18px / 1.125rem | 20px / 1.25rem | 24px / 1.5rem | 500 | Serif | 1.35 |

### Body & Utility

| Token | Element | Mobile | Desktop | Weight | Font | Line Height |
|-------|---------|--------|---------|--------|------|-------------|
| `body-lg` | Lead paragraph | 16px | 18px | 400 | Sans | 1.7 |
| `body` | Body text | 16px | 16px | 400 | Sans | 1.6 |
| `body-sm` | Caption, meta | 14px | 14px | 400 | Sans | 1.5 |
| `label` | Overline, form labels | 12px | 12px | 500 | Sans | 1.4 |
| `button` | Button text | 14px | 16px | 500 | Sans | 1 (single line) |

### Tailwind Mapping

```css
@theme inline {
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
}
```

```html
<h1 class="font-heading text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
<p class="font-body text-base leading-relaxed text-foreground">
<span class="font-body text-xs font-medium uppercase tracking-widest text-muted-foreground">
```

---

## Letter Spacing

| Context | Value | Class |
|---------|-------|-------|
| Display headings | -0.02em | `tracking-tight` |
| Section headings | -0.01em | `tracking-tight` |
| Body text | 0 (normal) | `tracking-normal` |
| Overline labels | 0.1em | `tracking-widest` |
| Button text | 0.01em | `tracking-wide` |
| All caps text | 0.06em | `tracking-wider` |

**Never:** positive tracking on body text. **Never:** tracking on serif headings beyond `tight`.

---

## Line Heights

| Context | Ratio | Class |
|---------|-------|-------|
| Display (hero) | 1.1 | `leading-none` or `leading-tight` |
| Headings | 1.2–1.35 | `leading-tight` to `leading-snug` |
| Lead paragraph | 1.7 | `leading-relaxed` |
| Body text | 1.6 | `leading-relaxed` |
| Captions | 1.5 | `leading-normal` |
| Buttons | 1.0 | `leading-none` |
| Form labels | 1.4 | `leading-snug` |

---

## Paragraph Width

### Maximum Reading Width

| Context | Max Width | Class | Characters |
|---------|-----------|-------|------------|
| Long-form article | 680px | `max-w-3xl` (inner prose) | ~65–75 per line |
| Lead paragraph | 600px | `max-w-2xl` | ~55–65 per line |
| Section description | 560px | `max-w-xl` | ~50–60 per line |
| Card excerpt | 100% of card | — | 2–3 lines clamped |
| Form helper text | 100% of field | — | 1 line |

**Optimal reading:** 60–75 characters per line for body text. Never exceed 80.

### Paragraph Spacing

- Between paragraphs: `mb-4` (16px)
- After heading before body: `mt-4 mb-6`
- Between section heading and description: `mt-2 mb-8`

---

## Button Typography

| Property | Value |
|----------|-------|
| Font family | Sans (DM Sans) |
| Size | 14px mobile, 16px desktop |
| Weight | 500 (medium) |
| Letter spacing | 0.01em |
| Text transform | None (sentence case) |
| Line height | 1 (single line, vertically centred) |

**Examples:** "Book a consultation", "View services", "Send enquiry"

**Never:** ALL CAPS buttons. **Never:** font size below 14px on buttons.

---

## Lists

### Unordered

```html
<ul class="font-body text-base leading-relaxed list-disc pl-6 mb-4 space-y-2">
```

- Disc marker, primary text colour
- 8px between items
- Nested: `list-circle` at second level

### Ordered

```html
<ol class="font-body text-base leading-relaxed list-decimal pl-6 mb-4 space-y-2">
```

- Used for steps, procedures, instructions
- Number colour: `foreground`

### Feature Lists (Services)

- Lucide check icon (16px, `text-primary`) + text
- No bullet character
- `space-y-3` between items

---

## Tables

Used in blog content (Gutenberg) and potentially service comparison.

```html
<table class="w-full text-sm border-collapse mb-6">
  <th class="border border-border px-4 py-2 text-left font-medium bg-muted">
  <td class="border border-border px-4 py-2">
```

- Header: `bg-muted`, medium weight sans
- Body: regular weight sans, 14px
- Responsive: wrap in `overflow-x-auto` container
- Never: tables for layout

---

## Blockquotes

### In Gutenberg Content

```html
<blockquote class="border-l-4 border-accent pl-4 my-6 italic text-muted-foreground font-body text-lg">
```

- Left border: 4px gold accent
- Italic, muted colour
- Slightly larger than body (18px)
- Attribution below: `text-sm text-muted-foreground not-italic`

### Pull Quotes (Future)

- Serif font, `heading-3` size
- Centred, `max-w-2xl`
- No border — used sparingly in editorial blog layouts

---

## Links

### In Body Text

```html
<a class="text-primary underline-offset-4 hover:underline font-body">
```

- Colour: `text-primary` (teal)
- Underline on hover only
- Underline offset: 4px
- No underline by default (cleaner editorial feel)

### In Navigation

- No underline
- Colour: `text-foreground`, hover `text-primary`
- Active: `text-primary font-medium`

### In Cards

- Entire card is link — title colour `foreground`, hover `text-primary`
- No separate "Read more" link unless card has no wrap link

### External Links

- Lucide `ExternalLink` icon (14px) after text
- `target="_blank"` + `rel="noopener noreferrer"`

---

## Article Typography (Blog Detail)

### Structure

```
[Category badges]     — body-sm, sans, muted
[Article title h1]    — heading-1, serif
[Byline: author, date] — body-sm, sans, muted
[Featured image]        — full reading width
[Article body]          — Gutenberg ContentRenderer
```

### Article Body (Gutenberg HTML)

| Element | Style |
|---------|-------|
| `h2` | `heading-2` serif, `mt-8 mb-4` |
| `h3` | `heading-3` serif, `mt-6 mb-3` |
| `h4` | `heading-4` serif, `mt-4 mb-2` |
| `p` | `body` sans, `mb-4 leading-relaxed` |
| `a` | `text-primary underline-offset-4 hover:underline` |
| `ul`, `ol` | As list rules above |
| `blockquote` | As blockquote rules above |
| `img` | `rounded-lg my-6 max-w-full h-auto` |
| `figure` | `my-8` |
| `figcaption` | `text-sm text-muted-foreground mt-2 text-center` |
| `code` | `font-mono text-sm bg-muted px-1.5 py-0.5 rounded` |
| `pre` | `font-mono text-sm bg-muted p-4 rounded-lg overflow-x-auto my-6` |
| `table` | As table rules above |
| `hr` | `border-border my-8` |

### Article Meta

- Author name: `body-sm font-medium text-foreground`
- Date: `body-sm text-muted-foreground`
- Category: badge style — `text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground`
- Reading time (future): `body-sm text-muted-foreground`

---

## Blog Typography (Listing)

| Element | Style |
|---------|-------|
| Page title | `heading-1` serif |
| Card title | `heading-4` serif, 2-line clamp |
| Excerpt | `body-sm` sans, `text-muted-foreground`, 3-line clamp |
| Date | `body-sm` sans, `text-muted-foreground` |
| Category badge | `label` sans, uppercase tracking |

---

## Service Page Typography

### Service Detail

| Element | Style |
|---------|-------|
| Service title (h1) | `heading-1` serif |
| Service excerpt/lead | `body-lg` sans, `text-muted-foreground`, `max-w-2xl` |
| Content body | Gutenberg rules (same as article) |
| CTA section title | `heading-2` serif |
| Related service card titles | `heading-4` serif |

### Services Listing

| Element | Style |
|---------|-------|
| Page title | `heading-1` serif |
| Page description | `body-lg` sans, `max-w-2xl` |
| Card title | `heading-4` serif |
| Card excerpt | `body-sm` sans, muted, 2-line clamp |

---

## Responsive Typography

### Scaling Strategy

Mobile-first: base size on mobile, scale up at breakpoints.

| Token | Mobile | md (768px) | lg (1024px) |
|-------|--------|------------|-------------|
| display-xl | 2.25rem | 3rem | 4.5rem |
| heading-1 | 1.875rem | 2.25rem | 3rem |
| heading-2 | 1.5rem | 1.875rem | 2.25rem |
| heading-3 | 1.25rem | 1.5rem | 1.875rem |
| body | 1rem | 1rem | 1rem |
| body-lg | 1rem | 1.125rem | 1.125rem |

Body text stays 16px at all breakpoints — never smaller on mobile.

### Fluid Typography (Optional Enhancement)

```css
/* Hero display — fluid scaling */
font-size: clamp(2.25rem, 5vw + 1rem, 4.5rem);
```

Use `clamp()` only on display headings. Body text remains fixed 16px.

---

## Accessibility

- Minimum body text: 16px (1rem) — never 14px for paragraphs
- Minimum contrast: 4.5:1 for body text, 3:1 for large text (≥24px)
- `#1A1A2E` on `#FFFFFF` = 14.8:1 (passes AAA)
- `#64748B` on `#FFFFFF` = 4.6:1 (passes AA for body-sm captions)
- Never use colour alone to distinguish linked text (underline on hover required)
- Headings must use semantic `h1`–`h6` elements, not styled `div`
- One `h1` per page
- No heading level skips

---

## Medical Readability Standards

Healthcare content must be readable by patients of all ages and literacy levels.

| Guideline | Standard |
|-----------|----------|
| Body font size | Minimum 16px |
| Line height | Minimum 1.5 (we use 1.6) |
| Paragraph length | Maximum 4 sentences on web |
| Medical terms | Define on first use or link to glossary |
| Abbreviations | Spell out on first use: "Intense Pulsed Light (IPL)" |
| Reading level | Target Year 8–10 reading level for patient-facing copy |
| Contrast | WCAG AA minimum, AAA preferred for body |

---

## SEO Considerations

- One `h1` per page containing primary keyword
- Heading hierarchy reflects content structure (h2 for sections, h3 for subsections)
- Never skip heading levels for visual sizing — use CSS classes for visual override
- `h1` text should match or closely align with `generateMetadata` title
- Blog titles: descriptive, not clickbait
- Service titles: treatment name + benefit where natural
- Meta descriptions: 150–160 characters, sans keyword stuffing

---

## Gutenberg HTML Styling Rules

WordPress Gutenberg content renders as HTML via `ContentRenderer`. Typography must be consistent regardless of WordPress theme styles.

### Override Strategy

Scope all Gutenberg typography under `.wp-content` class:

```css
.wp-content h2 { /* heading-2 styles */ }
.wp-content p { /* body styles */ }
/* etc. */
```

### WordPress Class Mapping

| WordPress Class | Treatment |
|----------------|-----------|
| `.wp-block-heading` | Apply heading scale based on h-level |
| `.wp-block-paragraph` | Body text styles |
| `.wp-block-quote` | Blockquote styles |
| `.wp-block-list` | List styles |
| `.wp-block-image` | Image + figcaption styles |
| `.wp-block-embed` | Responsive iframe wrapper |
| `.wp-block-table` | Table styles |
| `.wp-block-separator` | `border-border my-8` |
| `.wp-block-button__link` | Secondary button styles |
| `.has-text-align-center` | `text-center` |
| `.alignwide` | `max-w-5xl mx-auto` |
| `.alignfull` | Full container width |

### Strip WordPress Theme Styles

WordPress may inject inline styles or theme classes. ContentRenderer normalisation:

- Remove inline `font-family`, `font-size`, `color` styles
- Remove WordPress theme colour classes (`.has-vivid-red-color`, etc.)
- Preserve semantic structure (headings, lists, links)
- Map to brand tokens via `.wp-content` scoped CSS

---

## Typography Audit Checklist

- [ ] Playfair Display for headings, DM Sans for body
- [ ] No more than 2 font families per page
- [ ] Body text ≥ 16px
- [ ] Reading width ≤ 680px for long-form
- [ ] One h1 per page
- [ ] Contrast passes WCAG AA
- [ ] Links distinguishable without colour alone
- [ ] Gutenberg content scoped under `.wp-content`
- [ ] Button text ≥ 14px, medium weight
- [ ] No ALL CAPS except overline labels

---

*Typography is the primary design element of this brand. When visual decisions conflict, typography rules take precedence.*
