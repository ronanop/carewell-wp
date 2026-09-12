import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { drSandeepBhasin } from "@/components/doctors/content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PHOTO_SRC = "/images/dr-sandeep-bhasin-portrait.png";

/**
 * Right-rail sidebar for blog posts — search + author card.
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
        className="flex w-full items-center gap-1.5 rounded-full border border-slate-200/90 bg-white p-1.5 shadow-[0_4px_20px_-8px_rgba(10,37,64,0.18)] transition-[border-color,box-shadow] focus-within:border-primary/30 focus-within:shadow-[0_6px_24px_-8px_rgba(10,37,64,0.22)] focus-within:ring-2 focus-within:ring-primary/10"
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
          className="min-w-0 flex-1 rounded-full border-0 bg-transparent px-4 py-2 text-small text-foreground outline-none placeholder:text-slate-400 focus-visible:ring-0"
        />
        <button
          type="submit"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-[background-color,transform,box-shadow] hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
          aria-label="Search"
        >
          <Search className="size-4" aria-hidden />
        </button>
      </form>

      <div
        className="mt-8 overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-surface via-surface to-surface-editorial"
        aria-labelledby="blog-sidebar-about-heading"
      >
        <div className="relative h-20 bg-[linear-gradient(135deg,#0A2540_0%,#1557A0_55%,#2D7A7A_100%)]">
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, white 0, transparent 45%), radial-gradient(circle at 80% 70%, white 0, transparent 40%)",
            }}
            aria-hidden
          />
        </div>

        <div className="relative px-5 pb-5 pt-0 text-center">
          <div className="-mt-11 mx-auto size-[5.5rem] overflow-hidden rounded-full border-[3px] border-white bg-muted shadow-[0_8px_24px_-10px_rgba(10,37,64,0.45)]">
            <div className="relative size-full">
              <Image
                src={PHOTO_SRC}
                alt={photoAlt}
                fill
                className="object-cover object-top"
                sizes="88px"
              />
            </div>
          </div>

          <p className="mt-4 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary">
            About the author
          </p>
          <h2
            id="blog-sidebar-about-heading"
            className="mt-1.5 font-heading text-lg font-semibold tracking-tight text-[#0A2540]"
          >
            {doctor.name}
          </h2>
          <p className="mt-1 text-[0.8125rem] font-medium leading-snug text-muted-foreground">
            {doctor.title}
          </p>

          <p className="mt-3 text-[0.8125rem] leading-relaxed text-slate-600">
            {doctor.heroSummary}
          </p>

          <dl className="mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface px-3.5 py-2.5 text-left">
              <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Experience
              </dt>
              <dd className="font-heading text-sm font-semibold text-[#0A2540]">
                20+ years
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface px-3.5 py-2.5 text-left">
              <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Role
              </dt>
              <dd className="text-right font-heading text-sm font-semibold text-[#0A2540]">
                Sr. Cosmetic Surgeon
              </dd>
            </div>
          </dl>

          <Link
            href="/about/dr-sandeep-bhasin/"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "mt-4 h-10 w-full gap-1.5 no-underline hover:no-underline",
            )}
          >
            View full profile
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </aside>
  );
}
