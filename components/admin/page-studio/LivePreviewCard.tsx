"use client";

import { motion } from "framer-motion";

import type { PresentationConfig } from "@/types/presentation-config";
import { cn } from "@/lib/utils";

type PreviewDevice = "desktop" | "tablet" | "mobile";

type LivePreviewCardProps = {
  title: string;
  uri: string;
  config: PresentationConfig;
  heroPreviewUrl?: string | null;
  device: PreviewDevice;
};

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  trust: "Trust",
  content: "Content",
  gallery: "Gallery",
  doctor: "Doctor",
  pricing: "Pricing",
  timeline: "Timeline",
  faq: "FAQ",
  location: "Location",
  "related-treatments": "Related Treatments",
  "related-blogs": "Related Blogs",
  testimonials: "Testimonials",
  cta: "CTA",
};

/**
 * Realistic presentation preview card with device frames.
 */
export function LivePreviewCard({
  title,
  uri,
  config,
  heroPreviewUrl,
  device,
}: LivePreviewCardProps) {
  const widthClass =
    device === "mobile"
      ? "max-w-[22rem]"
      : device === "tablet"
        ? "max-w-[34rem]"
        : "max-w-full";

  const heroHeight =
    config.hero.height === "compact"
      ? "h-28"
      : config.hero.height === "tall"
        ? "h-52"
        : "h-40";

  const readingWidth =
    config.content.readingWidth === "landing"
      ? "max-w-[92%]"
      : config.content.readingWidth === "article"
        ? "max-w-[68%]"
        : config.content.readingWidth === "wide"
          ? "max-w-full"
          : "max-w-[80%]";

  const themeTint =
    config.theme.variant === "warm"
      ? "from-amber-50/80 to-white"
      : config.theme.variant === "minimal"
        ? "from-neutral-50 to-white"
        : config.theme.variant === "editorial"
          ? "from-stone-100 to-white"
          : "from-teal-50/70 to-white";

  const enabledSections = config.sections.filter((section) => {
    if (section.type === "hero") return config.hero.enabled && section.enabled;
    return section.enabled;
  });

  const breadcrumbHidden = config.navigation.breadcrumbStyle === "hidden";
  const breadcrumbTone =
    config.navigation.breadcrumbStyle === "dark"
      ? "bg-neutral-900 text-neutral-200"
      : config.navigation.breadcrumbStyle === "transparent"
        ? "bg-transparent text-neutral-600"
        : "bg-neutral-50 text-neutral-600";

  return (
    <div className={cn("mx-auto w-full transition-all", widthClass)}>
      <motion.div
        layout
        className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
      >
        <div className="border-b border-border bg-muted/40 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-red-300" />
            <span className="size-2.5 rounded-full bg-amber-300" />
            <span className="size-2.5 rounded-full bg-emerald-300" />
            <span className="ml-2 truncate font-mono text-[0.6875rem] text-muted-foreground">
              {uri}
            </span>
          </div>
        </div>

        <div className={cn("bg-gradient-to-b", themeTint)}>
          {config.hero.enabled ? (
            <div
              className={cn(
                "relative overflow-hidden",
                heroHeight,
                config.hero.variant === "premium" &&
                  "bg-gradient-to-br from-primary-800 via-primary-700 to-primary-500",
                config.hero.variant === "editorial" &&
                  "bg-gradient-to-r from-neutral-900 to-neutral-700",
                config.hero.variant === "minimal" && "bg-neutral-100",
              )}
              style={
                heroPreviewUrl && config.hero.imageSource !== "none"
                  ? {
                      backgroundImage: `linear-gradient(rgba(0,0,0,${config.hero.overlayStrength / 100}), rgba(0,0,0,${config.hero.overlayStrength / 100})), url(${heroPreviewUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              <div
                className={cn(
                  "relative z-10 flex h-full flex-col justify-end p-5",
                  config.hero.headingAlignment === "center" &&
                    "items-center text-center",
                  config.hero.headingAlignment === "right" &&
                    "items-end text-right",
                )}
              >
                <p
                  className={cn(
                    "text-[0.625rem] uppercase tracking-[0.14em]",
                    config.hero.variant === "minimal"
                      ? "text-muted-foreground"
                      : "text-white/70",
                  )}
                >
                  {config.templateSlug ?? "Page"}
                </p>
                <h3
                  className={cn(
                    "mt-1 max-w-[90%] font-heading text-lg font-semibold leading-snug",
                    config.hero.variant === "minimal"
                      ? "text-foreground"
                      : "text-white",
                    config.content.headingStyle === "bold" && "tracking-tight",
                    config.content.headingStyle === "quiet" && "font-medium",
                  )}
                >
                  {title}
                </h3>
                {config.hero.showTrustBadges ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["15+ yrs", "Delhi NCR", "Board certified"].map((badge) => (
                      <span
                        key={badge}
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[0.625rem]",
                          config.hero.variant === "minimal"
                            ? "bg-white text-muted-foreground ring-1 ring-border"
                            : "bg-white/15 text-white",
                        )}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                ) : null}
                {config.hero.showCta ? (
                  <div className="mt-3">
                    <span
                      className={cn(
                        "inline-flex rounded-md px-3 py-1.5 text-[0.6875rem] font-medium",
                        config.hero.buttonVariant === "outline"
                          ? "border border-white/70 text-white"
                          : config.hero.buttonVariant === "secondary"
                            ? "bg-white/20 text-white"
                            : "bg-white text-primary-800",
                      )}
                    >
                      Book consultation
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {!breadcrumbHidden ? (
            <div className={cn("px-5 py-2 text-[0.6875rem]", breadcrumbTone)}>
              Home / Treatments / {title}
            </div>
          ) : null}

          <div className="space-y-3 px-5 py-5">
            <div className="flex flex-wrap gap-2">
              <Chip label={`Anim · ${config.animation.preset}`} />
              <Chip label={`Theme · ${config.theme.variant}`} />
              <Chip label={`Width · ${config.content.readingWidth}`} />
              <Chip label={`Images · ${config.content.imageStyle}`} />
            </div>

            <ol className="space-y-1.5">
              {enabledSections.map((section, index) => (
                <motion.li
                  key={section.id}
                  layout
                  className={cn(
                    "rounded-lg border border-border/80 bg-white/70 px-3 py-2",
                    section.type === "content" && readingWidth,
                    section.background === "muted" && "bg-muted/70",
                    section.background === "tint" && "bg-primary/5",
                    section.spacing === "spacious" && "py-4",
                    section.spacing === "compact" && "py-1.5",
                  )}
                >
                  <div className="flex items-center gap-2 text-small text-foreground">
                    <span className="flex size-5 items-center justify-center rounded-md bg-muted text-[0.625rem] font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                    {SECTION_LABELS[section.type] ?? section.type}
                    <span className="ml-auto text-[0.625rem] uppercase tracking-wide text-muted-foreground">
                      {section.variant}
                    </span>
                  </div>
                  {section.type === "content" ? (
                    <div className="mt-2 space-y-1.5">
                      <div className="h-2.5 w-full rounded-full bg-foreground/70" />
                      <div className="h-2 w-5/6 rounded-full bg-muted-foreground/25" />
                      <div className="h-2 w-4/5 rounded-full bg-muted-foreground/20" />
                    </div>
                  ) : null}
                </motion.li>
              ))}
            </ol>
          </div>

          {(config.navigation.stickyCta || config.navigation.stickyMobileCta) &&
          (config.navigation.enableWhatsApp || config.navigation.enableCall) ? (
            <div className="border-t border-border bg-surface px-4 py-3">
              <div className="flex gap-2">
                {config.navigation.enableWhatsApp ? (
                  <span className="flex-1 rounded-lg bg-emerald-600 py-2 text-center text-[0.6875rem] font-medium text-white">
                    WhatsApp
                  </span>
                ) : null}
                {config.navigation.enableCall ? (
                  <span className="flex-1 rounded-lg bg-primary py-2 text-center text-[0.6875rem] font-medium text-primary-foreground">
                    Call
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-md bg-muted px-2 py-1 text-[0.625rem] text-muted-foreground">
      {label}
    </span>
  );
}
