import {
  WordPressPageBreadcrumb,
} from "@/components/features/wordpress-page/WordPressPageBreadcrumb";
import { buildUriBreadcrumbs } from "@/lib/wordpress/routeUtils";

export function ContactBreadcrumb() {
  return <WordPressPageBreadcrumb items={buildUriBreadcrumbs("/contact/")} />;
}
