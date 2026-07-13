# Care Well Medical Centre — Folder Conventions

## Purpose

Define detailed file placement rules, import path conventions, and organizational patterns for maintaining a clean, navigable codebase.

## Responsibilities

Ensure every file has exactly one correct location and every import follows the established alias and boundary rules.

## Architecture

### File Placement Decision Tree

```
Is it a route/page?
  → app/{route}/page.tsx

Is it a Shadcn UI primitive?
  → components/ui/{name}.tsx

Is it a layout element (Navbar, Footer, Container)?
  → components/layout/{Name}.tsx

Is it used by 2+ features?
  → components/shared/{Name}.tsx

Is it specific to one feature/domain?
  → components/features/{domain}/{Name}.tsx

Is it a GraphQL query or WordPress utility?
  → lib/wordpress/queries/ or lib/wordpress/

Is it a Zod schema or form validation?
  → lib/validations/

Is it a React hook?
  → hooks/use{Name}.ts

Is it a TypeScript type/interface?
  → types/{domain}.ts

Is it a static asset?
  → public/{category}/

Is it documentation?
  → docs/

Is it an agent skill?
  → skills/
```

### Import Boundary Rules

| From | Can Import | Cannot Import |
|------|-----------|---------------|
| `app/` | `components/`, `lib/`, `hooks/`, `types/` | Other `app/` routes directly |
| `components/features/` | `components/ui/`, `components/shared/`, `components/layout/`, `lib/`, `hooks/`, `types/` | Other feature folders |
| `components/shared/` | `components/ui/`, `components/layout/`, `lib/`, `hooks/`, `types/` | `components/features/` |
| `components/ui/` | `lib/utils.ts` only | Everything else |
| `lib/` | `types/` | `components/`, `app/`, `hooks/` |
| `hooks/` | `lib/`, `types/` | `components/`, `app/` |

## Best Practices

- Always use `@/` import alias — never relative paths crossing feature boundaries.
- Feature folders are self-contained — no cross-feature imports.
- Shared components earn their place by being used in 2+ features.
- Keep `components/ui/` pristine — Shadcn primitives only, no modifications beyond theming.

## Folder Examples

```
# Correct imports in a feature component
// components/features/services/ServiceCard.tsx
import { Card } from '@/components/ui/card';           // UI primitive
import { Button } from '@/components/ui/button';       // UI primitive
import { cn } from '@/lib/utils';                        // Utility
import type { Service } from '@/types/service';         // Type

# Correct imports in a page
// app/services/page.tsx
import { Container } from '@/components/layout/Container';
import { ServiceCard } from '@/components/features/services/ServiceCard';
import { getAllServices } from '@/lib/wordpress/queries/get-all-services';

# Incorrect — cross-feature import
// components/features/blog/BlogCard.tsx
import { ServiceCard } from '@/components/features/services/ServiceCard';  // WRONG
```

## Naming Conventions

- Directories: kebab-case (`blog/`, `contact-form/`).
- Component files: PascalCase (`ServiceCard.tsx`).
- Non-component files: kebab-case (`get-all-services.ts`, `contact-form.ts`).
- Index files: use sparingly, only for feature barrel exports when justified.

## Production Recommendations

- Enforce import boundaries with ESLint `no-restricted-imports` rule (future).
- Keep directory depth maximum 4 levels from project root.
- Audit `components/shared/` quarterly — promote or demote components as usage changes.

## Common Mistakes

- Placing business logic in `components/ui/`.
- Creating `utils/` at root instead of using `lib/`.
- Cross-feature imports creating coupling between domains.
- Deep relative imports (`../../../lib/utils`) instead of `@/lib/utils`.

## Scalability Considerations

- Feature folders can be extracted to packages if the project grows significantly.
- Import boundaries prevent circular dependencies as codebase grows.
- Clear placement rules enable any developer/agent to locate files instantly.

## Do's

- Follow the file placement decision tree for every new file.
- Use `@/` alias consistently.
- Keep feature folders independent.
- Add new feature folders under `components/features/` as domains emerge.

## Don'ts

- Do not create files at project root (except config files).
- Do not create `src/` directory.
- Do not nest more than 3 levels in `components/`.
- Do not create catch-all `helpers/` or `misc/` folders.

## Future Expansion

- ESLint plugin for enforcing import boundaries.
- Automated architecture tests (dependency-cruiser).
- Monorepo extraction if admin tools are ever needed (not planned).
