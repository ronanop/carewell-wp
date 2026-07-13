/**
 * Next.js instrumentation hook — runs once when the Node server starts.
 * Validates required WordPress environment variables and fails fast.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "edge") {
    return;
  }

  const { assertWordPressEnv } = await import("@/lib/wordpress/config");
  assertWordPressEnv();
}
