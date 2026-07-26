"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Num } from "@/components/numerals";
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon } from "@/components/icons";
import { focusRing, pressable } from "@/components/ui";
import { addDays } from "@/lib/booking/booking";
import type { StayDates } from "@/lib/booking/booking";
import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";
import { CalendarDayCell, CalendarPadCell } from "./calendar-day";
import {
  NO_SELECTION,
  WEEKDAYS,
  buildMonth,
  canCheckOutOn,
  daysInMonth,
  resolveDay,
  selectionStatus,
  shiftMonth,
  startOfMonth,
  weekdayIndex,
} from "./calendar-model";
import type { CalendarMonth, CalendarSelection } from "./calendar-model";

/**
 * The date-range picker — `gw-021-reserve.html`'s `.cal`, built in Tailwind
 * against `@salamstay/design-tokens` rather than ported from the card's
 * stylesheet (BUILD-DECISIONS ruling 0).
 *
 * ONE DELIBERATE DIVERGENCE FROM THE CARD. `gw-021` draws a Hijri numeral under
 * each Gregorian one, a Hijri span in the month header, a Ramadan band, an Eid
 * dot and a moon-sighting footnote. The founder's 2026-07-26 ruling removes the
 * Hijri layer entirely, so none of it is here and the conversion module that
 * computed it has been deleted rather than left unused. The card is to be
 * updated to match; this is not drift to be corrected back later.
 *
 * WHERE IT SITS
 * -------------
 * In open space directly beneath the dates form group, with no box, no card and
 * no second border — SHELL DECISION 4 and TASTE §1's "carries NEITHER",
 * applied deliberately to the largest object on the page. The form group above
 * it and the `.dfoot` nights line belong to the step, not here; this component
 * owns the calendar and nothing else, and speaks to the page through `value` /
 * `onChange`.
 *
 * WHAT IT DOES NOT DECIDE
 * -----------------------
 * `today` is a required prop, not `new Date()`. `lib/booking/booking.ts` keeps
 * every date rule free of `Date.now()` so the same input always produces the
 * same screen, and a calendar that reads the clock on the client would render
 * one grid on the server and a different one after hydration on any day that
 * turns over mid-request. The page picks the day; the picker draws it.
 *
 * There is no booking horizon and no maximum stay. Neither exists anywhere in
 * the corpus and BUILD-DECISIONS §16 names both as product decisions nobody may
 * invent, so `next` never disables. `prev` disables at the month containing
 * `today` because the past is not a booking horizon, it is the past.
 *
 * THE TWO-TAP SEQUENCE
 * --------------------
 * First tap sets the check-in and clears any committed range; second tap
 * completes the stay if it can, and otherwise becomes a new check-in. Which of
 * the two a tap does is decided by `canCheckOutOn`, which is `stayIssues` from
 * `lib/booking` — so the picker cannot offer a range the checkout would then
 * reject.
 *
 * The in-progress check-in lives inside this component, because a lone check-in
 * is not a `StayDates` and must not reach the draft. `onChange` therefore fires
 * with `null` when a committed range is broken up, and with a complete
 * `StayDates` when one is made. A page-level "Clear dates" that must also drop a
 * half-made selection should change the picker's `key`.
 */

export interface DateRangePickerProps {
  readonly listing: ListingContent;
  /** The committed stay, or `null`. Controlled. */
  readonly value: StayDates | null;
  /** `null` when a committed range is broken up by a fresh first tap. */
  readonly onChange: (dates: StayDates | null) => void;
  /** `YYYY-MM-DD`. Supplied by the page; never read from the clock here. */
  readonly today: string;
  /** How many months to show side by side above 1080px. Two, per the card. */
  readonly monthCount?: number;
  /** Names the calendar region. Point it at the section's own heading. */
  readonly labelledBy?: string;
}

/**
 * `CHECKOUT-SHELL.md` §4 fixes the checkout's collapse at 1080px: the summary
 * rail leaves the flow and the calendar drops to one month. 1080 is not a
 * Tailwind breakpoint and it is not a design token — it is the width at which
 * this page's two-column shell stops fitting, so it is expressed as the
 * arbitrary variant it is rather than rounded to `lg` (1024), where the rail is
 * still beside the form and two months would each get 40px columns.
 */
const TWO_UP = "(min-width: 1080px)";

function subscribeToWidth(onChange: () => void): () => void {
  const query = window.matchMedia(TWO_UP);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * How many months are actually on screen.
 *
 * The CSS hides the second month below 1080px, which is what stops it flashing
 * in and out around hydration. This hook exists for the OTHER half of the
 * problem: arrow-key focus must not walk into a `display:none` month, where
 * `focus()` silently does nothing and the guest loses the grid. The server
 * snapshot is the full count so hydration matches the markup, and the real
 * measurement arrives on the first client render.
 */
function useMonthsInView(monthCount: number): number {
  return useSyncExternalStore(
    subscribeToWidth,
    () => (window.matchMedia(TWO_UP).matches ? monthCount : 1),
    () => monthCount,
  );
}

export function DateRangePicker({
  listing,
  value,
  onChange,
  today,
  monthCount = 2,
  labelledBy,
}: DateRangePickerProps) {
  const [firstMonth, setFirstMonth] = useState(() =>
    startOfMonth(value?.checkIn ?? today),
  );
  const [pending, setPending] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [focusedIso, setFocusedIso] = useState(() => value?.checkIn ?? today);

  const monthsInView = useMonthsInView(monthCount);
  const gridRef = useRef<HTMLDivElement>(null);
  const cells = useRef(new Map<string, HTMLElement>());
  const moveByKey = useRef(false);

  const registerCell = useCallback((iso: string, element: HTMLElement | null) => {
    if (element === null) cells.current.delete(iso);
    else cells.current.set(iso, element);
  }, []);

  // Focus follows the roving tabindex, but only when a key moved it — clicking
  // a day must not yank focus back after the browser has already placed it.
  useEffect(() => {
    if (!moveByKey.current) return;
    moveByKey.current = false;
    cells.current.get(focusedIso)?.focus();
  }, [focusedIso, firstMonth]);

  const months: readonly CalendarMonth[] = useMemo(
    () =>
      Array.from({ length: monthCount }, (_, i) =>
        buildMonth(shiftMonth(firstMonth, i), today, listing),
      ),
    [firstMonth, monthCount, today, listing],
  );

  const selection: CalendarSelection = useMemo(() => {
    if (value !== null) {
      return { checkIn: value.checkIn, checkOut: value.checkOut, preview: null };
    }
    if (pending === null) return NO_SELECTION;
    const provisional =
      preview !== null && canCheckOutOn(preview, pending, listing) ? preview : null;
    return { checkIn: pending, checkOut: null, preview: provisional };
  }, [value, pending, preview, listing]);

  const selectDay = useCallback(
    (iso: string) => {
      if (pending !== null && canCheckOutOn(iso, pending, listing)) {
        setPending(null);
        setPreview(null);
        onChange({ checkIn: pending, checkOut: iso });
        return;
      }
      setPending(iso);
      setPreview(null);
      if (value !== null) onChange(null);
    },
    [pending, listing, onChange, value],
  );

  // Only a half-made selection has anything to preview, so the pointer stops
  // costing a render the rest of the time.
  const previewDay = useCallback(
    (iso: string | null) => {
      if (pending === null) return;
      setPreview(iso);
    },
    [pending],
  );

  const lastMonthInView = shiftMonth(firstMonth, monthsInView - 1);
  const earliestMonth = startOfMonth(today);
  const atEarliestMonth = firstMonth <= earliestMonth;

  /**
   * The one cell that holds `tabIndex={0}`, DERIVED rather than stored.
   *
   * `focusedIso` is where the arrow keys left off, and paging with the nav
   * buttons deliberately does not move it — focus belongs to the button the
   * guest just pressed. But a roving tabindex pointing at a month that is no
   * longer rendered is a grid with no tab stop at all: Tab would skip the whole
   * calendar. Deriving the tab stop instead of syncing it means the two can
   * never disagree, and the guest lands on the same day-of-month in the month
   * they paged to, which is where they were looking.
   */
  const tabbableIso = ((): string => {
    const month = startOfMonth(focusedIso);
    if (month >= firstMonth && month <= lastMonthInView) return focusedIso;
    return addDays(
      firstMonth,
      Math.min(Number(focusedIso.slice(8, 10)), daysInMonth(firstMonth)) - 1,
    );
  })();

  const pageMonths = useCallback(
    (delta: number) => {
      setFirstMonth((current) => {
        const next = shiftMonth(current, delta);
        return next < earliestMonth ? earliestMonth : next;
      });
    },
    [earliestMonth],
  );

  const moveFocus = useCallback(
    (target: string) => {
      const clamped = target < earliestMonth ? earliestMonth : target;
      const targetMonth = startOfMonth(clamped);
      if (targetMonth < firstMonth) setFirstMonth(targetMonth);
      else if (targetMonth > lastMonthInView) {
        setFirstMonth(shiftMonth(targetMonth, -(monthsInView - 1)));
      }
      moveByKey.current = true;
      setFocusedIso(clamped);
      if (pending !== null) setPreview(clamped);
    },
    [earliestMonth, firstMonth, lastMonthInView, monthsInView, pending],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // Under RTL the whole grid mirrors, so the arrow that means "the day to
      // my left" is the one that means "tomorrow".
      const rtl =
        gridRef.current !== null &&
        getComputedStyle(gridRef.current).direction === "rtl";

      let target: string | null = null;
      switch (event.key) {
        case "ArrowLeft":
          target = addDays(tabbableIso, rtl ? 1 : -1);
          break;
        case "ArrowRight":
          target = addDays(tabbableIso, rtl ? -1 : 1);
          break;
        case "ArrowUp":
          target = addDays(tabbableIso, -7);
          break;
        case "ArrowDown":
          target = addDays(tabbableIso, 7);
          break;
        case "Home":
          target = addDays(tabbableIso, -weekdayIndex(tabbableIso));
          break;
        case "End":
          target = addDays(tabbableIso, 6 - weekdayIndex(tabbableIso));
          break;
        case "PageUp":
          target = sameDayInMonth(tabbableIso, -1);
          break;
        case "PageDown":
          target = sameDayInMonth(tabbableIso, 1);
          break;
        default:
          return;
      }
      event.preventDefault();
      moveFocus(target);
    },
    [tabbableIso, moveFocus],
  );

  const status = selectionStatus(selection.checkIn, selection.checkOut, listing);

  return (
    // `role="group"` only when there is something to name it with. A group with
    // no accessible name is an extra boundary a screen reader announces and
    // learns nothing from; without `labelledBy` the wrapper is just a div and
    // the two `role="grid"`s carry their own names.
    <div
      className="mt-6"
      {...(labelledBy === undefined ? {} : { role: "group", "aria-labelledby": labelledBy })}
    >
      <div className="flex items-center gap-3">
        <MonthNav
          direction="prev"
          disabled={atEarliestMonth}
          onClick={() => pageMonths(-1)}
        />
        <div className="grid flex-1 grid-cols-1 gap-6 text-center min-[1080px]:grid-cols-2">
          {months.map((month, index) => (
            <div
              key={month.firstIso}
              className={`text-bodyMd font-semibold text-primary ${
                index === 0 ? "" : "hidden min-[1080px]:block"
              }`}
            >
              <Num>{month.title}</Num>
            </div>
          ))}
        </div>
        <MonthNav direction="next" onClick={() => pageMonths(1)} />
      </div>

      <div
        ref={gridRef}
        onKeyDown={onKeyDown}
        onPointerLeave={() => previewDay(null)}
        className="mt-3 grid max-w-md grid-cols-1 gap-6 min-[1080px]:max-w-none min-[1080px]:grid-cols-2"
      >
        {months.map((month, index) => (
          <MonthGrid
            key={month.firstIso}
            month={month}
            hidden={index > 0}
            selection={selection}
            listing={listing}
            focusedIso={tabbableIso}
            onSelect={selectDay}
            onPreview={previewDay}
            onFocusDay={setFocusedIso}
            registerCell={registerCell}
          />
        ))}
      </div>

      <p className="sr-only" role="status">
        {status}
      </p>

      <Legend />

      <p className="mt-4 flex max-w-[62ch] items-start gap-2 text-label font-normal leading-relaxed text-secondary">
        <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-tertiary" />
        <span>
          <Num>
            {`Struck-through dates are unavailable or below this host's ${listing.capacity.minNights}-night minimum stay. They stay visible so you can see why.`}
          </Num>
        </span>
      </p>
    </div>
  );
}

/** Same day-of-month one month away, clamped to that month's length. */
function sameDayInMonth(iso: string, delta: number): string {
  const target = shiftMonth(iso, delta);
  const dayOfMonth = Number(iso.slice(8, 10));
  return addDays(target, Math.min(dayOfMonth, daysInMonth(target)) - 1);
}

/**
 * Prev / next. TASTE §11.7: a control at a bound stays exactly where it is,
 * loses its edge rather than its place, and never shifts the row.
 */
function MonthNav({
  direction,
  disabled = false,
  onClick,
}: {
  readonly direction: "prev" | "next";
  readonly disabled?: boolean;
  readonly onClick: () => void;
}) {
  const Chevron = direction === "prev" ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous month" : "Next month"}
      className={`flex h-10 w-10 flex-none items-center justify-center rounded-full border bg-canvas text-primary disabled:border-hairline disabled:bg-raised disabled:text-disabled ${
        disabled ? "border-hairline" : "border-border-default hover:border-border-strong"
      } ${focusRing} ${pressable}`}
    >
      <Chevron className="h-4 w-4 rtl:-scale-x-100" />
    </button>
  );
}

function MonthGrid({
  month,
  hidden,
  selection,
  listing,
  focusedIso,
  onSelect,
  onPreview,
  onFocusDay,
  registerCell,
}: {
  readonly month: CalendarMonth;
  readonly hidden: boolean;
  readonly selection: CalendarSelection;
  readonly listing: ListingContent;
  readonly focusedIso: string;
  readonly onSelect: (iso: string) => void;
  readonly onPreview: (iso: string | null) => void;
  readonly onFocusDay: (iso: string) => void;
  readonly registerCell: (iso: string, element: HTMLElement | null) => void;
}) {
  return (
    <div className={hidden ? "hidden min-[1080px]:block" : undefined}>
      <div role="grid" aria-label={month.title}>
        <div role="row" className="grid grid-cols-7">
          {WEEKDAYS.map((day) => (
            <span
              key={day.short}
              role="columnheader"
              aria-label={day.long}
              className="pb-2 text-center text-overline text-tertiary"
            >
              {day.short}
            </span>
          ))}
        </div>
        {month.weeks.map((week) => (
          <div key={week.key} role="row" className="grid grid-cols-7">
            {week.days.map((day, column) =>
              day === null ? (
                <CalendarPadCell key={`${week.key}-p${column}`} />
              ) : (
                <CalendarDayCell
                  key={day.iso}
                  day={day}
                  resolved={resolveDay(day, selection, listing)}
                  focused={day.iso === focusedIso}
                  onSelect={onSelect}
                  onPreview={onPreview}
                  onFocus={onFocusDay}
                  registerCell={registerCell}
                />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The legend — `gw-021`'s four rows, and only ever those four.
 *
 * Every row keys a mark that is genuinely on the grid: the ink endpoint, the
 * band, the today ring, the strikethrough. A key to a mark the calendar does
 * not draw is decoration, and TASTE §12's "steal layouts, never content" cuts
 * cells rather than filling them.
 */
function Legend() {
  return (
    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-hairline pt-4">
      <LegendRow label="Check-in / check-out">
        <span className="h-3 w-3 flex-none rounded-full bg-selected" />
      </LegendRow>
      <LegendRow label="Nights in your stay">
        <span className="h-3 w-3 flex-none rounded-none border border-hairline bg-raised" />
      </LegendRow>
      <LegendRow label="Today">
        <span className="h-3 w-3 flex-none rounded-full border border-border-strong" />
      </LegendRow>
      {/* `gw-021`'s own wording, which carries no digit — the note directly
          below the legend is where the number belongs, and printing it twice
          two lines apart reads as a stutter. */}
      <LegendRow label="Unavailable or below the minimum">
        <span className="relative h-3 w-3 flex-none rounded-full border border-border-default bg-canvas">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-disabled" />
        </span>
      </LegendRow>
    </div>
  );
}

function LegendRow({
  label,
  children,
}: {
  readonly label: string;
  readonly children: React.ReactNode;
}) {
  return (
    // The label is wrapped in ONE span on purpose: `Num` splits a string into a
    // text run per digit group, and as bare children of a `gap-2` flex row each
    // run would become its own flex item with 8px of air around every numeral.
    <span className="inline-flex items-center gap-2 text-label font-normal text-secondary">
      {children}
      <span>
        <Num>{label}</Num>
      </span>
    </span>
  );
}

export default DateRangePicker;
