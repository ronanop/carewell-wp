import { notFound } from "next/navigation";

import { VisualBuilder } from "@/components/admin/builder/VisualBuilder";
import { createStaticPageProvider } from "@/lib/experience/providers/staticPageProvider";
import { isStaticPageSlug } from "@/lib/experience/static-pages/catalog";

type StaticStudioRouteProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Static Experience Studio — mounts the real page view (ADR-015).
 * Loads exclusively via StaticPageProvider; client resolves view by slug.
 */
export default async function StaticPageStudioPage({
  params,
}: StaticStudioRouteProps) {
  const { slug } = await params;
  if (!isStaticPageSlug(slug)) notFound();

  const provider = createStaticPageProvider();
  const loaded = await provider.loadStatic(slug);
  if (!loaded) notFound();

  return (
    <VisualBuilder
      pageId={loaded.pageId}
      title={loaded.descriptor.title}
      uri={loaded.descriptor.route}
      basePage={null}
      initialConfig={loaded.config}
      persistenceKind="static"
      staticDescriptor={loaded.descriptor}
      staticPageSlug={slug}
      catalogBlocks={[]}
    />
  );
}
