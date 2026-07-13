import "server-only";

import type { GraphQLError as GraphQLErrorPayload } from "@/types/wordpress";

/**
 * Base class for all WordPress GraphQL client failures.
 */
export abstract class WordPressClientError extends Error {
  /**
   * @param message - Safe, non-sensitive error description.
   * @param options - Standard `Error` options (`cause`, etc.).
   */
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}

/**
 * Thrown when the GraphQL response contains one or more GraphQL errors.
 * Callers must never treat partial `data` as success when this is thrown.
 */
export class GraphQLError extends WordPressClientError {
  /** GraphQL error entries from the response body. */
  readonly errors: ReadonlyArray<GraphQLErrorPayload>;

  /**
   * @param message - Summary message for logging and upstream handlers.
   * @param errors - Raw GraphQL error payloads from the response.
   * @param options - Optional `Error` options.
   */
  constructor(
    message: string,
    errors: ReadonlyArray<GraphQLErrorPayload>,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.errors = errors;
  }
}

/**
 * Thrown when the HTTP request fails due to network or DNS errors.
 * Does not cover timeouts — see {@link TimeoutError}.
 */
export class NetworkError extends WordPressClientError {
  /**
   * @param message - Summary message for logging and upstream handlers.
   * @param options - Optional `Error` options.
   */
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

/**
 * Thrown when AbortController cancels a request due to the client timeout.
 */
export class TimeoutError extends WordPressClientError {
  /** Timeout budget that was exceeded, in milliseconds. */
  readonly timeoutMs: number;

  /**
   * @param message - Summary message for logging and upstream handlers.
   * @param timeoutMs - Configured timeout in milliseconds.
   * @param options - Optional `Error` options.
   */
  constructor(message: string, timeoutMs: number, options?: ErrorOptions) {
    super(message, options);
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Thrown when WordPress rejects credentials (HTTP 401/403).
 */
export class AuthenticationError extends WordPressClientError {
  /** HTTP status code from the rejected response. */
  readonly status: number;

  /**
   * @param message - Summary message for logging and upstream handlers.
   * @param status - HTTP status code (typically 401 or 403).
   * @param options - Optional `Error` options.
   */
  constructor(message: string, status: number, options?: ErrorOptions) {
    super(message, options);
    this.status = status;
  }
}

/**
 * Thrown when the HTTP response is unsuccessful for non-auth reasons.
 */
export class ResponseError extends WordPressClientError {
  /** HTTP status code from the failed response. */
  readonly status: number;
  /** HTTP status text from the failed response. */
  readonly statusText: string;

  /**
   * @param message - Summary message for logging and upstream handlers.
   * @param status - HTTP status code.
   * @param statusText - HTTP status text.
   * @param options - Optional `Error` options.
   */
  constructor(
    message: string,
    status: number,
    statusText: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * Thrown when a requested WordPress entity does not exist.
 */
export class NotFoundError extends WordPressClientError {
  /** Domain resource kind (e.g. `page`, `menu`). */
  readonly resource: string;
  /** Lookup key used in the request (uri, id, location). */
  readonly identifier: string;

  /**
   * @param resource - Domain resource kind.
   * @param identifier - Lookup key that was not found.
   * @param options - Optional `Error` options.
   */
  constructor(resource: string, identifier: string, options?: ErrorOptions) {
    super(`${resource} not found: ${identifier}`, options);
    this.resource = resource;
    this.identifier = identifier;
  }
}

/**
 * Thrown when GraphQL data fails repository validation / mapping.
 */
export class ValidationError extends WordPressClientError {
  /** Domain context for the failed validation. */
  readonly context: string;

  /**
   * @param message - Safe validation failure description.
   * @param context - Domain context (query or field path).
   * @param options - Optional `Error` options.
   */
  constructor(message: string, context: string, options?: ErrorOptions) {
    super(message, options);
    this.context = context;
  }
}

/**
 * Type guard for WordPress client error instances.
 *
 * @param error - Unknown thrown value.
 * @returns Whether `error` is a `WordPressClientError`.
 */
export function isWordPressClientError(
  error: unknown,
): error is WordPressClientError {
  return error instanceof WordPressClientError;
}
