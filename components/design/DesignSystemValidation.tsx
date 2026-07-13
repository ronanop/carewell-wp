import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SectionBlock({
  label,
  title,
  description,
  children,
  className,
}: {
  label: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-t border-border pt-12 first:border-t-0 first:pt-0", className)}>
      <p className="text-label uppercase text-muted-foreground">{label}</p>
      <h2 className="mt-3 font-heading text-h2 text-foreground">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-body text-muted-foreground">
          {description}
        </p>
      ) : null}
      <div className="mt-8">{children}</div>
    </div>
  );
}

function DemoCard({
  title,
  description,
  variant = "default",
}: {
  title: string;
  description: string;
  variant?: "default" | "elevated" | "interactive";
}) {
  return (
    <article
      className={cn(
        "rounded-lg border border-border bg-surface p-6 transition-colors",
        variant === "elevated" && "shadow-md",
        variant === "interactive" &&
          "cursor-pointer hover:border-primary/30 hover:bg-secondary/40"
      )}
    >
      <h3 className="font-heading text-h4 text-foreground">{title}</h3>
      <p className="mt-2 text-small text-muted-foreground">{description}</p>
    </article>
  );
}

const spacingScale = [
  { token: "space-4", label: "16px", size: "var(--space-4)" },
  { token: "space-6", label: "24px", size: "var(--space-6)" },
  { token: "space-8", label: "32px", size: "var(--space-8)" },
  { token: "space-12", label: "48px", size: "var(--space-12)" },
  { token: "space-16", label: "64px", size: "var(--space-16)" },
];

const shadowScale = [
  { token: "shadow-xs", className: "shadow-xs" },
  { token: "shadow-sm", className: "shadow-sm" },
  { token: "shadow-md", className: "shadow-md" },
  { token: "shadow-lg", className: "shadow-lg" },
  { token: "shadow-xl", className: "shadow-xl" },
];

const radiusScale = [
  { token: "radius-sm", className: "rounded-sm" },
  { token: "radius-md", className: "rounded-md" },
  { token: "radius-lg", className: "rounded-lg" },
  { token: "radius-xl", className: "rounded-xl" },
  { token: "radius-2xl", className: "rounded-2xl" },
];

export function DesignSystemValidation() {
  return (
    <section className="bg-secondary/50">
      <div className="container-content section-padding">
        <p className="text-label uppercase text-accent">Foundation</p>
        <h2 className="mt-3 max-w-3xl font-heading text-h1 text-foreground">
          Designed for clarity, trust, and calm
        </h2>
        <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">
          Every element on this page reflects the visual language we are building
          for Care Well — editorial typography, generous spacing, and restrained
          colour that feels premium without excess.
        </p>

        <div className="mt-16 space-y-16">
          <SectionBlock
            label="Typography"
            title="A hierarchy that guides with confidence"
            description="Display type for moments of arrival. Headings for structure. Body copy that reads effortlessly."
          >
            <div className="space-y-8 rounded-lg border border-border bg-surface p-8">
              <div>
                <p className="text-caption text-muted-foreground">Display XL</p>
                <p className="mt-2 font-heading text-display-xl text-foreground">
                  Your health, elevated
                </p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">Display L</p>
                <p className="mt-2 font-heading text-display-lg text-foreground">
                  Specialist care in a refined setting
                </p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">H1</p>
                <p className="mt-2 font-heading text-h1 text-foreground">
                  Comprehensive medical services
                </p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">H2</p>
                <p className="mt-2 font-heading text-h2 text-foreground">
                  Personalised treatment plans
                </p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">H3</p>
                <p className="mt-2 font-heading text-h3 text-foreground">
                  Meet our specialists
                </p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">H4</p>
                <p className="mt-2 font-heading text-h4 text-foreground">
                  Dermatology &amp; aesthetics
                </p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">Body Large</p>
                <p className="mt-2 text-body-lg text-muted-foreground">
                  We take time to understand your concerns, explain your options
                  clearly, and recommend treatments grounded in clinical evidence.
                </p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">Body</p>
                <p className="mt-2 text-body text-muted-foreground">
                  Appointments are available by consultation. Our team responds
                  within one business day.
                </p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">Caption</p>
                <p className="mt-2 text-caption text-muted-foreground">
                  Results vary by individual. A consultation is required to
                  determine suitability.
                </p>
              </div>
            </div>
          </SectionBlock>

          <SectionBlock
            label="Actions"
            title="Clear paths to care"
            description="Buttons that invite action without pressure — primary for commitment, secondary for exploration."
          >
            <div className="flex flex-wrap items-center gap-4">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
              <Button disabled>Disabled</Button>
            </div>
            <p className="mt-4 text-caption text-muted-foreground">
              Hover states apply on pointer interaction — try each variant above.
            </p>
          </SectionBlock>

          <SectionBlock
            label="Cards"
            title="Structured content, quietly elevated"
            description="Cards organise services, specialists, and insights — bordered by default, with depth only when it serves hierarchy."
          >
            <div className="grid-cw">
              <div className="col-span-4 md:col-span-2 lg:col-span-4">
                <DemoCard
                  variant="default"
                  title="Default"
                  description="Border-led surface for everyday content blocks across the site."
                />
              </div>
              <div className="col-span-4 md:col-span-2 lg:col-span-4">
                <DemoCard
                  variant="elevated"
                  title="Elevated"
                  description="Subtle shadow for emphasis — featured services or highlighted insights."
                />
              </div>
              <div className="col-span-4 md:col-span-2 lg:col-span-4">
                <DemoCard
                  variant="interactive"
                  title="Interactive"
                  description="Hover state signals clickability — doctor profiles, service listings."
                />
              </div>
            </div>
          </SectionBlock>

          <SectionBlock
            label="Spacing"
            title="Breathing room that feels intentional"
            description="A 4px base grid keeps rhythm consistent from mobile to desktop."
          >
            <div className="space-y-4 rounded-lg border border-border bg-surface p-8">
              {spacingScale.map((item) => (
                <div key={item.token} className="flex items-center gap-6">
                  <span className="w-20 shrink-0 text-caption text-muted-foreground">
                    {item.token}
                  </span>
                  <div
                    className="h-3 rounded-sm bg-primary/20"
                    style={{ width: item.size }}
                  />
                  <span className="text-caption text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock
            label="Shadows"
            title="Depth used sparingly"
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {shadowScale.map((item) => (
                <div
                  key={item.token}
                  className={cn(
                    "flex h-24 items-end rounded-lg border border-border bg-surface p-4",
                    item.className
                  )}
                >
                  <span className="text-caption text-muted-foreground">
                    {item.token}
                  </span>
                </div>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock
            label="Radius"
            title="Soft corners, consistent geometry"
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {radiusScale.map((item) => (
                <div
                  key={item.token}
                  className={cn(
                    "flex h-24 items-end border border-border bg-surface p-4",
                    item.className
                  )}
                >
                  <span className="text-caption text-muted-foreground">
                    {item.token}
                  </span>
                </div>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock
            label="Containers"
            title="Content width for every context"
            description="Article for reading. Content for pages. Wide for heroes. Full for edge-to-edge moments."
          >
            <div className="space-y-6">
              <div className="overflow-hidden rounded-lg border border-dashed border-border">
                <div className="container-article bg-primary/5 px-6 py-4">
                  <p className="text-small text-foreground">
                    <span className="font-medium">Article</span> — optimised for
                    long-form reading and blog content.
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-dashed border-border">
                <div className="container-content bg-primary/5 py-4">
                  <p className="text-small text-foreground">
                    <span className="font-medium">Content</span> — default page
                    width for sections and layouts.
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-dashed border-border">
                <div className="container-wide bg-primary/5 px-6 py-4">
                  <p className="text-small text-foreground">
                    <span className="font-medium">Wide</span> — hero bands and
                    full-width feature rows.
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-dashed border-border">
                <div className="container-full bg-primary/5 px-6 py-4">
                  <p className="text-small text-foreground">
                    <span className="font-medium">Full</span> — edge-to-edge
                    with horizontal padding only.
                  </p>
                </div>
              </div>
            </div>
          </SectionBlock>

          <SectionBlock
            label="Grid"
            title="Responsive structure"
            description="Four columns on mobile, twelve on desktop — content adapts without losing hierarchy."
          >
            <div className="grid-cw">
              <div className="col-span-4 rounded-lg border border-border bg-surface p-4 lg:col-span-12">
                <p className="text-small text-muted-foreground">
                  Full width — 12 columns
                </p>
              </div>
              <div className="col-span-4 rounded-lg border border-border bg-surface p-4 lg:col-span-8">
                <p className="text-small text-muted-foreground">
                  Primary — 8 columns
                </p>
              </div>
              <div className="col-span-4 rounded-lg border border-border bg-surface p-4 lg:col-span-4">
                <p className="text-small text-muted-foreground">
                  Aside — 4 columns
                </p>
              </div>
              <div className="col-span-2 rounded-lg border border-border bg-surface p-4 lg:col-span-3">
                <p className="text-small text-muted-foreground">1/4</p>
              </div>
              <div className="col-span-2 rounded-lg border border-border bg-surface p-4 lg:col-span-3">
                <p className="text-small text-muted-foreground">1/4</p>
              </div>
              <div className="col-span-2 rounded-lg border border-border bg-surface p-4 lg:col-span-3">
                <p className="text-small text-muted-foreground">1/4</p>
              </div>
              <div className="col-span-2 rounded-lg border border-border bg-surface p-4 lg:col-span-3">
                <p className="text-small text-muted-foreground">1/4</p>
              </div>
            </div>
          </SectionBlock>
        </div>
      </div>
    </section>
  );
}
