"use client";

import Link from "next/link";

import { AiSkinAnalysisScan } from "@/components/home/AiSkinAnalysisScan";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { buttonVariants } from "@/components/ui/button";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/experience/static-pages/elementOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_LABEL = "AI Skin Analysis";
const DEFAULT_HEADING = "Analyze My Skin";
const DEFAULT_DESCRIPTION =
  "AI-powered analysis to identify your skin concerns and recommend the right treatment —guided by our clinical team in Delhi.";
const DEFAULT_BUTTON_LABEL = "Scan My Skin →";
const DEFAULT_BUTTON_HREF = "/contact";

/**
 * Homepage promo for AI skin analysis.
 * UI-only for now — real AI / camera integration comes later.
 */
export function AiSkinAnalysis() {
  const { config } = useStaticEditContext();

  const label = resolveElementText(config, "home.ai-skin.label", DEFAULT_LABEL);
  const heading = resolveElementText(
    config,
    "home.ai-skin.heading",
    DEFAULT_HEADING,
  );
  const description = resolveElementText(
    config,
    "home.ai-skin.description",
    DEFAULT_DESCRIPTION,
  );
  const buttonLabel = resolveElementField(
    config,
    "home.ai-skin.button",
    "label",
    DEFAULT_BUTTON_LABEL,
  );
  const buttonHref = resolveElementField(
    config,
    "home.ai-skin.button",
    "href",
    DEFAULT_BUTTON_HREF,
  );

  return (
    <section className="bg-background" aria-labelledby="ai-skin-analysis-heading">
      <div className="container-content section-padding">
        <div
          className={cn(
            // Mobile: compact vertical promo card
            "relative flex min-w-0 flex-col items-stretch gap-5 overflow-hidden rounded-2xl bg-surface px-5 py-6",
            "border border-border/60 shadow-[0_8px_30px_rgb(10_37_64/0.08)]",
            // Desktop (lg+): preserve side-by-side layout
            "lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:p-12",
          )}
        >
          {/* Copy + CTA — hierarchy: eyebrow → heading → body → CTA */}
          <div className="order-2 min-w-0 flex-1 text-center lg:order-1 lg:text-left">
            <EditableElement
              id="home.ai-skin.label"
              kind="label"
              defaultValue={DEFAULT_LABEL}
              as="p"
              className="text-label uppercase tracking-[0.14em] text-[#3B82F6]"
            >
              {({ value }) => value || label}
            </EditableElement>
            <EditableElement
              id="home.ai-skin.heading"
              kind="heading"
              defaultValue={DEFAULT_HEADING}
              as="h2"
              className="mt-2 font-heading text-[1.375rem] font-bold leading-snug text-[#0A2540] sm:mt-3 sm:text-[1.5rem] sm:leading-tight lg:text-h2"
            >
              {({ value }) => (
                <span id="ai-skin-analysis-heading">{value || heading}</span>
              )}
            </EditableElement>
            <EditableElement
              id="home.ai-skin.description"
              kind="paragraph"
              defaultValue={DEFAULT_DESCRIPTION}
              as="p"
              className="mx-auto mt-2.5 max-w-[22rem] text-[0.9375rem] leading-relaxed text-muted-foreground sm:mt-3 sm:max-w-lg sm:text-body lg:mx-0 lg:mt-4"
            >
              {({ value }) => value || description}
            </EditableElement>
            <div className="mt-5 sm:mt-6 lg:mt-7">
              <EditableElement
                id="home.ai-skin.button"
                kind="button"
                field="label"
                defaultValue={DEFAULT_BUTTON_LABEL}
                as="div"
                className="block w-full lg:inline-block lg:w-auto"
              >
                {({ fields }) => (
                  <Link
                    href={String(fields.href ?? buttonHref)}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-12 w-full rounded-lg bg-[#0A2540] text-base text-white no-underline hover:bg-[#0A2540]/90 hover:no-underline lg:h-11 lg:w-auto lg:text-sm",
                    )}
                  >
                    {String(fields.label ?? buttonLabel)}
                  </Link>
                )}
              </EditableElement>
            </div>
          </div>

          {/* Scan visual — compact on mobile, original scale on lg+ */}
          <div className="order-1 flex shrink-0 justify-center lg:order-2 lg:pr-4">
            <AiSkinAnalysisScan />
          </div>
        </div>
      </div>
    </section>
  );
}
