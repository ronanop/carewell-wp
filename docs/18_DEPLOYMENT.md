# Care Well Medical Centre — Deployment

## Purpose

Define the deployment architecture, environment configuration, CI/CD pipeline, and operational procedures for the CWMC headless frontend.

## Responsibilities

| Platform | Role |
|----------|------|
| Vercel | Next.js hosting, serverless functions, preview deployments |
| Cloudflare | DNS, CDN, DDoS protection, SSL termination |
| Hostinger | WordPress hosting, MySQL, media storage |

## Architecture

### Deployment Flow

```
Developer Push → GitHub Repository
  → Vercel CI (build + lint + type check)
    → Preview Deployment (PR branches)
    → Production Deployment (main branch)
      → Cloudflare CDN → User
```

### Environment Strategy

| Environment | Branch | URL | WordPress |
|-------------|--------|-----|-----------|
| Development | local | `localhost:3000` | Staging WP or production WP |
| Preview | PR branches | `*.vercel.app` | Staging WP |
| Production | `main` | `www.carewellmedical.com` | Production WP |

### Environment Variables

```env
# Required — Production (Vercel)
WORDPRESS_GRAPHQL_URL=https://cms.carewellmedical.com/graphql
NEXT_PUBLIC_SITE_URL=https://www.carewellmedical.com
REVALIDATION_SECRET=<random-secret-token>

# Optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
CONTACT_FORM_ENDPOINT=https://formspree.io/f/xxxxx
```

### Vercel Configuration

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "regions": ["bom1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### Cloudflare Configuration

- DNS: CNAME `www` → Vercel deployment URL.
- SSL: Full (strict) mode.
- Caching: Cache static assets (JS, CSS, fonts, images) with 1-year TTL.
- Page Rules: Bypass cache for `/api/*` routes.
- Security: Enable Bot Fight Mode, rate limiting on contact form endpoint.

## Best Practices

- Never commit `.env.local` or secrets to the repository.
- Provide `.env.example` with all required variable names (no values).
- Use Vercel Preview Deployments for every PR — test before merge.
- Run `npm run build` locally before pushing to catch build errors early.
- Configure WordPress CORS to allow Vercel deployment domains.

## Folder Examples

```
.env.example                   # Template for environment variables
.env.local                     # Local development (gitignored)
vercel.json                    # Vercel deployment configuration (if needed)
next.config.ts                 # Image domains, redirects, headers
```

## Naming Conventions

- Environment variables: `SCREAMING_SNAKE_CASE`.
- Public variables: prefix with `NEXT_PUBLIC_`.
- Secret variables: no public prefix; server-side only.

## Production Recommendations

- Deploy to Vercel region closest to target audience (`bom1` for India).
- Set up Vercel Analytics and Speed Insights for monitoring.
- Configure custom domain with Cloudflare DNS.
- Enable Vercel Deployment Protection for preview URLs.
- Set up uptime monitoring (Better Uptime, Pingdom) for production URL.
- Create 301 redirect map in `next.config.ts` for any URL changes.

## Common Mistakes

- Deploying without setting environment variables on Vercel.
- Not whitelisting Vercel domains in WordPress CORS settings.
- Forgetting to configure `images.remotePatterns` for WordPress media domain.
- Deploying preview environments that index in search engines (add `noindex`).
- Not testing production build locally before deploying.

## Scalability Considerations

- Vercel serverless scales automatically with traffic.
- ISR eliminates need for dedicated caching infrastructure.
- Cloudflare CDN handles static asset delivery globally.
- WordPress on Hostinger is the bottleneck — monitor GraphQL endpoint performance.

## Do's

- Use GitHub integration with Vercel for automatic deployments.
- Test WordPress GraphQL connectivity from Vercel serverless environment.
- Set up staging WordPress instance for preview deployments.
- Document rollback procedure (Vercel instant rollback to previous deployment).

## Don'ts

- Do not deploy WordPress and Next.js on the same server.
- Do not expose WordPress admin URL publicly without security hardening.
- Do not use `output: 'export'` — ISR requires server runtime.
- Do not skip SSL on any environment.

## Future Expansion

- GitHub Actions CI pipeline for lint, type-check, and Lighthouse audit.
- On-demand ISR revalidation via WordPress publish webhook.
- Multi-region Vercel deployment for global audience.
- Automated visual regression testing on preview deployments.
