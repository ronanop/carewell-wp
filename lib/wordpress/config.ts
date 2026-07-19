import "server-only";

import { z } from "zod";

/** Default GraphQL request timeout in milliseconds. */
export const DEFAULT_TIMEOUT_MS = 20_000;

/** Maximum number of retries after the initial network failure. */
export const DEFAULT_MAX_RETRIES = 2;

/** Base delay (ms) used for exponential backoff between retries. */
export const DEFAULT_BACKOFF_BASE_MS = 500;

/**
 * Required WordPress environment variable names.
 * All must be present and non-empty at process startup.
 */
export const REQUIRED_WORDPRESS_ENV_VARS = [
  "NEXT_PUBLIC_SITE_URL",
  "WORDPRESS_GRAPHQL_ENDPOINT",
  "WEBHOOK_SECRET",
] as const;

/** Optional — media upload / authenticated WP REST. Missing does not block the site. */
export const OPTIONAL_WORDPRESS_CREDENTIAL_VARS = [
  "WORDPRESS_USERNAME",
  "WORDPRESS_APPLICATION_PASSWORD",
] as const;

/**
 * Zod schema for required WordPress / site environment variables.
 */
const wordpressEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string({
      error: "NEXT_PUBLIC_SITE_URL is required (canonical public site URL)",
    })
    .trim()
    .min(1, "NEXT_PUBLIC_SITE_URL must not be empty")
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL"),
  WORDPRESS_GRAPHQL_ENDPOINT: z
    .string({
      error: "WORDPRESS_GRAPHQL_ENDPOINT is required (WPGraphQL HTTP endpoint)",
    })
    .trim()
    .min(1, "WORDPRESS_GRAPHQL_ENDPOINT must not be empty")
    .url("WORDPRESS_GRAPHQL_ENDPOINT must be a valid URL"),
  WORDPRESS_USERNAME: z.string().trim().optional().default(""),
  WORDPRESS_APPLICATION_PASSWORD: z.string().trim().optional().default(""),
  WEBHOOK_SECRET: z
    .string({
      error: "WEBHOOK_SECRET is required (on-demand revalidation shared secret)",
    })
    .trim()
    .min(1, "WEBHOOK_SECRET must not be empty"),
});

/** Validated environment shape for WordPress integration. */
export type WordPressEnv = z.infer<typeof wordpressEnvSchema>;

/**
 * Server-only WordPress integration configuration.
 * Credentials and endpoint must never be exposed to the client bundle.
 */
export interface WordPressConfig {
  /** Absolute WPGraphQL HTTP endpoint URL. */
  endpoint: string;
  /** Public site URL used for canonical links and metadata. */
  siteUrl: string;
  /** WordPress username for Application Password auth. */
  username: string;
  /** WordPress Application Password (server-only). */
  applicationPassword: string;
  /** Shared secret for on-demand revalidation webhooks. */
  webhookSecret: string;
  /** Per-request timeout in milliseconds. */
  timeoutMs: number;
  /** Maximum retry attempts for transient network failures. */
  maxRetries: number;
  /** Base delay in ms for exponential backoff (`base * 2^attempt`). */
  backoffBaseMs: number;
}

/**
 * Formats Zod issues into a multi-line, actionable error message.
 *
 * @param error - Zod validation failure.
 * @returns Human-readable description of every missing/invalid variable.
 */
function formatEnvValidationError(error: z.ZodError): string {
  const lines = error.issues.map((issue) => {
    const key = issue.path.join(".") || "env";
    return `  - ${key}: ${issue.message}`;
  });

  return [
    "WordPress environment validation failed. Fix the following before starting the app:",
    ...lines,
    `Required variables: ${REQUIRED_WORDPRESS_ENV_VARS.join(", ")}`,
  ].join("\n");
}

/**
 * Validates every required WordPress environment variable and fails fast.
 * Intended for process startup (`instrumentation`) and config construction.
 *
 * @returns Parsed, trimmed environment values.
 * @throws {Error} When any required variable is missing or invalid.
 */
export function assertWordPressEnv(): WordPressEnv {
  const result = wordpressEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    WORDPRESS_GRAPHQL_ENDPOINT: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
    WORDPRESS_USERNAME: process.env.WORDPRESS_USERNAME,
    WORDPRESS_APPLICATION_PASSWORD: process.env.WORDPRESS_APPLICATION_PASSWORD,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
  });

  if (!result.success) {
    throw new Error(formatEnvValidationError(result.error));
  }

  return result.data;
}

/**
 * Builds WordPress config from validated process environment.
 *
 * @param overrides - Optional partial overrides for tests or DI.
 * @returns Validated {@link WordPressConfig}.
 * @throws {Error} When required environment variables are missing or invalid.
 */
export function getWordPressConfig(
  overrides: Partial<WordPressConfig> = {},
): WordPressConfig {
  const env = assertWordPressEnv();

  return {
    endpoint: overrides.endpoint ?? env.WORDPRESS_GRAPHQL_ENDPOINT,
    siteUrl: overrides.siteUrl ?? env.NEXT_PUBLIC_SITE_URL,
    username: overrides.username ?? env.WORDPRESS_USERNAME,
    applicationPassword:
      overrides.applicationPassword ?? env.WORDPRESS_APPLICATION_PASSWORD,
    webhookSecret: overrides.webhookSecret ?? env.WEBHOOK_SECRET,
    timeoutMs: overrides.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    maxRetries: overrides.maxRetries ?? DEFAULT_MAX_RETRIES,
    backoffBaseMs: overrides.backoffBaseMs ?? DEFAULT_BACKOFF_BASE_MS,
  };
}

/**
 * Creates an HTTP Basic Authorization header from Application Password credentials.
 *
 * Use only for WordPress REST API mutations (media upload/update). Do not send
 * this header on public WPGraphQL reads — authenticated GraphQL can 500 on some hosts.
 *
 * @param config - WordPress configuration.
 * @returns `Basic …` header value, or `""` when credentials are missing.
 */
export function createAuthorizationHeader(
  config: Pick<WordPressConfig, "username" | "applicationPassword">,
): string {
  if (!config.username || !config.applicationPassword) {
    return "";
  }

  const token = Buffer.from(
    `${config.username}:${config.applicationPassword}`,
    "utf8",
  ).toString("base64");

  return `Basic ${token}`;
}

/**
 * Returns whether the current Node environment is development.
 *
 * @returns `true` when `NODE_ENV` is `"development"`.
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}
