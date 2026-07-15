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
            "flex flex-col items-center gap-8 rounded-2xl bg-surface p-6 sm:p-8 md:flex-row md:items-center md:justify-between md:gap-12 md:p-10 lg:p-12",
            "border border-border/60 shadow-[0_8px_30px_rgb(10_37_64/0.08)]",
          )}
        >
          <div className="min-w-0 flex-1 text-center md:text-left">
            <EditableElement
              id="home.ai-skin.label"
              kind="label"
              defaultValue={DEFAULT_LABEL}
              as="p"
              className="text-label uppercase text-[#3B82F6]"
            >
              {({ value }) => value || label}
            </EditableElement>
            <EditableElement
              id="home.ai-skin.heading"
              kind="heading"
              defaultValue={DEFAULT_HEADING}
              as="h2"
              className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
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
              className="mx-auto mt-4 max-w-lg text-body leading-relaxed text-muted-foreground md:mx-0"
            >
              {({ value }) => value || description}
            </EditableElement>
            <div className="mt-7">
              <EditableElement
                id="home.ai-skin.button"
                kind="button"
                field="label"
                defaultValue={DEFAULT_BUTTON_LABEL}
                as="div"
                className="inline-block"
              >
                {({ fields }) => (
                  <Link
                    href={String(fields.href ?? buttonHref)}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90 no-underline hover:no-underline",
                    )}
                  >
                    {String(fields.label ?? buttonLabel)}
                  </Link>
                )}
              </EditableElement>
            </div>
          </div>

          <div className="flex shrink-0 justify-center md:pr-2 lg:pr-4">
            <AiSkinAnalysisScan />
          </div>
        </div>
      </div>
    </section>
  );
}
