import { gutter } from "@/components/ui";

/**
 * City-template class grammar — one definition of the page's rhythm so six
 * city landings cannot drift apart, and so a reviewer diffing Karachi against
 * Islamabad sees only content.
 *
 * Every value is a token role from the Tailwind preset: `max-w-page` is
 * `container.page`, `text-h3` is the section-heading type role, `duration-*` /
 * `ease-*` come off the motion ladder. No literal px, hex or ms.
 *
 * Motion policy for this surface (Emil): hover and press feedback ONLY.
 * Nothing enters on load, nothing reveals on scroll. A city landing is an
 * entry point people arrive at from search and leave within seconds; a staged
 * entrance would delay the first paint they came for and re-play on every
 * back-navigation. Every transition names its properties, runs on the
 * `instant`/`fast` rungs (120/180ms), eases out, and collapses under
 * `motion-reduce`.
 */

/** Section shell: `container.page`, screen gutter, vertical rhythm. */
export const sectionShell = `mx-auto max-w-page py-12 md:py-16 ${gutter}`;

/** Sections after the hero are separated by a hairline, as the card draws. */
export const sectionRule = "border-t border-hairline";

export const eyebrow = "text-overline uppercase text-interactive";

export const sectionHeading = "text-h3 text-primary";

export const sectionSub = "mt-3 max-w-[66ch] text-bodyMd text-secondary";

/**
 * Media card (area thumbnails, listing tiles). Lifts 2px and swaps
 * elevation.subtle → elevation.card on hover, answers a press with the shared
 * 0.97-family scale. `hoverOnlyWhenSupported` in the Tailwind config keeps the
 * lift off touch devices, so a tap never leaves a tile floating.
 */
export const cardLift =
  "transition-[transform,box-shadow,border-color] duration-fast ease-decelerate hover:-translate-y-0.5 hover:shadow-card active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100";

/** Pill control: filter chips. Border and label go brand on hover. */
export const chip =
  "group inline-flex h-10 select-none items-center gap-2 rounded-full border border-border-default bg-canvas px-4 text-bodySm font-medium text-primary transition-[transform,border-color,color] duration-instant ease-decelerate hover:border-border-brand hover:text-interactive active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";

/**
 * Static attribute pill on a listing tile. Not interactive — no hover state.
 * Padding and gap are the card's tight badge metrics rather than the roomier
 * control ones: three pills have to sit on ONE line inside a 341px tile, and a
 * row that wraps 2+1 leaves the third pill looking dropped rather than listed.
 */
export const attributePill =
  "inline-flex items-center gap-1 rounded-full border border-hairline bg-raised px-2 py-1 text-overline text-primary";

/** Inline brand link (area "View stays in …", related columns). */
export const inlineLink =
  "inline-flex items-center gap-2 rounded-sm text-bodySm font-medium text-link underline-offset-4 transition-colors duration-instant ease-decelerate hover:text-link-strong hover:underline motion-reduce:transition-none";
