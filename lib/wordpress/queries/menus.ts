import { gql } from "graphql-request";

import { MENU_ITEM_FRAGMENT } from "@/lib/wordpress/queries/fragments";

/**
 * Fetch menu items for a registered menu location.
 *
 * Variables: `{ location: MenuLocationEnum!, first: Int = 50 }`
 *
 * Verified location on this site: `PRIMARY_MENU`.
 */
export const getMenu = gql`
  ${MENU_ITEM_FRAGMENT}
  query GetMenu($location: MenuLocationEnum!, $first: Int = 50) {
    menuItems(where: { location: $location }, first: $first) {
      nodes {
        ...MenuItem
      }
    }
  }
`;
