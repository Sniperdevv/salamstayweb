/**
 * Shared control grammar for the web chrome.
 *
 * One definition of the press / hover / focus behaviour so the header, the
 * footer and the error surfaces cannot drift apart. Every value is a token
 * role from the Tailwind preset — sizes come from the DESIGN.md button redline
 * (§8.1: sm/md/lg height = space-8/10/12, h-pad = space-3/4/5), motion from the
 * `duration` ladder, colors from the themed roles.
 *
 * Note on class order: `fontSize` utilities are emitted in token order, so a
 * size variant must carry its own `text-*` role rather than overriding a base
 * one. Sizes therefore own the type role; the base owns everything else.
 */

/**
 * DESIGN.md §8 shared convention: a 2px `interactive.focusRing` ring, offset
 * `space-1`, keyboard-only. `interactive` resolves to brand-600 (light) /
 * brand-400 (dark) — byte-identical to the `focusRing` color token.
 */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive focus-visible:ring-offset-4 focus-visible:ring-offset-canvas";

/**
 * Press feedback: a subtle scale-down so the control answers the pointer at
 * once. `duration.instant` + `easing.decelerate` (never accelerate — an
 * ease-in press reads as lag). Collapses to nothing under reduced motion.
 */
export const pressable =
  "transition-[transform,background-color,border-color,color] duration-instant ease-decelerate active:scale-[0.97] motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate motion-reduce:active:scale-100";

export const btnBase = `inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md border font-semibold ${focusRing} ${pressable}`;

export const btnPrimary =
  "border-interactive bg-interactive text-on-brand hover:border-interactive-hover hover:bg-interactive-hover";

export const btnGhost =
  "border-border-default bg-transparent text-primary hover:border-border-strong";

/**
 * The gray-fill secondary button (TASTE-RULES §5) — ONE component carrying
 * every secondary action on every surface: Show more, Show all N reviews,
 * Message host, Save & exit. If an action is not the surface's single primary
 * CTA and is not an inline text link, it is this.
 *
 * Deliberately NOT composed from `btnBase`: the base carries a border and 600
 * weight, and the §5 redline is a borderless, shadowless `bg.raised` plate with
 * a 500-weight ink label. Elevation law (§1) is the reason for the absences —
 * this button does not float over anything, so it casts nothing, and it is not
 * a form boundary or an unselected choice, so it draws no border either.
 *
 * On the hover fill: there is no `bg.raisedHover` role in the token set yet, and
 * `interactive.subtle*` is brand-tinted, which §2 forbids on a secondary
 * control. `border.hairline` is the neighbouring neutral step in BOTH themes —
 * light #E7E9EA is one step darker than raised #F7F8F8, dark #2A3230 is one step
 * lighter than raised #161B1A — so the fill deepens relative to its own canvas
 * either way. A static `slate-200` would read correctly in light and invert in
 * dark. Flagged for a proper `bg.raisedHover` role in the next tokens cut.
 */
export const btnSecondary = `inline-flex h-12 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md bg-raised px-6 text-bodyMd font-medium text-primary hover:bg-hairline ${focusRing} ${pressable}`;

/**
 * Underline-at-rest (TASTE-RULES §8): every inline text action — Show more,
 * Learn more, Report, View all — is ink and underlined WHERE IT SITS, not on
 * hover. Brand green is not a link colour here (§2): green survives only on the
 * wordmark dot, the search-submit circle, the one primary CTA per surface and
 * verification marks, and a page of green links spends the whole budget on
 * navigation.
 *
 * Hover dims the label to `text.secondary` rather than adding decoration — the
 * underline is already spent, and 120ms/decelerate is the same micro-feedback
 * rung every other control on the site answers a pointer with.
 */
export const inlineAction =
  "rounded-sm text-primary underline underline-offset-4 transition-colors duration-instant ease-decelerate hover:text-secondary motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate";

/** md — the header's auth pair. */
export const btnMd = "h-10 px-4 text-bodySm";

/** lg — the recovery calls-to-action on the error surfaces. */
export const btnLg = "h-12 px-5 text-bodyMd";

/** Screen gutter: `layoutSpace.screenGutter` on mobile, `space-6` from md up. */
export const gutter = "px-4 md:px-6";
