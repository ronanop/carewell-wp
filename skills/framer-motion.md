# Framer Motion Skill — Care Well Medical Centre

## When to Use

Apply when adding animations, transitions, or scroll-triggered effects.

## Core Rules

- Animations must be **subtle, purposeful, and fast** (200-500ms).
- Always check **`prefers-reduced-motion`** via `useReducedMotion` hook.
- Lazy load Framer Motion with **`next/dynamic`** on pages that need it.
- Animate **`opacity` and `transform` only** — GPU-composited properties.
- Use **CSS transitions** for simple hover/focus — reserve Framer Motion for complex sequences.

## Animation Standards

| Type | Duration | Usage |
|------|----------|-------|
| Micro-interaction | 150-200ms | Button hover, link underline |
| Content reveal | 300-500ms | Scroll-into-view sections |
| Modal | 200-300ms | Dialog enter/exit |
| Stagger | 50-100ms delay | Card grids |

## Patterns

```typescript
// Scroll reveal with reduced motion support
const prefersReducedMotion = useReducedMotion();
<motion.section
  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
/>
```

## Do's

- Use `viewport={{ once: true }}` on scroll animations.
- Wrap reusable animation logic in `AnimatedSection` component.
- Limit animated elements to 10-15 per viewport.

## Don'ts

- Do not use bounce, wiggle, or parallax effects.
- Do not auto-play looping animations.
- Do not animate above-fold content (delays LCP).
- Do not block user interaction during animations.

## Reference

Read `docs/16_ANIMATION_GUIDELINES.md`.
