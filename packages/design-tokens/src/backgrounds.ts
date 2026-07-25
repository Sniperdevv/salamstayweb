/**
 * SalamStay — Background & surface-fill foundation ("Quiet Modern").
 *
 * Backgrounds are solid surfaces first. The system allows at most ONE
 * ultra-subtle vertical tint (a whisper of brand at the very top of hero
 * areas) and a neutral skeleton shimmer for loading. There is deliberately NO
 * decorative pattern anywhere in this layer — cultural surfacing happens later
 * via clean badges/icons, never wallpaper.
 *
 * Colors reference the same raw ramps as `colors.ts` so nothing drifts.
 */

import { brandRamp, slateRamp, darkSurfaceRamp } from "./colors.js";

/**
 * The single sanctioned gradient: a near-invisible brand tint fading to the
 * canvas. Stops are given as {color, position%} so both CSS and RN gradient
 * libs can consume them. Angle is top→bottom (180deg / vertical).
 */
export const heroTint = {
  light: {
    angle: 180,
    stops: [
      { color: brandRamp[50], position: 0 },
      { color: slateRamp[0], position: 60 },
    ],
  },
  dark: {
    angle: 180,
    stops: [
      { color: darkSurfaceRamp.raised, position: 0 },
      { color: darkSurfaceRamp.canvas, position: 60 },
    ],
  },
} as const;

/**
 * Neutral skeleton shimmer. `base` is the resting placeholder fill; `highlight`
 * is the sweeping band. Kept low-contrast and neutral so it never flashes.
 * `durationMs` matches the motion ladder's `slower` step.
 */
export const skeleton = {
  light: {
    base: slateRamp[100],
    highlight: slateRamp[50],
    durationMs: 480,
  },
  dark: {
    base: darkSurfaceRamp.raised,
    highlight: darkSurfaceRamp.elevated,
    durationMs: 480,
  },
} as const;

/**
 * A translucent scrim for overlays (behind modals/sheets). Alpha-only so it
 * dims whatever theme is underneath.
 *
 * `subtle` is the second, quieter job the same role has to do: a gradient foot
 * under text laid on a photograph, or the wash that lets a white control hold
 * its edge on a bright image. At 0.44 that reads as a dismissible backdrop and
 * kills the photo; 0.18 buys legibility without the image looking switched off.
 * Modal backdrops keep the full weight — there the point IS "the page behind is
 * out of play".
 */
export const scrim = {
  light: "rgba(16, 25, 27, 0.44)",
  dark: "rgba(0, 0, 0, 0.6)",
  subtle: {
    light: "rgba(16, 25, 27, 0.18)",
    dark: "rgba(0, 0, 0, 0.28)",
  },
} as const;

/** The composed backgrounds token tree. */
export const backgrounds = {
  heroTint,
  skeleton,
  scrim,
} as const;

export type BackgroundsTokens = typeof backgrounds;
