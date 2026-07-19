import "server-only";

import {
  AuthenticationError,
  NetworkError,
  ResponseError,
  TimeoutError,
} from "@/lib/wordpress/errors";
import type { WordPressConfig } from "@/lib/wordpress/config";

/**
 * HTTP status codes that must never be retried.
 */
export const NON_RETRYABLE_HTTP_STATUSES = [401, 403, 404, 500] as const;

/**
 * Next.js data-cache options supported by the WordPress fetch layer.
 */
export interface WordPressFetchCacheOptions {
  /** Next.js fetch cache mode. */
  cache?: "force-cache" | "no-store";
  /** Next.js ISR / tag revalidation options. */
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

/**
 * Injectable dependencies for the low-level HTTP helper (tests / DI).
 */
export interface WordPressFetchDependencies {
  /** Fetch implementation; defaults to global `fetch`. */
  fetchFn?: typeof fetch;
  /** Delay helper used between retries. */
  sleep?: (ms: number) => Promise<void>;
}

/**
 * Parameters for a single WordPress GraphQL HTTP POST.
 */
export interface WordPressHttpRequest extends WordPressFetchCacheOptions {
  /** Absolute GraphQL endpoint URL. */
  endpoint: string;
  /** Serialized GraphQL request body. */
  body: string;
  /** Optional Basic auth header value. */
  authorization?: string;
  /** Additional request headers (merged after defaults; auth wins). */
  headers?: Record<string, string>;
  /** Optional caller abort signal (combined with the timeout signal). */
  signal?: AbortSignal;
  /** Request timeout in milliseconds. */
  timeoutMs: number;
  /** Maximum retry attempts for network failures only. */
  maxRetries: number;
  /** Base delay in ms for exponential backoff. */
  backoffBaseMs: number;
  /** Short operation label for development logs (never secrets). */
  operationLabel?: string;
}

/**
 * Default sleep implementation.
 *
 * @param ms - Milliseconds to wait.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Computes exponential backoff delay for a zero-based retry attempt.
 *
 * @param attempt - Zero-based retry index (0 = first retry).
 * @param baseMs - Base delay in milliseconds.
 * @returns Delay in milliseconds (`baseMs * 2^attempt`).
 */
export function computeBackoffMs(attempt: number, baseMs: number): number {
  return baseMs * 2 ** attempt;
}

/**
 * Returns true when an error is a retryable network failure.
 * Timeouts, auth failures, and HTTP 401/403/404/500 never retry.
 *
 * @param error - Unknown thrown value.
 */
export function isRetryableNetworkFailure(error: unknown): boolean {
  if (error instanceof TimeoutError) {
    return false;
  }

  if (error instanceof AuthenticationError) {
    return false;
  }

  if (error instanceof ResponseError) {
    return false;
  }

  if (error instanceof NetworkError) {
    return true;
  }

  if (error instanceof TypeError) {
    return true;
  }

  return false;
}

/**
 * Returns whether an HTTP status must never enter retry logic.
 *
 * @param status - HTTP status code.
 */
export function isNonRetryableHttpStatus(status: number): boolean {
  return (NON_RETRYABLE_HTTP_STATUSES as readonly number[]).includes(status);
}

/**
 * Performs a single POST with AbortController timeout.
 *
 * @param request - HTTP request parameters.
 * @param deps - Injectable fetch dependencies.
 * @returns Resolved `Response` on HTTP completion (including 4xx/5xx).
 */
async function performOnce(
  request: WordPressHttpRequest,
  deps: Required<Pick<WordPressFetchDependencies, "fetchFn">>,
): Promise<Response> {
  const controller = new AbortController();
  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, request.timeoutMs);

  const onExternalAbort = (): void => {
    controller.abort();
  };

  if (request.signal) {
    if (request.signal.aborted) {
      controller.abort();
    } else {
      request.signal.addEventListener("abort", onExternalAbort, { once: true });
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...request.headers,
  };

  if (request.authorization) {
    headers.Authorization = request.authorization;
  }

  const init: RequestInit = {
    method: "POST",
    headers,
    body: request.body,
    signal: controller.signal,
  };

  if (request.cache !== undefined) {
    init.cache = request.cache;
  }

  if (request.next !== undefined) {
    init.next = request.next;
  }

  try {
    return await deps.fetchFn(request.endpoint, init);
  } catch (error: unknown) {
    const aborted =
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "TimeoutError");

    if (aborted && timedOut) {
      throw new TimeoutError(
        `WordPress GraphQL request timed out after ${request.timeoutMs}ms`,
        request.timeoutMs,
        { cause: error },
      );
    }

    throw new NetworkError("WordPress GraphQL network request failed", {
      cause: error,
    });
  } finally {
    clearTimeout(timeoutId);
    request.signal?.removeEventListener("abort", onExternalAbort);
  }
}

/**
 * Maps an HTTP response to a typed client error when unsuccessful.
 *
 * @param response - Fetch response.
 * @throws {AuthenticationError} On 401/403.
 * @throws {ResponseError} On other non-OK statuses (including 404 and 500).
 */
export function assertOkResponse(response: Response): void {
  if (response.ok) {
    return;
  }

  if (response.status === 401 || response.status === 403) {
    throw new AuthenticationError(
      "WordPress GraphQL authentication failed",
      response.status,
    );
  }

  throw new ResponseError(
    `WordPress GraphQL HTTP ${response.status}`,
    response.status,
    response.statusText,
  );
}

/**
 * POSTs to WordPress GraphQL with timeout and network-only retries.
 * HTTP 401, 403, 404, and 500 never enter retry logic.
 *
 * @param request - HTTP request parameters.
 * @param deps - Optional injectable dependencies.
 * @returns Successful HTTP `Response`.
 */
export async function wordpressFetch(
  request: WordPressHttpRequest,
  deps: WordPressFetchDependencies = {},
): Promise<Response> {
  const fetchFn = deps.fetchFn ?? fetch;
  const sleepFn = deps.sleep ?? sleep;
  const maxAttempts = request.maxRetries + 1;

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await performOnce(request, { fetchFn });
      // 401/403/404/500 throw here and never reach the retry branch below.
      assertOkResponse(response);
      return response;
    } catch (error: unknown) {
      lastError = error;

      if (
        error instanceof ResponseError &&
        isNonRetryableHttpStatus(error.status)
      ) {
        throw error;
      }

      if (error instanceof AuthenticationError) {
        throw error;
      }

      const canRetry =
        isRetryableNetworkFailure(error) && attempt < request.maxRetries;

      if (!canRetry) {
        throw error;
      }

      const delayMs = computeBackoffMs(attempt, request.backoffBaseMs);
      await sleepFn(delayMs);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new NetworkError("WordPress GraphQL request failed after retries");
}

/**
 * Options accepted when building an HTTP request from GraphQL options.
 */
export interface BuildHttpRequestOptions extends WordPressFetchCacheOptions {
  /** Additional request headers. */
  headers?: Record<string, string>;
  /** Optional caller abort signal. */
  signal?: AbortSignal;
  /** Safe operation label for development logs. */
  operationLabel?: string;
}

/**
 * Builds a {@link WordPressHttpRequest} from config and body.
 *
 * Public GraphQL reads are unauthenticated. Application Password Basic Auth is
 * only for WordPress REST media upload/update (see AssetProvider) — never attach
 * it here; some WP hosts return HTTP 500 when GraphQL is called with Basic Auth.
 *
 * @param config - WordPress configuration.
 * @param body - JSON-serialized GraphQL body.
 * @param options - Cache, headers, signal, and label options.
 */
export function buildHttpRequest(
  config: WordPressConfig,
  body: string,
  options: BuildHttpRequestOptions = {},
): WordPressHttpRequest {
  return {
    endpoint: config.endpoint,
    body,
    headers: options.headers,
    signal: options.signal,
    timeoutMs: config.timeoutMs,
    maxRetries: config.maxRetries,
    backoffBaseMs: config.backoffBaseMs,
    cache: options.cache,
    next: options.next,
    operationLabel: options.operationLabel,
  };
}
