/**
 * SalamStay — NativeWind preset (mobile: React Native + Expo).
 *
 * Same tokens as the web Tailwind preset, adapted for NativeWind v4:
 *  - spacing/radii are emitted in px (RN has no rem; NativeWind maps px 1:1),
 *  - colors resolve to concrete hexes (RN has no CSS custom properties), and
 *    dark mode is handled with NativeWind's class strategy: each themeable
 *    color is emitted as a light default plus a `*-dark` sibling, so a screen
 *    reads `bg-canvas dark:bg-canvas-dark`,
 *  - box-shadow strings are omitted (RN uses the `elevation` tokens directly
 *    via the `NativeShadow` shape from `./elevation`), only leaving the
 *    structured shadow tokens for components to consume.
 *
 * Like the web preset, this declares a minimal local type instead of importing
 * `nativewind`/`tailwindcss`, so the tokens package has no runtime dependency.
 */

import { brandRamp, slateRamp, color } from "./colors.js";
import type { ThemeColors } from "./colors.js";
import { dataviz } from "./dataviz.js";
import type { DatavizTheme } from "./dataviz.js";
import {
  fontFamily,
  textStyle,
  fontWeight,
  letterSpacing,
} from "./typography.js";
import { space } from "./spacing.js";
import { radius as radiusScale } from "./radii.js";
import { skeleton } from "./backgrounds.js";
import { duration, easingCss } from "./motion.js";

export interface NativeWindPreset {
  readonly darkMode: "class";
  readonly theme: {
    readonly extend: Record<string, unknown>;
  };
}

const brandColors = { ...brandRamp } as const;
const slateColors = { ...slateRamp } as const;

/** Flatten a theme's role tree into NativeWind color entries (hex values). */
function themeColorEntries(
  theme: ThemeColors,
  dv: DatavizTheme,
  suffix: "" | "-dark",
  skeletonTheme: { readonly base: string },
): Record<string, string> {
  return {
    [`canvas${suffix}`]: theme.bg.canvas,
    [`raised${suffix}`]: theme.bg.raised,
    [`sunken${suffix}`]: theme.bg.sunken,
    [`inverse${suffix}`]: theme.bg.inverse,
    // `backgrounds.skeleton.*.base` only — the resting placeholder fill. The
    // token's `highlight`/`durationMs` sweep is deliberately not exposed, so
    // `bg-skeleton` is a still bar on both platforms and the two presets cannot
    // disagree about whether a placeholder animates.
    [`skeleton${suffix}`]: skeletonTheme.base,
    [`primary${suffix}`]: theme.text.primary,
    [`secondary${suffix}`]: theme.text.secondary,
    [`tertiary${suffix}`]: theme.text.tertiary,
    [`on-brand${suffix}`]: theme.text.onBrand,
    [`on-semantic${suffix}`]: theme.text.onSemantic,
    [`disabled${suffix}`]: theme.text.disabled,
    [`interactive${suffix}`]: theme.interactive.primary,
    [`interactive-hover${suffix}`]: theme.interactive.primaryHover,
    [`interactive-active${suffix}`]: theme.interactive.primaryActive,
    [`link${suffix}`]: theme.interactive.link,
    [`link-strong${suffix}`]: theme.interactive.linkStrong,
    [`link-on-inverse${suffix}`]: theme.interactive.linkOnInverse,
    [`brand-subtle${suffix}`]: theme.interactive.subtle,
    [`brand-subtle-hover${suffix}`]: theme.interactive.subtleHover,
    [`selected${suffix}`]: theme.interactive.selectedFill,
    [`selected-fg${suffix}`]: theme.interactive.selectedFg,
    [`focus-ring${suffix}`]: theme.interactive.focusRing,
    [`hairline${suffix}`]: theme.border.hairline,
    [`border-default${suffix}`]: theme.border.default,
    [`border-strong${suffix}`]: theme.border.strong,
    [`border-brand${suffix}`]: theme.border.brand,
    [`success${suffix}`]: theme.semantic.success.fg,
    [`success-bg${suffix}`]: theme.semantic.success.bg,
    [`success-border${suffix}`]: theme.semantic.success.border,
    [`warning${suffix}`]: theme.semantic.warning.fg,
    [`warning-bg${suffix}`]: theme.semantic.warning.bg,
    [`warning-border${suffix}`]: theme.semantic.warning.border,
    [`error${suffix}`]: theme.semantic.error.fg,
    [`error-bg${suffix}`]: theme.semantic.error.bg,
    [`error-border${suffix}`]: theme.semantic.error.border,
    [`info${suffix}`]: theme.semantic.info.fg,
    [`info-bg${suffix}`]: theme.semantic.info.bg,
    [`info-border${suffix}`]: theme.semantic.info.border,
    // Data-viz roles (see ./dataviz). Series assigned in fixed order.
    [`chart-1${suffix}`]: dv.series[0],
    [`chart-2${suffix}`]: dv.series[1],
    [`chart-3${suffix}`]: dv.series[2],
    [`chart-axis${suffix}`]: dv.axisLabel,
    [`chart-grid${suffix}`]: dv.gridline,
  };
}

const themedColors = {
  ...themeColorEntries(color.light, dataviz.light, "", skeleton.light),
  ...themeColorEntries(color.dark, dataviz.dark, "-dark", skeleton.dark),
} as const;

// Spacing in px (RN-native units).
const spacing: Record<string, string> = {};
for (const [k, val] of Object.entries(space)) {
  spacing[k] = `${val.px}px`;
}

// Border radius in px.
const borderRadius: Record<string, string> = {};
for (const [k, val] of Object.entries(radiusScale)) {
  borderRadius[k] = val === radiusScale.full ? "9999px" : `${val}px`;
}

// Font sizes in px (RN maps px directly); carry line-height/weight/spacing.
const fontSize: Record<
  string,
  [string, { lineHeight: string; letterSpacing: string; fontWeight: string }]
> = {};
for (const [role, s] of Object.entries(textStyle)) {
  fontSize[role] = [
    `${s.fontSize}px`,
    {
      lineHeight: String(s.lineHeight),
      letterSpacing: `${s.letterSpacing}em`,
      fontWeight: String(s.fontWeight),
    },
  ];
}

const transitionDuration: Record<string, string> = {};
for (const [k, ms] of Object.entries(duration)) {
  transitionDuration[k] = `${ms}ms`;
}

/** The NativeWind preset. Add via `presets: [nativewindPreset]` in the RN app. */
export const nativewindPreset: NativeWindPreset = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: brandColors,
        slate: slateColors,
        ...themedColors,
      },
      fontFamily: {
        sans: [...fontFamily.latin],
        urdu: [...fontFamily.urdu],
        mono: [...fontFamily.mono],
      },
      fontWeight: {
        regular: String(fontWeight.regular),
        medium: String(fontWeight.medium),
        semibold: String(fontWeight.semibold),
        bold: String(fontWeight.bold),
      },
      letterSpacing: {
        tighter: `${letterSpacing.tighter}em`,
        tight: `${letterSpacing.tight}em`,
        normal: `${letterSpacing.normal}em`,
        wide: `${letterSpacing.wide}em`,
        wider: `${letterSpacing.wider}em`,
      },
      fontSize,
      spacing,
      borderRadius,
      transitionDuration,
      transitionTimingFunction: {
        standard: easingCss.standard,
        decelerate: easingCss.decelerate,
        accelerate: easingCss.accelerate,
        emphasized: easingCss.emphasized,
      },
    },
  },
};

export default nativewindPreset;
