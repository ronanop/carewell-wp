import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const LOGO_IMAGE_SRC = "/images/logo.png";

type SiteLogoProps = {
  className?: string;
};

export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 leading-none no-underline hover:no-underline",
        className
      )}
    >
      <Image
        src={LOGO_IMAGE_SRC}
        alt="Carewell Medical Centre logo"
        width={40}
        height={40}
        className="size-10 shrink-0 object-contain"
        priority
      />
      <span className="flex flex-col">
        <span className="text-[17px] font-semibold tracking-[-0.01em] text-[#0A2540]">
          Carewell Medical Centre
        </span>
        <span className="mt-1 text-[11px] font-normal leading-tight text-neutral-500">
          Laparoscopic &amp; Cosmetic Surgery Centre
        </span>
      </span>
    </Link>
  );
}
