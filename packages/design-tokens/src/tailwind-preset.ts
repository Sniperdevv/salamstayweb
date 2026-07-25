/**
 * SalamStay — Tailwind preset (web).
 *
 * A partial Tailwind config consumed by `apps/*` web via `presets: [tailwindPreset]`.
 * It maps the design tokens into `theme.extend` and enables class-based dark
 * mode. Theme-swappable colors (surfaces, text, interactive, semantic) resolve
 * through CSS variables so a single `.dark` class flips the whole tree with no
 * duplicate class names; the raw brand/slate ramps are emitted as static hexes
 * for utilities like `bg-brand-600`.
 *
 * The variable *values* for both themes are exported as `cssVariables` — the
 * app writes these into `:root` / `.dark` in a global stylesheet (see
 * FOUNDATIONS.md). This file intentionally declares a minimal local preset type
 * instead of importing `tailwindcss` so the tokens package carries no runtime
 * dependency and stays strict-clean.
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
import { elevationLight } from "./elevation.js";
import { duration, easingCss } from "./motion.js";

// --- Minimal structural type for a Tailwind preset (no dep on `tailwindcss`) --
export interface TailwindPreset {
  readonly darkMode: "class";
  readonly theme: {
    readonly extend: Record<string, unknown>;
  };
}

// CSS variable name helpers keep the naming scheme in one place.
const v = (name: string): string => `var(--ss-${name})`;

/** Static ramp objects for `bg-brand-600`, `text-slate-500`, etc. */
const brandColors = { ...brandRamp } as const;
const slateColors = { ...slateRamp } as const;

/**
 * Variable-backed semantic color scale. These class names (`bg-canvas`,
 * `text-primary`, `border-hairline`, `bg-success`, …) are theme-agnostic; the
 * value flips via the `.dark` scope written from `cssVariables`.
 */
const themedColors = {
  canvas: v("bg-canvas"),
  raised: v("bg-raised"),
  sunken: v("bg-sunken"),
  inverse: v("bg-inverse"),

  primary: v("text-primary"),
  secondary: v("text-secondary"),
  tertiary: v("text-tertiary"),
  "on-brand": v("text-on-brand"),
  "on-semantic": v("text-on-semantic"),
  disabled: v("text-disabled"),

  interactive: v("interactive-primary"),
  "interactive-hover": v("interactive-hover"),
  "interactive-active": v("interactive-active"),
  link: v("interactive-link"),
  "link-strong": v("interactive-link-strong"),
  "link-on-inverse": v("interactive-link-on-inverse"),
  "brand-subtle": v("interactive-subtle"),
  "brand-subtle-hover": v("interactive-subtle-hover"),

  hairline: v("border-hairline"),
  "border-default": v("border-default"),
  "border-strong": v("border-strong"),
  "border-brand": v("border-brand"),

  success: v("success-fg"),
  "success-bg": v("success-bg"),
  "success-border": v("success-border"),
  warning: v("warning-fg"),
  "warning-bg": v("warning-bg"),
  "warning-border": v("warning-border"),
  error: v("error-fg"),
  "error-bg": v("error-bg"),
  "error-border": v("error-border"),
  info: v("info-fg"),
  "info-bg": v("info-bg"),
  "info-border": v("info-border"),

  // Data-viz roles (see ./dataviz). Series assigned in fixed order.
  "chart-1": v("chart-1"),
  "chart-2": v("chart-2"),
  "chart-3": v("chart-3"),
  "chart-axis": v("chart-axis"),
  "chart-grid": v("chart-grid"),
} as const;

// --- Spacing: index name → rem string (e.g. `p-6` → 1.5rem) ---
const spacing: Record<string, string> = {};
for (const [k, val] of Object.entries(space)) {
  spacing[k] = `${val.rem}rem`;
}

// --- Border radius: token name → px string ---
const borderRadius: Record<string, string> = {};
for (const [k, val] of Object.entries(radiusScale)) {
  borderRadius[k] = val === radiusScale.full ? "9999px" : `${val}px`;
}

// --- Font sizes: role → [rem, { lineHeight, letterSpacing, fontWeight }] ---
const fontSize: Record<
  string,
  [string, { lineHeight: string; letterSpacing: string; fontWeight: string }]
> = {};
for (const [role, s] of Object.entries(textStyle)) {
  fontSize[role] = [
    `${s.rem}rem`,
    {
      lineHeight: String(s.lineHeight),
      letterSpacing: `${s.letterSpacing}em`,
      fontWeight: String(s.fontWeight),
    },
  ];
}

// --- Box shadow: elevation level → CSS string (light; `.dark` overrides via var) ---
const boxShadow: Record<string, string> = {};
for (const [level, e] of Object.entries(elevationLight)) {
  boxShadow[level] = e.web;
}

// --- Transition durations / timing functions ---
const transitionDuration: Record<string, string> = {};
for (const [k, ms] of Object.entries(duration)) {
  transitionDuration[k] = `${ms}ms`;
}

/**
 * The CSS variable value maps, per theme. Consumers write:
 *   :root { <light> }   .dark { <dark> }
 * Keys are the full `--ss-*` custom-property names.
 */
function themeVars(
  theme: ThemeColors,
  dv: DatavizTheme,
): Record<string, string> {
  return {
    "--ss-bg-canvas": theme.bg.canvas,
    "--ss-bg-raised": theme.bg.raised,
    "--ss-bg-sunken": theme.bg.sunken,
    "--ss-bg-inverse": theme.bg.inverse,
    "--ss-text-primary": theme.text.primary,
    "--ss-text-secondary": theme.text.secondary,
    "--ss-text-tertiary": theme.text.tertiary,
    "--ss-text-on-brand": theme.text.onBrand,
    "--ss-text-on-semantic": theme.text.onSemantic,
    "--ss-text-disabled": theme.text.disabled,
    "--ss-interactive-primary": theme.interactive.primary,
    "--ss-interactive-hover": theme.interactive.primaryHover,
    "--ss-interactive-active": theme.interactive.primaryActive,
    "--ss-interactive-link": theme.interactive.link,
    "--ss-interactive-link-strong": theme.interactive.linkStrong,
    "--ss-interactive-link-on-inverse": theme.interactive.linkOnInverse,
    "--ss-interactive-subtle": theme.interactive.subtle,
    "--ss-interactive-subtle-hover": theme.interactive.subtleHover,
    "--ss-border-hairline": theme.border.hairline,
    "--ss-border-default": theme.border.default,
    "--ss-border-strong": theme.border.strong,
    "--ss-border-brand": theme.border.brand,
    "--ss-success-fg": theme.semantic.success.fg,
    "--ss-success-bg": theme.semantic.success.bg,
    "--ss-success-border": theme.semantic.success.border,
    "--ss-warning-fg": theme.semantic.warning.fg,
    "--ss-warning-bg": theme.semantic.warning.bg,
    "--ss-warning-border": theme.semantic.warning.border,
    "--ss-error-fg": theme.semantic.error.fg,
    "--ss-error-bg": theme.semantic.error.bg,
    "--ss-error-border": theme.semantic.error.border,
    "--ss-info-fg": theme.semantic.info.fg,
    "--ss-info-bg": theme.semantic.info.bg,
    "--ss-info-border": theme.semantic.info.border,
    "--ss-chart-1": dv.series[0],
    "--ss-chart-2": dv.series[1],
    "--ss-chart-3": dv.series[2],
    "--ss-chart-axis": dv.axisLabel,
    "--ss-chart-grid": dv.gridline,
  };
}

/** Emit-ready CSS variable maps for both themes. */
export const cssVariables = {
  light: themeVars(color.light, dataviz.light),
  dark: themeVars(color.dark, dataviz.dark),
} as const;

/** The Tailwind preset. Add to a web app config via `presets: [tailwindPreset]`. */
export const tailwindPreset: TailwindPreset = {
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
      boxShadow,
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

export default tailwindPreset;
