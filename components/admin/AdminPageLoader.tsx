"use client";

/** Compact loader for admin route transitions (not full-viewport). */
export function AdminPageLoader() {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 py-16"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span
        className="size-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#0A2540]"
        aria-hidden
      />
      <p className="text-sm text-slate-500">Loading…</p>
      <span className="sr-only">Loading page</span>
    </div>
  );
}
