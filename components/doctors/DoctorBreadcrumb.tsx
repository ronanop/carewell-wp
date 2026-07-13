import Link from "next/link";

import type { DoctorProfile } from "@/types/doctor";

interface DoctorBreadcrumbProps {
  doctor: Pick<DoctorProfile, "name" | "slug">;
}

export function DoctorBreadcrumb({ doctor }: DoctorBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-border/60 bg-muted/30"
    >
      <div className="container-content py-3.5">
        <ol className="flex flex-wrap items-center gap-2 text-small text-muted-foreground">
          <li>
            <Link
              href="/"
              className="no-underline transition-colors hover:text-[#0A2540] hover:no-underline"
            >
              Home
            </Link>
          </li>
          <li aria-hidden className="text-muted-foreground/60">
            »
          </li>
          <li>
            <Link
              href="/about"
              className="no-underline transition-colors hover:text-[#0A2540] hover:no-underline"
            >
              About
            </Link>
          </li>
          <li aria-hidden className="text-muted-foreground/60">
            »
          </li>
          <li>
            <span className="font-medium text-[#0A2540]" aria-current="page">
              {doctor.name}
            </span>
          </li>
        </ol>
      </div>
    </nav>
  );
}
