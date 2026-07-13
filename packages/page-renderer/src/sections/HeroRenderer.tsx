import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type {
  PresentationConfig,
  PresentationPage,
} from "@/types/presentation-config";

export function HeroRenderer({
  title,
  config,
  image,
  className,
}: {
  title: string;
  config: PresentationConfig;
  image: PresentationPage["resolved"]["heroImage"];
  className?: string;
}) {
  const height =
    config.hero.height === "compact"
      ? "min-h-[16rem]"
      : config.hero.height === "tall"
        ? "min-h-[28rem]"
        : "min-h-[22rem]";

  const imageTransform = config.hero.imageTransform;
  const objectPosition =
    imageTransform?.objectPositionX != null ||
    imageTransform?.objectPositionY != null
      ? `${imageTransform?.objectPositionX ?? 50}% ${imageTransform?.objectPositionY ?? 50}%`
      : "50% 50%";
  const objectFit = imageTransform?.objectFit ?? "cover";
  const imageScale = imageTransform?.scale ?? 1;
  const crop = imageTransform?.crop;

  return (
    <section
      className={cn("relative overflow-hidden", height, className)}
      aria-labelledby="presentation-hero-title"
      data-presentation-section-type="hero"
      data-manip-target="hero-image"
    >
      {image?.sourceUrl ? (
        <Image
          src={image.sourceUrl}
          alt={image.altText || title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          style={{
            objectFit,
            objectPosition,
            transform: `scale(${imageScale})`,
            transformOrigin: "center center",
            willChange: imageScale !== 1 ? "transform" : undefined,
            clipPath: crop
              ? `inset(${crop.y}% ${Math.max(0, 100 - crop.x - crop.width)}% ${Math.max(0, 100 - crop.y - crop.height)}% ${crop.x}%)`
              : undefined,
          }}
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0",
            config.hero.variant === "premium" &&
              "bg-gradient-to-br from-primary-800 via-primary-700 to-primary-500",
            config.hero.variant === "editorial" &&
              "bg-gradient-to-r from-neutral-900 to-neutral-700",
            config.hero.variant === "minimal" && "bg-muted",
          )}
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(0,0,0,${(config.hero.overlayStrength ?? 40) / 100})`,
        }}
      />
      <div
        className={cn(
          "relative z-10 flex h-full flex-col justify-end px-6 py-10 md:px-10",
          config.hero.headingAlignment === "center" &&
            "items-center text-center",
          config.hero.headingAlignment === "right" && "items-end text-right",
        )}
      >
        <div className="container-content w-full">
          <p
            className={cn(
              "text-label uppercase tracking-[0.14em]",
              config.hero.variant === "minimal"
                ? "text-primary"
                : "text-white/70",
            )}
          >
            Care Well Medical Centre
          </p>
          <h1
            id="presentation-hero-title"
            className={cn(
              "mt-3 max-w-3xl font-heading text-h1 font-bold tracking-tight",
              config.hero.variant === "minimal"
                ? "text-foreground"
                : "text-white",
            )}
          >
            {title}
          </h1>
          {config.hero.showCta ? (
            <div className="mt-6">
              <Link
                href="/contact"
                className={cn(
                  "inline-flex min-h-11 items-center rounded-md px-6 text-button font-medium no-underline",
                  config.hero.buttonVariant === "outline"
                    ? "border border-white text-white"
                    : config.hero.buttonVariant === "secondary"
                      ? "bg-white/20 text-white"
                      : "bg-white text-primary",
                )}
              >
                Book consultation
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
