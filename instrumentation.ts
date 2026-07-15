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
  try {
    assertWordPressEnv();
  } catch (error) {
    // Fail soft in production so a missing optional WP Application Password
    // (or a mis-set webhook) does not take down every serverless route,
    // including /admin/login. Surface loudly in logs instead.
    const message =
      error instanceof Error ? error.message : "Unknown WordPress env error";
    console.error(`[instrumentation] ${message}`);
    if (process.env.NODE_ENV === "development") {
      throw error;
    }
  }
}
