"use client";

import Link from "next/link";
import { Phone } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_WHATSAPP = "https://wa.me/919811003148";
const DEFAULT_PHONE = "tel:+919811003148";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export type ContactActionsProps = {
  bookHref?: string;
  bookLabel?: string;
  whatsappHref?: string;
  phoneHref?: string;
  onBookClick?: () => void;
  onWhatsAppClick?: () => void;
  onCallClick?: () => void;
  className?: string;
  size?: "default" | "sm" | "lg";
  /**
   * Phase 8.1 — never three equally strong CTAs.
   * primary-secondary-tertiary: Book (primary) → WhatsApp (secondary tone) → Call (ghost/outline)
   */
  hierarchy?: "primary-secondary-tertiary" | "primary-only" | "equal";
  /**
   * Mobile/tablet: fixed bottom bar (hide inline). Desktop `lg+`: inline only.
   */
  stickyOnMobile?: boolean;
};

/**
 * Shared Book / WhatsApp / Call actions — consistent height, radius, focus.
 */
export function ContactActions({
  bookHref = "/contact/",
  bookLabel = "Book consultation",
  whatsappHref = DEFAULT_WHATSAPP,
  phoneHref = DEFAULT_PHONE,
  onBookClick,
  onWhatsAppClick,
  onCallClick,
  className,
  size = "default",
  hierarchy = "primary-secondary-tertiary",
  stickyOnMobile = false,
}: ContactActionsProps) {
  const whatsappVariant =
    hierarchy === "equal" ? "whatsapp" : hierarchy === "primary-only" ? "ghost" : "outline";
  const callVariant = hierarchy === "equal" ? "call" : "ghost";

  const actions = (opts?: { stretch?: boolean; compact?: boolean }) => {
    const stretch = opts?.stretch;
    const compact = opts?.compact;
    const btnSize = compact ? "sm" : size;
    const shareRow =
      stretch &&
      "min-w-0 flex-1 justify-center gap-1.5 px-2 text-[13px] sm:gap-2 sm:px-3 sm:text-small";
    const bookText =
      compact && bookLabel === "Book consultation" ? "Book" : bookLabel;

    return (
      <>
        <Link
          href={bookHref}
          onClick={onBookClick}
          className={cn(
            buttonVariants({ variant: "default", size: btnSize }),
            "rounded-xl text-white [&_svg]:text-white",
            shareRow,
          )}
        >
          <span className={cn("text-white", stretch && "truncate")}>
            {bookText}
          </span>
        </Link>
        {hierarchy !== "primary-only" ? (
          <>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onWhatsAppClick}
              className={cn(
                buttonVariants({
                  variant: whatsappVariant === "whatsapp" ? "whatsapp" : whatsappVariant,
                  size: btnSize,
                }),
                "rounded-xl",
                hierarchy !== "equal" &&
                  whatsappVariant === "outline" &&
                  "border-[#25D366]/50 text-[#128C7E] hover:bg-[#25D366]/8 hover:border-[#25D366]/70",
                shareRow,
              )}
            >
              <WhatsAppIcon className="size-4 shrink-0" />
              <span className={cn(stretch && "truncate")}>WhatsApp</span>
            </a>
            <a
              href={phoneHref}
              onClick={onCallClick}
              className={cn(
                buttonVariants({ variant: callVariant, size: btnSize }),
                "rounded-xl text-muted-foreground",
                shareRow,
              )}
            >
              <Phone className="size-4 shrink-0" aria-hidden />
              <span className={cn(stretch && "truncate")}>Call</span>
            </a>
          </>
        ) : null}
      </>
    );
  };

  const rowClass = cn(
    "flex w-full max-w-full flex-nowrap items-stretch gap-2",
    hierarchy === "primary-only" && "max-w-sm",
  );

  if (stickyOnMobile) {
    return (
      <>
        <div className={cn("hidden lg:flex", rowClass, className)}>
          {actions({ stretch: true })}
        </div>

        <nav
          aria-label="Contact actions"
          className={cn(
            "fixed inset-x-0 bottom-0 z-40 lg:hidden",
            "border-t border-[#0A2540]/10 bg-white/95 shadow-[0_-4px_24px_rgba(10,37,64,0.08)] backdrop-blur-md",
            "px-3 pt-2.5",
            "pb-[max(0.625rem,env(safe-area-inset-bottom))]",
          )}
        >
          <div className={cn("mx-auto max-w-lg", rowClass)}>
            {actions({ stretch: true, compact: true })}
          </div>
        </nav>
      </>
    );
  }

  return (
    <div className={cn(rowClass, className)}>
      {actions({ stretch: true })}
    </div>
  );
}
