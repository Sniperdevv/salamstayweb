import type { Config } from "tailwindcss";
import { tailwindPreset } from "@salamstay/design-tokens/tailwind-preset";
import { container, zIndex } from "@salamstay/design-tokens/layout";

/**
 * The shared preset maps color / type / spacing / radii / elevation / motion.
 * It does NOT yet map `layout.ts`, so container widths (`max-w-page`,
 * `max-w-wide`) and the z-index ladder (`z-header`) are bridged here — still
 * token-sourced, never a literal. Fold this into the package preset when a
 * second app needs it.
 */
const maxWidth = Object.fromEntries(
  Object.entries(container).map(([k, v]) => [k, typeof v === "number" ? `${v}px` : v]),
);

const zIndexScale = Object.fromEntries(
  Object.entries(zIndex).map(([k, v]) => [k, String(v)]),
);

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
    },
  },
};

export default config;
