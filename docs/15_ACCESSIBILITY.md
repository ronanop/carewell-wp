# Care Well Medical Centre — Accessibility

## Purpose

Ensure the CWMC website meets WCAG 2.1 Level AA standards, providing an inclusive experience for all users including those using assistive technologies.

## Responsibilities

- WCAG 2.1 AA compliance across all pages and components.
- Semantic HTML structure on every page.
- Keyboard navigation for all interactive elements.
- Screen reader compatibility.
- Reduced motion support for vestibular disorders.

## Architecture

### WCAG AA Requirements

| Principle | Requirement | Implementation |
|-----------|------------|----------------|
| Perceivable | Text contrast 4.5:1 (normal), 3:1 (large) | Design system color tokens |
| Perceivable | Alt text on all images | WordPress altText field → next/image alt |
| Perceivable | Captions for video | YouTube embed captions |
| Operable | Keyboard accessible | Focus management, tab order |
| Operable | Skip navigation link | Root layout skip-to-content |
| Operable | No keyboard traps | Modal focus trap with escape |
| Understandable | Consistent navigation | Shared Navbar/Footer |
| Understandable | Form labels and errors | React Hook Form + aria-describedby |
| Robust | Valid HTML | Semantic elements, ARIA where needed |

### Semantic HTML Structure

```html
<body>
  <a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>
  <header>
    <nav aria-label="Main navigation"><!-- Navbar --></nav>
  </header>
  <main id="main-content">
    <article><!-- Page content --></article>
  </main>
  <footer><!-- Footer --></footer>
</body>
```

### ARIA Patterns

| Component | ARIA Pattern |
|-----------|-------------|
| Navbar mobile menu | `aria-expanded`, `aria-controls`, `role="dialog"` |
| Accordion | `aria-expanded`, `aria-controls`, `role="region"` |
| Tabs | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected` |
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Pagination | `aria-label="Pagination"`, `aria-current="page"` |
| Breadcrumb | `aria-label="Breadcrumb"`, `nav` element |
| Form errors | `aria-invalid="true"`, `aria-describedby="{id}-error"` |
| Loading states | `aria-live="polite"`, `aria-busy="true"` |

## Best Practices

- Use semantic HTML first; add ARIA only when semantics are insufficient.
- All interactive elements must be reachable and operable via keyboard.
- Focus indicators must be visible (use `--ring` design token, never `outline: none` without replacement).
- Form inputs must have associated `<label>` elements, not just placeholders.
- Color must not be the sole means of conveying information.
- Test with screen readers (NVDA, VoiceOver) during development.

## Folder Examples

```
hooks/
├── useReducedMotion.ts        # prefers-reduced-motion media query
components/shared/
├── SkipToContent.tsx          # Skip navigation link
components/ui/
├── button.tsx                 # Shadcn with focus-visible styles
├── dialog.tsx                 # Modal with focus trap
```

## Naming Conventions

- ARIA labels: descriptive, concise (`aria-label="Open navigation menu"`).
- ID references: `{component}-{purpose}` (e.g., `contact-email-error`).
- Screen reader only class: `sr-only` (Tailwind utility).

## Production Recommendations

- Run axe-core or Lighthouse accessibility audit on every page before launch.
- Test keyboard navigation flow on all pages.
- Verify color contrast with automated tools (e.g., Stark, axe).
- Ensure all WordPress images have alt text populated.
- Test at 200% browser zoom — content must remain usable.

## Common Mistakes

- Using `<div onClick>` instead of `<button>` for interactive elements.
- Missing alt text on decorative vs informative images distinction.
- Removing focus outlines without providing alternative focus indicators.
- Auto-playing animations without reduced-motion fallback.
- Form placeholders used as sole labels.

## Scalability Considerations

- Shadcn UI components include baseline accessibility patterns.
- Shared accessibility hooks (`useReducedMotion`) apply globally.
- ARIA patterns documented here apply to all future components.

## Do's

- Include skip-to-content link in root layout.
- Use heading hierarchy correctly (h1 → h2 → h3, no skipping).
- Provide text alternatives for all non-text content.
- Support `prefers-reduced-motion` for all Framer Motion animations.
- Announce dynamic content changes with `aria-live` regions.

## Don'ts

- Do not use `tabindex` values greater than 0.
- Do not trap keyboard focus without providing escape mechanism.
- Do not rely on hover-only interactions for critical functionality.
- Do not use `<table>` for layout purposes.
- Do not disable browser zoom (`user-scalable=no`).

## Future Expansion

- WCAG 2.2 AAA compliance for critical patient-facing forms.
- High contrast mode support via CSS media query.
- Accessibility statement page.
- Automated accessibility testing in CI (axe-core, pa11y).
- User-adjustable font size controls.
