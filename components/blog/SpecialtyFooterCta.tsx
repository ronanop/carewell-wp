"use client";

import Link from "next/link";

import { emitEditorialEvent } from "@/lib/experience/blog/editorial/analytics";
import {
  detectSpecialtyFromHaystack,
  getContextAwareCtaCopyForSpecialty,
} from "@/lib/experience/unified/context";
import { cn } from "@/lib/utils";
import type { BlogCategory } from "@/types/blog";

export function SpecialtyFooterCta({
  categories,
  className,
}: {
  categories: BlogCategory[];
  className?: string;
}) {
  const hay = categories.map((c) => `${c.slug} ${c.name}`).join(" ");
  const key = detectSpecialtyFromHaystack(hay);
  const cta = getContextAwareCtaCopyForSpecialty(key);

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border bg-gradient-to-br from-[#0A2540] to-[#0A2540]/90 p-6 text-white sm:p-8",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
        Next step
      </p>
      <h2 className="mt-2 font-heading text-xl font-semibold tracking-tight text-white sm:text-2xl">
        {cta.title}
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">{cta.body}</p>
      <Link
        href="/contact/"
        onClick={() =>
          emitEditorialEvent({
            type: "cta_clicked",
            ctaId: `specialty-${key}`,
            href: "/contact/",
            placement: "footer",
          })
        }
              className="mt-5 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-medium text-[#0A2540]"
      >
        {cta.label}
      </Link>
    </aside>
  );
}
