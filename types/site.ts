/**
 * Frontend site settings domain model.
 */

/**
 * WordPress general settings used for site-wide metadata.
 */
export interface GeneralSettings {
  title: string;
  description: string;
  language: string;
  url: string;
  timezone: string;
}
