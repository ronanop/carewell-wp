# Hostinger go-live cutover

Production stack: **Hostinger Node** (Next.js) + **Neon** (Postgres leads) + **Sanity** (`carewellcms.sanity.studio`).

Canonical domain: `https://www.carewellmedicalcentre.com`

## One-command auto deploy

On every GitHub push, Hostinger runs **`npm run build`**, which does:

1. Fail fast if `DATABASE_URL` or `AUTH_SECRET` missing
2. `prisma generate`
3. `prisma db push` (Neon schema, incl. leads + `SitePageView` + `SiteMegaMenu`)
4. `prisma db seed` (roles + first `/admin` user if missing)
5. `next build`

Then Hostinger starts **`node server.js`** (entry file), which runs Next on the platform `PORT`.

**Important:** Build tools (`prisma`, `tsx`, `typescript`, `tailwindcss`, `@types/*`) live in **`dependencies`** so Hostinger production installs (which often omit `devDependencies`) still succeed.

### hPanel → Deployments → Deployment settings

| Setting | Value |
|---------|--------|
| Framework | Next.js (or Other) |
| Branch | `main` |
| Node.js | **20** or **22** |
| Build command | `npm run build` |
| Output directory | `.next` |
| Entry file | `server.js` |
| Package manager | npm |

Local Next-only build (skip DB): `npm run build:next`

---

## 1. Set Hostinger environment variables

Use values from `.env.example`. Required:

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://www.carewellmedicalcentre.com` |
| `AUTH_URL` | Same as site URL |
| `AUTH_SECRET` | Strong unique (`openssl rand -hex 32`) |
| `AUTH_TRUST_HOST` | `true` |
| `DATABASE_URL` | Neon **pooler** connection string |
| `SANITY_PROJECT_ID` / `SANITY_DATASET` | `ndeeiwkw` / `production` |
| `SANITY_API_TOKEN` | Project **Viewer** (draft/preview reads) |
| `LEAD_NOTIFY_TO` / `LEAD_NOTIFY_FROM` | Clinic inbox |
| `SMTP_HOST` / `PORT` / `SECURE` / `USER` / `PASS` | Hostinger mail (notify is fail-soft if unset) |
| `NEXT_PUBLIC_GA_ID` | `G-0YVNST47B8` (GA4) |
| `STUDIO_BOOTSTRAP_EMAIL` | First `/admin/login` email (created only if missing) |
| `STUDIO_BOOTSTRAP_PASSWORD` | First `/admin/login` password (≥8 chars) |

Optional: `STUDIO_BOOTSTRAP_FORCE=true` once to reset that admin password on next deploy (then remove it).

`/admin` = leads ops console (not Sanity Studio, not WordPress).

---

## 2. Deploy flow

1. Set all env vars in hPanel (before first build).
2. Connect GitHub repo → Deploy (or push to `main`).
3. Wait for green build; open the site.
4. Point domain DNS to Hostinger when ready; SSL is handled by Hostinger.

---

## 3. Smoke checklist (after deploy)

1. Home, one service URI, one blog post load with correct titles.
2. Contact / homepage consultation form → Neon lead + SMTP email.
3. `/admin/login` → leads list (bootstrap email/password).
4. `/dev`, `/design`, `/sanity-test` return **404**.
5. Draft enable without Sanity preview secret fails; Studio at https://carewellcms.sanity.studio still edits content.
6. `/robots.txt`, `/sitemap.xml`, and `/llms.txt` resolve.
7. Admin login rejects open `callbackUrl` (e.g. `https://evil.example`).

---

## 4. Notes

- Lead notify stays fail-soft: forms still save if SMTP is misconfigured.
- Seed does **not** overwrite an existing admin password unless `STUDIO_BOOTSTRAP_FORCE=true`.
- In-memory rate limits assume a **single** Node process.
- Full CSP and on-demand Sanity revalidate are deferred post-launch (ISR ~1h is OK short-term).
