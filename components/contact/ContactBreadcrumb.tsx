import {
  WordPressPageBreadcrumb,
} from "@/components/features/wordpress-page/WordPressPageBreadcrumb";
import { buildUriBreadcrumbs } from "@/lib/routing/uri";

export function ContactBreadcrumb() {
  return <WordPressPageBreadcrumb items={buildUriBreadcrumbs("/contact/")} />;
}
