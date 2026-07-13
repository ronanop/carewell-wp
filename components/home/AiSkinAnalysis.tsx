import Link from "next/link";

import { AiSkinAnalysisScan } from "@/components/home/AiSkinAnalysisScan";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Homepage promo for AI skin analysis.
 * UI-only for now — real AI / camera integration comes later.
 */
export function AiSkinAnalysis() {
  return (
    <section className="bg-background" aria-labelledby="ai-skin-analysis-heading">
      <div className="container-content section-padding">
        <div
          className={cn(
            "flex flex-col items-center gap-8 rounded-2xl bg-surface p-6 sm:p-8 md:flex-row md:items-center md:justify-between md:gap-12 md:p-10 lg:p-12",
            "border border-border/60 shadow-[0_8px_30px_rgb(10_37_64/0.08)]"
          )}
        >
          <div className="min-w-0 flex-1 text-center md:text-left">
            <p className="text-label uppercase text-[#3B82F6]">AI Skin Analysis</p>
            <h2
              id="ai-skin-analysis-heading"
              className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
            >
              Analyze My Skin
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-body leading-relaxed text-muted-foreground md:mx-0">
              AI-powered analysis to identify your skin concerns and recommend
              the right treatment —guided by our clinical team in Delhi.
            </p>
            <div className="mt-7">
              {/* Placeholder CTA — wire to AI flow when backend is ready */}
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90 no-underline hover:no-underline"
                )}
              >
                Scan My Skin →
              </Link>
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
