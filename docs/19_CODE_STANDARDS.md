# Care Well Medical Centre — Code Standards

## Purpose

Establish TypeScript, React, and project-wide coding conventions that ensure consistency, maintainability, and quality across the CWMC codebase.

## Responsibilities

Every contributor and AI agent must follow these standards without exception.

## Architecture

### TypeScript Rules

- **Strict mode enabled** — `"strict": true` in `tsconfig.json`.
- **No `any` type** — use `unknown` with type guards when type is uncertain.
- **Explicit return types** on exported functions and component props.
- **Interface over type** for object shapes; `type` for unions and intersections.
- **No enum** — use `as const` objects or union types instead.

```typescript
// Preferred patterns

interface ServiceCardProps {
  service: Service;
  className?: string;
}

const SERVICE_CATEGORIES = {
  dermatology: 'Dermatology',
  cosmetology: 'Cosmetology',
  dental: 'Dental',
} as const;

type ServiceCategory = keyof typeof SERVICE_CATEGORIES;
```

### React Rules

- Functional components only — no class components.
- Server Components by default; `"use client"` directive only when required.
- Props destructuring in function signature.
- No default exports for utilities; default exports for page and feature components.
- Composition over inheritance — build complex UIs from simple components.

### Import Organization

```typescript
// 1. React/Next.js
import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// 2. Third-party libraries
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

// 3. Internal absolute imports (@/)
import { Container } from '@/components/layout/Container';
import { getAllServices } from '@/lib/wordpress/queries/get-all-services';
import type { Service } from '@/types/service';

// 4. Relative imports (same feature only)
import { ServiceCard } from './ServiceCard';
```

### File Structure Rules

- One component per file.
- Co-locate component-specific types in the same file or dedicated `types/` file.
- Maximum file length: 200 lines (split if exceeded).
- No inline styles — Tailwind CSS classes only.

## Best Practices

- Use `cn()` utility from `lib/utils.ts` for conditional class merging.
- Use CVA for component variants instead of manual class string concatenation.
- Validate external data with Zod schemas at system boundaries (WordPress responses, form inputs).
- Use meaningful variable names — no single-letter variables except loop indices.
- Early returns over nested conditionals.

## Folder Examples

```
lib/utils.ts                   # cn() helper
lib/validations/contact-form.ts  # Zod schemas
types/service.ts               # Domain interfaces
components/features/services/ServiceCard.tsx  # Feature component
```

## Naming Conventions

| Entity | Convention | Example |
|--------|------------|---------|
| Components | PascalCase | `ServiceCard.tsx` |
| Hooks | camelCase, `use` prefix | `useMediaQuery.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types/Interfaces | PascalCase | `Service`, `BlogPost` |
| Constants | SCREAMING_SNAKE_CASE | `SITE_URL`, `REVALIDATE_TIME` |
| GraphQL queries | SCREAMING_SNAKE_CASE | `GET_ALL_SERVICES_QUERY` |
| CSS variables | kebab-case | `--primary-foreground` |
| Files (non-component) | kebab-case | `get-all-services.ts` |

## Production Recommendations

- Enable ESLint with `eslint-config-next` — no custom rule overrides without justification.
- Run `npm run lint` before every commit.
- Run `npm run build` to catch type errors before pushing.
- Use `@/` import alias for all internal imports — no relative `../../` paths across feature boundaries.

## Common Mistakes

- Using `any` to silence TypeScript errors instead of proper typing.
- Importing entire libraries (`import _ from 'lodash'`) instead of specific functions.
- Mixing Server and Client Component concerns in one file.
- Creating utility functions that duplicate existing `lib/utils.ts` or Shadcn patterns.
- Using `console.log` in production code — use structured logging or remove.

## Scalability Considerations

- Strict TypeScript catches breaking changes at compile time.
- Consistent import organization makes code reviews faster.
- Feature-based folder structure scales with team size.
- Zod validation at boundaries prevents runtime errors from WordPress schema changes.

## Do's

- Write self-documenting code with clear naming.
- Extract reusable logic into hooks or utility functions.
- Use TypeScript discriminated unions for component variants.
- Keep components focused — single responsibility.

## Don'ts

- Do not use `// @ts-ignore` or `// @ts-expect-error` without documented reason.
- Do not use inline styles (`style={{}}`).
- Do not duplicate code — extract shared logic.
- Do not use `var` — `const` by default, `let` when reassignment needed.
- Do not commit commented-out code.

## Future Expansion

- Prettier for automated formatting.
- Husky pre-commit hooks for lint and type check.
- Custom ESLint rules for project-specific patterns.
- Automated code review with Cursor Bugbot.
