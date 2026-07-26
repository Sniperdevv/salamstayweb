/**
 * The calendar's model — grid shape, day states and accessible names, with no
 * React and no styling in sight.
 *
 * It is split out so the two things that are easy to get quietly wrong can be
 * checked without a browser: which days are struck and why, and what a screen
 * reader is told about each one. Both are derived here from `lib/booking`'s
 * arithmetic; nothing in this file re-implements a date rule.
 *
 * WHAT IS BORROWED, NOT REBUILT
 * -----------------------------
 * `isNightBlocked`, `canCheckInOn`, `stayIssues`, `addDays` and `daysBetween`
 * all come from `lib/booking/booking.ts`. In particular `canCheckInOn` is the
 * whole of the below-minimum rule and `stayIssues` is the whole of the
 * can-this-range-be-booked rule, so the calendar and the checkout steps cannot
 * disagree about whether a stay is bookable.
 *
 * The month helpers at the top are here rather than in `lib/` because they are
 * grid geometry — where a month starts, how many days it holds — and nothing
 * outside this picker needs them. Every one is string arithmetic over
 * `YYYY-MM-DD` in UTC, the same discipline `booking.ts` sets out: no `Date`
 * ever built from a local-time constructor, so a grid rendered in Karachi and
 * one rendered on a CI box in Virginia are the same grid.
 *
 * ONE PLACE THE ARITHMETIC IS STRICTER THAN THE CARD
 * --------------------------------------------------
 * `gw-021` strikes 8 Aug 2026 through and calls 4 Aug, 20 Aug and 11 Sep 2026
 * available. All four are the same case: a free night with fewer than
 * `minNights` free nights after it. 8 Aug is the one the card noticed because
 * it is an isolated gap; the other three sit immediately before a block and are
 * equally unbookable as a CHECK-IN, and `canCheckInOn` returns false for all
 * four. The card is a hand-authored illustration and the function is the rule,
 * so the function wins — and none of the three becomes unreachable, because a
 * day that cannot begin a stay can still end one (see `resolveDay`).
 */

import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";
import {
  addDays,
  canCheckInOn,
  daysBetween,
  isNightBlocked,
  stayIssues,
} from "@/lib/booking/booking";

// ——— month geometry ——————————————————————————————————————————————————————

/** First day of the Gregorian month containing `iso`, as `YYYY-MM-01`. */
export function startOfMonth(iso: string): string {
  return `${iso.slice(0, 7)}-01`;
}

/** `iso` shifted by whole months, landing on the 1st. */
export function shiftMonth(iso: string, months: number): string {
  const year = Number(iso.slice(0, 4));
  const month = Number(iso.slice(5, 7)) - 1 + months;
  const shiftedYear = year + Math.floor(month / 12);
  const shiftedMonth = ((month % 12) + 12) % 12;
  return `${String(shiftedYear).padStart(4, "0")}-${String(shiftedMonth + 1).padStart(2, "0")}-01`;
}

/** Days in the month containing `iso`. Measured, so February needs no rule. */
export function daysInMonth(iso: string): number {
  return daysBetween(startOfMonth(iso), shiftMonth(iso, 1));
}

/**
 * Month and weekday names, as constants rather than through `Intl`. The strings
 * are visible product copy in one locale, so they belong beside the rest of the
 * copy; and a formatter would give the server and the first client frame two
 * chances to disagree about a locale, which is a hydration mismatch on a page
 * whose whole job is dates.
 */
const MONTH_NAMES: readonly string[] = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Sunday-first, matching `gw-021`'s `.wk` row. */
export const WEEKDAYS: readonly { readonly short: string; readonly long: string }[] = [
  { short: "Su", long: "Sunday" },
  { short: "Mo", long: "Monday" },
  { short: "Tu", long: "Tuesday" },
  { short: "We", long: "Wednesday" },
  { short: "Th", long: "Thursday" },
  { short: "Fr", long: "Friday" },
  { short: "Sa", long: "Saturday" },
];

/** 0 = Sunday. 1 Jan 1970 was a Thursday, which is the `+ 4`. */
export function weekdayIndex(iso: string): number {
  return (((daysBetween("1970-01-01", iso) + 4) % 7) + 7) % 7;
}

/**
 * `noUncheckedIndexedAccess` is on, and this lookup is total by construction —
 * the index comes out of a validated ISO month. The guard is here to STATE that
 * invariant rather than assert it away with `!`, so an edit that breaks it
 * throws instead of rendering the word `undefined` into a date.
 */
export function gregorianMonthName(iso: string): string {
  const name = MONTH_NAMES[Number(iso.slice(5, 7)) - 1];
  if (name === undefined) throw new RangeError(`Not an ISO date: ${iso}`);
  return name;
}

/** Same invariant guard, for the weekday table. */
export function weekday(iso: string): (typeof WEEKDAYS)[number] {
  const day = WEEKDAYS[weekdayIndex(iso)];
  if (day === undefined) throw new RangeError(`Not an ISO date: ${iso}`);
  return day;
}

// ——— days ————————————————————————————————————————————————————————————————

/** Why a day cannot begin a stay. `available` means it can. */
export type DayAvailability = "available" | "past" | "unavailable" | "below-minimum";

/** Where a day sits in the selected (or previewed) range. */
export type BandRole = "none" | "start" | "middle" | "end";

export interface CalendarDay {
  readonly iso: string;
  readonly dayOfMonth: number;
  readonly availability: DayAvailability;
  readonly isToday: boolean;
}

export interface CalendarWeek {
  readonly key: string;
  /** Always 7 entries; `null` is a leading or trailing pad. */
  readonly days: readonly (CalendarDay | null)[];
}

export interface CalendarMonth {
  readonly firstIso: string;
  /** `August 2026` */
  readonly title: string;
  readonly weeks: readonly CalendarWeek[];
}

function dayAvailability(
  iso: string,
  today: string,
  listing: ListingContent,
): DayAvailability {
  if (iso < today) return "past";
  if (isNightBlocked(iso, listing.availability.blockedNights)) return "unavailable";
  if (!canCheckInOn(iso, listing)) return "below-minimum";
  return "available";
}

/**
 * One month as rows of seven, leading and trailing pads included so every
 * `role="row"` carries the same cell count. The pads render as empty cells
 * rather than being dropped: a row short of seven is a grid a screen reader
 * cannot count its way across.
 */
export function buildMonth(
  monthIso: string,
  today: string,
  listing: ListingContent,
): CalendarMonth {
  const first = startOfMonth(monthIso);
  const total = daysInMonth(first);
  const lead = weekdayIndex(first);
  const cells: (CalendarDay | null)[] = Array.from({ length: lead }, () => null);

  for (let i = 0; i < total; i += 1) {
    const iso = addDays(first, i);
    cells.push({
      iso,
      dayOfMonth: i + 1,
      availability: dayAvailability(iso, today, listing),
      isToday: iso === today,
    });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: CalendarWeek[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push({ key: `${first}-w${i / 7}`, days: cells.slice(i, i + 7) });
  }

  return {
    firstIso: first,
    title: `${gregorianMonthName(first)} ${first.slice(0, 4)}`,
    weeks,
  };
}

// ——— selection ————————————————————————————————————————————————————————————

/**
 * What the guest has chosen so far.
 *
 * `checkOut` is `null` while a check-in is waiting for its partner. That
 * half-made state is the reason this is its own type rather than `StayDates`:
 * `StayDates` is a bookable stay and a lone check-in is not one, so it must not
 * be able to reach the draft.
 *
 * `preview` is a check-out under the pointer or the keyboard focus and nothing
 * more. It is kept apart from `checkOut` rather than folded into it because the
 * two answer different questions: `preview` paints the band, `checkOut` decides
 * what every OTHER day is allowed to be. Fold them together and hovering a
 * candidate check-out would silently un-strike the days a pending check-in had
 * ruled out, and the grid would ripple as the pointer crossed it.
 */
export interface CalendarSelection {
  readonly checkIn: string | null;
  readonly checkOut: string | null;
  readonly preview: string | null;
}

export const NO_SELECTION: CalendarSelection = {
  checkIn: null,
  checkOut: null,
  preview: null,
};

/** True when a stay from `checkIn` may hand the keys back on `iso`. */
export function canCheckOutOn(
  iso: string,
  checkIn: string,
  listing: ListingContent,
): boolean {
  return (
    daysBetween(checkIn, iso) > 0 &&
    stayIssues({ checkIn, checkOut: iso }, listing).length === 0
  );
}

export function bandRole(
  iso: string,
  checkIn: string | null,
  checkOut: string | null,
): BandRole {
  if (checkIn === null) return "none";
  if (checkOut === null) return iso === checkIn ? "start" : "none";
  if (iso === checkIn) return "start";
  if (iso === checkOut) return "end";
  return iso > checkIn && iso < checkOut ? "middle" : "none";
}

export interface ResolvedDay {
  readonly selectable: boolean;
  /** `null` when the day is selectable. */
  readonly blockedReason: string | null;
  /** What is PAINTED, so it follows the preview. */
  readonly band: BandRole;
  readonly label: string;
}

function availabilityReason(
  availability: DayAvailability,
  minNights: number,
): string | null {
  switch (availability) {
    case "available":
      return null;
    case "past":
      return "in the past";
    case "unavailable":
      return "unavailable";
    case "below-minimum":
      return `below the ${minNights}-night minimum stay`;
  }
}

/**
 * Everything the cell needs, resolved against the current interaction state.
 *
 * The two rules worth stating, because they are what stops the picker dead-
 * ending or lying:
 *
 *  · **A day that cannot begin a stay can still end one.** With a check-in
 *    pending, a booked night is a legitimate check-out — the guest leaves that
 *    morning and the night belongs to whoever booked it — and `stayIssues`
 *    already knows this, because it tests the nights `checkIn … checkOut - 1`
 *    and never the check-out itself. Without this rule, a check-in three days
 *    before a block would offer no reachable check-out at all.
 *  · **The reason a day is struck changes with the pending check-in.** Before a
 *    check-in exists the reason is about the day; after one exists it is about
 *    the stay, and it comes straight out of `stayIssues`. Same two sentences
 *    the card ships, chosen by which issue actually fires.
 */
export function resolveDay(
  day: CalendarDay,
  selection: CalendarSelection,
  listing: ListingContent,
): ResolvedDay {
  const minNights = listing.capacity.minNights;
  const { checkIn, checkOut, preview } = selection;
  const pending = checkOut === null ? checkIn : null;

  const completesStay =
    pending !== null && day.iso > pending && canCheckOutOn(day.iso, pending, listing);
  const beginsStay = day.availability === "available";
  const selectable = completesStay || beginsStay;

  let blockedReason: string | null = null;
  if (!selectable) {
    blockedReason =
      pending !== null && day.iso > pending
        ? reasonAgainstStay(day.iso, pending, listing, minNights)
        : availabilityReason(day.availability, minNights);
  }

  return {
    selectable,
    blockedReason,
    band: bandRole(day.iso, checkIn, checkOut ?? preview),
    // The NAME never follows the preview. A day the pointer is passing over has
    // not been chosen, and announcing "check-out" for it would tell a screen
    // reader something the guest has not done.
    label: composeLabel(
      day,
      bandRole(day.iso, checkIn, checkOut),
      completesStay,
      blockedReason,
    ),
  };
}

function reasonAgainstStay(
  iso: string,
  checkIn: string,
  listing: ListingContent,
  minNights: number,
): string {
  const issues = stayIssues({ checkIn, checkOut: iso }, listing);
  if (issues.includes("blocked-night")) return "unavailable";
  if (issues.includes("below-minimum")) return `below the ${minNights}-night minimum stay`;
  return "unavailable";
}

/**
 * The accessible name, in `gw-021`'s own order and vocabulary:
 * `1 August, today, available` · `14 August, check-in` ·
 * `8 August, below the 2-night minimum stay`.
 *
 * The year is absent because the card leaves it absent and the grid's own
 * `aria-label` carries it, and the weekday is absent because the row of
 * `columnheader`s supplies it as focus moves between columns.
 */
function composeLabel(
  day: CalendarDay,
  band: BandRole,
  completesStay: boolean,
  blockedReason: string | null,
): string {
  const parts = [`${day.dayOfMonth} ${gregorianMonthName(day.iso)}`];
  if (day.isToday) parts.push("today");

  if (band === "start") parts.push("check-in");
  else if (band === "end") parts.push("check-out");
  else if (band === "middle") parts.push("in your stay");
  else if (blockedReason !== null) parts.push(blockedReason);
  else if (completesStay) parts.push("available as check-out");
  else parts.push("available");

  return parts.join(", ");
}

// ——— the status line ——————————————————————————————————————————————————————

/**
 * What the live region says. A range picker whose whole state lives in colour
 * is a picker a screen-reader user selects blind, so the two-tap sequence is
 * narrated: the check-in is confirmed and the next action is named, then the
 * finished stay is read back with its length.
 */
export function selectionStatus(
  checkIn: string | null,
  checkOut: string | null,
  listing: ListingContent,
): string {
  if (checkIn === null) return "No dates selected. Choose your check-in date.";
  if (checkOut === null) {
    return `Check-in ${longDate(checkIn)}. Now choose your check-out date. This home asks for at least ${listing.capacity.minNights} nights.`;
  }
  const span = daysBetween(checkIn, checkOut);
  return `${span} ${span === 1 ? "night" : "nights"}, ${longDate(checkIn)} to ${longDate(checkOut)}.`;
}

/** `Friday 14 August 2026` — spoken, never rendered, so no `.num` isolation. */
export function longDate(iso: string): string {
  return `${weekday(iso).long} ${Number(iso.slice(8, 10))} ${gregorianMonthName(iso)} ${iso.slice(0, 4)}`;
}
