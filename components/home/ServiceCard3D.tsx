"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type ServiceCard3DProps = {
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  objectPosition?: string;
};

/** Homepage service card — flat hover only (no 3D tilt). */
export function ServiceCard3D({
  title,
  description,
  href,
  imageSrc,
  imageAlt,
  objectPosition = "center",
}: ServiceCard3DProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-[#0A2540] no-underline",
        "ring-1 ring-[#0A2540]/15",
        "shadow-[0_14px_36px_-18px_rgba(10,37,64,0.45)]",
        "transition-[box-shadow] duration-300 ease-out",
        "sm:hover:shadow-[0_22px_44px_-16px_rgba(10,37,64,0.5)]",
        "sm:hover:no-underline",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A2540]/80 sm:aspect-[16/11]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 48vw, 32vw"
          className={cn(
            "object-cover transition-transform duration-500 ease-out",
            "sm:group-hover:scale-[1.03]",
          )}
          style={{ objectPosition: objectPosition || "center" }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A2540] via-[#0A2540]/35 to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative -mt-10 flex flex-1 flex-col bg-gradient-to-b from-transparent via-[#0A2540] to-[#0A2540] px-4 pb-5 pt-2 sm:-mt-12 sm:px-5 sm:pb-6 sm:pt-3">
        <h3 className="font-heading text-[1.15rem] font-bold leading-snug tracking-tight text-white sm:text-[1.45rem]">
          {title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-[0.9375rem] font-medium leading-relaxed text-white/80 sm:mt-2.5 sm:text-base sm:leading-relaxed">
          {description}
        </p>
        <span
          className={cn(
            "mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl",
            "bg-white px-4 text-[0.9375rem] font-semibold text-[#0A2540]",
            "transition-colors duration-200",
            "sm:mt-5 sm:w-auto sm:justify-start sm:self-start sm:px-5",
            "sm:group-hover:bg-sky-50",
          )}
        >
          Learn more
          <ArrowRight
            className="size-4 transition-transform duration-300 ease-out sm:group-hover:translate-x-1"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
