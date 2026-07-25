/**
 * SalamStay — Border width tokens.
 *
 * A tiny, deliberate scale so every stroke on the UI is on-scale rather than a
 * one-off. `hairline` is the default 1px divider/edge; `thin` (1.5) aligns with
 * the icon `stroke.thin` so control outlines match icon weight; `medium` (2)
 * is the focus-ring / selected-control weight; `thick` is reserved for emphatic
 * dividers. Values are in px (unitless number; presets append the unit).
 */
export const borderWidth = {
  none: 0,
  hairline: 1,
  thin: 1.5,
  medium: 2,
  thick: 3,
} as const;

export type BorderWidthScale = typeof borderWidth;

/**
 * Role-based border widths, so product code asks for intent, not a number.
 *  - `divider`/`control` are the everyday 1px edges.
 *  - `focusRing` is the 2px ring paired with the brand focus color.
 *  - `selected` is the 1.5px brand outline on chosen chips/cards.
 */
export const borderWidthRole = {
  divider: borderWidth.hairline,
  control: borderWidth.hairline,
  selected: borderWidth.thin,
  focusRing: borderWidth.medium,
  emphasis: borderWidth.thick,
} as const;

export type BorderWidthTokens = typeof borderWidthRole;
