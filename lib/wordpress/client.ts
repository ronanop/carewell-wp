import "server-only";

import {
  getWordPressConfig,
  isDevelopment,
  type WordPressConfig,
} from "@/lib/wordpress/config";
import { GraphQLError } from "@/lib/wordpress/errors";
import {
  buildHttpRequest,
  wordpressFetch,
  type WordPressFetchDependencies,
} from "@/lib/wordpress/fetch";
import type { GraphQLResponse } from "@/types/wordpress";

/**
 * Variables object accepted by GraphQL operations.
 */
export type GraphQLVariables = Record<string, unknown>;

/**
 * Options for {@link fetchGraphQL}.
 */
export interface FetchGraphQLOptions {
  /** GraphQL variables for the operation. */
  variables?: GraphQLVariables;
  /** Next.js fetch cache mode. */
  cache?: "force-cache" | "no-store";
  /** Next.js ISR / tag revalidation options. */
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  /** Additional HTTP headers merged into the request. */
  headers?: Record<string, string>;
  /** Optional abort signal from the caller. */
  signal?: AbortSignal;
  /** Optional safe label for development timing logs. */
  operationName?: string;
}

/**
 * Configurable GraphQL client bound to a WordPress config + fetch deps.
 */
export interface WordPressGraphQLClient {
  /**
   * Executes a GraphQL operation and returns typed `data`.
   *
   * @typeParam T - Expected `data` shape.
   * @param query - GraphQL document string.
   * @param options - Variables, cache, headers, and signal options.
   */
  fetchGraphQL: <T>(
    query: string,
    options?: FetchGraphQLOptions,
  ) => Promise<T>;
}

/**
 * Creates a WordPress GraphQL client with dependency injection.
 *
 * @param config - WordPress configuration (defaults to env-backed config).
 * @param deps - Optional fetch/sleep overrides for tests.
 * @returns A {@link WordPressGraphQLClient}.
 */
export function createWordPressClient(
  config: WordPressConfig = getWordPressConfig(),
  deps: WordPressFetchDependencies = {},
): WordPressGraphQLClient {
  return {
    async fetchGraphQL<T>(
      query: string,
      options: FetchGraphQLOptions = {},
    ): Promise<T> {
      return executeGraphQL<T>(query, options, config, deps);
    },
  };
}

/**
 * Default singleton client using environment configuration.
 * Instantiated lazily on first use via {@link getWordPressClient}.
 */
let defaultClient: WordPressGraphQLClient | undefined;

/**
 * Returns the shared WordPress GraphQL client singleton.
 *
 * @returns Default {@link WordPressGraphQLClient}.
 */
export function getWordPressClient(): WordPressGraphQLClient {
  if (!defaultClient) {
    defaultClient = createWordPressClient();
  }
  return defaultClient;
}

/**
 * Convenience helper: execute a GraphQL operation with the default client.
 *
 * @typeParam T - Expected `data` shape.
 * @param query - GraphQL document string.
 * @param options - Variables, cache, headers, and signal options.
 * @returns Typed GraphQL `data`.
 */
export async function fetchGraphQL<T>(
  query: string,
  options: FetchGraphQLOptions = {},
): Promise<T> {
  return getWordPressClient().fetchGraphQL<T>(query, options);
}

/**
 * Development-only timing log. Never runs in production.
 *
 * @param operationName - Safe query label.
 * @param durationMs - Elapsed request time in milliseconds.
 * @param cache - Cache mode used for the request.
 */
function logDevTiming(
  operationName: string,
  durationMs: number,
  cache: FetchGraphQLOptions["cache"],
): void {
  if (!isDevelopment()) {
    return;
  }

  const cacheLabel = cache ?? "default";
  console.info(
    `[WPGraphQL] ${operationName} • ${durationMs}ms • cache:${cacheLabel}`,
  );
}

/**
 * Core GraphQL execution: POST, parse JSON, surface typed errors.
 * Any response `errors` array causes {@link GraphQLError}; partial data is never returned.
 *
 * @typeParam T - Expected `data` shape.
 * @param query - GraphQL document string.
 * @param options - Variables and cache options.
 * @param config - WordPress configuration.
 * @param deps - Fetch dependencies.
 * @returns Typed `data` from the GraphQL response.
 */
async function executeGraphQL<T>(
  query: string,
  options: FetchGraphQLOptions,
  config: WordPressConfig,
  deps: WordPressFetchDependencies,
): Promise<T> {
  const operationName = options.operationName ?? "fetchGraphQL";
  const payload: { query: string; variables?: GraphQLVariables } = { query };

  if (options.variables !== undefined) {
    payload.variables = options.variables;
  }

  const body = JSON.stringify(payload);
  const httpRequest = buildHttpRequest(config, body, {
    cache: options.cache,
    next: options.next,
    headers: options.headers,
    signal: options.signal,
    operationLabel: operationName,
  });

  const startedAt = Date.now();
  const response = await wordpressFetch(httpRequest, deps);
  const json: unknown = await response.json();
  const data = unwrapGraphQLData<T>(json);

  logDevTiming(operationName, Date.now() - startedAt, options.cache);

  return data;
}

/**
 * Parses a GraphQL JSON body and returns `data` only when no errors are present.
 *
 * @typeParam T - Expected `data` shape.
 * @param value - Parsed JSON body.
 * @returns Typed GraphQL `data`.
 * @throws {GraphQLError} When an `errors` array is present or `data` is missing.
 */
function unwrapGraphQLData<T>(value: unknown): T {
  if (typeof value !== "object" || value === null) {
    throw new GraphQLError(
      "WordPress GraphQL response was not a JSON object",
      [],
    );
  }

  const record = value as Record<string, unknown>;

  if (Array.isArray(record.errors) && record.errors.length > 0) {
    const errors = record.errors.filter(isGraphQLErrorPayload);
    const payload =
      errors.length > 0
        ? errors
        : [{ message: "WordPress GraphQL returned an errors array" }];
    const summary = payload.map((error) => error.message).join("; ");

    throw new GraphQLError(
      `WordPress GraphQL returned errors: ${summary}`,
      payload,
    );
  }

  if (record.data === undefined || record.data === null) {
    throw new GraphQLError("WordPress GraphQL response contained no data", []);
  }

  return record.data as T;
}

/**
 * Type guard for a GraphQL error payload entry.
 *
 * @param value - Unknown array element.
 */
function isGraphQLErrorPayload(
  value: unknown,
): value is NonNullable<GraphQLResponse<unknown>["errors"]>[number] {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return typeof (value as { message?: unknown }).message === "string";
}
