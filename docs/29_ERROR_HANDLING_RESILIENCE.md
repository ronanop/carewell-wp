# Care Well Medical Centre — Error Handling & Resilience

## Purpose

Define error handling patterns, fallback UI, degraded mode behavior, and resilience strategies when WordPress or external services are unavailable.

## Responsibilities

- Graceful degradation when WordPress GraphQL fails.
- Consistent error boundaries at route and layout levels.
- User-friendly error messages without exposing system details.
- Server-side error logging for operations debugging.

## Architecture

### Error Handling Layers

```
Layer 1: GraphQL Fetcher (lib/wordpress/queries/)
  → try/catch, typed errors, retry (1x transient)

Layer 2: Page Component (app/**/page.tsx)
  → notFound() for missing content
  → error.tsx for unhandled failures

Layer 3: Route Error Boundary (app/**/error.tsx)
  → User-friendly fallback with retry

Layer 4: Root Error Boundary (app/global-error.tsx)
  → Catastrophic failure fallback

Layer 5: Degraded Mode
  → Static fallback content when WordPress unavailable
```

---

## GraphQL Error Handling

### Fetcher Pattern

```typescript
// Reference pattern for lib/wordpress/queries/
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const data = await wpClient.request(GET_SERVICE_BY_SLUG_QUERY, { slug });
    if (!data?.service) return null;
    return mapService(data.service);
  } catch (error) {
    console.error('[GraphQL] getServiceBySlug failed', { slug, error });
    throw new WordPressFetchError('Failed to fetch service', { slug, cause: error });
  }
}
```

### Error Types

| Error Class | When | Page Behavior |
|------------|------|---------------|
| `null` response | Content deleted or slug not found | `notFound()` → 404 page |
| `WordPressFetchError` | GraphQL network/timeout failure | `error.tsx` with retry |
| `WordPressParseError` | Mapper validation failure | `error.tsx` with retry |
| Unknown error | Unexpected failure | `error.tsx` with retry |

### Retry Policy

- Retry once on network timeout or 5xx response.
- No retry on 4xx (bad query, auth failure).
- Timeout: 10 seconds per GraphQL request.

---

## Route Error Boundaries

### File Placement

```
app/
├── error.tsx                  # Root-level error boundary
├── global-error.tsx           # Catastrophic (layout failure)
├── services/
│   ├── error.tsx              # Services section errors
│   └── [slug]/error.tsx       # Service detail errors
└── blogs/
    ├── error.tsx
    └── [slug]/error.tsx
```

### Error Component Contract

```typescript
'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Must: display user-friendly message, offer retry via reset()
// Must not: expose stack traces, GraphQL URLs, or env vars
```

### User-Facing Messages

| Scenario | Message |
|----------|---------|
| WordPress unavailable | "We're having trouble loading this content. Please try again." |
| Content not found | 404 page (not error boundary) |
| Form submission failed | "Your message could not be sent. Please try again or call us directly." |

---

## Degraded Mode

When WordPress is entirely unavailable at build or request time:

| Page | Degraded Behavior |
|------|------------------|
| Homepage | Render layout with static fallback hero; hide dynamic sections |
| About/Contact | Serve last cached ISR version if available |
| Services/Blogs listing | Show cached version or empty state with message |
| Service/Blog detail | `error.tsx` with retry if no cache |
| 404 | Always static — unaffected |

### Static Fallback Constants

Define in `lib/constants/fallbacks.ts`:

- `FALLBACK_SITE_NAME`: "Care Well Medical Centre"
- `FALLBACK_PHONE`: Business phone number
- `FALLBACK_EMAIL`: Contact email
- `FALLBACK_ADDRESS`: Physical address

Use in Footer and error pages so contact info is always available.

---

## Loading States

| Route Segment | Loading UI |
|--------------|------------|
| Data-fetching pages | `loading.tsx` with skeleton matching final layout |
| Client interactions | Inline spinner on button (form submit) |
| Images | `next/image` blur placeholder |

Skeleton components must match final content dimensions to prevent CLS.

---

## Form Error Handling

See `31_FORMS_ARCHITECTURE.md` for contact form specifics.

- Client: React Hook Form field-level errors.
- Server: Zod validation errors mapped to fields.
- Submission failure: toast or inline error with retry.

---

## Logging

### Server-Side (Production)

Log with context, never log secrets:

```typescript
console.error('[GraphQL]', { query: 'getAllServices', duration, status, error: message });
```

### Do Not Log

- `WORDPRESS_GRAPHQL_URL` with credentials
- Full GraphQL query variables containing PII
- User form submission content in production logs

### Future: Structured Logging

- Vercel Log Drain or external service (Datadog, Axiom).
- Error tracking via Sentry (future ADR required).

---

## Monitoring Alerts

| Condition | Alert |
|-----------|-------|
| GraphQL error rate > 5% over 5 min | Pager/email ops |
| Build failure on main branch | CI notification |
| 5xx rate on Vercel > 1% | Uptime monitor |

See `32_OBSERVABILITY_MONITORING.md`.

---

## Do's

- Call `notFound()` for missing slugs — not error boundaries.
- Implement `error.tsx` for every route segment that fetches WordPress data.
- Provide retry via `reset()` in error boundaries.
- Keep contact information visible on error pages.

## Don'ts

- Do not expose GraphQL errors or stack traces to users.
- Do not silently swallow errors — always log server-side.
- Do not return empty pages without explanation when fetch fails.
- Do not retry indefinitely on GraphQL failures.

## Future Expansion

- Circuit breaker pattern for WordPress GraphQL.
- Stale-while-revalidate with explicit "content may be outdated" banner.
- Sentry integration for client and server errors.
