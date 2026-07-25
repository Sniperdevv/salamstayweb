/**
 * Area-landing page grammar — one definition of the shell, the rhythm and the
 * heading role, shared by every block in `components/area/*`.
 *
 * These values are byte-identical to `components/city/city-shell.ts`, and that
 * is the point rather than an oversight. Phase 3 moved the city landing onto
 * the homepage's measures and left the area template behind at
 * `container.page` with `py-12/16` sections and `text-h3` headings; Phase 4
 * moves the area page onto the same measures, because the two are now the same
 * kind of page — an inventory page with a reading tail — and a reader who
 * arrives from `/stays-in-islamabad` should not feel the measure change under
 * them.
 *
 * Why `max-w-wide` and not `max-w-page`:
 *  · The rail needs it. At a 1232 content box the rail holds 6.28 compact
 *    cards (208 wide, 12 gap) against 5.8 at `container.page` — which is the
 *    difference between six homes on one row and five plus a stub.
 *  · The shared header is `max-w-wide` (components/site-header.tsx). Running
 *    the H1 at `container.page` sets it eighty pixels right of the wordmark
 *    directly above it, a step the eye reads as a bug rather than as two
 *    measures. Long-form runs keep their own cap instead.
 *
 * The duplication is deliberate for now: promoting these three constants and
 * the disclosure card into a shared `components/discovery/*` module is a
 * refactor that touches the shipped city page, and Phase 4 does not touch the
 * city page. It is the obvious follow-up.
 *
 * Rhythm is bottom-padding only, so the gap between two blocks is one value
 * rather than the sum of two.
 */

import { gutter } from "@/components/ui";

export const shell = `mx-auto max-w-wide ${gutter}`;

export const rhythm = "pb-8 md:pb-10";

/** Every section heading is the rail heading's role, so the page has one voice. */
export const sectionH2 = "text-h4 text-primary";

/** Standard gap from a section heading to its content — the rail's own. */
export const headingGap = "mt-5";

/**
 * Sibling-sector tile: a bordered panel that is itself a link. The toolkit's
 * `panelLink` at `p-5` with this page's `p-4` cards next to it reads as two
 * card families, so the padding is the page's and the motion is the toolkit's,
 * copied verbatim — border and heading go brand, the press answers with the
 * shared 0.99 scale, no lift, and reduced motion keeps the colour change and
 * drops the transform.
 */
export const siblingPanel =
  "group block rounded-lg border border-hairline bg-canvas p-4 " +
  "transition-[transform,border-color] duration-instant ease-decelerate " +
  "hover:border-border-brand active:scale-[0.99] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";
