/**
 * Visual Rule Engine — evaluates block visibility before render.
 */

import type {
  BindingContext,
  BlockRules,
  VisibilityRule,
} from "@/types/studio-platform";

function getByPath(source: unknown, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = source;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function evaluateRule(rule: VisibilityRule, context: BindingContext): boolean {
  const actual = getByPath(context, rule.path);

  switch (rule.operator) {
    case "exists":
      return actual != null && actual !== "";
    case "notExists":
      return actual == null || actual === "";
    case "equals":
      return actual === rule.value;
    case "notEquals":
      return actual !== rule.value;
    case "includes":
      return Array.isArray(actual)
        ? actual.includes(rule.value)
        : typeof actual === "string" && typeof rule.value === "string"
          ? actual.includes(rule.value)
          : false;
    case "truthy":
      return Boolean(actual);
    case "falsy":
      return !actual;
    default:
      return true;
  }
}

/**
 * Returns whether a block should render given rules + binding context.
 */
export function evaluateBlockRules(
  rules: BlockRules | undefined,
  context: BindingContext,
  options?: {
    templateSlug?: string | null;
    themeId?: string | null;
  },
): boolean {
  if (!rules) return true;

  if (rules.visibility && rules.visibility !== "always") {
    const device = context.runtime.device;
    if (rules.visibility === "desktop" && device !== "desktop") return false;
    if (rules.visibility === "mobile" && device !== "mobile") return false;
    if (rules.visibility === "tablet" && device !== "tablet") return false;
  }

  if (rules.templates?.length) {
    const slug = options?.templateSlug ?? null;
    if (!slug || !rules.templates.includes(slug)) return false;
  }

  if (rules.themes?.length) {
    const themeId = options?.themeId ?? context.theme.id;
    if (!rules.themes.includes(themeId)) return false;
  }

  if (rules.schedule) {
    const now = new Date(context.runtime.now).getTime();
    if (rules.schedule.startAt) {
      const start = new Date(rules.schedule.startAt).getTime();
      if (!Number.isNaN(start) && now < start) return false;
    }
    if (rules.schedule.endAt) {
      const end = new Date(rules.schedule.endAt).getTime();
      if (!Number.isNaN(end) && now > end) return false;
    }
  }

  // Future targeting slots — reserved, currently no-op when null.
  if (rules.requireAuth === true) {
    // Auth context not wired on public site; treat as hidden until session binding exists.
    return false;
  }

  for (const rule of rules.when ?? []) {
    if (!evaluateRule(rule, context)) return false;
  }

  return true;
}
