/**
 * SalamStay — Corner radius foundation ("Quiet Modern").
 *
 * A compact 6→20 ramp plus a `full` pill. Soft, not rounded-cartoonish: cards
 * sit at lg/xl, controls at md, small chips/inputs at sm. The values step
 * roughly +4 so nested corners (a control inside a card) stay visually
 * concentric.
 */

/** Radius scale in px (React Native consumes px directly). */
export const radius = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
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
  /** Sheets, modals, popovers. */
  overlay: radius["2xl"],
  /** Avatars, pills, toggles. */
  pill: radius.full,
} as const;

export type RadiusScale = typeof radius;
export type RadiiTokens = typeof radius;
