import {
  WordPressPageBreadcrumb,
} from "@/components/features/wordpress-page/WordPressPageBreadcrumb";
import { buildUriBreadcrumbs } from "@/lib/wordpress/routeUtils";

export function PrivacyBreadcrumb() {
  return (
    <WordPressPageBreadcrumb items={buildUriBreadcrumbs("/privacy-policy/")} />
  );
}
