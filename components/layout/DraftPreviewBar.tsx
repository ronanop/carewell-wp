"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Client-only so the root layout never calls `draftMode()` (which forces
 * dynamic rendering and kills homepage ISR / raises TTFB).
 */
export function DraftPreviewBar() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/draft-mode/status/", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { enabled?: boolean } | null) => {
        if (!cancelled && data?.enabled) setEnabled(true);
      })
      .catch(() => {
        /* ignore — bar is optional */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="sticky top-0 z-[80] flex flex-wrap items-center justify-between gap-3 border-b border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-950">
      <p>
        Preview — you are seeing unpublished changes. Visitors will not see this
        until you publish in the CMS.
      </p>
      <Link
        href="/api/draft-mode/disable/"
        className="shrink-0 rounded-md bg-amber-950 px-3 py-1.5 text-xs font-medium text-amber-50"
      >
        Exit preview
      </Link>
    </div>
  );
}
