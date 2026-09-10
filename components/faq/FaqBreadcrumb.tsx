import { WordPressPageBreadcrumb } from "@/components/features/wordpress-page/WordPressPageBreadcrumb";
import { buildUriBreadcrumbs } from "@/lib/routing/uri";

export function FaqBreadcrumb() {
  return <WordPressPageBreadcrumb items={buildUriBreadcrumbs("/faq/")} />;
}
