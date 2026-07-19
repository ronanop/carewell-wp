import {
  WordPressPageBreadcrumb,
} from "@/components/features/wordpress-page/WordPressPageBreadcrumb";
import { buildUriBreadcrumbs } from "@/lib/wordpress/routeUtils";
import type { DoctorProfile } from "@/types/doctor";

interface DoctorBreadcrumbProps {
  doctor: Pick<DoctorProfile, "name" | "slug">;
}

export function DoctorBreadcrumb({ doctor }: DoctorBreadcrumbProps) {
  return (
    <WordPressPageBreadcrumb
      items={buildUriBreadcrumbs(`/about/${doctor.slug}/`)}
    />
  );
}
