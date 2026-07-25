import { inlineAction } from "@/components/ui";

/**
 * The two control classes the discovery templates still share.
 *
 * This file used to be the whole stays-discovery grammar: a section shell, a
 * hairline section rule, a section eyebrow, a section heading role, a card
 * lift, an attribute pill and a bordered panel link. Every one of those either
 * moved (the page grammar is `components/discovery/shell.ts` now) or died with
 * the v1 components that consumed it — `stay-card.tsx`, `faq-section.tsx` and
 * `notes-section.tsx`, none of which any route mounted after the Phase 3/4
 * rebuild. The eyebrow in particular is not coming back: TASTE-RULES §7 and
 * §11.20 are explicit that `overline` is a form-label token (CHECK-IN, GUESTS)
 * and that there are ZERO section eyebrows anywhere.
 *
 * What remains is what is actually imported, by two call sites each.
 *
 * Motion policy for these surfaces (Emil): hover and press feedback ONLY.
 * Nothing enters on load, nothing reveals on scroll. A city or area landing is
 * an entry point people arrive at from search and leave within seconds; a
 * staged entrance would delay the first paint they came for and re-play on
 * every back-navigation. Every transition names its properties, runs on the
 * `instant` rung (120ms), eases out, and collapses under `motion-reduce`.
 */

/**
 * Pill control: filter chips (the city page's "Popular filters", the
 * homepage's property types).
 *
 * §1: a chip is an unselected choice, so it carries a border and no shadow.
 * §2/§3: the hover state strengthens the BORDER and leaves the label ink — a
 * chip that goes green under the pointer is claiming the primary-action colour
 * for a filter, and a row of eight of them turns the page green on a mouse
 * sweep. Selected (when it ships) is `bg-selected` ink fill, never brand.
 */
export const chip =
  "group inline-flex h-10 select-none items-center gap-2 rounded-full border border-border-default bg-canvas px-4 text-bodySm font-medium text-primary transition-[transform,border-color,color] duration-instant ease-decelerate hover:border-border-strong active:scale-[0.97] motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate motion-reduce:active:scale-100";

/**
 * Inline text link (the area page's "All stays in Islamabad", the city page's
 * related columns) — §8's underline-at-rest, in ink, at the discovery
 * surfaces' 14px meta size. The flex box is this file's own (both call sites
 * pair the label with a leading or trailing glyph); everything about colour,
 * underline and hover comes from the one shared `inlineAction` in `ui.ts` so
 * nothing can drift.
 */
export const inlineLink = `inline-flex items-center gap-2 text-bodySm font-medium ${inlineAction}`;
