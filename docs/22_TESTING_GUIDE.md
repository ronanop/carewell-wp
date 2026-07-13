# Care Well Medical Centre — Testing Guide

## Purpose

Define testing strategy, recommended tools, test categories, and quality gates for the CWMC frontend.

## Responsibilities

Ensure reliability of WordPress data integration, component rendering, form validation, and critical user flows before production deployment.

## Architecture

### Testing Pyramid

```
         ┌─────────┐
         │  E2E    │  Critical user flows (Playwright)
         ├─────────┤
         │ Integr. │  WordPress GraphQL + page rendering
         ├─────────┤
         │  Unit   │  Utilities, mappers, validators, hooks
         └─────────┘
```

### Test Categories

| Category | Scope | Tools | Priority |
|----------|-------|-------|----------|
| Unit | Mappers, validators, utilities, hooks | Vitest | High |
| Integration | GraphQL queries, page data fetching | Vitest + MSW | High |
| Component | UI component rendering, props | Vitest + Testing Library | Medium |
| E2E | Full page flows, navigation, forms | Playwright | Medium |
| Visual | Screenshot comparison | Playwright | Low |
| Accessibility | WCAG compliance | axe-core | High |
| Performance | Core Web Vitals, bundle size | Lighthouse CI | Medium |

### Critical Test Scenarios

1. **Homepage renders** with WordPress data or graceful fallback.
2. **Service listing** displays paginated services from WordPress.
3. **Service detail** renders Gutenberg HTML content correctly.
4. **Blog listing** with pagination works correctly.
5. **Blog detail** renders with author, date, categories, and content.
6. **Contact form** validates with Zod and submits successfully.
7. **404 page** renders for non-existent slugs.
8. **Navigation** links resolve to correct routes.
9. **SEO metadata** generated correctly for all page types.
10. **Images** load from WordPress with proper alt text.

## Best Practices

- Test mappers and validators first — they are the data integrity boundary.
- Mock WordPress GraphQL responses in unit/integration tests — never hit live WP in CI.
- Use MSW (Mock Service Worker) for GraphQL mocking.
- Test accessibility with axe-core in component and E2E tests.
- Run tests in CI on every PR before merge.

## Folder Examples

```
# Future test structure
__tests__/
├── unit/
│   ├── mappers/
│   │   └── map-service.test.ts
│   └── validations/
│       └── contact-form.test.ts
├── integration/
│   └── queries/
│       └── get-all-services.test.ts
└── e2e/
    ├── homepage.spec.ts
    ├── services.spec.ts
    └── contact-form.spec.ts
```

## Naming Conventions

- Test files: `{name}.test.ts` (unit/integration) or `{name}.spec.ts` (E2E).
- Test descriptions: `'should {expected behavior} when {condition}'`.
- Mock data files: `__mocks__/{entity}.ts` (e.g., `__mocks__/service.ts`).

## Production Recommendations

- Set up Vitest and Playwright when implementation phase begins.
- Create WordPress response fixtures from real GraphQL data for consistent mocks.
- Run Lighthouse CI on PR previews with performance budget assertions.
- Test production build (`npm run build`) in CI — catches SSR/SSG errors.
- Include accessibility audit in pre-launch checklist.

## Common Mistakes

- Testing implementation details instead of user-visible behavior.
- Hitting live WordPress in automated tests (flaky, slow, rate-limited).
- Not testing error states (WordPress down, null responses, empty lists).
- Skipping mobile viewport testing in E2E tests.

## Scalability Considerations

- Mock fixtures scale with content model — add fixtures as new types emerge.
- MSW handlers reusable across unit and integration tests.
- Playwright parallel execution scales E2E suite runtime.

## Do's

- Write tests for mappers and Zod validators before page implementation.
- Test error boundaries and fallback UI states.
- Include accessibility assertions in E2E tests.
- Maintain WordPress response fixtures that mirror production schema.

## Don'ts

- Do not test Shadcn UI primitives — they are tested by the library.
- Do not test Next.js framework behavior.
- Do not skip testing form validation edge cases.
- Do not rely solely on manual testing for WordPress integration.

## Future Expansion

- Visual regression testing with Playwright screenshots.
- Contract testing between WordPress schema and TypeScript types.
- Load testing for WordPress GraphQL endpoint.
- Automated sitemap validation post-deployment.
