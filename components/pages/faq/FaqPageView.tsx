/**
 * FAQ view — handcrafted public page (body from legacy FAQ).
 */

import { FaqBreadcrumb } from "@/components/faq/FaqBreadcrumb";
import { FaqContent } from "@/components/faq/FaqContent";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";

export function FaqPageView() {
  return (
    <>
      <NavbarPlaceholder />
      <main className="flex-1">
        <FaqBreadcrumb />
        <FaqContent />
      </main>
      <FooterPlaceholder />
    </>
  );
}
