# Accessibility Skill — Care Well Medical Centre

## When to Use

Apply when building components, forms, navigation, or any user-facing interface element.

## Core Rules

- Target **WCAG 2.1 Level AA** compliance on all pages.
- Use **semantic HTML** first; ARIA only when semantics are insufficient.
- All interactive elements must be **keyboard accessible**.
- **Focus indicators** must be visible — use `--ring` token, never remove outlines without replacement.
- Support **`prefers-reduced-motion`** for all animations.
- Form inputs must have associated `<label>` elements.

## Required Patterns

- Skip-to-content link in root layout.
- One `<h1>` per page; correct heading hierarchy (no skipping levels).
- Alt text on all images from WordPress `altText` field.
- ARIA on interactive components: accordion, tabs, modal, pagination, mobile menu.
- Form errors linked via `aria-describedby` and `aria-invalid`.

## ARIA Quick Reference

| Component | Key ARIA |
|-----------|----------|
| Mobile menu | `aria-expanded`, `aria-controls` |
| Modal | `role="dialog"`, `aria-modal="true"` |
| Accordion | `aria-expanded`, `aria-controls` |
| Tabs | `role="tablist"`, `aria-selected` |
| Pagination | `aria-current="page"` |

## Do's

- Test with keyboard-only navigation.
- Use Shadcn UI components (baseline accessibility built-in).
- Provide text alternatives for non-text content.
- Ensure 4.5:1 contrast ratio for normal text.

## Don'ts

- Do not use `<div onClick>` — use `<button>`.
- Do not use color alone to convey information.
- Do not use `tabindex` > 0.
- Do not auto-play media without controls.

## Reference

Read `docs/15_ACCESSIBILITY.md`.
