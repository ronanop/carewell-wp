import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ModuleEmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
}

/**
 * Premium empty module placeholder for unfinished Studio features.
 */
export function ModuleEmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionHref,
}: ModuleEmptyStateProps) {
  return (
    <div className="flex min-h-[28rem] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center shadow-sm">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-6" aria-hidden />
      </div>
      <h2 className="mt-6 font-heading text-h3 font-semibold text-foreground">
        {title}
      </h2>
      <p className="mt-3 max-w-md text-body text-muted-foreground">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className={cn(
            buttonVariants({ size: "default" }),
            "mt-8 no-underline hover:no-underline",
          )}
        >
          {actionLabel}
        </Link>
      ) : (
        <p className="mt-8 text-small text-muted-foreground">
          Module scaffolded · ready for feature development
        </p>
      )}
    </div>
  );
}
