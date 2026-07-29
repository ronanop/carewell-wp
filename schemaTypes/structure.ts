import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Care Well CMS")
    .items([
      S.listItem()
        .title("Services")
        .schemaType("service")
        .child(S.documentTypeList("service").title("Services")),
      S.listItem()
        .title("Blog posts")
        .schemaType("post")
        .child(S.documentTypeList("post").title("Blog posts")),
      S.listItem()
        .title("Pages")
        .schemaType("page")
        .child(S.documentTypeList("page").title("Pages")),
      S.divider(),
      S.listItem()
        .title("Gallery")
        .schemaType("galleryItem")
        .child(S.documentTypeList("galleryItem").title("Gallery items")),
      S.listItem()
        .title("Testimonials")
        .schemaType("testimonial")
        .child(S.documentTypeList("testimonial").title("Testimonials")),
      S.divider(),
      S.listItem()
        .title("Navigation")
        .schemaType("navigation")
        .child(S.documentTypeList("navigation").title("Navigation")),
      S.listItem()
        .title("Site settings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site settings"),
        ),
      S.listItem()
        .title("Redirects")
        .schemaType("redirect")
        .child(S.documentTypeList("redirect").title("Redirects")),
    ]);
