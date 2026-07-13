/**
 * Canonical render modes for the shared page renderer.
 * Never use ad-hoc booleans (isEditor / isStudio / isPreview).
 */
export enum RenderMode {
  PUBLIC = "PUBLIC",
  EDITOR = "EDITOR",
  PREVIEW = "PREVIEW",
}
