# Care Well Medical Centre — Environment Variables Reference

## Purpose

Provide the complete reference for all environment variables used across development, preview, and production environments.

Canonical deployment: **Vercel** (Next.js) + **Render** (Postgres) + **Hostinger** (WordPress). See `docs/18_DEPLOYMENT.md`.

---

## Required Variables

| Variable | Exposure | Required In | Description | Example |
|----------|----------|-------------|-------------|---------|
| `WORDPRESS_GRAPHQL_ENDPOINT` | Server only | All environments | WPGraphQL endpoint URL | `https://cms.example.com/graphql` |
| `NEXT_PUBLIC_SITE_URL` | Client + Server | All environments | Canonical public site URL | `https://www.carewellmedical.com` |
| `WEBHOOK_SECRET` | Server only | Production, Preview | Bearer token for on-demand ISR webhook | `openssl rand -hex 32` |
| `DATABASE_URL` | Server only | Production, Preview, local Studio | Postgres for Experience Studio + Lead Engine | Render External URL + `?schema=public` |
| `AUTH_SECRET` | Server only | When using `/admin` login | Auth.js secret | `openssl rand -hex 32` |

---

## Optional / Conditional Variables

| Variable | Exposure | Description | Example |
|----------|----------|-------------|-------------|
| `AUTH_TRUST_HOST` | Server only | Trust host header on Vercel | `true` |
| `AUTH_URL` | Server only | Auth callback base URL | same as `NEXT_PUBLIC_SITE_URL` |
| `WORDPRESS_USERNAME` | Server only | WP Application Password user (media upload) | — |
| `WORDPRESS_APPLICATION_PASSWORD` | Server only | WP Application Password | — |
| `STUDIO_BOOTSTRAP_EMAIL` | Server only | Seed script only | — |
| `STUDIO_BOOTSTRAP_PASSWORD` | Server only | Seed script only | — |
| `NEXT_PUBLIC_GA_ID` | Client | Google Analytics 4 | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_SITE_NAME` | Client | Site name fallback | `Care Well Medical Centre` |
| `NEXT_PUBLIC_WORDPRESS_URL` | Client | WP origin for admin media browser (if used) | `https://cms.example.com` |

---

## Environment Matrix

| Variable | Local (`.env.local`) | Vercel Preview | Vercel Production |
|----------|---------------------|----------------|-------------------|
| `WORDPRESS_GRAPHQL_ENDPOINT` | Staging or production WP | Staging WP recommended | Production WP |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://{preview}.vercel.app` | Production domain |
| `WEBHOOK_SECRET` | Dev secret | Preview secret | Strong production secret |
| `DATABASE_URL` | Docker Compose | Render External URL | Render External URL |
| `AUTH_SECRET` | Local secret | Preview secret | Production secret |
| `AUTH_TRUST_HOST` | optional | `true` | `true` |

---

## Exposure Rules

### Server-Only (NEVER prefix with `NEXT_PUBLIC_`)

- `WORDPRESS_GRAPHQL_ENDPOINT`
- `WEBHOOK_SECRET`
- `DATABASE_URL`
- `AUTH_SECRET`
- `WORDPRESS_USERNAME`
- `WORDPRESS_APPLICATION_PASSWORD`

### Client-Safe (`NEXT_PUBLIC_` prefix)

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_WORDPRESS_URL` (origin only; no secrets)

---

## File Templates

Keep `.env.example` in sync with this doc. Copy to `.env.local` for local development.

Production secrets live in the **Vercel** project settings. Database lives on **Render**; paste its External URL into Vercel as `DATABASE_URL`.

---

## Security

- Never commit `.env.local`, `.env`, or production URLs with passwords.
- Rotate `WEBHOOK_SECRET` / `AUTH_SECRET` if leaked.
- Prefer separate Render databases for preview vs production when feasible.
- Do not put Render **Internal** Database URL on Vercel.

---

## Do's

- Keep `.env.example` updated when adding variables.
- Document new variables here before use.
- Use `NEXT_PUBLIC_` only when the browser must read the value.

## Don'ts

- Do not expose GraphQL credentials or `DATABASE_URL` to the client.
- Do not hardcode production secrets in source.
