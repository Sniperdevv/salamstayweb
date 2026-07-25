/**
 * SalamStay — Motion foundation ("Quiet Modern").
 *
 * Motion is functional, not showy: short durations, an asymmetric ease that
 * settles fast, and an explicit reduced-motion contract. Durations climb on a
 * deliberate ladder (120 → 480) so the *distance/importance* of a transition
 * picks the token, never a stopwatch.
 *
 * Cheap-to-render rules for low-end Android are baked into the guidance below;
 * prefer transform/opacity, avoid animating layout or shadow.
 */

/** Duration ladder in milliseconds. */
export const duration = {
  /** micro-feedback: hover/press color, tiny state flips. */
  instant: 120,
  /** default UI transitions: toggles, tab underlines, small reveals. */
  fast: 180,
  /** standard element enter/exit: menus, tooltips, chips. */
  normal: 240,
  /** larger surfaces: sheets, dialogs, page-level fades. */
  slow: 320,
  /** full-screen / hero transitions only. */
  slower: 480,
} as const;

/**
 * Easing curves as cubic-bezier control-point tuples (web consumes the string
 * form via `easingCss`, native/Reanimated consumes the tuple).
 */
export const easing = {
  /** standard — symmetric-ish accelerate/decelerate for most transitions. */
  standard: [0.2, 0, 0, 1],
  /** decelerate — for elements entering the screen (ease-out). */
  decelerate: [0, 0, 0, 1],
  /** accelerate — for elements leaving the screen (ease-in). */
  accelerate: [0.3, 0, 1, 1],
  /** emphasized — a touch more character for hero moments. */
  emphasized: [0.2, 0, 0, 1],
} as const;

const toCubicBezier = (c: readonly [number, number, number, number]): string =>
  `cubic-bezier(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;

/** Pre-rendered CSS `transition-timing-function` strings. */
export const easingCss = {
  standard: toCubicBezier(easing.standard),
  decelerate: toCubicBezier(easing.decelerate),
  accelerate: toCubicBezier(easing.accelerate),
  emphasized: toCubicBezier(easing.emphasized),
} as const;

/**
 * A subtle React Native spring for gesture-driven surfaces (sheets, toggles).
 * Tuned to settle quickly without visible bounce — matches the ease ladder in
 * feel so JS-driven and spring-driven motion read as one system.
 */
export const spring = {
  gentle: { damping: 26, stiffness: 220, mass: 1 },
  /** snappier response for small toggles. */
  snappy: { damping: 22, stiffness: 320, mass: 1 },
} as const;

/**
 * Reduced-motion contract. When the OS requests reduced motion, replace
 * movement/scale with a plain cross-fade at `reducedDuration`, and disable
 * springs entirely. Never remove feedback — dampen it.
 */
export const reducedMotion = {
  /** Cross-fade duration to use in place of any transform-based transition. */
  reducedDuration: duration.instant,
  /** Guidance flags for consumers building motion primitives. */
  disableSprings: true,
  crossfadeOnly: true,
} as const;

/** The composed motion token tree. */
export const motion = {
  duration,
  easing,
  easingCss,
  spring,
  reducedMotion,
} as const;

export type DurationTokens = typeof duration;
export type EasingTokens = typeof easing;
export type MotionTokens = typeof motion;
