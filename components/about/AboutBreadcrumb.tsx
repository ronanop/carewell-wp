import {
  WordPressPageBreadcrumb,
} from "@/components/features/wordpress-page/WordPressPageBreadcrumb";
import { buildUriBreadcrumbs } from "@/lib/wordpress/routeUtils";

export function AboutBreadcrumb() {
  return <WordPressPageBreadcrumb items={buildUriBreadcrumbs("/about/")} />;
}
