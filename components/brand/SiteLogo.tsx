import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const LOGO_IMAGE_SRC = "/images/logo.png";

type SiteLogoProps = {
  className?: string;
  /** Defaults to public home `/`. Use `/admin` in the staff shell. */
  href?: string;
  /** Forwarded to the root link (e.g. `-1` when inside a closed `aria-hidden` drawer). */
  tabIndex?: number;
};

export function SiteLogo({ className, href = "/", tabIndex }: SiteLogoProps) {
  return (
    <Link
      href={href}
      tabIndex={tabIndex}
      className={cn(
        "inline-flex min-w-0 items-center gap-2 leading-none no-underline hover:no-underline sm:gap-2.5",
        className
      )}
    >
      <Image
        src={LOGO_IMAGE_SRC}
        alt="Carewell Medical Centre logo"
        width={40}
        height={40}
        className="size-9 shrink-0 object-contain sm:size-10"
        sizes="40px"
        quality={70}
      />
      <span className="min-w-0 flex flex-col">
        <span className="truncate whitespace-nowrap text-[clamp(0.95rem,5.2vw,1.1875rem)] font-semibold tracking-[-0.01em] text-[#0A2540]">
          Carewell Medical Centre
        </span>
        <span className="mt-1 truncate whitespace-nowrap text-[0.625rem] font-normal leading-tight text-neutral-600 sm:text-xs">
          Laparoscopic &amp; Cosmetic Surgery Centre
        </span>
      </span>
    </Link>
  );
}
