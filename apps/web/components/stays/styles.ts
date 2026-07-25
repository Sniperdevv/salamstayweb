import { gutter, inlineAction } from "@/components/ui";

/**
 * Stays-discovery class grammar — one definition of the page rhythm shared by
 * the city template (GW-002) and the area template (GW-003), so six city
 * landings and N area pages cannot drift apart, and so a reviewer diffing F-7
 * against Islamabad sees only content.
 *
 * Every value is a token role from the Tailwind preset: `max-w-page` is
 * `container.page`, `text-h3` is the section-heading type role, `duration-*` /
 * `ease-*` come off the motion ladder. No literal px, hex or ms.
 *
 * Motion policy for these surfaces (Emil): hover and press feedback ONLY.
 * Nothing enters on load, nothing reveals on scroll. A city or area landing is
 * an entry point people arrive at from search and leave within seconds; a
 * staged entrance would delay the first paint they came for and re-play on
 * every back-navigation. Every transition names its properties, runs on the
 * `instant`/`fast` rungs (120/180ms), eases out, and collapses under
 * `motion-reduce`.
 */

/** Section shell: `container.page`, screen gutter, vertical rhythm. */
export const sectionShell = `mx-auto max-w-page py-12 md:py-16 ${gutter}`;

/** Sections after the hero are separated by a hairline, as the card draws. */
export const sectionRule = "border-t border-hairline";

/**
 * TASTE-RULES §7 / §11.20 are explicit that there are ZERO section eyebrows —
 * `overline` is a form-label token (CHECK-IN, GUESTS) and nothing else. The two
 * remaining consumers (`faq-section`, `notes-section`) are not mounted by any
 * shipped route, so removing the prop is a pass-2 deletion rather than a live
 * change; the green is taken off it now so no surface can reintroduce a brand
 * micro-label by importing this.
 */
export const eyebrow = "text-overline uppercase text-tertiary";

export const sectionHeading = "text-h3 text-primary";

export const sectionSub = "mt-3 max-w-[66ch] text-bodyMd text-secondary";

/**
 * Media card (area thumbnails, listing tiles). Lifts 2px and swaps
 * elevation.subtle → elevation.card on hover, answers a press with the shared
 * 0.97-family scale. `hoverOnlyWhenSupported` in the Tailwind config keeps the
 * lift off touch devices, so a tap never leaves a tile floating.
 */
export const cardLift =
  "transition-[transform,border-color] duration-fast ease-decelerate hover:-translate-y-0.5 active:scale-[0.99] motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100";

/**
 * Pill control: filter chips.
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
 * Static attribute pill on a listing tile. Not interactive — no hover state.
 * Padding and gap are the card's tight badge metrics rather than the roomier
 * control ones: three pills have to sit on ONE line inside a 341px tile, and a
 * row that wraps 2+1 leaves the third pill looking dropped rather than listed.
 */
export const attributePill =
  "inline-flex items-center gap-1 rounded-full border border-hairline bg-raised px-2 py-1 text-overline text-primary";

/**
 * Bordered panel that is itself a link — the area template's nearby-sector
 * tiles (gw-003 `.nb:hover { border-color: brand }`). No lift and no shadow
 * swap: these sit in a row of three plain panels beside the practical notes,
 * which do NOT move, and lifting only the linked ones would read as the page
 * disagreeing with itself. The press answers with the shared 0.97-family scale.
 * Reduced motion keeps the colour change and drops the transform, per the
 * shipped `pressable` pattern in `ui.ts`.
 *
 * The card's brand hover border is retired under §2: a panel is an unselected
 * choice (§1), its hover strengthens the boundary, and `border.strong` is the
 * role that means exactly that. Green is not a hover colour anywhere.
 */
export const panelLink =
  "group block rounded-lg border border-hairline bg-canvas p-5 transition-[transform,border-color] duration-instant ease-decelerate hover:border-border-strong active:scale-[0.99] motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate motion-reduce:active:scale-100";

/**
 * Inline text link (area "View stays in …", related columns) — §8's
 * underline-at-rest, in ink, at the discovery surfaces' 14px meta size. The
 * flex box is this file's own (some call sites pair the label with a leading
 * or trailing glyph); everything about colour, underline and hover comes from
 * the one shared `inlineAction` in `ui.ts` so nothing can drift.
 */
export const inlineLink = `inline-flex items-center gap-2 text-bodySm font-medium ${inlineAction}`;
