import { createPreviewSecret } from "@sanity/preview-url-secret/create-secret";
import { useClient, type DocumentActionComponent } from "sanity";
import { defineLocations } from "sanity/presentation";

/** Hosted Studio must preview the public site, not localhost. */
export const PREVIEW_ORIGIN =
  process.env.SANITY_STUDIO_PREVIEW_ORIGIN ||
  "https://www.carewellmedicalcentre.com";

const PREVIEWABLE = new Set(["service", "page", "post"]);

type PreviewDoc = {
  title?: string;
  uri?: string | null;
  slug?: { current?: string | null } | null;
};

export function cmsPublicPath(
  doc: PreviewDoc | null | undefined,
): string | null {
  const uri = doc?.uri?.trim();
  if (uri) {
    if (/^https?:\/\//i.test(uri)) {
      try {
        const pathname = new URL(uri).pathname || "/";
        return pathname.endsWith("/") ? pathname : `${pathname}/`;
      } catch {
        return null;
      }
    }
    const path = uri.startsWith("/") ? uri : `/${uri}`;
    return path.endsWith("/") ? path : `${path}/`;
  }

  const slug = doc?.slug?.current?.trim();
  if (!slug) return null;
  return `/${slug.replace(/^\/+|\/+$/g, "")}/`;
}

function locationsFor(fallbackTitle: string) {
  return defineLocations({
    select: { title: "title", slug: "slug.current", uri: "uri" },
    resolve: (doc) => {
      const href = cmsPublicPath(doc);
      if (!href) return { locations: [] };
      return {
        locations: [{ title: doc?.title || fallbackTitle, href }],
      };
    },
  });
}

export const presentationLocations = {
  service: locationsFor("Service"),
  page: locationsFor("Page"),
  post: locationsFor("Blog post"),
  homepage: defineLocations({
    select: { title: "title" },
    resolve: () => ({
      locations: [{ title: "Homepage", href: "/" }],
    }),
  }),
};

/** Opens the public page with unpublished drafts, without publishing. */
export const PreviewAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2025-02-19" });
  const doc = (props.draft || props.published) as PreviewDoc | null;
  const path = cmsPublicPath(doc);

  return {
    label: "Preview",
    disabled: !path,
    title: path
      ? "View this page on the live site, including unpublished changes"
      : "Add a slug or URI before previewing",
    onHandle: async () => {
      if (!path) return;
      try {
        const { secret } = await createPreviewSecret(
          client as never,
          "carewell.preview",
          window.location.origin,
        );
        const enable = new URL("/api/draft-mode/enable", PREVIEW_ORIGIN);
        enable.searchParams.set("sanity-preview-secret", secret);
        enable.searchParams.set("sanity-preview-pathname", path);
        window.open(enable.toString(), "_blank", "noopener,noreferrer");
      } catch (error) {
        console.error("[preview] failed to open preview", error);
        window.alert(
          "Could not open preview. Publish is not required, but this Studio user must be allowed to create drafts.",
        );
      } finally {
        props.onComplete();
      }
    },
  };
};

export function withPreviewAction(
  prev: DocumentActionComponent[],
  schemaType: string,
): DocumentActionComponent[] {
  if (!PREVIEWABLE.has(schemaType)) return prev;
  return [PreviewAction, ...prev];
}
