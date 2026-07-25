import { iconStroke } from "@salamstay/design-tokens/icons";
import Link from "next/link";
import { SearchIcon } from "./icons";
import { focusRing } from "./ui";

/**
 * GW-001 hero search pill — the card's `.searchbar`: three read-only summary
 * segments (Where / Dates / Guests) hairline-divided inside one pill, then the
 * brand submit inset by `space-2`.
 *
 * The segments are deliberately NOT inputs. On the card they are placeholders
 * that state what the search will ask for; the real city / date / guest pickers
 * are GW-005 / GW-022 / GW-023 surfaces. Submitting lands on `/search`, which
 * is exactly what the card's `action="/search" method="get"` promises — no
 * dead control, no fake affordance.
 *
 * Layout follows the card's own breakpoint behaviour: a column-stacked card
 * with an `xl` radius on narrow screens, a `full`-radius row from `sm` up.
 *
 * Elevation (TASTE-RULES §1, §10): the pill floats over the page the reader
 * scrolls, so it carries `elevation.floating` and NO border. The two are
 * alternatives, not a pair — a shadow says "above the plane", a border says
 * "form boundary", and drawing both on one object says neither convincingly.
 * The booking card is the single sanctioned exception on the site, and this is
 * not it.
 */

/**
 * Segment divider (§11.9): an INSET hairline, shorter than the pill, drawn as a
 * pseudo-element rather than a `border-r`. A full-height rule inside a rounded
 * container runs into the curve at both ends and reads as a seam in the pill;
 * inset by `space-3` top and bottom it reads as a divider between fields.
 */
const segmentDivider =
  "md:relative md:before:absolute md:before:inset-y-3 md:before:right-0 md:before:w-px md:before:bg-hairline md:before:content-[''] md:last-of-type:before:hidden";

/**
 * Hover deepens the shadow by exactly one ladder rung (`floating` → `popover`)
 * rather than growing a border back. Emil: 180ms (`duration.fast`) and
 * decelerating, so the lift starts the instant the pointer lands; `box-shadow`
 * is paint-local and interruptible, and nothing about the pill's geometry moves.
 * Reduced motion keeps the state change and drops the interpolation.
 */
const pillHover =
  "transition-shadow duration-fast ease-decelerate hover:shadow-popover motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate";

function Segment({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <span
      className={`flex min-w-0 flex-col justify-center border-b border-hairline px-5 py-3 last:border-b-0 md:basis-0 md:grow md:border-b-0 ${segmentDivider}`}
    >
      <span className="text-overline uppercase text-secondary">{label}</span>
      <span className="mt-1 truncate text-bodyMd text-secondary">{value}</span>
    </span>
  );
}

export function HomeSearchPill() {
  return (
    <>
    <form
      role="search"
      aria-label="Search stays"
      action="/search"
      method="get"
      /* `container.prose` is the pill's ceiling so the three segments divide
         one fixed measure evenly, the way the card draws them, instead of
         each sizing to its own placeholder and reading ragged. */
      className={`mt-8 hidden w-full max-w-prose overflow-hidden rounded-full bg-canvas shadow-floating md:flex md:flex-row md:items-stretch ${pillHover}`}
    >
      <Segment label="Where" value="Choose a city" />
      <Segment label="Dates" value="Add dates" />
      <Segment label="Guests" value="Add guests" />
      <button
        type="submit"
        className={`m-2 inline-flex h-12 shrink-0 select-none items-center justify-center gap-2 self-stretch whitespace-nowrap rounded-full bg-interactive px-6 text-bodyMd font-semibold text-on-brand transition-[transform,background-color] duration-instant ease-decelerate hover:bg-interactive-hover active:scale-[0.97] motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate motion-reduce:active:scale-100 md:self-center ${focusRing}`}
      >
        <SearchIcon className="size-5" stroke={iconStroke.bold} />
        Search stays
      </button>
    </form>
    {/* Below md the three-field pill would stack into ~350px of hero — the
        mobile fold belongs to inventory (review A1). One collapsed pill,
        Airbnb-style, links straight to /search. */}
    <Link
      href="/search"
      aria-label="Search stays"
      className={`mt-6 flex h-14 w-full items-center gap-3 rounded-full bg-canvas px-5 text-bodyMd text-secondary shadow-floating transition-[transform,box-shadow] duration-fast ease-decelerate hover:shadow-popover active:scale-[0.99] motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate motion-reduce:active:scale-100 md:hidden ${focusRing}`}
    >
      {/* Ink, not brand (§2): the collapsed pill has no submit circle, and a
          green leading glyph would spend a green role on a magnifier. */}
      <SearchIcon className="size-5 text-primary" stroke={iconStroke.bold} />
      <span className="truncate">Where to? · Any week · Add guests</span>
    </Link>
    </>
  );
}

export default HomeSearchPill;
