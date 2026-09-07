/**
 * If production AUTH_URL still points at localhost, Auth.js redirects there
 * after login. Prefer NEXT_PUBLIC_SITE_URL when that happens.
 */
export function syncProductionAuthUrl(): void {
  if (process.env.NODE_ENV !== "production") return;
  const authUrl = process.env.AUTH_URL?.trim();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl || /localhost|127\.0\.0\.1/i.test(siteUrl)) return;
  if (authUrl && !/localhost|127\.0\.0\.1/i.test(authUrl)) return;
  process.env.AUTH_URL = siteUrl.replace(/\/$/, "");
}
