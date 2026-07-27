import {
  daysInMonth,
  gregorianMonthName,
  startOfMonth,
  weekdayIndex,
} from "@/components/booking/calendar-model";
import { addDays, daysBetween } from "@/lib/booking/booking";
import { formatPkr } from "@/lib/money";

import type { HostListing, NightStay } from "./calendar-data";

/**
 * The host month — grid shape, night states and accessible names, with no React
 * and no styling in sight.
 *
 * The same split, for the same reason, as `components/booking/calendar-model.ts`:
 * the two things easiest to get quietly wrong on a calendar are which nights are
 * struck and why, and what a screen reader is told about each one. Both are
 * decided here where they can be read in one screen.
 *
 * WHAT IS BORROWED FROM THE GUEST PICKER, AND WHAT COULD NOT BE
 * ------------------------------------------------------------
 * **Borrowed, unchanged:** every date function. `startOfMonth`, `weekdayIndex`
 * and `gregorianMonthName` come from `calendar-model.ts`; `addDays` and
 * `daysBetween` from `lib/booking/booking.ts`. All of it is string arithmetic
 * over `YYYY-MM-DD` in UTC, which is the discipline that makes a grid rendered
 * in Karachi and one rendered on a CI box in Virginia the same grid. Nothing
 * here re-implements a date rule, and the seven-wide, pad-to-a-full-row geometry
 * is `buildMonth`'s, followed exactly.
 *
 * **Not borrowed, and here is the honest reason:** `buildMonth`, `resolveDay`,
 * `bandRole` and `selectionStatus` all take a `ListingContent` and answer a
 * GUEST's question — can a stay START here, can it END here, is this run below
 * the minimum. A host is not picking a range and there is no `ListingContent`
 * behind these homes; the fixture is booking-shaped, not listing-shaped. Calling
 * those functions would have meant fabricating a listing to satisfy their
 * signature, which is a lie told to a type. So the geometry is imported and the
 * host semantics — booked, requested, blocked, past — are written here.
 *
 * ONE NUMERAL. `gw-021` and `ha-041` both draw a Hijri numeral under the
 * Gregorian one, a Hijri span in the month header, a Ramadan band and an Eid
 * dot. The founder's 2026-07-26 ruling drops the Hijri layer, `calendar-day.tsx`
 * and `date-range-picker.tsx` already ship without it, and `REPOSITIONING.md`
 * retires the observance model this product used to carry. None of it is here.
 */

/**
 * What a night IS. Ranked by who decided it: a guest's confirmed stay outranks
 * a request, and both outrank anything the host has done to the night.
 */
export type NightState = "open" | "requested" | "booked" | "blocked";

export interface HostNight {
  readonly iso: string;
  readonly dayOfMonth: number;
  readonly isToday: boolean;
  /** Before today. Not a state of the night — a fact about the calendar. */
  readonly isPast: boolean;
  readonly state: NightState;
  /** Present on `booked` and `requested`. */
  readonly stay: NightStay | null;
  /** What this home's stays are booked at. `null` where a price says nothing. */
  readonly nightly: number | null;
  /** A host may close and reopen a night. They may not touch one that is sold. */
  readonly selectable: boolean;
}

export interface HostWeek {
  readonly key: string;
  /** Always 7 entries; `null` is a leading or trailing pad. */
  readonly nights: readonly (HostNight | null)[];
}

export interface HostMonth {
  readonly firstIso: string;
  /** `August 2026` */
  readonly title: string;
  readonly weeks: readonly HostWeek[];
}

export interface MonthInput {
  readonly monthIso: string;
  readonly today: string;
  readonly listing: HostListing;
  readonly held: ReadonlyMap<string, NightStay>;
  readonly blocked: ReadonlySet<string>;
}

function nightState(
  iso: string,
  held: ReadonlyMap<string, NightStay>,
  blocked: ReadonlySet<string>,
): { readonly state: NightState; readonly stay: NightStay | null } {
  const stay = held.get(iso);
  if (stay !== undefined && stay.hold === "booked") return { state: "booked", stay };
  if (blocked.has(iso)) return { state: "blocked", stay: null };
  if (stay !== undefined) return { state: "requested", stay };
  return { state: "open", stay: null };
}

/**
 * One month as rows of seven, leading and trailing pads included so every
 * `role="row"` carries the same cell count. The pads render as empty cells
 * rather than being dropped: a row short of seven is a grid a screen reader
 * cannot count its way across. `buildMonth`'s reasoning, quoted because it is
 * the reason this file did not shorten its rows.
 */
export function buildHostMonth({
  monthIso,
  today,
  listing,
  held,
  blocked,
}: MonthInput): HostMonth {
  const first = startOfMonth(monthIso);
  const total = daysInMonth(first);
  const lead = weekdayIndex(first);
  const cells: (HostNight | null)[] = Array.from({ length: lead }, () => null);

  for (let i = 0; i < total; i += 1) {
    const iso = addDays(first, i);
    const isPast = iso < today;
    const { state, stay } = nightState(iso, held, blocked);

    cells.push({
      iso,
      dayOfMonth: i + 1,
      isToday: iso === today,
      isPast,
      state,
      stay,
      /*
       * A price is a thing you can still be paid. It is printed on nights that
       * are for sale and suppressed everywhere else — on a night already sold
       * (the guest's own rate lives on the reservation), on a night the host has
       * closed, and on every night behind today. TASTE §12: null money is an
       * absence, never a dash.
       */
      nightly: state === "open" && !isPast ? listing.nightly : null,
      /*
       * THE ONE RULE THIS SURFACE EXISTS FOR. A booked night cannot be selected,
       * so it cannot be blocked, so a confirmed guest cannot be shut out of a
       * home they have paid for. The past is not selectable either — a calendar
       * that let a host close last Tuesday would be offering an edit with no
       * effect. A REQUESTED night stays selectable on purpose: nobody has agreed
       * to anything, and a host who needs the night is entitled to take it and
       * decline.
       */
      selectable: !isPast && state !== "booked",
    });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: HostWeek[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push({ key: `${first}-w${String(i / 7)}`, nights: cells.slice(i, i + 7) });
  }

  return { firstIso: first, title: `${gregorianMonthName(first)} ${first.slice(0, 4)}`, weeks };
}

/**
 * The accessible name, in the guest model's own order and vocabulary:
 * the date, then today, then what the night is, then the money.
 *
 * The year is absent because the grid's own `aria-label` carries it, and the
 * weekday is absent because the row of `columnheader`s supplies it as focus
 * moves between columns — `composeLabel`'s two reasons, unchanged.
 *
 * Selection is said in the NAME rather than through `aria-pressed`, because
 * `aria-pressed` is not supported on `role="gridcell"` and the cell is the
 * gridcell. `resolveDay` already puts "check-in" and "in your stay" into the
 * name for exactly the same reason.
 */
export function nightLabel(night: HostNight, selected: boolean): string {
  const parts = [`${String(night.dayOfMonth)} ${gregorianMonthName(night.iso)}`];
  if (night.isToday) parts.push("today");
  else if (night.isPast) parts.push("in the past");

  switch (night.state) {
    case "booked":
      parts.push(`booked by ${night.stay?.guest ?? "a guest"}`);
      break;
    case "requested":
      parts.push(`${night.stay?.guest ?? "a guest"} has asked to stay`);
      break;
    case "blocked":
      parts.push("blocked by you");
      break;
    case "open":
      if (!night.isPast) parts.push("open");
      break;
  }

  if (night.nightly !== null) parts.push(formatPkr(night.nightly));
  if (selected) parts.push("selected");
  if (!night.selectable && !night.isPast) parts.push("cannot be changed");

  return parts.join(", ");
}

/**
 * What the live region says after every selection change.
 *
 * A multi-select whose whole state lives in a ring is a set a screen-reader user
 * builds blind, so the count and the action it unlocks are narrated —
 * `selectionStatus`'s job on the guest picker, for this surface's interaction.
 */
export function selectionSummary(
  selected: ReadonlySet<string>,
  allBlocked: boolean,
): string {
  const count = selected.size;
  if (count === 0) return "No nights selected.";
  const noun = count === 1 ? "night" : "nights";
  return allBlocked
    ? `${String(count)} ${noun} selected. They are blocked; you can open them again.`
    : `${String(count)} ${noun} selected. You can block them.`;
}

/**
 * The nights between two clicks, inclusive, in date order.
 *
 * Shift-click is how a host closes a fortnight without fourteen clicks, and the
 * modifier arrives on the click event whether the button was pressed with a
 * pointer or with Enter, so the keyboard gets the same reach for free.
 */
export function nightsBetween(a: string, b: string): readonly string[] {
  const [from, to] = a <= b ? [a, b] : [b, a];
  const span = daysBetween(from, to);
  return Array.from({ length: span + 1 }, (_, i) => addDays(from, i));
}
