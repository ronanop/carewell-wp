/**
 * Compatibility re-exports for the canonical page renderer.
 * Prefer importing from `@carewell/page-renderer` in new code.
 */
export {
  PresentationPage as PresentationPageView,
  type PresentationPageProps as PresentationPageViewProps,
  type SectionMarkContext as SectionWrapContext,
  HeroRenderer as PresentationHero,
  RenderMode,
} from "@carewell/page-renderer";
