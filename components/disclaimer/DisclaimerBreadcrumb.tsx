import {
  WordPressPageBreadcrumb,
} from "@/components/features/wordpress-page/WordPressPageBreadcrumb";
import { buildUriBreadcrumbs } from "@/lib/wordpress/routeUtils";

export function DisclaimerBreadcrumb() {
  return (
    <WordPressPageBreadcrumb items={buildUriBreadcrumbs("/disclaimer/")} />
  );
}
