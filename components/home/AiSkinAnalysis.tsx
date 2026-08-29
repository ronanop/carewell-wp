"use client";

import Link from "next/link";

import { AiSkinAnalysisScan } from "@/components/home/AiSkinAnalysisScan";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { buttonVariants } from "@/components/ui/button";
import { StaggerReveal } from "@/components/ui/StaggerReveal";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/static-pages/elementOverrides";
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
    <section
      className="bg-background lg:-mt-16"
      aria-labelledby="ai-skin-analysis-heading"
    >
      <style>{`
        @keyframes ai-skin-rgb-border {
          0%,
          100% {
            background-position: 0% 50%, 0% 50%;
          }
          50% {
            background-position: 100% 50%, 100% 50%;
          }
        }

        .ai-skin-analysis-card {
          border: 1.5px solid transparent;
          background-image:
            linear-gradient(var(--surface), var(--surface)),
            linear-gradient(
              115deg,
              #ff3cac,
              #784ba0,
              #2b86c5,
              #00f5a0,
              #ffcc70,
              #ff3cac
            );
          background-origin: border-box;
          background-clip: padding-box, border-box;
          background-size: 100% 100%, 300% 300%;
          animation: ai-skin-rgb-border 9s ease-in-out infinite;
          box-shadow:
            0 8px 30px rgb(10 37 64 / 0.08),
            0 0 20px rgb(59 130 246 / 0.16),
            0 0 28px rgb(236 72 153 / 0.1);
        }

        @media (prefers-reduced-motion: reduce) {
          .ai-skin-analysis-card {
            animation: none;
          }
        }
      `}</style>
      <div className="container-content section-padding lg:pt-[50px]">
        <StaggerReveal
          stepMs={80}
          className={cn(
            // Mobile: compact vertical promo card
            "relative flex min-w-0 flex-col items-stretch gap-4 overflow-hidden rounded-xl bg-surface px-4 py-4",
            "ai-skin-analysis-card border-transparent",
            // Desktop (lg+): preserve side-by-side layout
            "sm:gap-5 sm:rounded-2xl sm:px-5 sm:py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:p-12",
          )}
        >
          {/* Copy + CTA — hierarchy: eyebrow → heading → body → CTA */}
          <div className="order-2 min-w-0 flex-1 text-center lg:order-1 lg:text-left">
            <EditableElement
              id="home.ai-skin.label"
              kind="label"
              defaultValue={DEFAULT_LABEL}
              as="p"
              className="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-[#3B82F6] sm:text-[0.9rem]"
            >
              {({ value }) => value || label}
            </EditableElement>
            <EditableElement
              id="home.ai-skin.heading"
              kind="heading"
              defaultValue={DEFAULT_HEADING}
              as="h2"
              className="mt-1.5 font-heading text-[1.3rem] font-bold leading-snug text-[#0A2540] sm:mt-3 sm:text-[1.8rem] sm:leading-tight lg:text-[2.7rem]"
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
              className="mx-auto mt-2 max-w-[18rem] text-[0.75rem] font-medium leading-relaxed text-slate-600 sm:mt-3 sm:max-w-lg sm:text-[1.3rem] lg:mx-0 lg:mt-4"
            >
              {({ value }) => value || description}
            </EditableElement>
            <div className="mt-3 sm:mt-6 lg:mt-7">
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
                      "h-10 w-full rounded-lg bg-[#0A2540] text-[0.75rem] text-white no-underline hover:bg-[#0A2540]/90 hover:no-underline sm:h-12 sm:text-[1.2rem] lg:h-11 lg:w-auto lg:text-[1.05rem]",
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
        </StaggerReveal>
      </div>
    </section>
  );
}
