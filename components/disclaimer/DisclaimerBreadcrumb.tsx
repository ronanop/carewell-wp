import {
  WordPressPageBreadcrumb,
} from "@/components/features/wordpress-page/WordPressPageBreadcrumb";
import { buildUriBreadcrumbs } from "@/lib/routing/uri";

export function DisclaimerBreadcrumb() {
  return (
    <WordPressPageBreadcrumb items={buildUriBreadcrumbs("/disclaimer/")} />
  );
}
