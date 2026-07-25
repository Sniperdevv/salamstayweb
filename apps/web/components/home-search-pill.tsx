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
 */

function Segment({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <span className="flex min-w-0 flex-col justify-center border-b border-hairline px-5 py-3 md:basis-0 md:grow md:border-b-0 md:border-r">
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
      className="mt-8 hidden w-full max-w-prose overflow-hidden rounded-full border border-border-default bg-canvas shadow-card md:flex md:flex-row md:items-stretch"
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
      className={`mt-6 flex h-14 w-full items-center gap-3 rounded-full border border-border-default bg-canvas px-5 text-bodyMd text-secondary shadow-card transition-[transform,border-color] duration-instant ease-decelerate hover:border-border-strong active:scale-[0.99] motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate motion-reduce:active:scale-100 md:hidden ${focusRing}`}
    >
      <SearchIcon className="size-5 text-interactive" stroke={iconStroke.bold} />
      <span className="truncate">Where to? · Any week · Add guests</span>
    </Link>
    </>
  );
}

export default HomeSearchPill;
