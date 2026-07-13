# Care Well Medical Centre — UI Guidelines

## Purpose

Translate the design system into actionable UI patterns, layout rules, and interaction standards for every page and component in the CWMC frontend.

## Responsibilities

- Enforce Editorial Luxury Minimalism across all user-facing surfaces.
- Define layout grids, section patterns, and content hierarchy.
- Standardize interactive states (hover, focus, active, disabled).
- Ensure healthcare-appropriate tone in all visual communication.

## Architecture

### Layout Grid

- **Max content width:** 1280px (`max-w-7xl`) centered with auto margins.
- **Reading width:** 720px (`max-w-3xl`) for long-form blog content.
- **Grid columns:** 12-column grid on desktop; 4-column on tablet; single column on mobile.
- **Section rhythm:** Alternate `bg-background` and `bg-secondary` for visual separation.

### Section Pattern

Every page section follows this structure:

```
<Section>                    # Vertical padding, optional background
  <Container>                # Max-width + horizontal padding
    <SectionHeader>          # Overline + Heading + Description (optional)
    <SectionContent>         # Grid, cards, or content block
  </Container>
</Section>
```

### Page Templates

| Page | Hero | Body Sections | CTA |
|------|------|---------------|-----|
| Home | Full-width hero with headline + CTA | Services grid, doctors, testimonials, blog highlights | Book consultation |
| About | Minimal hero with brand story | Timeline, values, credentials | Contact us |
| Services | Category headline | Filterable service grid | View service detail |
| Service Detail | Service hero with image | Gutenberg content, related services | Book now |
| Blog Listing | Minimal headline | Paginated blog grid | Newsletter (future) |
| Blog Detail | Featured image hero | Gutenberg content, author, related posts | Share |
| Doctors | Team headline | Doctor card grid | Book with doctor |
| Gallery | Visual headline | Masonry/grid gallery | Contact |
| Contact | Simple headline | Form + map/info | Submit form |

## Best Practices

- One primary CTA per viewport — avoid competing actions.
- Use overline text (small caps label) above section headings for editorial feel.
- Images always use `next/image` with explicit width, height, and alt text.
- Cards use subtle border (`border-border`) with no heavy drop shadows.
- Maintain 48px minimum touch targets on mobile interactive elements.

## Folder Examples

```
components/layout/
├── Container.tsx              # max-w-7xl mx-auto px-*
├── Section.tsx                # py-20 md:py-28 + optional bg
└── SectionHeader.tsx          # overline + title + description

components/shared/
├── Hero.tsx                   # Reusable hero variants
└── CTA.tsx                    # Call-to-action block
```

## Naming Conventions

- Layout components: descriptive nouns (`Container`, `Section`, `SectionHeader`).
- Variant props: `variant="default" | "secondary" | "accent"`.
- Size props: `size="sm" | "md" | "lg"`.
- Boolean props: `centered`, `fullWidth`, `noPadding`.

## Production Recommendations

- Implement skeleton loading states matching final layout dimensions.
- Use `aspect-ratio` utilities for consistent image containers.
- Lazy load below-fold images with `loading="lazy"` via next/image.
- Test all pages at 320px, 768px, 1024px, 1280px, 1440px widths.

## Common Mistakes

- Centering all text — use left-aligned text for body content; center only heroes.
- Using carousel/slider for critical content (bad for accessibility and SEO).
- Inconsistent card heights in grids — use CSS grid with equal row sizing.
- Overloading pages with CTAs — one primary action per section maximum.

## Scalability Considerations

- Hero component should accept variants (image-left, image-right, centered, video).
- Section component should accept `id` prop for anchor navigation.
- Card components should be composable (image slot, content slot, action slot).

## Do's

- Use whitespace as a design element — luxury is spacious.
- Show trust indicators (certifications, years of experience, patient count).
- Use high-quality photography from the client's existing WordPress media.
- Maintain visual hierarchy: display → heading → body → caption.

## Don'ts

- Do not use auto-playing video or audio.
- Do not use pop-ups, interstitials, or countdown timers.
- Do not use generic stock photos of doctors with stethoscopes.
- Do not use comic sans, script fonts, or decorative typefaces for body text.

## Future Expansion

- Sticky navigation with scroll-aware background transition.
- Mega menu for services categories.
- Video hero backgrounds with reduced-motion fallback.
- Print stylesheet for blog and service pages.
