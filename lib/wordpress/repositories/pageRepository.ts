import "server-only";

import {
  getWordPressClient,
  type FetchGraphQLOptions,
  type WordPressGraphQLClient,
} from "@/lib/wordpress/client";
import { NotFoundError } from "@/lib/wordpress/errors";
import { mapPage, mapPages, type WpPageNode } from "@/lib/wordpress/mappers/pageMapper";
import {
  getChildren as getChildrenQuery,
  getPageByUri as getPageByUriQuery,
  getPages as getPagesQuery,
} from "@/lib/wordpress/queries/pages";
import type { Page } from "@/types/page";
import type { WordPressPageSyncMeta } from "@/types/wordpress-page-sync";

/**
 * GraphQL data shape for {@link getPageByUriQuery}.
 */
interface GetPageByUriData {
  nodeByUri?: WpPageNode | null;
}

/**
 * GraphQL data shape for {@link getChildrenQuery}.
 */
interface GetChildrenData {
  page?: {
    id?: string | null;
    children?: { nodes?: Array<WpPageNode | null> | null } | null;
  } | null;
}

interface WpPageListNode {
  databaseId?: number | null;
  title?: string | null;
  slug?: string | null;
  uri?: string | null;
  status?: string | null;
  modified?: string | null;
  parent?: { node?: { databaseId?: number | null } | null } | null;
  template?: { templateName?: string | null } | null;
  featuredImage?: {
    node?: { sourceUrl?: string | null } | null;
  } | null;
  seo?: { title?: string | null } | null;
}

interface GetPagesData {
  pages?: {
    nodes?: Array<WpPageListNode | null> | null;
    pageInfo?: {
      hasNextPage?: boolean | null;
      endCursor?: string | null;
    } | null;
  } | null;
}

/**
 * Optional cache / fetch overrides for repository calls.
 */
export type RepositoryFetchOptions = Omit<
  FetchGraphQLOptions,
  "variables" | "operationName"
>;

/**
 * Page domain repository contract (replaceable via DI).
 */
export interface PageRepository {
  getPageByUri: (
    uri: string,
    options?: RepositoryFetchOptions,
  ) => Promise<Page>;

  getChildren: (
    uri: string,
    options?: RepositoryFetchOptions,
  ) => Promise<Page[]>;

  /**
   * Lists all pages as sync metadata (paginated fetch, no HTML content).
   */
  listPagesForSync: (
    options?: RepositoryFetchOptions,
  ) => Promise<WordPressPageSyncMeta[]>;
}

/**
 * Normalizes a WordPress URI to a leading-and-trailing-slash form.
 */
export function normalizePageUri(uri: string): string {
  const trimmed = uri.trim();
  if (trimmed === "" || trimmed === "/") {
    return "/";
  }

  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

function mapSyncMeta(node: WpPageListNode): WordPressPageSyncMeta | null {
  if (
    typeof node.databaseId !== "number" ||
    !node.slug ||
    !node.uri ||
    !node.title
  ) {
    return null;
  }

  const modifiedRaw = node.modified ?? null;
  const modifiedAt = modifiedRaw ? new Date(modifiedRaw) : new Date();

  return {
    databaseId: node.databaseId,
    uri: normalizePageUri(node.uri),
    slug: node.slug,
    title: node.title,
    status: (node.status ?? "publish").toLowerCase(),
    wpTemplate: node.template?.templateName?.trim() || null,
    featuredImageUrl: node.featuredImage?.node?.sourceUrl ?? null,
    seoTitle: node.seo?.title?.trim() || null,
    modifiedAt: Number.isNaN(modifiedAt.getTime()) ? new Date() : modifiedAt,
    parentDatabaseId:
      typeof node.parent?.node?.databaseId === "number"
        ? node.parent.node.databaseId
        : null,
  };
}

/**
 * Creates a page repository bound to a GraphQL client.
 */
export function createPageRepository(
  client: WordPressGraphQLClient = getWordPressClient(),
): PageRepository {
  return {
    async getPageByUri(uri, options = {}) {
      const normalizedUri = normalizePageUri(uri);
      const data = await client.fetchGraphQL<GetPageByUriData>(
        getPageByUriQuery,
        {
          ...options,
          variables: { uri: normalizedUri },
          operationName: "GetPageByUri",
        },
      );

      const node = data.nodeByUri;
      if (
        !node ||
        (node.__typename !== undefined && node.__typename !== "Page") ||
        typeof node.databaseId !== "number" ||
        !node.slug
      ) {
        throw new NotFoundError("page", normalizedUri);
      }

      return mapPage(node, `getPageByUri:${normalizedUri}`);
    },

    async getChildren(uri, options = {}) {
      const normalizedUri = normalizePageUri(uri);
      const data = await client.fetchGraphQL<GetChildrenData>(
        getChildrenQuery,
        {
          ...options,
          variables: {
            id: normalizedUri,
            idType: "URI",
            first: 100,
          },
          operationName: "GetChildren",
        },
      );

      if (!data.page) {
        throw new NotFoundError("page", normalizedUri);
      }

      return mapPages(
        data.page.children?.nodes,
        `getChildren:${normalizedUri}`,
      );
    },

    async listPagesForSync(options = {}) {
      const results: WordPressPageSyncMeta[] = [];
      let after: string | null = null;
      let hasNextPage = true;

      while (hasNextPage) {
        const data: GetPagesData = await client.fetchGraphQL<GetPagesData>(
          getPagesQuery,
          {
            ...options,
            variables: { first: 50, after },
            operationName: "GetPages",
          },
        );

        const nodes = data.pages?.nodes ?? [];
        for (const node of nodes) {
          if (!node) continue;
          const meta = mapSyncMeta(node);
          if (meta) results.push(meta);
        }

        hasNextPage = Boolean(data.pages?.pageInfo?.hasNextPage);
        after = data.pages?.pageInfo?.endCursor ?? null;
        if (!after) hasNextPage = false;
      }

      return results;
    },
  };
}

let defaultPageRepository: PageRepository | undefined;

export function getPageRepository(): PageRepository {
  if (!defaultPageRepository) {
    defaultPageRepository = createPageRepository();
  }
  return defaultPageRepository;
}
