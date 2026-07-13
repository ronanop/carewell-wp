import { gql } from "graphql-request";

/**
 * Fetch WordPress general settings (site title, tagline, home URL).
 *
 * No variables.
 */
export const getGeneralSettings = gql`
  query GetGeneralSettings {
    generalSettings {
      title
      description
      url
    }
  }
`;
