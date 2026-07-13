import Image from "next/image";

import type { FeaturedImage } from "@/types/page";

export interface WordPressPageHeroProps {
  title: string;
  featuredImage: FeaturedImage | null;
}

/**
 * Page hero for WordPress-backed routes — title + optional featured image.
 */
export function WordPressPageHero({
  title,
  featuredImage,
}: WordPressPageHeroProps) {
  const hasImage = Boolean(featuredImage?.sourceUrl);

  return (
    <section className="bg-background" aria-labelledby="wordpress-page-title">
      <div className="container-content section-padding">
        <div
          className={
            hasImage
              ? "grid items-center gap-10 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:gap-14"
              : undefined
          }
        >
          <div className="min-w-0">
            <p className="text-label uppercase text-[#3B82F6]">
              Care Well Medical Centre
            </p>
            <h1
              id="wordpress-page-title"
              className="mt-3 font-heading text-h1 font-bold tracking-tight text-[#0A2540]"
            >
              {title}
            </h1>
          </div>

          {featuredImage?.sourceUrl ? (
            <div className="mx-auto w-full max-w-[26rem] lg:mx-0 lg:max-w-none">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-[0_8px_30px_rgb(10_37_64/0.08)]">
                <Image
                  src={featuredImage.sourceUrl}
                  alt={featuredImage.altText || title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 88vw, 26rem"
                  priority
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
