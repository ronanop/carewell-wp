import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeader } from "@/components/ui/section-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const posts = [
  {
    title: "What to expect at your first dermatology consultation",
    excerpt:
      "A calm, structured visit designed to understand your concerns and outline evidence-based options.",
    category: "Patient guide",
    href: "/blogs/first-dermatology-consultation",
  },
  {
    title: "Understanding laser skin resurfacing",
    excerpt:
      "How the treatment works, who it suits, and what recovery typically involves.",
    category: "Treatments",
    href: "/blogs/laser-skin-resurfacing",
  },
  {
    title: "Building a skincare routine that works",
    excerpt:
      "Practical guidance from our specialists on daily care backed by clinical insight.",
    category: "Wellness",
    href: "/blogs/skincare-routine-guide",
  },
];

export function BlogSection() {
  return (
    <section className="bg-background">
      <div className="container-content section-padding">
        <SectionHeader
          overline="From our blog"
          title="Latest insights"
          description="Educational articles written to help you make informed decisions about your care."
        />

        <div className="mt-12 grid-cw">
          {posts.map((post) => (
            <article
              key={post.href}
              className="col-span-4 md:col-span-2 lg:col-span-4"
            >
              <Link
                href={post.href}
                className="group flex h-full flex-col rounded-lg border border-border bg-surface no-underline transition-colors hover:border-primary/30 hover:no-underline"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-secondary via-surface to-primary/5" />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-label uppercase text-accent">
                    {post.category}
                  </p>
                  <h3 className="mt-3 font-heading text-h4 text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-small text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-small font-medium text-primary">
                    Read article
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/blogs"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "no-underline hover:no-underline"
            )}
          >
            Read our blog
          </Link>
        </div>
      </div>
    </section>
  );
}
