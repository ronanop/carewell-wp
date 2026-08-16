import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

import { drSandeepBhasin } from "@/components/doctors/content";
import { cn } from "@/lib/utils";

const PHOTO_SRC = "/images/dr-sandeep-bhasin-portrait.png";

/**
 * Right-rail sidebar for blog posts — search + About me (WP-style).
 */
export function BlogSidebar({
  className,
  defaultQuery = "",
}: {
  className?: string;
  defaultQuery?: string;
}) {
  const doctor = drSandeepBhasin;
  const photoAlt =
    doctor.portrait?.altText ||
    `${doctor.name}, Founder and Senior Cosmetic Surgeon`;

  return (
    <aside
      className={cn(
        "w-full lg:sticky lg:top-28 lg:self-start",
        className,
      )}
    >
      <form
        action="/blogs/"
        method="get"
        role="search"
        className="flex w-full overflow-hidden border border-[#2a2a2a]/80 bg-white"
      >
        <label htmlFor="blog-sidebar-search" className="sr-only">
          Search blogs
        </label>
        <input
          id="blog-sidebar-search"
          type="search"
          name="q"
          defaultValue={defaultQuery}
          placeholder="Search…"
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-small text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0"
        />
        <button
          type="submit"
          className="flex size-11 shrink-0 items-center justify-center bg-primary text-primary-foreground transition-colors hover:bg-primary-800"
          aria-label="Search"
        >
          <Search className="size-4" aria-hidden />
        </button>
      </form>

      <div className="mt-8">
        <div className="flex items-center gap-3">
          <h2 className="shrink-0 font-heading text-lg font-bold tracking-tight text-[#1a1a1a]">
            About me
          </h2>
          <span
            className="h-px min-w-[2rem] flex-1 bg-[#1a1a1a]/80"
            aria-hidden
          />
        </div>

        <p className="mt-4 text-[0.9375rem] leading-relaxed text-[#333]">
          Hello, I am {doctor.name}
        </p>

        <div className="relative mt-4 aspect-[4/5] w-full max-w-[220px] overflow-hidden bg-muted">
          <Image
            src={PHOTO_SRC}
            alt={photoAlt}
            fill
            className="object-cover object-top"
            sizes="220px"
          />
        </div>

        <p className="mt-4 text-[0.875rem] leading-[1.7] text-[#444]">
          I am a cosmetic surgeon and founder of{" "}
          <strong className="font-semibold text-[#1a1a1a]">
            Care Well Medical Centre
          </strong>{" "}
          in Delhi. I completed my{" "}
          <strong className="font-semibold text-[#1a1a1a]">MBBS</strong> and{" "}
          <strong className="font-semibold text-[#1a1a1a]">
            MS (General Surgery)
          </strong>{" "}
          from{" "}
          <strong className="font-semibold text-[#1a1a1a]">
            Aligarh Muslim University (AMU)
          </strong>
          , with further training at{" "}
          <strong className="font-semibold text-[#1a1a1a]">
            Walawalkar Hospital
          </strong>
          . My practice focuses on{" "}
          <strong className="font-semibold text-[#1a1a1a]">facelifts</strong>,{" "}
          <strong className="font-semibold text-[#1a1a1a]">rhinoplasty</strong>,{" "}
          <strong className="font-semibold text-[#1a1a1a]">liposuction</strong>,{" "}
          <strong className="font-semibold text-[#1a1a1a]">
            breast augmentation
          </strong>
          , and{" "}
          <strong className="font-semibold text-[#1a1a1a]">
            hair transplants
          </strong>
          .
        </p>

        <Link
          href="/about/dr-sandeep-bhasin/"
          className="mt-4 inline-flex text-small font-medium text-primary no-underline hover:underline"
        >
          View full profile →
        </Link>
      </div>
    </aside>
  );
}
