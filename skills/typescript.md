# TypeScript Skill — Care Well Medical Centre

## When to Use

Apply when writing TypeScript types, interfaces, mappers, validators, or any `.ts`/`.tsx` file.

## Core Rules

- **Strict mode** — never disable strict checks.
- **No `any`** — use `unknown` with type guards when uncertain.
- **Interface over type** for object shapes.
- **No enum** — use `as const` objects or union types.
- **Explicit return types** on exported functions.
- **No `@ts-ignore`** without documented justification.

## Type Organization

```
types/
├── wordpress.ts     # Shared: FeaturedImage, SeoMetadata, Author, Category, PageInfo
├── service.ts       # Service interface
├── blog.ts          # BlogPost interface
├── doctor.ts        # Doctor interface
└── navigation.ts    # Menu, MenuItem interfaces
```

## Patterns

```typescript
// Interface for component props
interface ServiceCardProps {
  service: Service;
  className?: string;
}

// Const assertion instead of enum
const ROUTES = {
  home: '/',
  services: '/services',
  blogs: '/blogs',
} as const;

// Type guard
function isService(data: unknown): data is Service {
  return typeof data === 'object' && data !== null && 'slug' in data;
}

// Mapper function
function mapService(raw: WpServiceResponse): Service {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    // ...
  };
}
```

## Do's

- Define types before writing mappers or components.
- Use strict null checks — WordPress fields are frequently optional.
- Validate external data with Zod at system boundaries.
- Export types alongside components for external use.

## Don'ts

- Do not use `any` to silence errors.
- Do not use type assertions (`as Service`) without validation.
- Do not duplicate type definitions — import from `types/`.

## Reference

Read `docs/12_CONTENT_MODEL.md` and `docs/19_CODE_STANDARDS.md`.
