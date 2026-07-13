# Care Well Medical Centre — Responsive Guidelines

## Purpose

Define breakpoint strategy, responsive layout patterns, and mobile-first design rules for the CWMC frontend across all device sizes.

## Responsibilities

- Mobile-first responsive design on all pages and components.
- Consistent behavior across phone, tablet, and desktop viewports.
- Touch-friendly interactive targets on mobile devices.
- Optimized content hierarchy per breakpoint.

## Architecture

### Breakpoint System

Using Tailwind CSS default breakpoints:

| Token | Min Width | Target Devices |
|-------|-----------|---------------|
| Default | 0px | Mobile phones (320px-639px) |
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets (portrait) |
| `lg` | 1024px | Tablets (landscape), small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### Layout Behavior by Breakpoint

| Element | Mobile | Tablet (md) | Desktop (lg+) |
|---------|--------|-------------|---------------|
| Container padding | `px-4` | `px-6` | `px-8` |
| Section padding Y | `py-16` | `py-20` | `py-28` |
| Grid columns | 1 | 2 | 3-4 |
| Navbar | Hamburger menu | Hamburger menu | Full horizontal nav |
| Hero layout | Stacked (text above image) | Stacked | Side-by-side |
| Typography scale | Reduced (-1 step) | Standard | Standard |
| Footer | Stacked columns | 2 columns | 4 columns |

### Mobile-First Pattern

```html
<!-- Mobile first: base styles for mobile, add complexity at larger breakpoints -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
  <!-- Cards -->
</div>

<h1 class="text-3xl md:text-4xl lg:text-5xl font-light">
  Page Title
</h1>
```

## Best Practices

- Design mobile layout first; enhance for larger screens.
- Use `clamp()` or responsive Tailwind text utilities for fluid typography.
- Navigation collapses to hamburger menu below `lg` breakpoint.
- Images use responsive `sizes` attribute with `next/image`.
- Touch targets minimum 44x44px on mobile (48x48px recommended).
- Test on real devices, not just browser DevTools.

## Folder Examples

```
hooks/
├── useMediaQuery.ts           # Breakpoint detection hook

components/layout/
├── Navbar.tsx                 # Responsive nav with mobile menu
├── Container.tsx              # Responsive padding
└── Section.tsx                # Responsive vertical spacing
```

## Naming Conventions

- Responsive classes: mobile-first order (`text-sm md:text-base lg:text-lg`).
- Breakpoint hook: `useMediaQuery('(min-width: 1024px)')`.
- Mobile menu component: `MobileMenu.tsx` or inline in Navbar.

## Production Recommendations

- Test at 320px (iPhone SE), 375px (iPhone), 768px (iPad), 1024px, 1440px.
- Use Chrome DevTools device emulation for initial testing.
- Verify no horizontal scroll at any breakpoint.
- Ensure forms are usable on mobile with appropriate input types (`tel`, `email`).
- Test landscape orientation on mobile devices.

## Common Mistakes

- Desktop-first design requiring `@media (max-width:)` overrides.
- Hidden content on mobile that should be accessible (use reorder, not hide).
- Fixed-width elements causing horizontal overflow on small screens.
- Tiny touch targets on mobile navigation and form buttons.
- Not testing with mobile browser chrome (address bar affects viewport).

## Scalability Considerations

- Container and Section components centralize responsive spacing.
- Grid system scales from 1 to 4 columns without component changes.
- Responsive image `sizes` prevent over-serving large images to mobile.

## Do's

- Use CSS Grid and Flexbox for responsive layouts — never float-based.
- Stack hero content vertically on mobile; side-by-side on desktop.
- Make phone number and CTA buttons prominent on mobile.
- Use responsive typography that scales smoothly across breakpoints.

## Don'ts

- Do not hide critical content on mobile (contact info, CTAs).
- Do not use separate mobile and desktop components for the same content.
- Do not rely on hover interactions for mobile-critical functionality.
- Do not use viewport units (`vh`) without fallback for mobile browser chrome.

## Future Expansion

- Container queries for component-level responsiveness.
- Responsive image art direction (different crops per breakpoint).
- Adaptive loading based on network speed (`navigator.connection`).
- Print stylesheet for blog and service content.
