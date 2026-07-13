/**
 * Frontend navigation domain model — never expose raw GraphQL shapes to UI.
 */

/**
 * Single navigation link after URL normalization.
 */
export interface MenuItem {
  id: string;
  databaseId: number;
  label: string;
  /** Next.js path or external/special URL. */
  href: string;
  /** Original WordPress URL. */
  url: string;
  path: string | null;
  target: "_blank" | "_self" | null;
  parentId: string | null;
  cssClasses: string[];
  order: number;
  isExternal: boolean;
  children: MenuItem[];
}

/**
 * Menu for a registered WordPress location.
 */
export interface Menu {
  location: string;
  items: MenuItem[];
}
