/**
 * SalamStay — Color foundation ("Quiet Modern").
 *
 * Two raw ramps (brand "Salam Green", neutral "Slate") plus muted semantic
 * hues, then a SEMANTIC token map resolving those raws into role-based tokens
 * for both `light` and `dark` themes.
 *
 * Every value here is proven against WCAG 2.1 contrast requirements — see
 * `design-system/foundations/FOUNDATIONS.md` for the full proof table. Do not
 * hand-edit a hex without re-running the proof; the whole point is that these
 * are earned, not vibed.
 *
 * Contrast conventions used below:
 *  - body/interactive text        → AA 4.5:1 against its intended surface
 *  - large text / UI boundaries   → AA 3:1
 *  - decorative hairlines         → WCAG-exempt (SC 1.4.11 non-essential)
 */

// ---------------------------------------------------------------------------
// Raw ramps
// ---------------------------------------------------------------------------

/**
 * Brand "Salam Green" — a softened, desaturated emerald-teal. Cool enough to
 * read as calm/modern, never neon, never a dark forest green. Anchored at 600.
 *  - 600 (#2E7D6A) is the primary interactive fill on white (AA 4.93:1).
 *  - 700 (#256757) is the deep interactive bound (hover / text on white 6.65:1).
 *  - 400 (#579D8B) is the dark-theme interactive lift (AA on #0E1211, 5.93:1).
 */
export const brandRamp = {
  50: "#EEF6F3",
  100: "#D6EAE3",
  200: "#AFD6C9",
  300: "#82BCAB",
  400: "#579D8B",
  500: "#3B8371",
  600: "#2E7D6A",
  700: "#256757",
  800: "#1E5A4C",
  900: "#1A473D",
  950: "#0F2E27",
} as const;

/**
 * Neutral "Slate" — a cool-tinted grey ramp. 0 is true white (canvas); 900 is
 * a near-black ink (#16191B, not pure black) for primary text; 950 is the base
 * from which the dark canvas is derived.
 */
export const slateRamp = {
  0: "#FFFFFF",
  50: "#F6F7F8",
  100: "#EEF0F1",
  200: "#E7E9EA",
  300: "#D3D7DA",
  400: "#AEB4B9",
  500: "#828A90",
  600: "#5F676D",
  700: "#454C51",
  800: "#2B3134",
  900: "#16191B",
  950: "#0E1211",
} as const;

/**
 * Muted semantic hues. Each is deliberately desaturated so alerts read as
 * information, not decoration — no bright red, no pure yellow. `fg` values are
 * tuned to AA on both their own tinted `bg` and on the canvas; `bg` values are
 * pale enough to sit quietly under body text.
 */
export const semanticRamp = {
  success: {
    light: { fg: "#1E7A54", bg: "#EAF5EF", border: "#B7DEC9" },
    dark: { fg: "#5FC79A", bg: "#13251E", border: "#2C4A3D" },
  },
  warning: {
    light: { fg: "#8A5A16", bg: "#FBF2E3", border: "#EBD3A6" },
    dark: { fg: "#E0B36B", bg: "#2A2115", border: "#4C3E24" },
  },
  error: {
    light: { fg: "#A8412F", bg: "#FBECE9", border: "#EBBDB2" },
    dark: { fg: "#E39385", bg: "#2C1B18", border: "#4E322C" },
  },
  info: {
    light: { fg: "#3A5A86", bg: "#ECF1F8", border: "#BFD0E6" },
    dark: { fg: "#8FB0DB", bg: "#171F2B", border: "#31435C" },
  },
} as const;

/**
 * Dark-theme neutral surfaces are green-tinted charcoals rather than pure
 * slate, so the dark UI feels of-a-piece with the brand without ever going
 * bright. These are one-off surface anchors (not a full ramp) but each is
 * derived from slate-950 + a controlled green lift and proven in the table.
 */
export const darkSurfaceRamp = {
  canvas: "#0E1211",
  raised: "#161B1A",
  elevated: "#1C2322",
  sunken: "#0A0E0D",
  border: "#2A3230",
  borderStrong: "#5B6663",
} as const;

// ---------------------------------------------------------------------------
// Semantic token map (role-based; theme-scoped)
// ---------------------------------------------------------------------------

/** A single resolved semantic-state color set (foreground/background/border). */
export interface SemanticState {
  readonly fg: string;
  readonly bg: string;
  readonly border: string;
}

/**
 * Structural (widened) shape of one theme's role tree. Both `color.light` and
 * `color.dark` conform to this; presets take it as a parameter so they can run
 * over either theme without the `as const` literal types clashing.
 */
export interface ThemeColors {
  readonly bg: {
    readonly canvas: string;
    readonly raised: string;
    readonly sunken: string;
    readonly inverse: string;
  };
  readonly text: {
    readonly primary: string;
    readonly secondary: string;
    readonly tertiary: string;
    readonly onBrand: string;
    readonly onInverse: string;
    /**
     * Ink placed on a filled SEMANTIC surface (success/warning/error/info `fg`
     * used as a fill — e.g. a destructive button). Exists because the semantic
     * `fg` hues flip lightness between themes: light-mode fills are dark (need
     * white on top), dark-mode fills are light (need ink on top). A single
     * on-brand token can't cover both, so this is the AA-safe label color for
     * whichever theme is active.
     */
    readonly onSemantic: string;
    readonly disabled: string;
  };
  readonly interactive: {
    readonly primary: string;
    readonly primaryHover: string;
    readonly primaryActive: string;
    readonly link: string;
    readonly linkStrong: string;
    /**
     * Link color for use on the INVERSE surface (`bg.inverse`), which is dark in
     * light mode and near-white in dark mode. The regular `link` is tuned for
     * the canvas and fails AA on the inverse ground, so this picks the brand
     * shade that clears AA against the inverse surface in the active theme.
     */
    readonly linkOnInverse: string;
    readonly subtle: string;
    readonly subtleHover: string;
    readonly focusRing: string;
  };
  readonly border: {
    readonly hairline: string;
    readonly default: string;
    readonly strong: string;
    readonly brand: string;
  };
  readonly semantic: {
    readonly success: SemanticState;
    readonly warning: SemanticState;
    readonly error: SemanticState;
    readonly info: SemanticState;
  };
}

const lightTheme = {
  bg: {
    /** Base page canvas — true white. */
    canvas: slateRamp[0],
    /** Raised surface (cards, sheets) — barely-there lift off canvas. */
    raised: "#F7F8F8",
    /** Sunken surface (wells, inset fields) — one step below canvas. */
    sunken: "#F4F5F6",
    /** Full-bleed inverse surface (e.g. tooltips) — the ink itself. */
    inverse: slateRamp[900],
  },
  text: {
    /** Primary body/heading text. */
    primary: slateRamp[900],
    /** Secondary/supporting text (still AA on canvas). */
    secondary: slateRamp[600],
    /** Tertiary text — captions/metadata; AA-large only, use ≥18.66px. */
    tertiary: slateRamp[500],
    /** Text on brand/ink fills. */
    onBrand: slateRamp[0],
    onInverse: slateRamp[0],
    /**
     * Ink on a semantic fill. Light-mode semantic `fg` fills are dark
     * (e.g. error #A8412F), so white holds AA (white on #A8412F = 6.07:1).
     */
    onSemantic: slateRamp[0],
    /** Disabled text — communicative, not readable-as-content. */
    disabled: slateRamp[400],
  },
  interactive: {
    /** Primary action fill (buttons, active nav). */
    primary: brandRamp[600],
    /** Primary action fill, pressed/hover. */
    primaryHover: brandRamp[700],
    /** Primary action fill, active/pressed-deep. */
    primaryActive: brandRamp[800],
    /** Brand text/link on canvas (AA 4.93:1). */
    link: brandRamp[600],
    /** Brand text/link, stronger — for dense/low-contrast surrounds. */
    linkStrong: brandRamp[700],
    /**
     * Brand link on the inverse (dark ink) surface. brand-300 (#82BCAB) is the
     * light shade that clears AA against `bg.inverse` (slate-900 ink) here.
     */
    linkOnInverse: brandRamp[300],
    /** Tinted subtle brand background (chips, selected rows). */
    subtle: brandRamp[50],
    /** Tinted subtle brand background, hovered. */
    subtleHover: brandRamp[100],
    /** Focus ring — brand, AA 3:1 as a UI boundary. */
    focusRing: brandRamp[600],
  },
  border: {
    /** Decorative hairline (dividers, card edges) — WCAG-exempt. */
    hairline: slateRamp[200],
    /** Default resting border on quiet controls. */
    default: slateRamp[300],
    /** Essential boundary that conveys a control's extent (AA 3:1). */
    strong: slateRamp[500],
    /** Brand-tinted border (selected/active controls). */
    brand: brandRamp[600],
  },
  semantic: {
    success: {
      fg: semanticRamp.success.light.fg,
      bg: semanticRamp.success.light.bg,
      border: semanticRamp.success.light.border,
    },
    warning: {
      fg: semanticRamp.warning.light.fg,
      bg: semanticRamp.warning.light.bg,
      border: semanticRamp.warning.light.border,
    },
    error: {
      fg: semanticRamp.error.light.fg,
      bg: semanticRamp.error.light.bg,
      border: semanticRamp.error.light.border,
    },
    info: {
      fg: semanticRamp.info.light.fg,
      bg: semanticRamp.info.light.bg,
      border: semanticRamp.info.light.border,
    },
  },
} as const satisfies ThemeColors;

const darkTheme = {
  bg: {
    canvas: darkSurfaceRamp.canvas,
    raised: darkSurfaceRamp.raised,
    sunken: darkSurfaceRamp.sunken,
    inverse: slateRamp[50],
  },
  text: {
    primary: "#EDEFEF",
    secondary: "#A7AFAD",
    tertiary: "#8A938F",
    /** On brand-400/300 fills in dark mode we place the dark ink for AA. */
    onBrand: slateRamp[950],
    onInverse: slateRamp[900],
    /**
     * Ink on a semantic fill. Dark-mode semantic `fg` fills are light
     * (e.g. error #E39385), so slate-950 ink (#0E1211) holds AA
     * (#0E1211 on #E39385 ≈ 8:1).
     */
    onSemantic: slateRamp[950],
    disabled: "#5B6663",
  },
  interactive: {
    /** Brand is lifted to 400 so it clears AA on the dark canvas. */
    primary: brandRamp[400],
    primaryHover: brandRamp[300],
    primaryActive: brandRamp[200],
    link: brandRamp[400],
    linkStrong: brandRamp[300],
    /**
     * Brand link on the inverse (near-white slate-50) surface. brand-700
     * (#256757) is the deep shade that clears AA against `bg.inverse` here.
     */
    linkOnInverse: brandRamp[700],
    subtle: "#16231F",
    subtleHover: "#1B2C27",
    focusRing: brandRamp[400],
  },
  border: {
    hairline: darkSurfaceRamp.border,
    default: "#39413F",
    strong: darkSurfaceRamp.borderStrong,
    brand: brandRamp[400],
  },
  semantic: {
    success: {
      fg: semanticRamp.success.dark.fg,
      bg: semanticRamp.success.dark.bg,
      border: semanticRamp.success.dark.border,
    },
    warning: {
      fg: semanticRamp.warning.dark.fg,
      bg: semanticRamp.warning.dark.bg,
      border: semanticRamp.warning.dark.border,
    },
    error: {
      fg: semanticRamp.error.dark.fg,
      bg: semanticRamp.error.dark.bg,
      border: semanticRamp.error.dark.border,
    },
    info: {
      fg: semanticRamp.info.dark.fg,
      bg: semanticRamp.info.dark.bg,
      border: semanticRamp.info.dark.border,
    },
  },
} as const satisfies ThemeColors;

/**
 * Elevated dark surface, exposed separately because it is only used by
 * high-elevation overlays (popovers/modals) rather than the base scale.
 */
export const darkElevated = darkSurfaceRamp.elevated;

/**
 * The canonical color token tree. Consume `color.light.*` / `color.dark.*` by
 * role — never reach past a role into a raw ramp inside product code. The raw
 * ramps are exported only for the Tailwind/NativeWind presets and for tooling.
 */
export const color = {
  brand: brandRamp,
  slate: slateRamp,
  light: lightTheme,
  dark: darkTheme,
} as const;

export type BrandRamp = typeof brandRamp;
export type SlateRamp = typeof slateRamp;
export type ThemeColorTokens = ThemeColors;
export type ColorTokens = typeof color;
