"use client";

import Image from "next/image";

/** Compact loader for admin route transitions (not full-viewport). */
export function AdminPageLoader() {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 py-16"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Image
        src="/page-loading-animation.gif"
        alt=""
        width={120}
        height={120}
        unoptimized
        priority
        aria-hidden="true"
      />
      <p className="text-sm text-slate-500">Loading…</p>
      <span className="sr-only">Loading page</span>
    </div>
  );
}
