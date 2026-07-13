# Coding Standards Skill — Care Well Medical Centre

## When to Use

Apply on every code change to maintain consistency and quality.

## Core Rules

- **Strict TypeScript** — no `any`, no `@ts-ignore` without reason.
- **No inline styles** — Tailwind CSS only.
- **No duplicate code** — extract shared logic.
- **Meaningful naming** — self-documenting code.
- **Clean imports** — organized in 4 groups (React/Next, third-party, internal @/, relative).

## Import Order

```typescript
// 1. React/Next.js
import type { Metadata } from 'next';

// 2. Third-party
import { motion } from 'framer-motion';

// 3. Internal (@/)
import { Container } from '@/components/layout/Container';
import type { Service } from '@/types/service';

// 4. Relative (same feature only)
import { ServiceCard } from './ServiceCard';
```

## Naming

| Entity | Convention | Example |
|--------|------------|---------|
| Components | PascalCase | `ServiceCard.tsx` |
| Hooks | camelCase, use prefix | `useMediaQuery.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types | PascalCase | `Service` |
| Constants | SCREAMING_SNAKE_CASE | `SITE_URL` |
| Files (non-component) | kebab-case | `get-all-services.ts` |

## Do's

- Use `cn()` for conditional classes.
- Use CVA for component variants.
- Validate external data with Zod.
- Keep files under 200 lines.
- Run `npm run lint` and `npm run build` before pushing.

## Don'ts

- Do not use `any` or `@ts-ignore`.
- Do not use inline styles.
- Do not commit commented-out code.
- Do not use relative imports across feature boundaries.
- Do not use `var` — `const` default, `let` when needed.

## Reference

Read `docs/19_CODE_STANDARDS.md` and `docs/21_FOLDER_CONVENTIONS.md`.
