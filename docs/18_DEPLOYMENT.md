# Care Well Medical Centre — Deployment

## Purpose

Define the deployment architecture, environment configuration, and operational procedures for the CWMC headless Next.js app.

## Platform roles

| Platform | Role |
|----------|------|
| **Vercel** | Next.js app (public site, `/admin`, Server Actions, API routes) |
| **Render** | PostgreSQL for Experience Studio + Lead Engine (`DATABASE_URL`) |
| Cloudflare | DNS, CDN, DDoS protection, SSL (optional in front of Vercel) |
| Hostinger | WordPress + WPGraphQL + media |

Do **not** split this Next.js app into “frontend on Vercel / backend on Render.” The Node “backend” is Next.js itself and must run on Vercel with the UI.

## Architecture

```
GitHub push → Vercel (build + deploy Next.js)
                │
                ├── WPGraphQL  → WordPress (Hostinger)
                └── DATABASE_URL → Render Postgres
```

### Environment strategy

| Environment | Branch | App host | Database |
|-------------|--------|----------|----------|
| Development | local | `localhost:3000` | Docker Compose (`docker compose up -d`) |
| Preview | PR branches | `*.vercel.app` | Render (shared) or a second Render DB |
| Production | `main` | custom domain on Vercel | Render Postgres (`render.yaml`) |

---

## 1. Deploy database on Render

1. Push this repository to GitHub (includes `render.yaml`).
2. In [Render](https://dashboard.render.com) → **New** → **Blueprint** → select the repo.
3. Confirm the `carewell-experience-db` Postgres service and create the Blueprint.
4. Open the database → copy **External Database URL**.
5. Ensure the URL includes `?schema=public` (append if missing).

Optional after DB is live (from your machine, with the Render URL):

```bash
# PowerShell
$env:DATABASE_URL="postgresql://USER:PASS@HOST/carewell_experience?schema=public"
npx prisma db push
$env:STUDIO_BOOTSTRAP_EMAIL="you@example.com"
$env:STUDIO_BOOTSTRAP_PASSWORD="YourSecurePassword1!"
npx prisma db seed
```

---

## 2. Deploy the app on Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → import the same GitHub repo.
2. Framework preset: **Next.js** (uses `vercel.json`; build is `npm run build` → `prisma generate && next build`).
3. Region: prefer **Bombay (`bom1`)** for India traffic.
4. Add environment variables (Production + Preview as appropriate):

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | Production canonical URL, e.g. `https://www.carewellmedical.com` |
| `WORDPRESS_GRAPHQL_ENDPOINT` | Production WPGraphQL URL |
| `WEBHOOK_SECRET` | On-demand revalidation secret |
| `DATABASE_URL` | Render **External** Postgres URL + `?schema=public` |
| `AUTH_SECRET` | `openssl rand -hex 32` |
| `AUTH_TRUST_HOST` | `true` |
| `AUTH_URL` | Same as public site URL (Auth callbacks) |
| `WORDPRESS_USERNAME` / `WORDPRESS_APPLICATION_PASSWORD` | Optional; media upload to WP |
| `STUDIO_BOOTSTRAP_*` | Only needed for seed; not required at runtime |

5. Deploy. Point DNS (Cloudflare CNAME `www` → Vercel) when ready.

### Prisma on Vercel serverless

- `postinstall` / `build` already run `prisma generate`.
- Schema changes: run `npx prisma db push` (or migrate) against Render, then redeploy Vercel.
- If you enable Render PgBouncer, use the pool URL and add Prisma-compatible params (`pgbouncer=true`, modest `connection_limit`) per [Prisma + PgBouncer](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/pgbouncer).

---

## Environment variables (canonical names)

```env
NEXT_PUBLIC_SITE_URL=https://www.carewellmedical.com
WORDPRESS_GRAPHQL_ENDPOINT=https://cms.example.com/graphql
WEBHOOK_SECRET=<random-secret-token>
DATABASE_URL=postgresql://...@...render.com/carewell_experience?schema=public
AUTH_SECRET=<random-secret-token>
AUTH_TRUST_HOST=true
AUTH_URL=https://www.carewellmedical.com
```

See also `.env.example` and `docs/33_ENVIRONMENT_VARIABLES.md`.

### Vercel configuration

Repo root `vercel.json` sets framework headers and `bom1`. Install/build defaults:

- Install: `npm install`
- Build: `npm run build`

### Cloudflare (optional)

- DNS: CNAME `www` → Vercel.
- SSL: Full (strict).
- Bypass cache for `/api/*` and `/admin/*` if edge caching is aggressive.
- Allow your Vercel domain in WordPress CORS.

## Best Practices

- Never commit `.env.local` or secrets.
- Use Vercel Preview Deployments for PRs.
- Run `npm run build` locally before pushing.
- Keep Render **External** URL only on Vercel (and local ops); Internal URL is for services inside Render’s network.

## Folder Examples

```
.env.example                   # Template for environment variables
.env.local                     # Local development (gitignored)
vercel.json                    # Vercel headers + region
render.yaml                    # Render Postgres Blueprint
docker-compose.yml             # Local Postgres
```

## Common Mistakes

- Putting only a “static frontend” on Vercel and expecting APIs on Render — this app is not split that way.
- Using Render **Internal** Database URL on Vercel (unreachable).
- Forgetting `AUTH_SECRET` / `AUTH_TRUST_HOST` (admin login fails).
- Deploying without `DATABASE_URL` (Studio / leads / auth fail).
- Not whitelisting the Vercel domain in WordPress CORS.
- Skipping `prisma db push` / seed on a fresh Render database.

## Do's

- Vercel for Next.js; Render for Postgres; Hostinger for WordPress.
- Generate a strong `AUTH_SECRET` and `WEBHOOK_SECRET` per environment.
- Seed one bootstrap admin after first DB create.

## Don'ts

- Do not use `output: 'export'` — Studio, auth, and ISR need a server runtime.
- Do not host WordPress and Next.js on the same box as a substitute for this layout.
- Do not commit production `DATABASE_URL` into the repo.

## Future Expansion

- GitHub Actions: lint, typecheck, `prisma migrate deploy`.
- Second Render database for Preview vs Production.
- On-demand ISR via WordPress publish webhook → Vercel.
