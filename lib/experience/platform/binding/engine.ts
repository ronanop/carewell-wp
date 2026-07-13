/**
 * Binding Engine — resolves PropBindings against BindingContext.
 * React components never see WordPress or binding paths.
 */

import type {
  BindingContext,
  BindingSchema,
  PropBinding,
} from "@/types/studio-platform";

function getByPath(source: unknown, path: string): unknown {
  if (!path) return undefined;
  const parts = path.split(".");
  let current: unknown = source;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

const COMPUTED: Record<
  string,
  (ctx: BindingContext, binding: PropBinding) => unknown
> = {
  featuredImageOrFallback: (ctx) => ctx.page.featuredImage?.url ?? null,
  pageTitleWithSite: (ctx) =>
    `${ctx.page.title} | ${ctx.site?.name ?? "Care Well Medical Centre"}`,
  isServicePage: (ctx) =>
    ctx.page.uri.includes("transplant") ||
    ctx.page.uri.includes("surgery") ||
    ctx.page.uri.includes("treatment"),
};

/**
 * Resolves one binding to a concrete prop value.
 */
export function resolveBinding(
  binding: PropBinding,
  context: BindingContext,
): unknown {
  switch (binding.kind) {
    case "static":
      return binding.value;
    case "field":
      return binding.path ? getByPath(context, binding.path) : undefined;
    case "computed": {
      if (!binding.compute) return undefined;
      const fn = COMPUTED[binding.compute];
      return fn ? fn(context, binding) : undefined;
    }
    case "expression":
      // Expression DSL reserved — return static fallback if provided.
      return binding.value;
    case "api":
      // Future API bindings — unresolved until API layer ships.
      return binding.value ?? null;
    default:
      return undefined;
  }
}

/**
 * Resolves an entire binding schema into component props.
 */
export function resolveBindings(
  schema: BindingSchema,
  context: BindingContext,
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  const props: Record<string, unknown> = { ...overrides };
  for (const [key, binding] of Object.entries(schema)) {
    if (key in overrides) continue;
    props[key] = resolveBinding(binding, context);
  }
  return props;
}

/**
 * Builds a BindingContext from PresentationEngine / page data.
 */
export function createBindingContext(input: {
  title: string;
  uri: string;
  slug: string;
  contentHtml: string;
  featuredImage: BindingContext["page"]["featuredImage"];
  seo: BindingContext["page"]["seo"];
  themeVariant: string;
  themeId?: string;
  device?: BindingContext["runtime"]["device"];
  doctor?: BindingContext["doctor"];
}): BindingContext {
  const normalized = input.uri.replace(/\/+$/, "") || "/";
  return {
    page: {
      title: input.title,
      uri: input.uri,
      slug: input.slug,
      contentHtml: input.contentHtml,
      featuredImage: input.featuredImage,
      seo: input.seo,
    },
    doctor: input.doctor ?? null,
    site: {
      name: "Care Well Medical Centre",
      phone: null,
    },
    theme: {
      id: input.themeId ?? "medical",
      variant: input.themeVariant,
    },
    runtime: {
      device: input.device ?? "desktop",
      path: normalized,
      isHomepage: normalized === "/",
      locale: "en-IN",
      now: new Date().toISOString(),
    },
    custom: {},
  };
}
