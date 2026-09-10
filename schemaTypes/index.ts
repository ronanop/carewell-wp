import { bodyImage, embed, htmlTable, seo, youtube } from "./objects";
import { page, post } from "./documents";
import { service } from "./service";
import {
  galleryItem,
  navigation,
  redirect,
  siteSettings,
  testimonial,
} from "./cms";
import { homepage } from "./homepage";

export const schemaTypes = [
  // objects
  seo,
  youtube,
  embed,
  htmlTable,
  bodyImage,
  // documents
  service,
  page,
  post,
  galleryItem,
  testimonial,
  navigation,
  homepage,
  siteSettings,
  redirect,
];
