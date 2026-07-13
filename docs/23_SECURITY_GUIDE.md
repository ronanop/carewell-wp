# Care Well Medical Centre — Security Guide

## Purpose

Define security practices for the CWMC headless frontend, covering data protection, environment security, WordPress hardening, and deployment security.

## Responsibilities

Protect patient-facing data, prevent common web vulnerabilities, and secure the integration between Next.js and WordPress.

## Architecture

### Security Boundaries

```
Public Internet
  ↓
Cloudflare (DDoS, WAF, SSL)
  ↓
Vercel (Serverless, env secrets)
  ↓
Next.js Server Components (read-only WordPress fetch)
  ↓
WPGraphQL (read-only, authenticated optional)
  ↓
WordPress Admin (restricted access, separate auth)
```

### Threat Model

| Threat | Mitigation |
|--------|-----------|
| XSS via WordPress HTML | Sanitize Gutenberg HTML in ContentRenderer |
| CSRF on contact form | Server-side form handling with token validation |
| Environment secret exposure | Server-only env vars, never `NEXT_PUBLIC_` for secrets |
| WordPress admin compromise | Separate admin URL, 2FA, IP restriction |
| DDoS | Cloudflare protection |
| GraphQL introspection abuse | Disable introspection in production WordPress |
| Dependency vulnerabilities | Regular `npm audit`, automated scanning |
| Clickjacking | `X-Frame-Options: DENY` header |

## Best Practices

### Environment Security

- `WORDPRESS_GRAPHQL_URL` — server-side only (no `NEXT_PUBLIC_` prefix).
- `REVALIDATION_SECRET` — server-side only; validate on revalidation endpoint.
- Never commit `.env.local`, `.env.production`, or any file containing secrets.
- Provide `.env.example` with variable names only.

### WordPress HTML Sanitization

```typescript
// ContentRenderer must sanitize WordPress HTML
// Strip <script>, <iframe> (except trusted YouTube), event handlers
// Use a sanitization library (isomorphic-dompurify or similar) when implementing
```

### HTTP Security Headers

Configure in `next.config.ts` or `vercel.json`:

| Header | Value |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |

### Form Security

- Validate all inputs server-side with Zod (client validation is UX, not security).
- Implement honeypot field on contact form for bot prevention.
- Rate limit form submissions via Cloudflare or Vercel edge middleware.
- Never expose form submission endpoints or API keys client-side.

## Folder Examples

```
.env.example                   # Variable names only
.env.local                     # Gitignored secrets
lib/validations/contact-form.ts  # Server-side validation
next.config.ts                 # Security headers
```

## Naming Conventions

- Secret env vars: no `NEXT_PUBLIC_` prefix.
- Public env vars: `NEXT_PUBLIC_` prefix only for non-sensitive values.
- Validation schemas: `{form}Schema` (e.g., `contactFormSchema`).

## Production Recommendations

- Enable Cloudflare WAF rules for common attack patterns.
- Disable WordPress GraphQL introspection in production.
- Restrict WordPress admin access by IP or VPN.
- Enable WordPress two-factor authentication for all admin users.
- Run `npm audit` regularly; address high/critical vulnerabilities immediately.
- Set up security monitoring alerts for unusual GraphQL query patterns.

## Common Mistakes

- Exposing WordPress GraphQL URL as a public environment variable.
- Rendering unsanitized WordPress HTML directly with `dangerouslySetInnerHTML`.
- Storing API keys or secrets in client-side code.
- Not validating form inputs server-side.
- Allowing WordPress admin panel on the same domain as the public site.

## Scalability Considerations

- Cloudflare WAF scales with traffic automatically.
- Server-side validation applies regardless of frontend complexity.
- Security headers are set once in config and apply to all routes.

## Do's

- Sanitize all WordPress HTML before rendering.
- Validate all form inputs server-side with Zod.
- Use HTTPS everywhere — no mixed content.
- Keep dependencies updated and audit regularly.
- Restrict WordPress admin to authorized personnel only.

## Don'ts

- **Never** create authentication or user management in Next.js.
- **Never** expose WordPress admin credentials in the frontend codebase.
- **Never** trust client-side validation as security measure.
- **Never** disable security headers for convenience.
- Do not store patient data in the Next.js application.

## Future Expansion

- Content Security Policy (CSP) headers.
- Subresource Integrity (SRI) for third-party scripts.
- Automated dependency vulnerability scanning in CI.
- WordPress security audit before launch.
- HIPAA compliance assessment if patient data is ever handled.
