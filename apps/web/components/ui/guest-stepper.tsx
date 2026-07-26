"use client";

import type { ReactNode } from "react";

import { focusRing, fieldHint, fieldName, fieldRow, pressableCircle } from "@/components/ui";
import { MinusMark, PlusMark } from "@/components/ui/marks";
import { countedGuests, type GuestCounts } from "@/lib/booking/booking";
import type { GuestBand, ListingContent } from "@/lib/content/listings/is-f7-2bed";

/**
 * One band of gw-021's guest picker — a name, an age note, and a ± pair around
 * a live count.
 *
 * It is ONE ROW, not the whole group. The three bands share a form group but
 * not a rule: adults floor at one, children and infants at zero, and only two
 * of the three are capped at all. Folding that into a single `<GuestPicker>`
 * would put the capacity policy inside a primitive, where the next home with a
 * different band set cannot reach it. The step composes three of these inside a
 * `fieldGroup` and owns the copy, which is where the corpus keeps it.
 *
 * DISABLED CONTROLS STAY IN PLACE
 * -------------------------------
 * TASTE §11.7, and it is the whole visual point of the row: at a bound the
 * button keeps its 44px, loses its border weight to `border.hairline`, fills
 * flat `bg.raised` and drops its glyph to `text.disabled`. It never disappears
 * and never shrinks, so the ± pair does not dance sideways as a guest counts up
 * to six. Elevation law says the same thing from the other side (§1: "disabled
 * floating controls stay visible, lose the shadow, keep their place") — these
 * cast nothing to begin with, so the fill carries the whole signal.
 *
 * 44px is `space-11`, the touch-target rung, named for exactly this.
 */

export interface GuestStepperProps {
  /** The band's name — "Adults". 16/500 ink. */
  readonly label: ReactNode;
  /** The age note under it — "Ages 13 and up". 13/400 gray. Optional. */
  readonly hint?: ReactNode;
  readonly value: number;
  /** Floor. Defaults to 0; gw-021 passes 1 for adults, because a stay needs one. */
  readonly min?: number;
  /**
   * Ceiling, or `null` for a band this home does not cap.
   *
   * `null` is not "unlimited" — it is "this listing's disclosed policy says
   * nothing here", which is the honest state for infants. BUILD-DECISIONS §16
   * forbids inventing an infant cap ("a product decision dressed as a type"),
   * so the ceiling is absent rather than guessed, and `+` simply never disables.
   * Derive it with `guestBandCeiling()` below rather than by hand.
   */
  readonly max: number | null;
  /**
   * What a screen reader hears when the count changes — "4 adults", "1 adult".
   *
   * The caller composes it because the caller owns the copy and the plural, and
   * because the Urdu build reuses the corpus translations rather than a fresh
   * paraphrase. It becomes the `aria-label` on the `role="status"` count, which
   * is how gw-021 ships it: the announcement says what changed, not just to
   * what.
   */
  readonly countLabel: string;
  /** `aria-label` for `−` — "Remove one adult". */
  readonly decrementLabel: string;
  /** `aria-label` for `+` — "Add one adult". */
  readonly incrementLabel: string;
  readonly onChange: (next: number) => void;
  readonly className?: string;
}

/**
 * The tallest this band may go before the home's limit is reached — or `null`
 * when the limit does not apply to it.
 *
 * INFANTS ARE NOT A SPECIAL CASE HERE, AND THAT IS THE POINT
 * ----------------------------------------------------------
 * The rule reads out of `capacity.countsTowardLimit`, which is data on the
 * listing (`["adults", "children"]` for is-f7-2bed) and the same array
 * `countedGuests()` sums. Writing `if (band === "infants")` would state the
 * host's disclosed policy a second time, in a file the host cannot edit, and
 * the day a home counts children differently the picker would enforce the old
 * rule while the rail printed the new one.
 *
 * The ceiling is this band's own value plus whatever headroom is left, so a
 * booking already at the limit gets `max === value` and `+` disables without
 * the number moving.
 */
export function guestBandCeiling(
  band: GuestBand,
  guests: GuestCounts,
  capacity: ListingContent["capacity"],
): number | null {
  if (!capacity.countsTowardLimit.includes(band)) return null;
  return guests[band] + (capacity.maxGuests - countedGuests(guests, capacity));
}

/**
 * `border.default` + ink glyph at rest; flat `bg.raised` + `border.hairline` +
 * `text.disabled` at a bound. Hover deepens the border one rung — the shared
 * control grammar, already gated behind `(hover: hover)` by the app's
 * `hoverOnlyWhenSupported`, so a tap never leaves it stuck on.
 */
const stepBase =
  "flex size-11 flex-none items-center justify-center rounded-full border";
const stepEnabled =
  "border-border-default bg-canvas text-primary hover:border-border-strong";
const stepDisabled = "cursor-default border-hairline bg-raised text-disabled";

export function GuestStepper({
  label,
  hint,
  value,
  min = 0,
  max,
  countLabel,
  decrementLabel,
  incrementLabel,
  onChange,
  className = "",
}: GuestStepperProps) {
  const atFloor = value <= min;
  const atCeiling = max !== null && value >= max;

  return (
    <div className={`${fieldRow} items-center ${className}`}>
      <span className="min-w-0 flex-1">
        <span className={fieldName}>{label}</span>
        {hint ? <span className={fieldHint}>{hint}</span> : null}
      </span>

      <span className="flex flex-none items-center gap-3">
        <button
          type="button"
          aria-label={decrementLabel}
          disabled={atFloor}
          onClick={() => onChange(value - 1)}
          className={`${stepBase} ${atFloor ? stepDisabled : stepEnabled} ${focusRing} ${pressableCircle}`}
        >
          <MinusMark className="size-4" />
        </button>

        {/*
          `role="status"` is an implicit polite live region, so the announcement
          rides the count itself rather than a duplicate off-screen node — one
          element, one truth. `aria-label` carries the composed phrase and the
          visible text carries the digit; both change together, so the region
          fires exactly once per press. `.num` isolates the digit run so a count
          cannot reverse inside Urdu prose, and tabular figures keep the ± pair
          from shifting when 9 becomes 10.
        */}
        <span
          role="status"
          aria-label={countLabel}
          className="num min-w-6 text-center text-bodyMd font-semibold text-primary"
        >
          {value}
        </span>

        <button
          type="button"
          aria-label={incrementLabel}
          disabled={atCeiling}
          onClick={() => onChange(value + 1)}
          className={`${stepBase} ${atCeiling ? stepDisabled : stepEnabled} ${focusRing} ${pressableCircle}`}
        >
          <PlusMark className="size-4" />
        </button>
      </span>
    </div>
  );
}

export default GuestStepper;
