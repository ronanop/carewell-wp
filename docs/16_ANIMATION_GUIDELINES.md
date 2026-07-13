# Care Well Medical Centre — Animation Guidelines

## Purpose

Define motion design principles, Framer Motion patterns, and performance-conscious animation standards for the CWMC frontend.

## Responsibilities

- Enhance user experience with purposeful, subtle animations.
- Maintain Editorial Luxury Minimalism — motion should feel refined, not flashy.
- Respect `prefers-reduced-motion` accessibility preference.
- Minimize JavaScript bundle impact from animation libraries.

## Architecture

### Animation Philosophy

Animations in a healthcare context must be:
- **Subtle** — gentle fades and slides, never bouncy or playful.
- **Purposeful** — guide attention, indicate state changes, reveal content.
- **Fast** — durations between 200ms-500ms; never slow or blocking.
- **Accessible** — disabled when `prefers-reduced-motion: reduce` is active.

### Animation Categories

| Category | Duration | Easing | Usage |
|----------|----------|--------|-------|
| Micro-interaction | 150-200ms | ease-out | Button hover, link underline |
| Content reveal | 300-500ms | ease-out | Section scroll-into-view |
| Page transition | 300-400ms | ease-in-out | Route changes (if implemented) |
| Modal enter/exit | 200-300ms | ease-out / ease-in | Dialog open/close |
| Stagger children | 50-100ms delay | ease-out | Card grids, list items |

### Framer Motion Patterns

```typescript
// Reference patterns — do not implement yet

// Scroll-triggered section reveal
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Staggered card grid
const containerVariants = {
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Reduced motion hook usage
const prefersReducedMotion = useReducedMotion();
const animate = prefersReducedMotion ? false : 'visible';
```

## Best Practices

- Lazy load Framer Motion with `next/dynamic` on pages that use scroll animations.
- Use CSS transitions for simple hover/focus states — reserve Framer Motion for complex sequences.
- Always check `prefers-reduced-motion` before applying motion.
- Animate `opacity` and `transform` only — these are GPU-composited properties.
- Never animate `width`, `height`, `top`, `left` — causes layout thrashing.

## Folder Examples

```
hooks/
├── useReducedMotion.ts

components/shared/
├── AnimatedSection.tsx          # Scroll-triggered wrapper
├── AnimatedGrid.tsx             # Staggered grid container
└── FadeIn.tsx                   # Simple fade-in wrapper

components/features/
├── gallery/GalleryLightbox.tsx  # Modal animation
└── layout/MobileMenu.tsx        # Slide-in navigation
```

## Naming Conventions

- Animation wrapper components: `Animated{Element}` (e.g., `AnimatedSection`).
- Variant objects: `{element}Variants` (e.g., `sectionVariants`, `cardVariants`).
- Motion components: `motion.div`, `motion.section` — not custom wrappers unless reusable.

## Production Recommendations

- Limit animated elements to 10-15 per viewport for performance.
- Use `viewport={{ once: true }}` on scroll animations to prevent re-triggering.
- Disable page transition animations on initial load for faster LCP.
- Test animations on low-end mobile devices.

## Common Mistakes

- Animating every element on the page — creates visual noise.
- Using spring animations in a corporate healthcare context.
- Not providing reduced-motion fallback.
- Importing entire `framer-motion` package instead of specific exports.
- Animating above-fold content delaying LCP.

## Scalability Considerations

- Shared animation variants in a constants file prevent duplication.
- `AnimatedSection` wrapper component standardizes scroll reveal across pages.
- CSS `@keyframes` in Tailwind for simple repeating animations (loading spinners).

## Do's

- Use fade-in + subtle upward translate for content reveals.
- Stagger card grid items for elegant sequential appearance.
- Animate mobile menu slide-in from right.
- Use smooth opacity transition for modal overlay.

## Don'ts

- Do not use parallax scrolling — bad for accessibility and performance.
- Do not auto-play looping animations on hero sections.
- Do not use bounce, wiggle, or shake animations.
- Do not animate text character-by-character — inappropriate for healthcare.
- Do not block user interaction during animations.

## Future Expansion

- Page transition animations between routes via layout animation.
- Scroll-linked progress indicators for long blog posts.
- Lottie animations for medical illustrations (if brand requires).
- Gesture-based interactions for gallery swipe on mobile.
