"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const PREVIEW_FLAG = "cw_preview";

/**
 * Client-only so the root layout never calls `draftMode()`.
 * Does not hit `/api/draft-mode/status/` on normal public visits — only when
 * Sanity preview enabled the session (`?cw_preview=1` or sessionStorage).
 */
export function DraftPreviewBar() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get(PREVIEW_FLAG) === "1") {
        sessionStorage.setItem(PREVIEW_FLAG, "1");
      }
      if (sessionStorage.getItem(PREVIEW_FLAG) !== "1") return;
    } catch {
      return;
    }

    fetch("/api/draft-mode/status/", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { enabled?: boolean } | null) => {
        if (!cancelled && data?.enabled) setEnabled(true);
        if (!cancelled && data && !data.enabled) {
          try {
            sessionStorage.removeItem(PREVIEW_FLAG);
          } catch {
            /* ignore */
          }
        }
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
        onClick={() => {
          try {
            sessionStorage.removeItem(PREVIEW_FLAG);
          } catch {
            /* ignore */
          }
        }}
      >
        Exit preview
      </Link>
    </div>
  );
}
