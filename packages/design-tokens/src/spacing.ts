/**
 * SalamStay — Spacing foundation ("Quiet Modern").
 *
 * A single 4px base unit. The scale is named by its /4 index (`space-1` = 4px,
 * `space-6` = 24px …) so the name always encodes the value — no guessing, no
 * one-off gaps. The scale is intentionally sparse at the top (32→96 in large
 * jumps) because layout rhythm should feel deliberate, not continuous.
 *
 * Values (px): 0, 4, 8, 12, 16, 20, 24, 32, 40, 44, 48, 64, 80, 96.
 */

/** The base unit, in px. Every space token is an integer multiple of this. */
export const spaceBase = 4 as const;

/**
 * Spacing scale keyed by /4 index. `px` is the raw device-independent pixel
 * value (React Native consumes this directly); `rem` is precomputed off a 16px
 * root for the web presets.
 */
export const space = {
  0: { px: 0, rem: 0 },
  1: { px: 4, rem: 0.25 },
  2: { px: 8, rem: 0.5 },
  3: { px: 12, rem: 0.75 },
  4: { px: 16, rem: 1 },
  5: { px: 20, rem: 1.25 },
  6: { px: 24, rem: 1.5 },
  8: { px: 32, rem: 2 },
  10: { px: 40, rem: 2.5 },
  /**
   * The touch-target step. 44px is the minimum comfortable hit area on both
   * platforms (Apple HIG 44pt, Material 48dp with a 44 floor once the visual
   * bounds are inset), so `size-11` / `min-h-11` is how a control declares it is
   * tappable — not a rounded-up `10` and not an arbitrary `h-[44px]`.
   */
  11: { px: 44, rem: 2.75 },
  12: { px: 48, rem: 3 },
  16: { px: 64, rem: 4 },
  20: { px: 80, rem: 5 },
  24: { px: 96, rem: 6 },
} as const;

/**
 * Semantic layout aliases so component code reads intent, not magnitude. Each
 * points at a scale step — never a raw number.
 */
export const layoutSpace = {
  /** Gap between tightly-related inline items (icon ↔ label). */
  inlineTight: space[2],
  /** Gap between related controls in a row. */
  inline: space[3],
  /** Default padding inside compact controls (chips, inputs). */
  controlPadding: space[3],
  /** Default padding inside a card/surface. */
  cardPadding: space[6],
  /** Padding inside a large/feature card, where 24 reads cramped. */
  cardPaddingLg: space[8],
  /** Vertical rhythm between stacked content blocks. */
  stack: space[4],
  /** Vertical rhythm between major sections. */
  section: space[12],
  /** Screen edge gutter on mobile. */
  screenGutter: space[4],
  /**
   * Screen edge gutter from the `md` breakpoint up. The mobile 16 is a
   * concession to a 360px viewport; holding it at 1280 leaves the content
   * pinned to the glass.
   */
  gutterDesktop: space[12],
  /** Screen edge gutter on wide (≥ `2xl`) viewports. */
  gutterWide: space[20],
} as const;

export type SpaceScale = typeof space;
export type SpacingTokens = typeof space;
