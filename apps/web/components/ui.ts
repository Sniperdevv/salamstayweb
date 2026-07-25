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

/** md — the header's auth pair. */
export const btnMd = "h-10 px-4 text-bodySm";

/** lg — the recovery calls-to-action on the error surfaces. */
export const btnLg = "h-12 px-5 text-bodyMd";

/** Screen gutter: `layoutSpace.screenGutter` on mobile, `space-6` from md up. */
export const gutter = "px-4 md:px-6";
