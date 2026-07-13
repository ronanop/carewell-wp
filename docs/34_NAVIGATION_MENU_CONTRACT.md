# Care Well Medical Centre — Navigation Menu Contract

## Purpose

Define how WordPress navigation menus map to the Next.js Navbar and Footer components, including URL transformation, active state detection, and responsive behavior.

## Responsibilities

- Fetch menu structure from WordPress via WPGraphQL.
- Transform WordPress URLs to Next.js routes.
- Support primary navigation and footer navigation menus.
- Handle external links and nested items (future).

## Architecture

```
WordPress Menu (Admin → Appearance → Menus)
  → WPGraphQL menu query
    → lib/wordpress/mappers/map-menu.ts
      → NavigationItem[] typed array
        → Navbar / Footer components
```

---

## WordPress Menu Configuration

### Required Menu Locations

Register and assign in WordPress (verify names in GraphiQL):

| Location Slug | Component | Description |
|--------------|-----------|-------------|
| `PRIMARY` or `primary` | Navbar | Main site navigation |
| `FOOTER` or `footer` | Footer | Footer link columns |

### GraphQL Query Pattern

```graphql
query GetMenu($location: MenuLocationEnum!) {
  menuItems(where: { location: $location }, first: 50) {
    nodes {
      id
      label
      url
      path
      target
      parentId
      cssClasses
      order
    }
  }
}
```

**Note:** Exact query shape must be verified in GraphiQL. WPGraphQL menu API varies by version.

---

## TypeScript Interface

```typescript
// types/navigation.ts
interface NavigationItem {
  id: string;
  label: string;
  href: string;           // Transformed Next.js path
  target?: '_blank' | '_self';
  children?: NavigationItem[];
  isExternal: boolean;
}

interface NavigationMenu {
  items: NavigationItem[];
}
```

---

## URL Transformation Rules

| WordPress URL Pattern | Next.js Route | Rule |
|----------------------|---------------|------|
| `https://cms.domain.com/services/laser/` | `/services/laser` | Strip CMS domain; ensure leading slash |
| `https://www.carewellmedical.com/about/` | `/about` | Strip production domain |
| `/services/laser/` | `/services/laser` | Use as-is with trailing slash removed |
| `https://external.com` | `https://external.com` | Keep external; set `isExternal: true` |
| `#contact` | `#contact` | Anchor links preserved |
| `tel:+91XXXXXXXXXX` | `tel:+91XXXXXXXXXX` | Phone links preserved |

### Transformation Function

```typescript
// lib/wordpress/mappers/map-menu-url.ts
function transformMenuUrl(wpUrl: string, siteUrl: string): { href: string; isExternal: boolean };
```

Rules:
1. If URL host differs from `NEXT_PUBLIC_SITE_URL` and CMS domain → external.
2. Strip trailing slashes from internal paths.
3. Never produce double slashes.
4. Log warnings for unrecognized URL patterns.

---

## Navbar Component Contract

### Location

`components/layout/Navbar.tsx` (Client Component — mobile menu toggle)

### Props

```typescript
interface NavbarProps {
  items: NavigationItem[];
  className?: string;
}
```

### Behavior

| Breakpoint | Behavior |
|-----------|----------|
| `< lg` | Hamburger menu; items in slide-out panel |
| `≥ lg` | Horizontal nav links |

### Active State

Highlight nav item when `pathname` matches `item.href`:

```typescript
const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
```

### Accessibility

- `<nav aria-label="Main navigation">`
- Mobile menu button: `aria-expanded`, `aria-controls="mobile-menu"`
- Current page: `aria-current="page"`

---

## Footer Component Contract

### Props

```typescript
interface FooterProps {
  menuItems: NavigationItem[];
  siteName: string;
  phone: string;
  email: string;
  address: string;
  className?: string;
}
```

### Layout

- 4 columns on desktop: About blurb, Quick Links (menu), Services (static or menu), Contact.
- Stacked on mobile.

---

## Fallback Navigation

If WordPress menu fetch fails, use static fallback defined in `lib/constants/navigation.ts`:

```typescript
export const FALLBACK_NAV_ITEMS: NavigationItem[] = [
  { id: '1', label: 'Home', href: '/', isExternal: false },
  { id: '2', label: 'About', href: '/about', isExternal: false },
  { id: '3', label: 'Services', href: '/services', isExternal: false },
  { id: '4', label: 'Blog', href: '/blogs', isExternal: false },
  { id: '5', label: 'Doctors', href: '/doctors', isExternal: false },
  { id: '6', label: 'Contact', href: '/contact', isExternal: false },
];
```

---

## Data Fetching

- Fetch menus in root layout or Navbar parent Server Component.
- Cache with `revalidate: 3600` and tag `navigation`.
- Pass mapped items as props to Navbar/Footer Client Components.

---

## Do's

- Fetch navigation from WordPress — do not hardcode in production.
- Provide static fallback for degraded mode.
- Open external links in new tab with `rel="noopener noreferrer"`.
- Highlight active route.

## Don'ts

- Do not hardcode menu items as the only source.
- Do not use WordPress absolute URLs directly in `<Link>`.
- Do not fetch menu data client-side.
- Do not nest more than 2 menu levels at launch.

## Future Expansion

- Mega menu for service categories.
- Nested dropdown navigation on desktop.
- Separate mobile-specific menu location.
