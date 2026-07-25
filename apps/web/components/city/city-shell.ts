import { gutter } from "@/components/ui";

/**
 * City-landing page grammar — one definition of the shell, the rhythm and the
 * heading role, shared by every block in `components/city/*`.
 *
 * This is deliberately the HOMEPAGE's grammar, not the area template's. The two
 * discovery templates diverged in Phase 3: the area page is still a reading
 * page at `container.page` with `py-12/16` sections and `text-h3` headings,
 * while a city landing is now an inventory page and inherits the homepage's
 * measures exactly. `components/stays/styles.ts` stays as it is and keeps
 * serving GW-003; nothing here changes it.
 *
 * Why `max-w-wide` and not `max-w-page`:
 *  · The rail needs it. At a 1232 content box the rail holds 6.28 compact
 *    cards (184 wide, 12 gap) against 5.8 at `container.page` — which is the
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
 * own gap in padding without tinting it, so the one block on the page that
 * changes surface pays it here instead.
 */
export const bandRhythm = "mb-8 md:mb-10";

/** Every section heading is the rail heading's role, so the page has one voice. */
export const sectionH2 = "text-h4 text-primary";

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
