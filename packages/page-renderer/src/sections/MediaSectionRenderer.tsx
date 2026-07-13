import Image from "next/image";

import { cn } from "@/lib/utils";
import type {
  PresentationConfig,
  PresentationPage,
  SectionConfig,
} from "@/types/presentation-config";

export function MediaSectionRenderer({
  section,
  page,
  config,
  className,
}: {
  section: SectionConfig;
  page: PresentationPage;
  config: PresentationConfig;
  className?: string;
}) {
  const media = page.resolved.sectionMedia[section.id] ?? [];

  return (
    <section
      className={className}
      aria-label={section.type}
      data-presentation-section-type={section.type}
    >
      <div className="container-content">
        <h2 className="font-heading text-h3 font-semibold text-foreground">
          {section.settings.heading ||
            section.type
              .split("-")
              .map((part) => part[0]?.toUpperCase() + part.slice(1))
              .join(" ")}
        </h2>
        {section.settings.supportingText ? (
          <p className="mt-2 max-w-2xl text-body text-muted-foreground">
            {section.settings.supportingText}
          </p>
        ) : null}
        {media.length > 0 ? (
          <div
            className={cn(
              "mt-6 grid gap-4",
              section.type === "gallery"
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : "max-w-sm",
            )}
          >
            {media.map((item) => (
              <div
                key={item.databaseId}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden bg-muted",
                  config.content.imageStyle === "rounded" && "rounded-2xl",
                  config.content.imageStyle === "shadow" &&
                    "rounded-2xl shadow-lg",
                  config.content.imageStyle === "editorial" && "rounded-sm",
                )}
              >
                <Image
                  src={item.sourceUrl}
                  alt={item.altText || page.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 320px"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
