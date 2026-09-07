"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Thin top progress bar during client navigations within admin.
 */
export function AdminNavProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 480);
    return () => window.clearTimeout(t);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="admin-nav-progress pointer-events-none fixed left-[14.5rem] right-0 top-0 z-50 h-0.5 overflow-hidden"
      aria-hidden
    >
      <div className="admin-nav-progress-bar h-full bg-primary" />
    </div>
  );
}
