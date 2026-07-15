"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HOME_BLOG_DEFAULTS } from "@/components/home/homeContent.elements";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { buttonVariants } from "@/components/ui/button";
import { resolveElementText } from "@/lib/experience/static-pages/elementOverrides";
import { resolveRepeaterItems } from "@/lib/experience/static-pages/repeaterOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_OVERLINE = "From our blog";
const DEFAULT_HEADING = "Latest insights";
const DEFAULT_DESCRIPTION =
  "Educational articles written to help you make informed decisions about your care.";

export function BlogSection() {
  const { config } = useStaticEditContext();

  const overline = resolveElementText(
    config,
    "home.blog.overline",
    DEFAULT_OVERLINE,
  );
  const heading = resolveElementText(
    config,
    "home.blog.heading",
    DEFAULT_HEADING,
  );
  const description = resolveElementText(
    config,
    "home.blog.description",
    DEFAULT_DESCRIPTION,
  );

  const posts = resolveRepeaterItems(
    config,
    "home.blog",
    HOME_BLOG_DEFAULTS.map((item) => ({ ...item })),
    ["title", "excerpt", "category", "href"],
  );

  return (
    <section className="bg-background">
      <div className="container-content section-padding">
        <div>
          <EditableElement
            id="home.blog.overline"
            kind="label"
            defaultValue={DEFAULT_OVERLINE}
            as="p"
            className="text-label uppercase text-accent"
          >
            {({ value }) => value || overline}
          </EditableElement>
          <EditableElement
            id="home.blog.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className="mt-3 font-heading text-h2 text-foreground"
          >
            {({ value }) => value || heading}
          </EditableElement>
          <EditableElement
            id="home.blog.description"
            kind="paragraph"
            defaultValue={DEFAULT_DESCRIPTION}
            as="p"
            className="mt-4 max-w-2xl text-body-lg text-muted-foreground"
          >
            {({ value }) => value || description}
          </EditableElement>
        </div>

        <div className="mt-12 grid-cw">
          {posts.map((post) => {
            const href = String(post.href ?? "#");
            const title = String(post.title ?? "");
            const excerpt = String(post.excerpt ?? "");
            const category = String(post.category ?? "");

            return (
              <article
                key={post.__index}
                className="col-span-4 md:col-span-2 lg:col-span-4"
              >
                <EditableElement
                  id={`home.blog.item.${post.__index}.title`}
                  kind="card"
                  defaultValue={title}
                >
                  {() => (
                    <Link
                      href={href}
                      className="group flex h-full flex-col rounded-lg border border-border bg-surface no-underline transition-colors hover:border-primary/30 hover:no-underline"
                    >
                      <div className="aspect-[16/10] bg-gradient-to-br from-secondary via-surface to-primary/5" />
                      <div className="flex flex-1 flex-col p-6">
                        <EditableElement
                          id={`home.blog.item.${post.__index}.category`}
                          kind="label"
                          defaultValue={category}
                          as="p"
                          className="text-label uppercase text-accent"
                        >
                          {({ value }) => value || category}
                        </EditableElement>
                        <h3 className="mt-3 font-heading text-h4 text-foreground transition-colors group-hover:text-primary">
                          {title}
                        </h3>
                        <EditableElement
                          id={`home.blog.item.${post.__index}.excerpt`}
                          kind="paragraph"
                          defaultValue={excerpt}
                          as="p"
                          className="mt-3 flex-1 text-small text-muted-foreground"
                        >
                          {({ value }) => value || excerpt}
                        </EditableElement>
                        <span className="mt-6 inline-flex items-center gap-2 text-small font-medium text-primary">
                          Read article
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  )}
                </EditableElement>
              </article>
            );
          })}
        </div>

        <div className="mt-12">
          <Link
            href="/blogs"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "no-underline hover:no-underline",
            )}
          >
            Read our blog
          </Link>
        </div>
      </div>
    </section>
  );
}
