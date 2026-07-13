# Care Well Medical Centre — Observability & Monitoring

## Purpose

Define logging, analytics, performance monitoring, uptime tracking, and alerting for the CWMC production environment.

## Responsibilities

- Monitor frontend availability and performance.
- Track user analytics without compromising privacy.
- Log server-side errors for debugging.
- Alert on critical failures before users report them.

## Architecture

```
User Browser
  → Vercel Analytics (page views, vitals)
  → Google Analytics 4 / Plausible (behavior)

Next.js Server
  → Vercel Logs (function output)
  → Console error logging (structured)

External
  → Uptime monitor (production URL)
  → WordPress GraphQL health check
  → Cloudflare analytics (traffic, threats)
```

---

## Analytics

### Recommended Stack

| Tool | Purpose | Integration |
|------|---------|-------------|
| Vercel Analytics | Page views, Web Vitals | `@vercel/analytics` |
| Vercel Speed Insights | CWV field data | `@vercel/speed-insights` |
| Google Analytics 4 | User behavior, conversions | `next/script` with `NEXT_PUBLIC_GA_ID` |

### Privacy Considerations

- No patient health information (PHI) in analytics events.
- Cookie consent banner if required by jurisdiction.
- Anonymize IP in GA4 configuration.
- Do not track form field contents as events.

### Key Events to Track

| Event | Trigger |
|-------|---------|
| `page_view` | Route change (automatic) |
| `contact_form_submit` | Successful form submission |
| `cta_click` | Primary CTA clicks (book, call) |
| `outbound_link` | External link clicks |

---

## Performance Monitoring

### Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | ≤ 2.5s | 2.5–4.0s | > 4.0s |
| INP | ≤ 200ms | 200–500ms | > 500ms |
| CLS | ≤ 0.1 | 0.1–0.25 | > 0.25 |

### Monitoring Tools

- Vercel Speed Insights (production field data).
- Lighthouse CI on PR previews (future).
- Google Search Console Core Web Vitals report.

---

## Logging

### Server-Side Log Format

```typescript
// Structured log pattern
console.error('[CWMC]', {
  level: 'error',
  context: 'wordpress.fetch',
  query: 'getAllServices',
  duration: 1234,
  message: error.message,
  timestamp: new Date().toISOString(),
});
```

### Log Levels

| Level | Usage |
|-------|-------|
| `error` | GraphQL failures, form submission errors, unhandled exceptions |
| `warn` | Mapper null fields, sanitization removals, deprecated fields |
| `info` | Revalidation events, successful deploys (future) |

### Do Not Log

- Environment secrets.
- Full GraphQL query bodies in production.
- User PII from contact forms.
- WordPress admin credentials.

---

## Uptime Monitoring

### Endpoints to Monitor

| Endpoint | Check Interval | Alert Threshold |
|----------|---------------|-----------------|
| `https://www.carewellmedical.com` | 1 min | 2 consecutive failures |
| WordPress GraphQL URL | 5 min | 3 consecutive failures |
| `/api/revalidate` (future) | 5 min | 5 consecutive failures |

### Recommended Tools

- Better Uptime, Pingdom, or UptimeRobot.
- Vercel deployment notifications.

---

## Alerting

| Condition | Severity | Channel |
|-----------|----------|---------|
| Production site down | Critical | Email + SMS |
| GraphQL error rate > 5% | High | Email |
| Build failure on main | High | GitHub notification |
| CWV degradation (LCP > 4s) | Medium | Weekly report |
| Dependency vulnerability (critical) | High | GitHub Dependabot |

---

## Health Check Pattern (Future)

```typescript
// app/api/health/route.ts
// Returns: { status: 'ok', wordpress: 'ok' | 'degraded', timestamp }
```

Use for uptime monitors and load balancer health checks.

---

## Dashboard Recommendations

| Dashboard | Contents |
|-----------|----------|
| Vercel | Deployments, function errors, bandwidth |
| Cloudflare | Traffic, cache ratio, threats blocked |
| GA4 | Sessions, top pages, conversions |
| Search Console | Indexing, CWV, search queries |

---

## Do's

- Enable Vercel Analytics and Speed Insights at launch.
- Monitor WordPress GraphQL independently from frontend.
- Review CWV monthly post-launch.
- Set up deploy notifications.

## Don'ts

- Do not log PHI or form content.
- Do not rely solely on user reports for outages.
- Do not track individual patient behavior.
- Do not disable monitoring on preview environments (use separate GA property).

## Future Expansion

- Sentry for error tracking with source maps.
- Log drain to Axiom/Datadog.
- Custom Grafana dashboard for GraphQL latency.
- Automated Lighthouse CI regression alerts.
