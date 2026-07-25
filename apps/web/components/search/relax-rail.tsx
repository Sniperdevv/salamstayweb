"use client";

import { ATTRIBUTES } from "@/components/stays/attributes";
import { ChevronRightIcon, RetryIcon, SearchIcon } from "@/components/icons";
import { focusRing } from "@/components/ui";
import type { FeaturedStay } from "@/lib/content/featured-stays";
import { countMatching, filterLabel, type FilterId } from "./filters";
import { Panel } from "./panel";

/**
 * The relax-a-filter state — GA-118's grammar on the web shell.
 *
 * The rule GA-118 exists to enforce: "no exact matches" is never a blank wall.
 * The empty state IS the navigation. Each row names the exact blocker and the
 * exact gain ("Remove 'Halal kitchen' — see 4 stays"), so the reader is never
 * asked to guess which of their choices cost them the results.
 *
 * Every number below is `countMatching()` over the fixtures this page is
 * already holding — the literal length of the array that would render if that
 * one chip came off. Nothing is estimated, nothing is inherited from the app's
 * shipped figures, and a row whose removal would reveal nothing is not drawn at
 * all rather than drawn promising zero.
 *
 * Rows are buttons for the same reason the chips are (GATE 75/76): relaxing a
 * filter must not be a navigation, because a navigation would be a URL.
 *
 * The glyph is the blocker's OWN attribute glyph, not a generic ✕. The row
 * already says "Remove" in words; spending the plate on the halal-kitchen mark
 * instead means the reader can find the row for the filter they regret without
 * reading three labels.
 */

/**
 * White plate, `border.default`, no shadow. §1 puts the border exactly here: a
 * row is an unselected choice, which is one of the two things a border is for,
 * and the closing review's "no bordered content boxes" ruling sanctions the
 * same distinction from the other side (form controls keep their borders; the
 * strip they sit on does not). `radius.md` per the gw-005 `.relaxbtn` redline.
 */
const row =
  "group flex w-full items-center gap-3 rounded-md border border-border-default bg-canvas px-4 py-2.5 text-start " +
  "transition-[transform,border-color] duration-instant ease-decelerate " +
  "hover:border-border-strong active:scale-[0.99] sm:w-auto " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";

const plate = "grid size-8 shrink-0 place-items-center rounded-full bg-sunken text-secondary";

function Gain({ count }: { readonly count: number }) {
  return (
    <span className="mt-0.5 block text-caption text-secondary">
      See <span className="num">{count}</span> {count === 1 ? "stay" : "stays"}
    </span>
  );
}

export interface RelaxRailProps {
  readonly cityName: string;
  readonly stays: readonly FeaturedStay[];
  readonly pressed: readonly FilterId[];
  readonly onRemove: (id: FilterId) => void;
  readonly onClear: () => void;
}

export function RelaxRail({
  cityName,
  stays,
  pressed,
  onRemove,
  onClear,
}: RelaxRailProps) {
  // One count per pressed filter: what this city holds with that chip off and
  // every other chip still on.
  const blockers = pressed
    .map((id) => ({ id, gain: countMatching(stays, pressed.filter((p) => p !== id)) }))
    .filter((b) => b.gain > 0);

  const total = stays.length;
  const showClear = pressed.length > 1 && total > 0;

  return (
    <Panel
      icon={<SearchIcon className="size-5" />}
      title="No stays match yet"
      body={
        <>
          <span className="num">{pressed.length}</span>{" "}
          {pressed.length === 1 ? "filter is" : "filters are"} narrowing the homes in{" "}
          {cityName}. Take one off and the rest come back.
        </>
      }
    >
      <div className="mt-4 flex flex-wrap gap-2">
        {blockers.map(({ id, gain }) => {
          const { Icon } = ATTRIBUTES[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onRemove(id)}
              className={`${row} ${focusRing}`}
            >
              <span className={plate}>
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-bodySm font-semibold text-primary">
                  Remove &ldquo;{filterLabel(id)}&rdquo;
                </span>
                <Gain count={gain} />
              </span>
              <ChevronRightIcon className="size-4 shrink-0 text-tertiary" />
            </button>
          );
        })}

        {showClear ? (
          <button type="button" onClick={onClear} className={`${row} ${focusRing}`}>
            <span className={plate}>
              <RetryIcon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-bodySm font-semibold text-primary">
                Clear all filters
              </span>
              <Gain count={total} />
            </span>
            <ChevronRightIcon className="size-4 shrink-0 text-tertiary" />
          </button>
        ) : null}
      </div>
    </Panel>
  );
}

export default RelaxRail;
