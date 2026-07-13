# Care Well Medical Centre — Environment Variables Reference

## Purpose

Provide the complete reference for all environment variables used across development, preview, and production environments.

## Responsibilities

- Document every required and optional variable.
- Specify server-side vs client-side exposure rules.
- Define validation requirements and example values.

---

## Required Variables

| Variable | Exposure | Required In | Description | Example |
|----------|----------|-------------|-------------|---------|
| `WORDPRESS_GRAPHQL_URL` | Server only | All environments | WPGraphQL endpoint URL | `https://cms.carewellmedical.com/graphql` |
| `NEXT_PUBLIC_SITE_URL` | Client + Server | All environments | Canonical public site URL | `https://www.carewellmedical.com` |
| `REVALIDATION_SECRET` | Server only | Production, Preview | Bearer token for on-demand ISR webhook | `openssl rand -hex 32` |

---

## Optional Variables

| Variable | Exposure | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_GA_ID` | Client | Google Analytics 4 measurement ID | `G-XXXXXXXXXX` |
| `CONTACT_FORM_ENDPOINT` | Server only | External form submission URL | `https://formspree.io/f/fxxxxxxx` |
| `NEXT_PUBLIC_SITE_NAME` | Client | Site name for metadata fallback | `Care Well Medical Centre` |
| `WORDPRESS_AUTH_TOKEN` | Server only | Bearer token if GraphQL requires auth (rare) | — |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Client | Plausible analytics domain (alternative to GA) | `carewellmedical.com` |

---

## Environment Matrix

| Variable | Local (`.env.local`) | Vercel Preview | Vercel Production |
|----------|---------------------|----------------|-------------------|
| `WORDPRESS_GRAPHQL_URL` | Staging or production WP | Staging WP recommended | Production WP |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://{preview}.vercel.app` | `https://www.carewellmedical.com` |
| `REVALIDATION_SECRET` | Dev secret | Unique per preview | Strong production secret |
| `NEXT_PUBLIC_GA_ID` | Omit or test ID | Omit or test ID | Production GA4 ID |
| `CONTACT_FORM_ENDPOINT` | Test endpoint | Test endpoint | Production endpoint |

---

## Exposure Rules

### Server-Only (NEVER prefix with `NEXT_PUBLIC_`)

- `WORDPRESS_GRAPHQL_URL`
- `REVALIDATION_SECRET`
- `CONTACT_FORM_ENDPOINT`
- `WORDPRESS_AUTH_TOKEN`

These must not appear in client bundles. Verify with `npm run build` bundle analysis if uncertain.

### Client-Safe (`NEXT_PUBLIC_` prefix)

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

Only non-sensitive values that browsers need.

---

## File Templates

### `.env.example` (committed)

```env
# WordPress
WORDPRESS_GRAPHQL_URL=

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Revalidation (generate: openssl rand -hex 32)
REVALIDATION_SECRET=

# Analytics (optional)
# NEXT_PUBLIC_GA_ID=

# Contact form (optional)
# CONTACT_FORM_ENDPOINT=
```

### `.env.local` (gitignored)

Copy from `.env.example` and fill values for local development.

---

## Validation at Startup

When implementing `lib/env.ts`, validate required variables:

```typescript
// Reference pattern — implement in Phase 1
import { z } from 'zod';

const envSchema = z.object({
  WORDPRESS_GRAPHQL_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  REVALIDATION_SECRET: z.string().min(16),
});

export const env = envSchema.parse(process.env);
```

Fail fast at build time if required variables are missing.

---

## Security

- Never commit `.env.local`, `.env.production`, or secrets to git.
- Rotate `REVALIDATION_SECRET` if compromised.
- Use Vercel environment variable UI for production secrets.
- Separate secrets per environment (preview ≠ production).

---

## Do's

- Keep `.env.example` updated when adding new variables.
- Document new variables in this file before use.
- Use `NEXT_PUBLIC_` only when browser access is required.

## Don'ts

- Do not expose WordPress GraphQL URL to client.
- Do not hardcode production URLs in source code.
- Do not share production secrets in PR descriptions or chat.
