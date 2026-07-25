/**
 * SalamStay — Typography foundation ("Quiet Modern").
 *
 * Latin text is set in Inter (variable) with a native system fallback so the
 * first paint is instant on low-end devices; Urdu is set in "Noto Nastaliq
 * Urdu", which needs materially more line-height (tall nastaliq strokes) and a
 * constrained weight budget (~1.5 MB subset → ship Regular + one bold only).
 *
 * The type scale is a modular scale with ratio ≈ 1.2 (minor third) anchored at
 * a 16px body. Every size is derived from that step, then rounded to the
 * nearest even px for crisp rendering; the rem value assumes a 16px root.
 */

/** Font family stacks. `latin` is the default; `urdu` swaps in under RTL. */
export const fontFamily = {
  latin: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
  /** Nastaliq for Urdu; falls back to Naskh then system before sans. */
  urdu: ["Noto Nastaliq Urdu", "Noto Naskh Arabic", "serif"],
  /** Tabular/numeric contexts (prices, dates) — Inter with its own fallback. */
  mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
} as const;

/** Numeric weight tokens. Inter is variable, so these map to axis values. */
export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/**
 * Urdu weight budget: nastaliq subsets are heavy, so we ship exactly two cuts.
 * Product code must map any Latin weight onto one of these under RTL.
 */
export const urduFontWeight = {
  regular: 400,
  bold: 700,
} as const;

/** Raw modular step sizes (px), ratio ≈ 1.2 from a 16px body anchor. */
export const fontSize = {
  overline: 11,
  caption: 12,
  label: 13,
  bodySm: 14,
  bodyMd: 16,
  bodyLg: 18,
  h6: 18,
  h5: 20,
  h4: 24,
  h3: 28,
  h2: 34,
  h1: 40,
  display: 52,
  displayLg: 64,
} as const;

/** Line-height tokens as unitless multipliers (Latin). */
export const lineHeight = {
  none: 1,
  /**
   * For `displayLg` only. Leading is a ratio, so 1.2 that looks right at 16px
   * opens a 13px trench between lines at 64px. 1.05 keeps a two-line hero
   * reading as one object.
   */
  display: 1.05,
  tight: 1.2,
  snug: 1.32,
  normal: 1.5,
  relaxed: 1.6,
} as const;

/**
 * Nastaliq requires more vertical room than Latin at the same px. Apply this
 * multiplier bump to the Latin line-height whenever text is set in Urdu.
 */
export const urduLineHeightScale = 1.35 as const;

/** Letter-spacing tokens (em). Larger display type tightens; caps/overline open up. */
export const letterSpacing = {
  tighter: -0.02,
  tight: -0.01,
  normal: 0,
  wide: 0.02,
  wider: 0.04,
} as const;

/** A fully-resolved text role: everything a component needs to render one style. */
export interface TextStyle {
  readonly fontSize: number;
  readonly rem: number;
  readonly lineHeight: number;
  readonly fontWeight: number;
  readonly letterSpacing: number;
  readonly textTransform?: "uppercase";
}

const px = (n: number): number => n / 16;

/**
 * The role-based type scale. Components reference roles (`textStyle.h1`), never
 * raw sizes. `rem` is precomputed off a 16px root for the web presets.
 */
export const textStyle = {
  /**
   * FUNNEL HEROES ONLY — the one line at the top of a marketing or conversion
   * page. Not for an indexable page's H1: those answer a query and get read at
   * a glance in a SERP-shaped mindset, and 64px turns a five-word answer into a
   * billboard. Not for section headings ever, at any breakpoint. If a screen
   * has two of these, one of them is wrong; the second is `display`.
   *
   * Ships at 700 with `tighter` tracking because optical sizing is manual here:
   * Inter's default spacing is drawn for text, and at 64px it looks loose.
   */
  displayLg: {
    fontSize: fontSize.displayLg,
    rem: px(fontSize.displayLg),
    lineHeight: lineHeight.display,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tighter,
  },
  display: {
    fontSize: fontSize.display,
    rem: px(fontSize.display),
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tighter,
  },
  h1: {
    fontSize: fontSize.h1,
    rem: px(fontSize.h1),
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tighter,
  },
  h2: {
    fontSize: fontSize.h2,
    rem: px(fontSize.h2),
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontSize: fontSize.h3,
    rem: px(fontSize.h3),
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.tight,
  },
  h4: {
    fontSize: fontSize.h4,
    rem: px(fontSize.h4),
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontSize: fontSize.h5,
    rem: px(fontSize.h5),
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },
  h6: {
    fontSize: fontSize.h6,
    rem: px(fontSize.h6),
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },
  bodyLg: {
    fontSize: fontSize.bodyLg,
    rem: px(fontSize.bodyLg),
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
  },
  bodyMd: {
    fontSize: fontSize.bodyMd,
    rem: px(fontSize.bodyMd),
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
  },
  bodySm: {
    fontSize: fontSize.bodySm,
    rem: px(fontSize.bodySm),
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
  },
  label: {
    fontSize: fontSize.label,
    rem: px(fontSize.label),
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.normal,
  },
  caption: {
    fontSize: fontSize.caption,
    rem: px(fontSize.caption),
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.wide,
  },
  overline: {
    fontSize: fontSize.overline,
    rem: px(fontSize.overline),
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.wider,
    textTransform: "uppercase",
  },
} as const satisfies Record<string, TextStyle>;

/** The composed typography token tree. */
export const typography = {
  fontFamily,
  fontWeight,
  urduFontWeight,
  fontSize,
  lineHeight,
  urduLineHeightScale,
  letterSpacing,
  textStyle,
} as const;

export type FontFamilyTokens = typeof fontFamily;
export type TextStyleTokens = typeof textStyle;
export type TypographyTokens = typeof typography;
