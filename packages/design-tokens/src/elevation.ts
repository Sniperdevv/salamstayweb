/**
 * SalamStay — Elevation foundation ("Quiet Modern").
 *
 * Five levels, Apple-soft: low opacity, tight-then-diffuse blur, near-zero
 * spread. Light shadows are cool near-black at very low alpha; dark shadows are
 * deeper/blacker (a dark UI needs more opacity to register the same lift) and
 * lean on a hairline top-rim rather than a big drop.
 *
 * Each level ships in three forms so web and native stay identical:
 *  - `web`    → a CSS `box-shadow` string (may stack two layers).
 *  - `native` → React Native shadow props (iOS) + `elevation` (Android).
 *  - `layers` → the structured source, so tooling can re-emit either form.
 *
 * Shadows are expensive on low-end Android, so only levels ≥ `card` should be
 * used on scrolling lists, and never on list *items* — lift the container.
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
} as const satisfies Record<string, ElevationLevel>;

/** The composed elevation token tree (both themes). */
export const elevation = {
  light: elevationLight,
  dark: elevationDark,
} as const;

export type ElevationLightTokens = typeof elevationLight;
export type ElevationTokens = typeof elevation;
