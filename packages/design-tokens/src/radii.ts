/**
 * SalamStay — Corner radius foundation ("Quiet Modern").
 *
 * A compact 6→20 ramp plus a `3xl` outlier and a `full` pill. Soft, not
 * rounded-cartoonish: cards sit at lg/xl, controls at md, small chips/inputs at
 * sm. The values step roughly +4 so nested corners (a control inside a card)
 * stay visually concentric.
 */

/** Radius scale in px (React Native consumes px directly). */
export const radius = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  /**
   * Deliberately off-step (+20, where the rest of the ramp steps +4). At full
   * viewport width a 20px corner reads as a rendering artifact rather than a
   * decision; 40px is the first radius that reads as intentional at that scale.
   * Only `componentRadius.heroMedia` should reach for it.
   */
  "3xl": 40,
  full: 9999,
} as const;

/**
 * Semantic radius aliases — component code references the role, not the size,
 * so the whole system re-rounds from one place.
 */
export const componentRadius = {
  /** Inputs, chips, small buttons. */
  control: radius.md,
  /** Default buttons. */
  button: radius.md,
  /** Cards / listing tiles. */
  card: radius.lg,
  /** Large media cards / hero surfaces. */
  cardLg: radius.xl,
  /**
   * Full-bleed funnel/marketing media — the one hero image or video that opens
   * a journey. Budgeted at ONCE PER JOURNEY: the radius is loud enough that a
   * second one on the same scroll turns a considered corner into a house style,
   * and the "quiet modern" direction does not have a house style. If a second
   * surface wants it, that surface wants `cardLg`.
   */
  heroMedia: radius["3xl"],
  /** Sheets, modals, popovers. */
  overlay: radius["2xl"],
  /** Avatars, pills, toggles. */
  pill: radius.full,
} as const;

export type RadiusScale = typeof radius;
export type RadiiTokens = typeof radius;
