/**
 * WordPress content rendering engine — public exports.
 *
 * Entry point for service/blog Gutenberg HTML: {@link RichContent}.
 * Editorial presentation: import {@link ContentEnhancer} from
 * `@/components/content/ContentEnhancer`.
 *
 * Client-only motion helpers (`AnimatedSection`, `ReadingProgress`) —
 * import from their own modules to avoid barrel client boundaries.
 */

export { RichContent, type RichContentProps } from "@/components/content/RichContent";
export {
  EditorialSection,
  type EditorialSectionProps,
} from "@/components/content/EditorialSection";
export {
  ContentCTA,
  type ContentCTAProps,
} from "@/components/content/ContentCTA";
export {
  ContentDivider,
  type ContentDividerProps,
} from "@/components/content/ContentDivider";
export {
  TableWrapper,
  type TableWrapperProps,
} from "@/components/content/TableWrapper";
export {
  VideoWrapper,
  type VideoWrapperProps,
} from "@/components/content/VideoWrapper";
export {
  ImageWrapper,
  type ImageWrapperProps,
} from "@/components/content/ImageWrapper";
export {
  FigureCaption,
  type FigureCaptionProps,
} from "@/components/content/FigureCaption";
export { CONTENT_THEME, type ContentTheme } from "@/components/content/ContentTheme";
export {
  ContentContainer,
  type ContentContainerProps,
} from "@/components/content/ContentContainer";
export {
  ResponsiveEmbed,
  type ResponsiveEmbedProps,
} from "@/components/content/ResponsiveEmbed";
export {
  ResponsiveTable,
  type ResponsiveTableProps,
} from "@/components/content/ResponsiveTable";
export {
  ImageFigure,
  type ImageFigureProps,
} from "@/components/content/ImageFigure";
export {
  ContentHeading,
  type ContentHeadingProps,
} from "@/components/content/ContentHeading";
export {
  ContentLink,
  type ContentLinkProps,
} from "@/components/content/ContentLink";
export {
  ContentButton,
  type ContentButtonProps,
} from "@/components/content/ContentButton";
export {
  normalizeContentSpacing,
  isExternalLink,
  normalizeImageAlignment,
  responsiveEmbedDetection,
  tableOverflowHandling,
  WP_IMAGE_ALIGNMENTS,
  type WpImageAlignment,
} from "@/components/content/content-utils";
