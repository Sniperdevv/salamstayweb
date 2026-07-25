import { gutter } from "@/components/ui";

/**
 * Discovery page grammar — ONE definition of the shell, the rhythm and the
 * heading role, shared by every block in `components/city/*` and
 * `components/area/*`.
 *
 * This file is the convergence `city-shell.ts` and `area-shell.ts` both said
 * was coming. Phase 3 moved the city landing onto the homepage's measures;
 * Phase 4 moved the area page onto the same ones and left the two constants
 * files byte-identical with a comment on each explaining that the duplicate was
 * deliberate until someone was allowed to touch both templates at once. This is
 * that moment: the two files are gone and both templates read these.
 *
 * Nothing about the rendered output changes. The values below are the two
 * shells' shared values, with `TILE_SIZES` (city area tiles) and `siblingPanel`
 * (area sibling links) carried across so the discovery grammar has one home
 * rather than one and two halves.
 *
 * Why `max-w-wide` and not `max-w-page`:
 *  · The rail needs it. At a 1232 content box the rail holds 6.28 compact cards
 *    (208 wide, 12 gap) against 5.8 at `container.page` — which is the
 *    difference between six homes on one row and five plus a stub.
 *  · The shared header is `max-w-wide` (components/site-header.tsx). Running
 *    the H1 at `container.page` sets it eighty pixels right of the wordmark
 *    directly above it, a step the eye reads as a bug rather than as two
 *    measures. Long-form runs keep their own cap instead.
 *
 * Rhythm is bottom-padding only, so the gap between two blocks is one value
 * rather than the sum of two.
 */

export const shell = `mx-auto max-w-wide ${gutter}`;

export const rhythm = "pb-8 md:pb-10";

/**
 * The same gap, as margin, for a full-bleed tinted band. A band cannot pay its
 * own gap in padding without tinting it, so the one block on a city page that
 * changes surface pays it here instead.
 */
export const bandRhythm = "mb-8 md:mb-10";

/**
 * Every section heading is the rail heading's role, so a page has one voice.
 *
 * `h5` (20), not `h4` (24). TASTE-RULES §7 sets the content-page ladder at
 * H1 ≈ 26 · sections ≈ 22 · card titles 16, and at 24 a section heading sat
 * only four pixels under a 28px H1 — close enough that the page read as a
 * column of near-equal shouts rather than as a title with sections under it.
 * At 20 the step down is legible, and the step from 20 to a 16px card title
 * still is. `h5` is the nearest role to the redline's 22.
 */
export const sectionH2 = "text-h5 text-primary";

/** Standard gap from a section heading to its content — the rail's own. */
export const headingGap = "mt-5";

/**
 * Six-across tile `sizes` for this shell: 1280 cap − 48 gutter = 1232, less
 * five 16px gaps, over six columns ≈ 192. Stated here rather than taken from
 * the toolkit's `CITY_GRID_SIZES`, which is the arithmetic of a
 * `container.page` grid.
 */
export const TILE_SIZES =
  "(min-width: 1280px) 192px, (min-width: 1024px) 17vw, (min-width: 768px) 31vw, 45vw";

/**
 * Sibling-sector tile: a bordered panel that is itself a link. The toolkit's
 * `panelLink` at `p-5` with the area page's `p-4` cards next to it reads as two
 * card families, so the padding is the page's and the motion is the toolkit's,
 * copied verbatim — the border strengthens (never goes brand: §2 keeps green
 * off hover states everywhere), the press answers with the shared 0.99 scale,
 * no lift, and reduced motion keeps the colour change and drops the transform.
 */
export const siblingPanel =
  "group block rounded-lg border border-hairline bg-canvas p-4 " +
  "transition-[transform,border-color] duration-instant ease-decelerate " +
  "hover:border-border-strong active:scale-[0.99] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";
