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
 * The demoted primary — an OUTLINE/INK button, for the one case where a green
 * fill would be the second green CTA on the surface.
 *
 * TASTE §2 budgets brand green at four roles and exactly ONE primary CTA per
 * surface, and the header is shared chrome: on a route whose own body owns the
 * green (the listing's Reserve, the host funnel's submit circle, the 404's
 * "Go to the SalamStay homepage"), the header CTA yields rather than the page
 * losing its call. See `site-header.tsx`.
 *
 * It is NOT `btnGhost`: Log in is already ghost, and two identical outlines
 * side by side is a pair with no rank. This one carries `border.strong` at rest
 * — one border rung above Log in — and answers a pointer by filling to
 * `bg.raised` rather than by darkening a border it has already spent. Ink label
 * either way; §2 keeps green off both.
 */
export const btnOutline =
  "border-border-strong bg-transparent text-primary hover:bg-raised";

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
 * The same §5 button, for the one place it cannot use its own fill: ON a
 * `bg.raised` band.
 *
 * §5 specifies a fill, but what it is actually specifying is a RELATIONSHIP —
 * a plate one neutral step off the surface it sits on, with no border and no
 * shadow, because it neither floats nor bounds a form. On the canvas that step
 * is `bg.raised`. Inside the one tinted band on the site, `bg.raised` IS the
 * ground, so the same class produces a button that is exactly invisible: a
 * label with an arrow and no plate at all, which reads as neither a button nor
 * an §8 inline action.
 *
 * The step therefore inverts rather than disappearing: `bg.canvas` on the
 * tint, hovering to `border.hairline` — the same neighbouring-neutral hover
 * `btnSecondary` uses, and one that still darkens relative to white in both
 * themes. Every other property is byte-identical to `btnSecondary`; this is one
 * fill role, answered for one ground.
 *
 * NOT composed as `${btnSecondary} bg-canvas`: Tailwind emits `.bg-raised`
 * after `.bg-canvas`, so the append would lose to the base regardless of class
 * order in the string.
 */
export const btnSecondaryOnTint = `inline-flex h-12 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md bg-canvas px-6 text-bodyMd font-medium text-primary hover:bg-hairline ${focusRing} ${pressable}`;

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
