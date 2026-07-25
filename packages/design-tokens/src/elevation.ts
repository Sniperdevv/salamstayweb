/**
 * SalamStay — Elevation foundation ("Quiet Modern").
 *
 * Six ladder levels plus one off-ladder role, Apple-soft: low opacity,
 * tight-then-diffuse blur, near-zero spread. Light shadows are cool near-black
 * at very low alpha; dark shadows are deeper/blacker (a dark UI needs more
 * opacity to register the same lift) and lean on a hairline top-rim rather than
 * a big drop.
 *
 * The ladder is `flat → hairline → subtle → card → floating → popover → modal`.
 * `onMedia` sits outside it: it is not a lift, it is legibility insurance for
 * chrome laid directly on photography or a map tile.
 *
 * Each level ships in three forms so web and native stay identical:
 *  - `web`    → a CSS `box-shadow` string (may stack two layers).
 *  - `native` → React Native shadow props (iOS) + `elevation` (Android).
 *  - `layers` → the structured source, so tooling can re-emit either form.
 *
 * Shadows are expensive on low-end Android, so only levels ≥ `card` should be
 * used on scrolling lists, and never on list *items* — lift the container.
 *
 * BOTH themes are emitted as CSS variables (`--ss-shadow-*`) by the Tailwind
 * preset, so a `shadow-card` utility flips with the `.dark` scope exactly the
 * way a `bg-canvas` does. Never read `elevationLight` directly in web code.
 */

export interface ShadowLayer {
  readonly x: number;
  readonly y: number;
  readonly blur: number;
  readonly spread: number;
  /** rgba color string. */
  readonly color: string;
}

export interface NativeShadow {
  readonly shadowColor: string;
  readonly shadowOpacity: number;
  readonly shadowRadius: number;
  readonly shadowOffset: { readonly width: number; readonly height: number };
  /** Android elevation (dp). */
  readonly elevation: number;
}

export interface ElevationLevel {
  readonly web: string;
  readonly native: NativeShadow;
  readonly layers: readonly ShadowLayer[];
}

const toBoxShadow = (layers: readonly ShadowLayer[]): string =>
  layers
    .map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`)
    .join(", ");

// Cool near-black shadow tint (matches slate-900), kept low-alpha for softness.
const L = (a: number): string => `rgba(16, 25, 27, ${a})`;
// Dark-mode shadows are pure-black and heavier to read against dark surfaces.
const D = (a: number): string => `rgba(0, 0, 0, ${a})`;

const build = (
  layers: readonly ShadowLayer[],
  native: NativeShadow,
): ElevationLevel => ({ web: toBoxShadow(layers), native, layers });

/** Light-theme elevation ladder. */
export const elevationLight = {
  /** flat — no shadow; used to reset. */
  flat: build([{ x: 0, y: 0, blur: 0, spread: 0, color: L(0) }], {
    shadowColor: "#10191B",
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  }),
  /** hairline — a 1px rim for separation without a real drop. */
  hairline: build([{ x: 0, y: 1, blur: 2, spread: 0, color: L(0.04) }], {
    shadowColor: "#10191B",
    shadowOpacity: 0.04,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  }),
  /** subtle — resting inputs / low chips. */
  subtle: build(
    [
      { x: 0, y: 1, blur: 2, spread: 0, color: L(0.05) },
      { x: 0, y: 1, blur: 3, spread: 0, color: L(0.04) },
    ],
    {
      shadowColor: "#10191B",
      shadowOpacity: 0.06,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
  ),
  /** card — listing cards / raised surfaces. */
  card: build(
    [
      { x: 0, y: 2, blur: 4, spread: -1, color: L(0.06) },
      { x: 0, y: 4, blur: 10, spread: -2, color: L(0.05) },
    ],
    {
      shadowColor: "#10191B",
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    },
  ),
  /**
   * floating — a card that has left the page plane: hover-lifted tiles, sticky
   * booking panels, the search pill once it detaches on scroll. Reads as a real
   * lift where `card` only reads as a seam, without borrowing `popover`'s
   * "I am temporary, press Escape" weight. Zero spread (not the ladder's usual
   * negative) so the footprint stays as wide as the element itself.
   */
  floating: build(
    [
      { x: 0, y: 2, blur: 6, spread: 0, color: L(0.08) },
      { x: 0, y: 6, blur: 16, spread: 0, color: L(0.12) },
    ],
    {
      shadowColor: "#10191B",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 6,
    },
  ),
  /** popover — menus, dropdowns, tooltips. */
  popover: build(
    [
      { x: 0, y: 4, blur: 8, spread: -2, color: L(0.08) },
      { x: 0, y: 12, blur: 24, spread: -4, color: L(0.08) },
    ],
    {
      shadowColor: "#10191B",
      shadowOpacity: 0.12,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
  ),
  /** modal — dialogs, bottom sheets at rest. */
  modal: build(
    [
      { x: 0, y: 8, blur: 16, spread: -4, color: L(0.1) },
      { x: 0, y: 24, blur: 48, spread: -8, color: L(0.12) },
    ],
    {
      shadowColor: "#10191B",
      shadowOpacity: 0.18,
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 16 },
      elevation: 16,
    },
  ),
  /**
   * onMedia — OFF-LADDER. For a surface sitting directly on a photograph or a
   * map tile, where the ground truth is unknowable: a white chip is invisible
   * on a bright sky, a dark one vanishes on a night shot. The tight 1/2 layer
   * draws the edge, the 2/6 layer separates it from whatever texture is behind.
   * Higher alpha than `card` on purpose — it is fighting image noise, not
   * expressing height. Do not use it as a lift; use `floating` for that.
   */
  onMedia: build(
    [
      { x: 0, y: 1, blur: 2, spread: 0, color: L(0.18) },
      { x: 0, y: 2, blur: 6, spread: 0, color: L(0.12) },
    ],
    {
      shadowColor: "#10191B",
      shadowOpacity: 0.2,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
      elevation: 3,
    },
  ),
} as const satisfies Record<string, ElevationLevel>;

/** Dark-theme elevation ladder — heavier alpha, blacker tint. */
export const elevationDark = {
  flat: build([{ x: 0, y: 0, blur: 0, spread: 0, color: D(0) }], {
    shadowColor: "#000000",
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  }),
  hairline: build([{ x: 0, y: 1, blur: 2, spread: 0, color: D(0.24) }], {
    shadowColor: "#000000",
    shadowOpacity: 0.24,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  }),
  subtle: build(
    [
      { x: 0, y: 1, blur: 2, spread: 0, color: D(0.3) },
      { x: 0, y: 1, blur: 3, spread: 0, color: D(0.24) },
    ],
    {
      shadowColor: "#000000",
      shadowOpacity: 0.32,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
  ),
  card: build(
    [
      { x: 0, y: 2, blur: 4, spread: -1, color: D(0.36) },
      { x: 0, y: 4, blur: 10, spread: -2, color: D(0.32) },
    ],
    {
      shadowColor: "#000000",
      shadowOpacity: 0.4,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    },
  ),
  /** floating — see the light ladder; sits between `card` and `popover`. */
  floating: build(
    [
      { x: 0, y: 2, blur: 6, spread: 0, color: D(0.4) },
      { x: 0, y: 6, blur: 16, spread: 0, color: D(0.36) },
    ],
    {
      shadowColor: "#000000",
      shadowOpacity: 0.45,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 6,
    },
  ),
  popover: build(
    [
      { x: 0, y: 4, blur: 8, spread: -2, color: D(0.44) },
      { x: 0, y: 12, blur: 24, spread: -4, color: D(0.4) },
    ],
    {
      shadowColor: "#000000",
      shadowOpacity: 0.5,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
  ),
  modal: build(
    [
      { x: 0, y: 8, blur: 16, spread: -4, color: D(0.5) },
      { x: 0, y: 24, blur: 48, spread: -8, color: D(0.5) },
    ],
    {
      shadowColor: "#000000",
      shadowOpacity: 0.6,
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 16 },
      elevation: 16,
    },
  ),
  /**
   * onMedia — OFF-LADDER. Only modestly heavier than the light value: the
   * photograph underneath is the same photograph in either theme, so this is
   * tuned for the image, not for the surrounding chrome.
   */
  onMedia: build(
    [
      { x: 0, y: 1, blur: 2, spread: 0, color: D(0.5) },
      { x: 0, y: 2, blur: 6, spread: 0, color: D(0.38) },
    ],
    {
      shadowColor: "#000000",
      shadowOpacity: 0.45,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
      elevation: 3,
    },
  ),
} as const satisfies Record<string, ElevationLevel>;

/**
 * `filter: drop-shadow()` values — the sibling of `box-shadow` for elements
 * with no box: a stroke glyph (a heart outline, a carousel dot) laid on a
 * photograph. `box-shadow` would trace the glyph's bounding rectangle; only
 * `drop-shadow` traces the alpha channel of the shape itself.
 *
 * Single-theme by design. The ground is a photograph, not a themed surface, so
 * the value must not flip with the `.dark` scope — a lighter shadow on a dark
 * UI would leave the glyph unreadable over exactly the bright images it exists
 * to survive.
 */
export const dropShadow = {
  /** Legibility shadow for stroke glyphs sitting on photography or map tiles. */
  onMedia: "0 1px 2px rgba(22, 25, 27, 0.45)",
} as const;

/** The composed elevation token tree (both themes). */
export const elevation = {
  light: elevationLight,
  dark: elevationDark,
} as const;

export type ElevationLightTokens = typeof elevationLight;
export type ElevationTokens = typeof elevation;
export type DropShadowTokens = typeof dropShadow;
