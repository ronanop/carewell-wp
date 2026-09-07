import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Static CTA — no typewriter timers (those cost main-thread work on mobile
 * even when the button is `hidden` via CSS).
 */
export function NavbarCtaButton() {
  return (
    <Link
      href="/contact"
      className={cn(
        buttonVariants(),
        "relative hidden min-w-[13.5rem] justify-center overflow-hidden rounded-full bg-[#0A2540] px-5 text-white hover:bg-[#0A2540]/90 no-underline hover:no-underline sm:inline-flex",
      )}
      aria-label="Book Free Consultation"
    >
      <span className="inline-flex items-center whitespace-nowrap">
        Book Free Consultation
      </span>
    </Link>
  );
}
