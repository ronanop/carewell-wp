/**
 * Lightweight route fallback — no GIF (protects LCP / bandwidth).
 */
export function PageLoader() {
  return (
    <div
      className="flex min-h-[40vh] flex-1 items-center justify-center bg-background"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span
        className="size-9 animate-spin rounded-full border-2 border-[#0A2540]/15 border-t-[#0A2540]"
        aria-hidden
      />
      <span className="sr-only">Loading page</span>
    </div>
  );
}
