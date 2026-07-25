import { iconStroke } from "@salamstay/design-tokens/icons";
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
    <span className="flex flex-col justify-center border-b border-hairline px-5 py-3 sm:border-b-0 sm:border-r">
      <span className="text-overline uppercase text-secondary">{label}</span>
      <span className="mt-1 whitespace-nowrap text-bodyMd text-secondary">{value}</span>
    </span>
  );
}

export function HomeSearchPill() {
  return (
    <form
      role="search"
      aria-label="Search stays"
      action="/search"
      method="get"
      className="mt-8 flex max-w-full flex-col overflow-hidden rounded-xl border border-border-default bg-canvas shadow-card sm:inline-flex sm:flex-row sm:items-stretch sm:rounded-full"
    >
      <Segment label="Where" value="Choose a city" />
      <Segment label="Dates" value="Add dates" />
      <Segment label="Guests" value="Add guests" />
      <button
        type="submit"
        className={`m-2 inline-flex h-12 shrink-0 select-none items-center justify-center gap-2 self-stretch whitespace-nowrap rounded-full bg-interactive px-6 text-bodyMd font-semibold text-on-brand transition-[transform,background-color] duration-instant ease-decelerate hover:bg-interactive-hover active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 sm:self-center ${focusRing}`}
      >
        <SearchIcon className="size-5" stroke={iconStroke.bold} />
        Search stays
      </button>
    </form>
  );
}

export default HomeSearchPill;
