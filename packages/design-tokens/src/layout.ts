/**
 * SalamStay — Layout tokens: breakpoints, container widths, overlay sizes, and
 * z-index layers. These give screen blueprints and overlays on-scale values
 * instead of scattered magic widths. All lengths are px (unitless number).
 */

/**
 * Responsive breakpoints (min-width, px). Aligned to the common Tailwind scale
 * so the web preset can map them directly. Mobile (RN) is effectively `base`.
 */
export const breakpoint = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/**
 * Max content widths. `prose` keeps long text at a readable measure; `page` is
 * the marketing/listing shell; `wide` is the dashboard/search+map shell.
 */
export const container = {
  prose: 720,
  page: 1120,
  wide: 1280,
  full: "100%",
} as const;

/**
 * Named overlay sizes so dialogs/sheets/toasts/tooltips pull from one scale
 * rather than inventing widths per component.
 */
export const overlaySize = {
  tooltipMax: 280,
  toastMax: 420,
  dialogSm: 400,
  dialogMd: 520,
  dialogLg: 680,
  /**
   * The widest dialog the system allows — for a dialog that carries a real
   * layout rather than a message: a two-column date picker, a photo gallery, a
   * map-plus-list. Past this width a dialog stops reading as an overlay and
   * should be a route.
   */
  dialogXl: 840,
  sheetGrabberW: 36,
  sheetGrabberH: 4,
} as const;

/**
 * Z-index layers. A short, ordered ladder — never use a raw z-index in product
 * code. Gaps of 10 leave room for the odd in-between without a renumber.
 */
export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 20,
  header: 30,
  dropdown: 40,
  overlay: 50,
  sheet: 60,
  modal: 70,
  toast: 80,
  tooltip: 90,
} as const;

export type BreakpointTokens = typeof breakpoint;
export type ContainerTokens = typeof container;
export type OverlaySizeTokens = typeof overlaySize;
export type ZIndexTokens = typeof zIndex;

/** Grouped layout token tree. */
export const layout = {
  breakpoint,
  container,
  overlaySize,
  zIndex,
} as const;

export type LayoutTokens = typeof layout;
