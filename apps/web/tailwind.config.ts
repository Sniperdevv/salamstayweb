import type { Config } from "tailwindcss";
import { tailwindPreset } from "@salamstay/design-tokens/tailwind-preset";
import { RAIL_CARD_PX } from "./components/stays/rail-metrics";

/**
 * The shared preset carries the whole system: color / type / spacing / radii /
 * elevation / motion, plus container widths (`max-w-page`), the z-index ladder
 * (`z-header`), the overlay scrims and the on-media drop shadow. Nothing that
 * belongs to the design system is redefined here.
 *
 * Only one thing is genuinely app-local, below.
 */

/**
 * Rail item width. A horizontally-scrolling rail cannot use a fluid card: the
 * constant width is exactly what decides how much of the next card peeks past
 * the gutter, and that peek is the affordance that says "this scrolls". That
 * makes it a fact about THIS layout, not a system token — it is derived in
 * components/stays/rail-metrics.ts, the single source for the width.
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
      width: railWidth,
    },
  },
};

export default config;
