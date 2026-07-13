# Care Well Medical Centre — Component API Contracts

## Purpose

Define formal prop interfaces, behavior contracts, and composition rules for every planned component. This document is the frontend contract layer between design system and implementation.

## Responsibilities

- Specify exact props for each component before implementation.
- Define Server vs Client classification.
- Document variant options, default values, and accessibility requirements.
- Prevent prop explosion through consistent patterns.

---

## Global Component Conventions

All components unless noted:

- Accept optional `className?: string` for Tailwind composition.
- Use `cn()` for class merging.
- Export `{ComponentName}Props` interface.
- Use semantic HTML elements.
- Support ref forwarding on interactive primitives.

---

## Layout Components

### Container

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Content |
| `className` | `string` | — | Additional classes |
| `as` | `'div' \| 'section' \| 'main'` | `'div'` | HTML element |

**Type:** Server Component  
**Renders:** `max-w-7xl mx-auto px-4 md:px-6 lg:px-8`

### Section

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Content |
| `className` | `string` | — | Additional classes |
| `variant` | `'default' \| 'secondary' \| 'accent'` | `'default'` | Background variant |
| `id` | `string` | — | Anchor ID |
| `padding` | `'sm' \| 'md' \| 'lg'` | `'md'` | Vertical padding scale |

**Type:** Server Component  
**Renders:** `<section>` with `py-16 md:py-20 lg:py-28`

### SectionHeader

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `overline` | `string` | — | Small caps label above title |
| `title` | `string` | required | Section heading |
| `description` | `string` | — | Subtitle paragraph |
| `align` | `'left' \| 'center'` | `'left'` | Text alignment |
| `className` | `string` | — | Additional classes |

**Type:** Server Component

### Navbar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `NavigationItem[]` | required | Menu items from WordPress |
| `className` | `string` | — | Additional classes |

**Type:** Client Component (mobile menu state)  
**Accessibility:** `aria-expanded`, `aria-controls`, focus trap in mobile menu

### Footer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `menuItems` | `NavigationItem[]` | required | Footer links |
| `siteName` | `string` | required | Business name |
| `phone` | `string` | required | Contact phone |
| `email` | `string` | required | Contact email |
| `address` | `string` | required | Physical address |
| `className` | `string` | — | Additional classes |

**Type:** Server Component

---

## Shared Components

### Hero

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Main headline |
| `subtitle` | `string` | — | Supporting text |
| `cta` | `{ label: string; href: string }` | — | Primary CTA |
| `image` | `FeaturedImage \| null` | — | Hero image |
| `variant` | `'centered' \| 'split-left' \| 'split-right'` | `'centered'` | Layout variant |
| `className` | `string` | — | Additional classes |

**Type:** Server Component

### Heading

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `'h1' \| 'h2' \| 'h3' \| 'h4'` | `'h2'` | Semantic level |
| `size` | `'display-xl' \| 'display-lg' \| 'heading-1' \| ...` | matches `as` | Visual size override |
| `children` | `ReactNode` | required | Text content |
| `className` | `string` | — | Additional classes |

**Type:** Server Component

### Typography

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'body' \| 'body-lg' \| 'body-sm' \| 'lead' \| 'caption' \| 'overline'` | `'body'` | Text style |
| `as` | `'p' \| 'span' \| 'div'` | `'p'` | HTML element |
| `children` | `ReactNode` | required | Text content |
| `className` | `string` | — | Additional classes |

**Type:** Server Component

### CTA

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | CTA headline |
| `description` | `string` | — | Supporting text |
| `button` | `{ label: string; href: string; variant?: ButtonVariant }` | required | Action button |
| `variant` | `'default' \| 'secondary'` | `'default'` | Section style |
| `className` | `string` | — | Additional classes |

**Type:** Server Component

### Breadcrumb

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `{ label: string; href?: string }[]` | required | Trail items (last = current) |
| `className` | `string` | — | Additional classes |

**Type:** Server Component  
**Accessibility:** `<nav aria-label="Breadcrumb">`, `aria-current="page"` on last item

### ContentRenderer

See `28_GUTENBERG_RENDERING_CONTRACT.md` for full contract.

### Pagination

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | required | Active page (1-indexed) |
| `totalPages` | `number` | required | Total page count |
| `basePath` | `string` | required | e.g., `/blogs` |
| `className` | `string` | — | Additional classes |

**Type:** Client Component  
**Accessibility:** `aria-label="Pagination"`, `aria-current="page"`

---

## Feature Components

### ServiceCard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `service` | `Pick<Service, 'slug' \| 'title' \| 'excerpt' \| 'featuredImage'>` | required | Service data |
| `className` | `string` | — | Additional classes |

**Type:** Server Component  
**Renders:** Link to `/services/{slug}` wrapping Card with image, title, excerpt

### BlogCard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `post` | `Pick<BlogPost, 'slug' \| 'title' \| 'excerpt' \| 'featuredImage' \| 'date' \| 'categories'>` | required | Post data |
| `className` | `string` | — | Additional classes |

**Type:** Server Component  
**Renders:** Link to `/blogs/{slug}`

### DoctorCard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `doctor` | `Pick<Doctor, 'slug' \| 'name' \| 'title' \| 'specialty' \| 'featuredImage'>` | required | Doctor data |
| `className` | `string` | — | Additional classes |

**Type:** Server Component

### Gallery

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `{ src: string; alt: string; width: number; height: number }[]` | required | Gallery images |
| `columns` | `2 \| 3 \| 4` | `3` | Grid columns on desktop |
| `className` | `string` | — | Additional classes |

**Type:** Client Component (lightbox interaction)

### ContactForm

See `31_FORMS_ARCHITECTURE.md` for full contract.

---

## UI Primitives (Shadcn)

Added via `npx shadcn@latest add {component}`. Follow Shadcn API with project design tokens.

| Component | Key Variants |
|-----------|-------------|
| Button | `default`, `secondary`, `outline`, `ghost`, `link` |
| Card | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| Input | Standard text input with focus ring |
| Textarea | Multi-line input |
| Accordion | Single/multiple expand |
| Tabs | Horizontal tab navigation |
| Dialog | Modal overlay |

---

## Composition Example

```tsx
// app/services/page.tsx — reference pattern
<Section variant="default">
  <Container>
    <SectionHeader
      overline="Our Services"
      title="Treatments & Procedures"
      description="Comprehensive care tailored to your needs."
    />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  </Container>
</Section>
```

---

## Do's

- Implement props exactly as specified.
- Use `Pick<>` for card data props to avoid over-fetching.
- Document any prop changes in this file before implementation.

## Don'ts

- Do not add business logic props to UI primitives.
- Do not pass raw GraphQL responses to feature components — use mapped types.
- Do not create components without defined props interface.

## Future Expansion

- Storybook stories generated from these contracts.
- Automated prop validation tests.
