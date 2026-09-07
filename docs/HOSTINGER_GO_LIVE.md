# Hostinger go-live cutover

Production stack for this launch: **Hostinger Node** (Next.js) + **Neon** (Postgres leads) + **Sanity** (`carewellcms.sanity.studio`).

Canonical domain: `https://www.carewellmedicalcentre.com`

## 1. Set Hostinger Node environment

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
| `SMTP_HOST` / `PORT` / `SECURE` / `USER` / `PASS` | Hostinger mail (lead notify is fail-soft if unset) |
| `NEXT_PUBLIC_GA_ID` | GA4 Measurement ID (`G-XXXXXXXX`) — optional |

## 2. Database + build

On the Hostinger app host (or CI that deploys there):

```bash
npx prisma db push
npm run db:seed
npm run build
npm start
```

Ensure `SitePageView` and lead tables exist after `db push`.

## 3. Smoke checklist (after deploy)

1. Home, one service URI, one blog post load with correct titles (not “Create Next App”).
2. Contact / homepage consultation form → row in Neon + SMTP email to clinic.
3. `/admin/login` → leads list (use seeded staff account).
4. `/dev`, `/design`, `/sanity-test` return **404**.
5. Draft enable without Sanity preview secret fails; Studio at https://carewellcms.sanity.studio still edits content.
6. `/robots.txt` and `/sitemap.xml` resolve; sitemap includes static + Sanity URLs.
7. Admin login rejects open `callbackUrl` (e.g. `https://evil.example`).

## 4. Notes

- Lead notify stays fail-soft: forms still save if SMTP is misconfigured; fix SMTP for clinic alerts.
- In-memory rate limits assume a **single** Node process; multi-instance needs Redis/Upstash later.
- Full CSP and on-demand Sanity revalidate are deferred post-launch (ISR ~1h is OK short-term).
