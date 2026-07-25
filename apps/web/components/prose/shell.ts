import { headingGap, sectionH2, shell } from "@/components/discovery/shell";

/**
 * Prose-page grammar — the four long-form content surfaces (GW-006 trust &
 * safety, GW-007 Shariah approach, GW-008 about, GW-009 city guide).
 *
 * These pages are read, not scanned. Everything on them is a sentence, a fact
 * row, a table or a link; there is no inventory, no map, no filter bar. So the
 * grammar is two measures rather than one:
 *
 *  · The SHELL is the site's `max-w-wide` box (`shell`, below). It has to be:
 *    the shared header sets its wordmark at that measure, and an H1 eighty
 *    pixels right of the wordmark directly above it reads as a bug rather than
 *    as two containers (the same reason `components/discovery/shell.ts` gives).
 *  · The COLUMN is the reading measure inside it. A 1232px line of 16px body
 *    text is about 150 characters and unreadable; `max-w-prose` is Tailwind's
 *    65ch, which is the middle of the readable band and the measure the city
 *    and area intros already set their support lines at. One measure for every
 *    paragraph on the page, so the left edge never moves and the right edge is
 *    always in the same place.
 *
 * Everything else is imported from the shared page grammar rather than restated
 * — the heading role, the heading-to-content gap and the block rhythm are the
 * site's, not this surface's. Re-exported here so a prose page has one import
 * for its measures and cannot pick up a discovery-only value by reaching into
 * that file for the two constants it does need.
 */

export { shell, sectionH2, headingGap };

/**
 * Block rhythm, one rung above the discovery pages' `pb-8 md:pb-10`.
 *
 * A discovery page's blocks are dense and adjacent — a rail, then chips, then
 * more rails — and a tight gap keeps inventory on the first screen. A prose
 * page's blocks are arguments, and the gap between two of them is what tells a
 * reader one has finished. The card contracts draw 52px section padding; this
 * is the nearest token pair.
 *
 * Bottom-padding only, so the gap between two sections is one value rather
 * than the sum of two.
 */
export const sectionGap = "pb-10 md:pb-12";

/**
 * The reading measure. Every paragraph, fact row, list and strip is capped
 * here; only the GW-007 document table is allowed to run wider, because three
 * columns of document names do not fit in 65 characters.
 */
export const column = "max-w-prose";

/**
 * Prose body: the shared 16/400 secondary role, with the payload-bold rule
 * (TASTE-RULES §7 — "bold the payload word only") wired in once so no page has
 * to remember to style its own `<strong>`. Ink + 600 is what a payload word
 * looks like everywhere else on the site.
 */
export const prose =
  `${column} text-bodyMd text-secondary [&_strong]:font-semibold [&_strong]:text-primary`;

/**
 * `bg.raised` info strip (TASTE-RULES §6, one of raised's five jobs; §10
 * "radius.md, only the payload bolded"). The ONLY tinted block these pages
 * carry, and only where a card ships strip-class content: the two GW-006
 * notes, the GW-007 honesty boundary and correction note, the GW-008 beta
 * note, the GW-009 verification note.
 *
 * No border and no shadow, by §1: a strip does not float over anything the
 * reader scrolls, and it is not a form boundary or an unselected choice. The
 * tint is the whole treatment.
 */
export const strip = `${column} rounded-md bg-raised p-5`;

/**
 * Hairline-separated fact row. Used by every list on these pages that is a
 * term plus a description — the GW-006 reporting and trip-safety rows, the
 * amanah and mediation steps, the GW-007 protections, the GW-008 registry.
 *
 * A rule between rows, never a box around each one: §1 puts content blocks in
 * open space with neither border nor shadow, and a rule is a separator rather
 * than a container. The first row drops its rule because the heading above it
 * is already the boundary.
 */
export const factRow = "border-t border-hairline py-4 first:border-t-0 first:pt-0";
