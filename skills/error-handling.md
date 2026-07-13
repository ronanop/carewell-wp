# Error Handling Skill — Care Well Medical Centre

## When to Use

Apply when implementing error boundaries, GraphQL error handling, fallback UI, or degraded mode behavior.

## Core Rules

- **null slug response** → `notFound()` (404 page)
- **GraphQL failure** → throw typed error → `error.tsx` with retry
- **Never expose** stack traces, GraphQL URLs, or env vars to users
- **Log server-side** with context; never log secrets or PII
- **Retry once** on transient GraphQL failures (timeout, 5xx)

## File Placement

```
app/error.tsx              # Root error boundary
app/global-error.tsx       # Layout catastrophic failure
app/{route}/error.tsx      # Route-specific errors
```

## Error Component Pattern

```typescript
'use client';
// Display friendly message + reset() retry button
```

## Degraded Mode

- Use static fallback contact info from `lib/constants/fallbacks.ts`
- Serve cached ISR content when available
- Show empty state with message when no cache

## User Messages

- WordPress down: "We're having trouble loading this content. Please try again."
- Form failure: "Your message could not be sent. Please try again or call us."

## Do's

- Implement `error.tsx` for every WordPress data route.
- Provide `reset()` retry in error boundaries.
- Keep contact info visible on error pages.

## Don'ts

- Do not use error boundary for missing content — use `notFound()`.
- Do not silently swallow GraphQL errors.
- Do not retry indefinitely.

## Reference

Read `docs/29_ERROR_HANDLING_RESILIENCE.md`.
