import type { AnchorHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * WordPress-style content button (CTA link).
 */
export interface ContentButtonProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
  variant?: "filled" | "outline";
}

/**
 * Button-styled link matching Gutenberg `.wp-block-button__link`.
 */
export function ContentButton({
  href,
  children,
  className,
  variant = "filled",
  ...rest
}: ContentButtonProps) {
  return (
    <div
      className={cn(
        "wp-block-button",
        variant === "outline" && "is-style-outline",
      )}
    >
      <a
        href={href}
        className={cn(
          "wp-block-button__link inline-flex min-h-11 items-center justify-center rounded-[var(--radius-sm)] px-6 py-3 text-[0.9375rem] font-medium no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring",
          variant === "filled" &&
            "bg-primary text-primary-foreground hover:bg-primary/90",
          variant === "outline" &&
            "bg-transparent text-primary shadow-[inset_0_0_0_1.5px_var(--primary)] hover:bg-primary hover:text-primary-foreground",
          className,
        )}
        {...rest}
      >
        {children}
      </a>
    </div>
  );
}
