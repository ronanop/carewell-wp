/**
 * Next.js instrumentation hook — runs once when the Node server starts.
 * Validates required Sanity environment variables and fails soft if missing.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "edge") {
    return;
  }

  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_PROJECT_ID;

  if (!projectId) {
    const message =
      "[instrumentation] Missing NEXT_PUBLIC_SANITY_PROJECT_ID (or SANITY_PROJECT_ID). Sanity content will not load.";
    console.error(message);
    if (process.env.NODE_ENV === "development") {
      // Soft-fail in prod; warn loudly in dev without crashing the whole process
      // so local work on static routes remains possible.
      console.warn(message);
    }
  }
}
