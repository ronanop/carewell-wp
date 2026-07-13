/**
 * Presentation status badges for the Pages module.
 */
export type PresentationBadge =
  | "configured"
  | "not_configured"
  | "outdated"
  | "draft"
  | "published";

export type PageListItem = {
  id: string;
  databaseId: number;
  title: string;
  uri: string;
  slug: string;
  wpStatus: string;
  wpTemplate: string | null;
  templateName: string | null;
  modifiedAt: string;
  lastSyncedAt: string;
  badges: PresentationBadge[];
  presentationId: string | null;
};

export function computePresentationBadges(input: {
  wpStatus: string;
  presentation: {
    status: "DRAFT" | "PUBLISHED";
    updatedAt: Date;
  } | null;
  lastWordPressModified: Date;
}): PresentationBadge[] {
  const badges: PresentationBadge[] = [];

  if (!input.presentation) {
    badges.push("not_configured");
  } else {
    badges.push("configured");
    badges.push(
      input.presentation.status === "PUBLISHED" ? "published" : "draft",
    );
    if (
      input.lastWordPressModified.getTime() >
      input.presentation.updatedAt.getTime()
    ) {
      badges.push("outdated");
    }
  }

  return badges;
}
