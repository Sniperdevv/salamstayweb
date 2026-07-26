/**
 * SalamStay — Tailwind preset (web).
 *
 * A partial Tailwind config consumed by `apps/*` web via `presets: [tailwindPreset]`.
 * It maps the design tokens into `theme.extend` and enables class-based dark
 * mode. Theme-swappable values (surfaces, text, interactive, semantic, AND
 * elevation) resolve through CSS variables so a single `.dark` class flips the
 * whole tree with no duplicate class names; the raw brand/slate ramps are
 * emitted as static hexes for utilities like `bg-brand-600`.
 *
 * The variable *values* for both themes are exported as `cssVariables` — the
 * app writes these into `:root` / `.dark` in a global stylesheet (see
 * FOUNDATIONS.md). This file intentionally declares a minimal local preset type
 * instead of importing `tailwindcss` so the tokens package carries no runtime
 * dependency and stays strict-clean.
 *
 * Everything an app needs is here: an app-level `tailwind.config.ts` should
 * carry the preset, its `content` globs, and whatever width is genuinely local
 * to that app's layout — nothing else. Widths, z-index, scrims and shadows all
 * live in this file so a second app cannot re-derive them slightly differently.
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
import {
  elevationLight,
  elevationDark,
  dropShadow as dropShadowTokens,
} from "./elevation.js";
import type { ElevationLevel } from "./elevation.js";
import { container, overlaySize, zIndex } from "./layout.js";
import { scrim, skeleton } from "./backgrounds.js";
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
  /**
   * The placeholder fill — the shape a value holds while it has none.
   *
   * Only `backgrounds.skeleton.*.base` is exposed. The token also carries a
   * `highlight` and a `durationMs`, i.e. a sweep, and the sweep is not shipped:
   * every call site on the web reached for this fill to stand in for data that
   * is not arriving over any request this build can make, and an animated bar
   * there is a loading state that never resolves. `bg-skeleton` is therefore a
   * resting fill and nothing else. If a genuinely in-flight region ever needs
   * the sweep, it gets its own role rather than quietly animating this one.
   */
  skeleton: v("bg-skeleton"),

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
  /** Chosen-item fill + its label (`bg-selected text-selected-fg`). */
  selected: v("interactive-selected-fill"),
  "selected-fg": v("interactive-selected-fg"),
  /**
   * The focus ring, as its own role. It currently resolves to the same value as
   * `interactive`, which is exactly why it needs its own name: the day the ring
   * has to move off brand for contrast on some surface, that is one token edit
   * and not a grep for `ring-interactive` across two apps.
   */
  "focus-ring": v("interactive-focus-ring"),

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

/**
 * Scrims are NOT theme-variable roles. A scrim's job is to dim whatever is
 * underneath it, and what is underneath is frequently a photograph, which does
 * not get lighter because the UI did. So both weights ship in both themes as
 * static values and the surface picks: `bg-scrim dark:bg-scrim-dark` for a
 * modal backdrop, `bg-scrim-subtle dark:bg-scrim-subtle-dark` for a text foot
 * on an image.
 */
const scrimColors = {
  scrim: scrim.light,
  "scrim-dark": scrim.dark,
  "scrim-subtle": scrim.subtle.light,
  "scrim-subtle-dark": scrim.subtle.dark,
} as const;

// --- Max widths: container role → px string (`max-w-page`, `max-w-wide`) ---
//
// `overlaySize` joins `container` here (added 2026-07-26). The roles existed but
// were unreachable as classes, so a form group specced at `dialogMd` (520) had to
// settle for `max-w-lg` (512) and shipped 8px narrow. A role nothing can consume
// is not a token; it is a comment. Names are namespaced with an `overlay-` prefix
// so a future `container.md` cannot silently shadow `overlaySize.md`.
const maxWidth: Record<string, string> = {};
for (const [k, val] of Object.entries(container)) {
  maxWidth[k] = typeof val === "number" ? `${val}px` : val;
}
for (const [k, val] of Object.entries(overlaySize)) {
  maxWidth[`overlay-${k}`] = typeof val === "number" ? `${val}px` : val;
}

// --- Z-index: the layer ladder as strings (`z-header`, `z-modal`) ---
const zIndexScale: Record<string, string> = {};
for (const [k, val] of Object.entries(zIndex)) {
  zIndexScale[k] = String(val);
}

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

/**
 * kebab-cases an elevation level for its CSS custom-property name, so
 * `onMedia` → `--ss-shadow-on-media` and the utility reads `shadow-on-media`.
 */
const kebab = (s: string): string =>
  s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/**
 * Box shadow: elevation level → `var(--ss-shadow-*)`.
 *
 * This is deliberately a variable and not the literal light-theme string. A
 * shadow is a claim about a light source, and in dark mode the light source is
 * different — a 5%-alpha near-black drop is simply invisible on a #0E1211
 * canvas, which is what shipping `elevationLight` into a themed preset used to
 * do: `.dark .shadow-card` rendered the light shadow, so every raised surface
 * in dark mode was flat. Both ladders are now emitted into `cssVariables`, and
 * `shadow-card` flips with the `.dark` scope exactly like `bg-canvas` does.
 *
 * Trade-off, stated: Tailwind cannot parse a color out of a `var()`, so the
 * `shadow-<color>` modifier (`shadow-card shadow-brand-600/20`) does not work
 * on these levels. That modifier was never usable here anyway — the shadow
 * tint is part of the elevation token, not a per-site decision.
 */
const boxShadow: Record<string, string> = {};
for (const level of Object.keys(elevationLight)) {
  // Key AND variable are kebab-cased, so `onMedia` yields `shadow-on-media` —
  // the same spelling as its `drop-shadow-on-media` sibling. Reaching for media
  // legibility should not require remembering which of the two is camelCase.
  boxShadow[kebab(level)] = v(`shadow-${kebab(level)}`);
}

/**
 * `filter: drop-shadow()` scale. Single-theme (see `dropShadow` in
 * ./elevation) so this maps to the literal, not a variable.
 */
const dropShadow: Record<string, string> = {};
for (const [role, val] of Object.entries(dropShadowTokens)) {
  dropShadow[kebab(role)] = val;
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
  elevationTheme: Record<string, ElevationLevel>,
  skeletonTheme: { readonly base: string },
): Record<string, string> {
  const shadows: Record<string, string> = {};
  for (const [level, e] of Object.entries(elevationTheme)) {
    shadows[`--ss-shadow-${kebab(level)}`] = e.web;
  }
  return {
    "--ss-bg-canvas": theme.bg.canvas,
    "--ss-bg-raised": theme.bg.raised,
    "--ss-bg-sunken": theme.bg.sunken,
    "--ss-bg-inverse": theme.bg.inverse,
    // From `backgrounds.skeleton`, not `colors.ts` — the surface ramps carry no
    // placeholder rung, and the fill is already specified there per theme.
    "--ss-bg-skeleton": skeletonTheme.base,
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
    "--ss-interactive-selected-fill": theme.interactive.selectedFill,
    "--ss-interactive-selected-fg": theme.interactive.selectedFg,
    "--ss-interactive-focus-ring": theme.interactive.focusRing,
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
    ...shadows,
  };
}

/**
 * Emit-ready CSS variable maps for both themes. Shape is
 * `Record<'--ss-*', string>` per theme — stable, so the app's emit script just
 * writes entries and never needs to know which foundation a variable came from.
 */
export const cssVariables = {
  light: themeVars(color.light, dataviz.light, elevationLight, skeleton.light),
  dark: themeVars(color.dark, dataviz.dark, elevationDark, skeleton.dark),
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
        ...scrimColors,
      },
      maxWidth,
      zIndex: zIndexScale,
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
      dropShadow,
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
