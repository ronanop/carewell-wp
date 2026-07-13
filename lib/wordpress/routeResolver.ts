import "server-only";

import { NotFoundError } from "@/lib/wordpress/errors";
import { getPageRepository } from "@/lib/wordpress/repositories/pageRepository";
import {
  isHandcraftedPath,
  normalizeUri,
} from "@/lib/wordpress/routeUtils";
import type { Page } from "@/types/page";

/**
 * Result of resolving a public URL against WordPress (and future content types).
 * Extend this union in `routeResolver` only — keep `app/[...uri]/page.tsx` stable.
 */
export type RouteResult =
  | {
      type: "page";
      page: Page;
    }
  | {
      type: "not-found";
    };

/**
 * Resolves a catch-all URI to a typed route result.
 *
 * Handcrafted App Router pages take precedence via Next.js file routing;
 * this function additionally refuses reserved paths and maps missing
 * WordPress pages to `{ type: "not-found" }`. Unexpected errors rethrow.
 *
 * @param uri - Normalized URI from {@link normalizeUri}.
 * @returns Discriminated {@link RouteResult}.
 */
export async function resolveRoute(uri: string): Promise<RouteResult> {
  if (uri === "/" || isHandcraftedPath(uri)) {
    return { type: "not-found" };
  }

  try {
    const page = await getPageRepository().getPageByUri(uri);
    return { type: "page", page };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { type: "not-found" };
    }
    throw error;
  }
}

/**
 * Normalizes catch-all params and resolves the route in one step.
 *
 * @param segments - `params.uri` from the catch-all page.
 * @returns Discriminated {@link RouteResult}.
 */
export async function resolveRouteFromSegments(
  segments: readonly string[] | undefined | null,
): Promise<RouteResult> {
  return resolveRoute(normalizeUri(segments));
}
