/**
 * Services mega menu side-panel image sizes.
 *
 * Live panel: `lg:max-w-[15.5rem]` (248px) × `aspect-[4/5]` → 248×310 CSS px.
 * Upload target is 2× for sharp retina on a ~250px `sizes` hint.
 */

export const MEGA_MENU_PANEL_DISPLAY = {
  width: 248,
  height: 310,
} as const;

/** Exact pixel size for uploaded / replaced category panel photos (4:5). */
export const MEGA_MENU_PANEL_IMAGE_SIZE = {
  width: 496,
  height: 620,
} as const;

export const MEGA_MENU_PANEL_IMAGE_HINT =
  `Upload ${MEGA_MENU_PANEL_IMAGE_SIZE.width}×${MEGA_MENU_PANEL_IMAGE_SIZE.height}px (4:5). Matches the Services mega menu side panel (~${MEGA_MENU_PANEL_DISPLAY.width}×${MEGA_MENU_PANEL_DISPLAY.height}px on screen).`;
