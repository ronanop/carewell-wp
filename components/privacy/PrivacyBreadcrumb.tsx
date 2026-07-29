import {
  WordPressPageBreadcrumb,
} from "@/components/features/wordpress-page/WordPressPageBreadcrumb";
import { buildUriBreadcrumbs } from "@/lib/routing/uri";

export function PrivacyBreadcrumb() {
  return (
    <WordPressPageBreadcrumb items={buildUriBreadcrumbs("/privacy-policy/")} />
  );
}
