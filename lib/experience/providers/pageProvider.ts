/**
 * Universal Page Provider — Studio never talks to WordPress GraphQL directly.
 * WordPress / Static / future API|Markdown|Database implementations.
 */

import type { PresentationConfig, PresentationPage } from "@/types/presentation-config";
import type { PageDefinition, PageSourceKind } from "@/types/static-page";

export type LoadedPage = {
  definition: PageDefinition;
  presentation: PresentationPage;
  config: PresentationConfig;
};

export interface PageProvider {
  readonly kind: PageSourceKind;
  list(): Promise<PageDefinition[]>;
  load(id: string): Promise<LoadedPage | null>;
}

export type { PageDefinition, PageSourceKind };
