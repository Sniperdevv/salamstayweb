/**
 * SalamStay — Icon foundation ("Quiet Modern").
 *
 * Line icons only, Lucide-style: 1.5–2px stroke, rounded joins/caps, on a 24
 * grid. This layer defines *sizing and stroke tokens only* — no glyphs. The
 * size system (16 micro / 20 dense / 24 default) keeps optical weight
 * consistent: the stroke thins at the smaller sizes so all read as one family.
 */

/** Icon box sizes in px. */
export const iconSize = {
  /**
   * micro: chevrons and carets riding inside a text run — a breadcrumb
   * separator, the disclosure arrow on an inline link. At 20 a chevron next to
   * 13px label text outweighs the text it belongs to.
   */
  xs: 16,
  /** dense contexts: inline-with-text, compact toolbars. */
  sm: 20,
  /** default: buttons, nav, list rows. */
  md: 24,
  /** emphasis: empty states, feature callouts. */
  lg: 32,
} as const;

/** Stroke widths in px, paired to size so optical weight stays even. */
export const iconStroke = {
  /** used at sm to avoid a heavy look at 20px. */
  thin: 1.5,
  /** default stroke at md/lg. */
  regular: 1.75,
  /** for reversed (on-fill) icons that need to hold up. */
  bold: 2,
} as const;

/** Line join/cap style — rounded throughout for the soft, modern feel. */
export const iconLineStyle = {
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * Size→stroke pairing recommendation. Consumers should read the pairing rather
 * than choosing a stroke ad hoc, so a 20px icon never ships with a 2px stroke.
 */
export const iconPairing = {
  xs: { size: iconSize.xs, stroke: iconStroke.thin },
  sm: { size: iconSize.sm, stroke: iconStroke.thin },
  md: { size: iconSize.md, stroke: iconStroke.regular },
  lg: { size: iconSize.lg, stroke: iconStroke.regular },
} as const;

/** The composed icon token tree. */
export const icons = {
  size: iconSize,
  stroke: iconStroke,
  lineStyle: iconLineStyle,
  pairing: iconPairing,
} as const;

export type IconSizeTokens = typeof iconSize;
export type IconTokens = typeof icons;
