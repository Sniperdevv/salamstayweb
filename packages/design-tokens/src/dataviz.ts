/**
 * SalamStay — Data-visualization palette ("Quiet Modern").
 *
 * A deliberately small, sanctioned chart palette so no one has to invent chart
 * colors (the earnings chart on the host dashboard, occupancy sparklines, etc.).
 * Three categorical **series** hues + supporting **axisLabel / gridline / plotBg**
 * roles, resolved for both `light` and `dark` themes.
 *
 * ── Derivation (every series traces to an existing ramp) ────────────────────
 *  - series[0]  brand green — the mid brand ramp. Light `brandRamp[500]`
 *    (#3B8371); dark lifted to `brandRamp[400]` (#579D8B) so it clears the dark
 *    canvas. This is the "primary metric" color and reads as of-a-piece with the
 *    brand.
 *  - series[1]  slate-blue — the semantic `info` family, tuned for separation.
 *    Light #34527E is `info.light.fg` (#3A5A86) pushed one step deeper/bluer so
 *    it clears the categorical distinguishability floor against the teal-leaning
 *    brand green; dark #9AC0F4 is `info.dark.fg` (#8FB0DB) lifted lighter for the
 *    same reason on the dark canvas.
 *  - series[2]  muted amber — the semantic `warning` family. Light
 *    `warning.light.fg` (#8A5A16); dark `warning.dark.fg` (#E0B36B). Far in hue
 *    from both green and blue, so it anchors the third slot cleanly.
 *
 * ── Distinguishability & contrast (computed, not vibed) ─────────────────────
 * Verified with the dataviz validator (OKLab ΔE, incl. CVD) and a WCAG 2.1
 * contrast script; see FOUNDATIONS.md §4-D for the recomputed table.
 *  - Every series clears **≥3:1** against its own canvas (graphical-object
 *    contrast, SC 1.4.11): light 4.50 / 7.91 / 5.91; dark 5.93 / 10.08 / 9.73.
 *  - The worst adjacent series pair (green↔blue) clears the normal-vision floor
 *    (light ΔE 16.2, dark 18.7) **and** the CVD floor (light ΔE 15.5, dark 17.2
 *    deutan) — mutually distinguishable including for color-blind readers.
 * Because the brand is intentionally desaturated ("Quiet Modern"), charts must
 * still carry **secondary encoding** (direct series labels / a legend), which the
 * dashboard charts already do — color is never the sole differentiator.
 *
 * `axisLabel` = `text.secondary` (AA body text on canvas). `gridline` =
 * `border.hairline` (decorative, WCAG-exempt). `plotBg` is transparent so a chart
 * inherits whatever surface it sits on (canvas / raised card).
 *
 * Assign series in fixed order, never cycled. A 4th+ metric folds into "Other,"
 * small multiples, or a second chart — never an invented hue.
 */

import { brandRamp, semanticRamp } from "./colors.js";

/** Structural shape of one theme's data-viz role set. */
export interface DatavizTheme {
  /** Categorical series colors, assigned in fixed order (never cycled). */
  readonly series: readonly [string, string, string];
  /** Axis tick / value labels — `text.secondary` (AA on canvas). */
  readonly axisLabel: string;
  /** Gridlines — `border.hairline` (decorative, WCAG-exempt). */
  readonly gridline: string;
  /** Plot background — transparent so the chart inherits its surface. */
  readonly plotBg: string;
}

const lightDataviz = {
  series: [
    /** series1 — brand green, `brandRamp[500]`. AA-graphic 4.50:1 on #FFFFFF. */
    brandRamp[500],
    /** series2 — slate-blue from the `info` family, deepened. 7.91:1 on #FFFFFF. */
    "#34527E",
    /** series3 — muted amber, `warning.light.fg`. 5.91:1 on #FFFFFF. */
    semanticRamp.warning.light.fg,
  ],
  /** `text.secondary` (slate-600). AA 5.76:1 on #FFFFFF. */
  axisLabel: "#5F676D",
  /** `border.hairline` (slate-200). Decorative — WCAG-exempt. */
  gridline: "#E7E9EA",
  plotBg: "transparent",
} as const satisfies DatavizTheme;

const darkDataviz = {
  series: [
    /** series1 — brand green, lifted to `brandRamp[400]`. 5.93:1 on #0E1211. */
    brandRamp[400],
    /** series2 — slate-blue from the `info` family, lifted. 10.08:1 on #0E1211. */
    "#9AC0F4",
    /** series3 — muted amber, `warning.dark.fg`. 9.73:1 on #0E1211. */
    semanticRamp.warning.dark.fg,
  ],
  /** `text.secondary` (dark). AA 8.42:1 on #0E1211. */
  axisLabel: "#A7AFAD",
  /** `border.hairline` (dark). Decorative — WCAG-exempt. */
  gridline: "#2A3230",
  plotBg: "transparent",
} as const satisfies DatavizTheme;

/**
 * The canonical data-viz token tree. Consume `dataviz.light.series[n]` /
 * `dataviz.dark.series[n]` by theme; never reach past a role into a raw ramp in
 * chart code.
 */
export const dataviz = {
  light: lightDataviz,
  dark: darkDataviz,
} as const;

export type DatavizThemeTokens = DatavizTheme;
export type DatavizTokens = typeof dataviz;
