/**
 * SalamStay design tokens — the FOUNDATION LAYER.
 *
 * A single, framework-agnostic source of truth for color, type, spacing,
 * radii, elevation, motion, backgrounds, and icon primitives. Product code
 * consumes tokens by role (`color.light.interactive.primary`), and the web /
 * native apps consume the Tailwind / NativeWind presets which are built from
 * exactly these tokens. Nothing downstream should hard-code a hex or a px.
 *
 * Import the whole tree from the package root, or a slice via a subpath export
 * (e.g. `@salamstay/design-tokens/colors`).
 */

export {
  color,
  brandRamp,
  slateRamp,
  semanticRamp,
  darkSurfaceRamp,
  darkElevated,
} from "./colors.js";
export type {
  SemanticState,
  BrandRamp,
  SlateRamp,
  ThemeColorTokens,
  ColorTokens,
} from "./colors.js";

export { dataviz } from "./dataviz.js";
export type {
  DatavizTheme,
  DatavizThemeTokens,
  DatavizTokens,
} from "./dataviz.js";

export {
  typography,
  fontFamily,
  fontWeight,
  urduFontWeight,
  fontSize,
  lineHeight,
  urduLineHeightScale,
  letterSpacing,
  textStyle,
} from "./typography.js";
export type {
  TextStyle,
  FontFamilyTokens,
  TextStyleTokens,
  TypographyTokens,
} from "./typography.js";

export { space, spaceBase, layoutSpace } from "./spacing.js";
export type { SpaceScale, SpacingTokens } from "./spacing.js";

export { radius, componentRadius } from "./radii.js";
export type { RadiusScale, RadiiTokens } from "./radii.js";

export { borderWidth, borderWidthRole } from "./borders.js";
export type { BorderWidthScale, BorderWidthTokens } from "./borders.js";

export {
  layout,
  breakpoint,
  container,
  overlaySize,
  zIndex,
} from "./layout.js";
export type {
  BreakpointTokens,
  ContainerTokens,
  OverlaySizeTokens,
  ZIndexTokens,
  LayoutTokens,
} from "./layout.js";

export {
  elevation,
  elevationLight,
  elevationDark,
  dropShadow,
} from "./elevation.js";
export type {
  ShadowLayer,
  NativeShadow,
  ElevationLevel,
  ElevationLightTokens,
  ElevationTokens,
  DropShadowTokens,
} from "./elevation.js";

export {
  motion,
  duration,
  easing,
  easingCss,
  spring,
  reducedMotion,
} from "./motion.js";
export type { DurationTokens, EasingTokens, MotionTokens } from "./motion.js";

export { backgrounds, heroTint, skeleton, scrim } from "./backgrounds.js";
export type { BackgroundsTokens } from "./backgrounds.js";

export {
  icons,
  iconSize,
  iconStroke,
  iconLineStyle,
  iconPairing,
} from "./icons.js";
export type { IconSizeTokens, IconTokens } from "./icons.js";

export {
  tailwindPreset,
  cssVariables,
  default as tailwindPresetDefault,
} from "./tailwind-preset.js";
export type { TailwindPreset } from "./tailwind-preset.js";

export {
  nativewindPreset,
  default as nativewindPresetDefault,
} from "./nativewind-preset.js";
