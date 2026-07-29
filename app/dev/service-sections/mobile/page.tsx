import { notFound } from "next/navigation";
import { ServiceSectionsGallery } from "@/components/service/sections/dev/ServiceSectionsGallery";

export const dynamic = "force-dynamic";

export default function DevServiceSectionsMobilePage() {
  if (process.env.NODE_ENV === "production") notFound();

  return <ServiceSectionsGallery viewport="mobile" />;
}
