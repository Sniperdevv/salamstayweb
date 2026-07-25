import type { Config } from "tailwindcss";
import { tailwindPreset } from "@salamstay/design-tokens/tailwind-preset";
import { container, zIndex } from "@salamstay/design-tokens/layout";
import { scrim } from "@salamstay/design-tokens/backgrounds";
import { spaceBase } from "@salamstay/design-tokens/spacing";
import { RAIL_CARD_PX } from "./components/stays/rail-metrics";

/**
 * The shared preset maps color / type / spacing / radii / elevation / motion.
 * It does NOT yet map `layout.ts` or `backgrounds.ts`, so container widths
 * (`max-w-page`, `max-w-wide`), the z-index ladder (`z-header`) and the overlay
 * scrim are bridged here — still token-sourced, never a literal. Fold these
 * into the package preset when a second app needs them.
 */
const maxWidth = Object.fromEntries(
  Object.entries(container).map(([k, v]) => [k, typeof v === "number" ? `${v}px` : v]),
);

const zIndexScale = Object.fromEntries(
  Object.entries(zIndex).map(([k, v]) => [k, String(v)]),
);

/**
 * Overlay scrim, from `backgrounds.scrim`. Alpha-only, so it dims whatever sits
 * underneath: the sheet backdrop dims the page, the wishlist bubble dims the
 * photograph behind the glyph. Both themes are exposed because the sheet
 * backdrop flips with the theme; media overlays pair `bg-scrim dark:bg-scrim-dark`
 * the same way so one scrim role covers both uses.
 */
const scrimColors = { scrim: scrim.light, "scrim-dark": scrim.dark };

/**
 * Rail item width. A horizontally-scrolling rail cannot use a fluid card: the
 * constant width is exactly what decides how much of the next card peeks past
 * the gutter, and that peek is the affordance that says "this scrolls".
 * See components/stays/rail-metrics.ts — the single source for this width.
 */
const railWidth = { "rail-card": `${RAIL_CARD_PX}px` };

const config: Config = {
  presets: [tailwindPreset as unknown as Config],
  // Applied system-wide: every `hover:` variant compiles behind
  // `@media (hover: hover) and (pointer: fine)`, so a tap never leaves a
  // hover state stuck on a touch device.
  future: { hoverOnlyWhenSupported: true },
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      maxWidth,
      zIndex: zIndexScale,
      colors: scrimColors,
      width: railWidth,
      // Legibility shadow for stroke glyphs sitting on photographs (hearts,
      // carousel dots). Bridged here until the tokens package ships an
      // elevation.onMedia role (recalibration backlog).
      dropShadow: {
        "on-media": "0 1px 2px rgb(22 25 27 / 0.45)",
      },
    },
  },
};

export default config;
