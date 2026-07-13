import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CTABanner() {
  return (
    <section className="bg-primary">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-h2 text-primary-foreground">
            Ready to begin your journey?
          </h2>
          <p className="mt-4 text-body-lg text-primary-foreground/80">
            Book a consultation with our specialists. We will take time to
            understand your goals and recommend a personalised plan of care.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-surface text-primary hover:bg-surface/90 no-underline hover:no-underline"
              )}
            >
              Book a consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
