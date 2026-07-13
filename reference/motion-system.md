# Care Well Medical Centre — Motion System

**Document Type:** Permanent Creative Reference  
**Audience:** Designers, frontend developers, AI agents generating UI  
**Library:** Framer Motion (lazy-loaded) + CSS transitions  
**Cross-reference:** `docs/16_ANIMATION_GUIDELINES.md`, `reference/visual-language.md`, `reference/brand.md`

---

## Motion Philosophy

Animation at Care Well Medical Centre exists to **guide attention, confirm interaction, and reveal content** — never to entertain, distract, or impress. Motion communicates the same qualities as the brand: calm, confident, premium, trustworthy.

### Core Principle

> If a patient notices the animation before they notice the content, the animation is too much.

### Motion Personality

| Attribute | Value |
|-----------|-------|
| Speed | Fast but not abrupt (200–500ms) |
| Easing | Ease-out entrances, ease-in exits |
| Distance | Subtle (8–24px translate maximum) |
| Scale | Minimal (1.0–1.02 maximum) |
| Opacity | Primary reveal mechanism (0 → 1) |
| Character | Calm, deliberate, editorial |

---

## When Animation Should Be Used

| Context | Purpose | Method |
|---------|---------|--------|
| Content entering viewport | Draw attention to new section | Scroll-triggered fade + translate |
| Card grid appearing | Sequential reveal, editorial feel | Staggered children |
| Mobile menu open/close | Confirm navigation state change | Slide + opacity |
| Modal/lightbox open | Focus shift to overlay content | Fade overlay + scale content |
| Button hover | Confirm interactivity | Background colour transition (CSS) |
| Form submission | Confirm processing state | Spinner icon |
| Page section load | Prevent jarring pop-in | Skeleton pulse |
| Accordion expand | Show/hide content relationship | Height + opacity |
| Image hover in card | Subtle engagement signal | Scale 1.02 on image only |

---

## When Animation Should NEVER Be Used

| Context | Reason |
|---------|--------|
| Hero headline on initial page load | Delays LCP; content must be immediately visible |
| Navigation links | CSS hover is sufficient |
| Body text paragraphs | Never animate text character-by-character |
| Critical CTAs | "Book consultation" must be instantly visible and clickable |
| Error messages | Must appear immediately, not animated in |
| Form validation errors | Instant feedback required |
| Above-fold images | No fade-in on hero image — hurts perceived performance |
| Pricing or medical information | Factual content must not feel "revealed" theatrically |
| Footer content | Static; no scroll animation needed |
| Autoplay anything | Never auto-animate without user scroll or interaction trigger |

---

## Framer Motion Standards

### Import Strategy

```typescript
// Lazy load on pages that need scroll animation
const AnimatedSection = dynamic(() => import('@/components/shared/AnimatedSection'));
```

### Component Wrapper Pattern

All Framer Motion logic lives in reusable wrappers — never inline `motion.div` scattered across pages.

| Wrapper | Location | Purpose |
|---------|----------|---------|
| `AnimatedSection` | `components/shared/` | Scroll-triggered section reveal |
| `AnimatedGrid` | `components/shared/` | Staggered card grid |
| `FadeIn` | `components/shared/` | Simple opacity fade |
| `AnimatedHero` | `components/shared/` | Hero content only (below-fold elements) |

### Motion Component Rules

- Use `motion.section`, `motion.div` — semantic elements preferred
- Always pair with `useReducedMotion()` hook
- Set `viewport={{ once: true }}` on all scroll triggers
- Never use `animate` on initial server render critical path

---

## Page Transition Rules

### Default: No Page Transitions

Route changes are instant. No full-page fade, slide, or crossfade between pages.

**Rationale:** Healthcare users need fast navigation between services. Page transitions add latency and feel consumer-app, not enterprise.

### Exception (Future, Optional)

If implemented later: opacity-only crossfade, 200ms maximum, disabled on reduced-motion. Requires explicit ADR approval.

---

## Scroll Animation Rules

### Section Reveal (Standard)

```typescript
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};
```

- **Trigger:** Element enters viewport at 20% visibility
- **Once:** `viewport={{ once: true, amount: 0.2 }}`
- **Properties:** opacity + translateY only
- **Distance:** 20px maximum
- **Duration:** 500ms

### Staggered Grid

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};
```

- **Stagger delay:** 80ms between children
- **Max children animated:** 12 per grid (beyond 12, show without stagger)
- **Initial delay:** 100ms after container enters viewport

### Scroll Animation Limits

- Maximum 10–15 animated elements per viewport
- Never animate elements above the fold on initial load
- Sections below fold only — starting from second section on homepage

---

## Hero Animations

### What Animates

| Element | Animates? | Method |
|---------|-----------|--------|
| Hero image | No | Static — immediate LCP |
| Hero headline (h1) | No on load | Immediate visibility |
| Hero subtitle | Optional | Fade in after 200ms delay (below-fold heroes only) |
| Hero CTA button | No on load | Immediate visibility |
| Split hero text column | Optional | Subtle fade + translate, only if hero is below navbar fold |

### Split Hero (Image + Text)

If hero is side-by-side and below initial viewport:
- Text column: fade in, `y: 16`, 400ms
- Image column: static (no animation on image)

**Never:** Ken Burns effect, parallax, zoom on hero image, text character animation.

---

## Navbar Behaviour

### Scroll-Aware Background (Optional)

| Scroll Position | Navbar State |
|----------------|-------------|
| Top of page | `bg-background` transparent or solid |
| Scrolled > 50px | `bg-background/95 border-b border-border` |
| Transition | CSS `transition: background-color 200ms ease` |

No height change on scroll. No hide/show on scroll direction.

### Mobile Menu

**Open:**
```typescript
{ opacity: 0, x: '100%' } → { opacity: 1, x: 0 }
// Duration: 300ms, ease: [0.25, 0.1, 0.25, 1]
```

**Close:** Reverse, 250ms

- Overlay: `bg-background/80` fade
- Panel slides from right
- Focus trap active during open state
- Body scroll locked

### Nav Link Hover

CSS only: `color 150ms ease` — no Framer Motion.

---

## Cards

### Service / Blog / Doctor Card

**Hover (CSS + optional Motion):**
- Border: `border-primary/30`, 200ms ease
- Image scale: `scale(1.02)`, 300ms ease — image only, not card
- Card body: no movement

**Enter (scroll-triggered via AnimatedGrid):**
- Opacity 0 → 1, translateY 16px → 0
- Staggered 80ms per card

**Never:** Card flip, card lift with shadow, 3D tilt, bounce on hover.

---

## Buttons

### All Button States — CSS Transitions Only

| State | Property | Duration |
|-------|----------|----------|
| Hover | `background-color` | 150ms ease |
| Focus | `ring` appearance | instant |
| Active/press | `background-color` darker | 100ms |
| Disabled | `opacity: 0.5` | instant |
| Loading | Spinner `rotate` | 1000ms linear infinite |

**No Framer Motion on buttons.** CSS handles all button interaction.

---

## Images

| Context | Animation |
|---------|-----------|
| Hero image | None — static |
| Card image hover | CSS `transform: scale(1.02)` 300ms |
| Gallery thumbnail hover | CSS opacity + ring |
| Gallery lightbox open | Framer Motion: overlay fade + image scale 0.95 → 1.0, 250ms |
| Gallery lightbox close | Reverse, 200ms |
| Content images (Gutenberg) | None — static |
| Blur placeholder | next/image native blur — not custom animation |

---

## Gallery

### Grid

- Scroll-triggered stagger on thumbnails (optional)
- 80ms stagger, opacity + translateY 12px

### Lightbox Modal

**Open:**
```typescript
overlay: { opacity: [0, 1] } // 200ms
image: { opacity: [0, 1], scale: [0.95, 1] } // 250ms
```

**Close:**
```typescript
overlay: { opacity: [1, 0] } // 150ms
image: { opacity: [1, 0], scale: [1, 0.95] } // 200ms
```

- Close on Escape key
- Close on overlay click
- Focus trap while open
- No swipe animation at launch (future: horizontal slide between images)

---

## Accordion

**Expand/collapse:**
```typescript
{ height: 0, opacity: 0 } → { height: 'auto', opacity: 1 }
// Duration: 250ms, ease: [0.25, 0.1, 0.25, 1]
```

- Animate height + opacity — not rotation of chevron beyond 180°
- Chevron rotation: CSS `transform: rotate(180deg)`, 200ms
- One section open at a time (default) or multiple (if specified)
- Reduced motion: instant expand/collapse, no animation

---

## Modal

**Standard modal (dialog):**
- Overlay: fade 0 → 1, 200ms
- Content: fade + scale 0.95 → 1.0, 250ms
- Close: reverse, 200ms
- Focus trap + Escape to close

**No:** slide-from-bottom (mobile app pattern), bounce spring, blur backdrop animation.

---

## Hover Animations

All hover animations use **CSS transitions** unless specified otherwise.

| Element | Hover Effect | Duration |
|---------|-------------|----------|
| Primary button | `bg-primary/90` | 150ms |
| Secondary button | `bg-primary/5` | 150ms |
| Link | `underline` + `text-primary` | 150ms |
| Card | `border-primary/30` | 200ms |
| Card image | `scale(1.02)` | 300ms |
| Nav link | `text-primary` | 150ms |
| Gallery item | `opacity-90 ring-2 ring-accent` | 200ms |
| Icon button | `bg-muted` | 150ms |

---

## Loading Animations

### Skeleton Pulse

```css
/* Tailwind: animate-pulse on bg-muted elements */
```

- No custom keyframe animations for skeleton
- Pulse matches final element dimensions exactly

### Button Spinner

- Lucide `Loader2` icon with `animate-spin`
- 1000ms linear infinite rotation
- Accompanied by "Sending..." text

### Page Transition Loading

- No spinner in centre of page
- Use `loading.tsx` skeleton layout instead

---

## Skeleton Behaviour

| Component | Skeleton Shape |
|-----------|---------------|
| Hero | Rectangle (16:9) + 3 text lines |
| Service card | Rectangle (4:3) + 2 text lines |
| Blog card | Rectangle (4:3) + 3 text lines |
| Doctor card | Square + 2 text lines |
| Text block | 4 lines varying width (100%, 90%, 80%, 60%) |
| Form | 4 input rectangles + button rectangle |

Skeleton background: `bg-muted`. Animation: `animate-pulse`. No shimmer.

---

## Reduced Motion Accessibility

### Implementation

```typescript
// hooks/useReducedMotion.ts
export function useReducedMotion(): boolean {
  // Returns true when prefers-reduced-motion: reduce is active
}
```

### Behaviour When Reduced Motion Is Active

| Animation | Fallback |
|-----------|----------|
| Scroll reveal | Instant visibility — no translate, no fade |
| Stagger grid | All items visible immediately |
| Mobile menu | Instant show/hide — no slide |
| Modal | Instant show/hide — no scale |
| Accordion | Instant expand/collapse |
| Card hover | Colour change only — no scale |
| Gallery lightbox | Instant show/hide |

### CSS Fallback

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Apply in `globals.css` as safety net. Framer Motion checks hook first.

---

## Animation Tokens

### Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `duration-instant` | 0ms | Reduced motion fallback |
| `duration-fast` | 150ms | Hover states, button transitions |
| `duration-normal` | 250ms | Modals, accordion, menu close |
| `duration-moderate` | 400ms | Card grid item reveal |
| `duration-slow` | 500ms | Section scroll reveal |
| `duration-slower` | 600ms | Maximum allowed — rarely used |

**Never exceed 600ms** for any animation.

### Delay Scale

| Token | Value | Usage |
|-------|-------|-------|
| `delay-none` | 0ms | Default |
| `delay-short` | 100ms | Grid container before children |
| `delay-stagger` | 80ms | Between staggered children |
| `delay-hero` | 200ms | Hero subtitle (if used) |

### Distance Scale

| Token | Value | Usage |
|-------|-------|-------|
| `distance-sm` | 8px | Subtle reveal |
| `distance-md` | 16px | Card item reveal |
| `distance-lg` | 20px | Section reveal |
| `distance-max` | 24px | Absolute maximum translate |

**Never translate more than 24px.**

### Opacity Scale

| Token | Value | Usage |
|-------|-------|-------|
| `opacity-hidden` | 0 | Initial state |
| `opacity-visible` | 1 | Final state |
| `opacity-overlay` | 0.8 | Mobile menu overlay |
| `opacity-hover` | 0.9 | Gallery thumbnail hover |

### Scale Rules

| Token | Value | Usage |
|-------|-------|-------|
| `scale-default` | 1 | Normal state |
| `scale-hover` | 1.02 | Card image hover |
| `scale-modal-in` | 0.95 → 1.0 | Modal entrance |
| `scale-max` | 1.02 | Absolute maximum scale |

**Never scale above 1.02** except modal entrance from 0.95.

---

## Easing Curves

| Token | Value | Usage |
|-------|-------|-------|
| `ease-out` | `[0.25, 0.1, 0.25, 1]` | Entrances (default) |
| `ease-in` | `[0.4, 0, 1, 1]` | Exits |
| `ease-in-out` | `[0.4, 0, 0.2, 1]` | State toggles |
| `ease-linear` | `linear` | Spinner rotation only |

**Never use:** spring physics, bounce easing, elastic easing.

```typescript
// Framer Motion — prohibited
transition: { type: 'spring', bounce: 0.5 } // NEVER
```

---

## Stagger Rules

| Grid Size | Stagger Delay | Max Animated |
|-----------|--------------|--------------|
| 2–4 items | 80ms | All |
| 5–8 items | 80ms | All |
| 9–12 items | 60ms | All |
| 13+ items | No stagger — fade container only | Container opacity only |

Stagger direction: top-left to bottom-right (DOM order).

---

## Performance Guidelines

1. Animate `opacity` and `transform` only — GPU-composited properties.
2. Never animate `width`, `height` (except accordion with `height: auto` technique), `top`, `left`, `margin`, `padding`.
3. Lazy load Framer Motion bundle — not in root layout.
4. Limit to 15 animated elements per viewport.
5. Use `will-change: transform` sparingly — only on actively animating elements.
6. Disable all scroll animations on mobile if frame rate drops (future: performance budget check).
7. Test on mid-range Android device — animation must not cause jank.

---

## Motion Audit Checklist

Before shipping any animated component:

- [ ] Respects `prefers-reduced-motion`
- [ ] Duration ≤ 600ms
- [ ] Translate ≤ 24px
- [ ] Scale ≤ 1.02 (or 0.95→1.0 for modals)
- [ ] No animation on above-fold critical content
- [ ] No spring/bounce/elastic easing
- [ ] CSS used for hover states (not Framer Motion)
- [ ] `viewport={{ once: true }}` on scroll triggers
- [ ] No autoplay or loop
- [ ] Framer Motion lazy-loaded

---

*Motion at Care Well Medical Centre is felt, not seen. When in doubt, remove the animation.*
