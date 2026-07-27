import { shortDate, shortDayMonth, weekday } from "@/components/booking/calendar-model";
import { addDays, daysBetween } from "@/lib/booking/booking";

import { RESERVATIONS, reservationHref } from "../reservations/reservations";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  THERE IS NO AVAILABILITY STORE. THIS FILE INVENTS NO BOOKING.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * SalamStay has no listings table, no availability table and no price store. So
 * `/host/calendar` does what `/host/earnings` did rather than writing a third
 * account: it reads the ONE booking-shaped fixture the product already has —
 * `../reservations/reservations.ts` — and derives everything it can from it.
 *
 * WHAT IS DERIVED FROM THAT FIXTURE, AND SO CANNOT DISAGREE WITH IT
 * ----------------------------------------------------------------
 *  · **The homes.** `LISTINGS` is the set of `listing` values in `RESERVATIONS`,
 *    with each home's city taken from the same rows. Two homes exist because two
 *    homes have stays; there is no second list to fall out of step.
 *  · **The nightly rate.** Every Gulberg 2 row is booked at `PKR 12,500` and
 *    every Cantt View row at `PKR 9,500`. That agreement is what makes the rate
 *    a fact about the home rather than a number invented here, and
 *    `assertOneRatePerListing` throws the moment it stops holding. No weekend
 *    differential, no seasonal rate, no override — `HOST-SHELL.md` §6, "never
 *    derive a number the host did not give you", and nobody has given one.
 *  · **Which nights are taken.** A confirmed stay's nights are `checkIn …
 *    checkOut − 1`, exactly the range `lib/booking/booking.ts`'s `stayIssues`
 *    tests. So the calendar and the guest checkout cannot disagree about which
 *    night belongs to whom.
 *  · **Which nights have been ASKED for.** `/host/reservations` shows two
 *    requests waiting. A calendar that painted those nights "open" while another
 *    surface said a guest had asked for them would be the two-surfaces-disagree
 *    failure this file exists to avoid. They are drawn, they are still bookable,
 *    and they are still blockable — nobody has agreed to anything yet.
 *
 * WHAT IS WRITTEN HERE BY HAND, AND WHY EACH ONE HAD TO BE
 * -------------------------------------------------------
 *  1. **`STAY_DATES`** — `reservations.ts` stores dates as display strings
 *     ("Fri 14 – Mon 17 Aug 2026"). A grid needs `YYYY-MM-DD`. Parsing prose is
 *     how two surfaces start disagreeing quietly, and adding ISO fields to that
 *     file is not this route's edit to make. So the ISO pair is stated here and
 *     `assertStayDates` checks it back against the fixture's own sentence, its
 *     own night count and its own id set, in development. A date that drifts
 *     throws; it does not render.
 *  2. **`BLOCKED_NIGHTS`** — the one genuinely invented thing on this surface,
 *     and it is invented because a host's own blocked nights are not a booking
 *     and exist nowhere else in the product. The page says so on screen with
 *     `SampleDataStrip`, and blocking is client-only: it lasts until reload, and
 *     the action bar says that in plain words.
 *
 * WHAT IS DELIBERATELY ABSENT
 * ---------------------------
 * No occupancy figure, no percentage, no "booked through", no demand signal, no
 * comparable-listing price, no suggested rate. `ha-031` shipped the explicit
 * absence of smart pricing and a calendar that whispered a number would quietly
 * undo it. Nothing on this surface is a rating, a count of anything good, or a
 * projection.
 */

/* ─────────────────────────────── the homes ──────────────────────────────── */

export interface HostListing {
  /** Slug of the name. Used as a key and in `aria` text, never in a URL. */
  readonly id: string;
  readonly name: string;
  readonly city: string;
  /** What this home's stays are booked at. One rate; see the file note. */
  readonly nightly: number;
}

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * The homes, in first-appearance order in the reservations fixture.
 *
 * An account with no reservations produces no homes and the page renders its
 * first-run empty — the same single lever `reservations.ts` and `earnings.ts`
 * both promise. It is not a claim that a home without a booking has no
 * calendar; it is that this build has no listings store to ask, and inventing
 * one here would put a third fictional account in the product.
 */
export const LISTINGS: readonly HostListing[] = (() => {
  const byName = new Map<string, HostListing>();
  for (const r of RESERVATIONS) {
    if (byName.has(r.listing)) continue;
    byName.set(r.listing, {
      id: slugify(r.listing),
      name: r.listing,
      city: r.city,
      nightly: r.money.nightly,
    });
  }
  return [...byName.values()];
})();

export function findListing(id: string): HostListing | undefined {
  return LISTINGS.find((listing) => listing.id === id);
}

/* ──────────────────────────── the stay dates ────────────────────────────── */

interface StayRange {
  readonly checkIn: string;
  readonly checkOut: string;
}

/**
 * Every reservation's stay, as ISO. Keys are `reservations.ts` ids.
 *
 * Checked against that file in development, three ways, by `assertStayDates`:
 * the id sets match exactly, `checkOut − checkIn` equals the stated `nights`,
 * and re-rendering the pair produces the fixture's own `dates` sentence
 * byte for byte.
 */
const STAY_DATES: Readonly<Record<string, StayRange>> = {
  "fatima-gulberg2-aug2026": { checkIn: "2026-08-14", checkOut: "2026-08-17" },
  "jonathan-canttview-aug2026": { checkIn: "2026-08-22", checkOut: "2026-08-23" },
  "bilal-gulberg2-aug2026": { checkIn: "2026-08-05", checkOut: "2026-08-07" },
  "omar-sana-canttview-aug2026": { checkIn: "2026-08-01", checkOut: "2026-08-04" },
  "ayesha-khan-gulberg2-jul2026": { checkIn: "2026-07-23", checkOut: "2026-07-27" },
};

/**
 * The fixture's own `dates` sentence, rebuilt from an ISO pair.
 *
 * CHECK-ONLY. Nothing renders this string — the page prints ranges through
 * `dateRange()`, which is the shipped web form and uses an arrow rather than a
 * dash. This reproduces `reservations.ts`'s spelling instead, dash and all,
 * because the whole point is to compare against what that file actually says.
 *
 * The month is said once when both ends share it, which is how all five rows
 * are written; the general form is here so a cross-month stay does not silently
 * fail the check for the wrong reason.
 */
function fixtureDateSentence({ checkIn, checkOut }: StayRange): string {
  const lead =
    checkIn.slice(0, 7) === checkOut.slice(0, 7)
      ? `${weekday(checkIn).long.slice(0, 3)} ${Number(checkIn.slice(8, 10))}`
      : shortDayMonth(checkIn);
  return `${lead} – ${shortDate(checkOut)}`;
}

function stayRange(id: string): StayRange {
  const range = STAY_DATES[id];
  if (range === undefined) {
    throw new RangeError(
      `No stay dates for reservation "${id}". Every row in reservations.ts needs an ` +
        "entry in STAY_DATES, or the calendar draws a month with a booking missing from it.",
    );
  }
  return range;
}

/**
 * A dev-time reconciliation, not a formatter — `reservations.ts`'s `assertSums`
 * in the shape this file needs.
 *
 * Two host surfaces claiming different bookings is the failure mode; this is
 * the thing that makes the claim checkable rather than promised in a comment.
 * Stripped in production for the same reason `assertSums` is: the fixture is
 * static, so if it holds in dev it holds everywhere, and a throw on a live page
 * would be worse than the drift.
 */
function assertStayDates(): void {
  const ids = new Set(RESERVATIONS.map((r) => r.id));

  for (const id of Object.keys(STAY_DATES)) {
    if (!ids.has(id)) {
      throw new Error(
        `STAY_DATES has "${id}", which reservations.ts no longer carries. ` +
          "Delete it here in the same edit, or the calendar blocks nights nobody booked.",
      );
    }
  }

  for (const r of RESERVATIONS) {
    const range = stayRange(r.id);
    const span = daysBetween(range.checkIn, range.checkOut);
    if (span !== r.nights) {
      throw new Error(
        `Reservation "${r.id}" states ${String(r.nights)} nights; ` +
          `${range.checkIn} to ${range.checkOut} is ${String(span)}.`,
      );
    }
    const sentence = fixtureDateSentence(range);
    if (sentence !== r.dates) {
      throw new Error(
        `Reservation "${r.id}" reads "${r.dates}" on /host/reservations but ` +
          `"${sentence}" on /host/calendar. One booking, one set of dates.`,
      );
    }
  }
}

/** Every home's stays are booked at one rate, which is what makes it a rate. */
function assertOneRatePerListing(): void {
  for (const listing of LISTINGS) {
    for (const r of RESERVATIONS) {
      if (r.listing !== listing.name) continue;
      if (r.money.nightly !== listing.nightly) {
        throw new Error(
          `"${listing.name}" has stays at ${String(listing.nightly)} and ` +
            `${String(r.money.nightly)} a night. The calendar prints one rate per home ` +
            "because the fixture has one; it must not pick a winner.",
        );
      }
    }
  }
}

if (process.env.NODE_ENV !== "production") {
  assertStayDates();
  assertOneRatePerListing();
}

/* ────────────────────────── nights that are spoken for ──────────────────── */

/**
 * `booked` is a stay that exists. `requested` is a guest who has asked and is
 * waiting — which is not a booking, and is why it does not lock the night.
 */
export type StayHold = "booked" | "requested";

export interface NightStay {
  readonly reservationId: string;
  readonly guest: string;
  readonly hold: StayHold;
  /** For the connector: the run's ends are inset, its middle is edge to edge. */
  readonly isFirstNight: boolean;
  readonly isLastNight: boolean;
  readonly href: string;
  /** The whole stay, for the accessible name. */
  readonly dates: string;
}

/**
 * Night → who has it, for one home.
 *
 * A stay covers `checkIn … checkOut − 1`: the guest hands the keys back on the
 * checkout morning, so that date is free to be sold to somebody else. That is
 * `booking.ts`'s rule and not a second reading of it — the same arithmetic the
 * guest picker uses to decide a legitimate check-out.
 */
export function nightsHeld(listingId: string): ReadonlyMap<string, NightStay> {
  const held = new Map<string, NightStay>();
  const listing = findListing(listingId);
  if (listing === undefined) return held;

  for (const r of RESERVATIONS) {
    if (r.listing !== listing.name) continue;
    const { checkIn, checkOut } = stayRange(r.id);
    const nights = daysBetween(checkIn, checkOut);

    for (let i = 0; i < nights; i += 1) {
      held.set(addDays(checkIn, i), {
        reservationId: r.id,
        guest: r.guest,
        hold: r.status === "request" ? "requested" : "booked",
        isFirstNight: i === 0,
        isLastNight: i === nights - 1,
        href: reservationHref(r.id),
        dates: r.dates,
      });
    }
  }
  return held;
}

/** The earliest month any stay touches — how far back paging may go. */
export function earliestStayMonth(): string | null {
  let earliest: string | null = null;
  for (const r of RESERVATIONS) {
    const { checkIn } = stayRange(r.id);
    if (earliest === null || checkIn < earliest) earliest = checkIn;
  }
  return earliest;
}

/* ──────────────────────────── blocked nights ────────────────────────────── */

/**
 * The host's own closed nights — INVENTED, and the only invented thing here.
 *
 * A blocked night is not a booking and exists in no other file, so there was
 * nothing to derive it from. Two consequences the page carries rather than
 * hides: `SampleDataStrip` states that this surface runs on example data, and
 * blocking is client-only, which the action bar says in its own words.
 *
 * Chosen to land where they can be seen without hunting: a pair in the month
 * the page opens on, and a pair a month ahead. None collides with a stay —
 * `assertBlockedNightsAreFree` would throw if one did, because a night that is
 * both booked and blocked is a contradiction the grid cannot draw.
 */
export const BLOCKED_NIGHTS: Readonly<Record<string, readonly string[]>> = {
  "gulberg-2-residence": ["2026-07-30", "2026-07-31", "2026-08-24", "2026-08-25"],
  "cantt-view-residence": ["2026-07-28", "2026-07-29", "2026-08-19"],
};

export function blockedNights(listingId: string): readonly string[] {
  return BLOCKED_NIGHTS[listingId] ?? [];
}

function assertBlockedNightsAreFree(): void {
  for (const listing of LISTINGS) {
    const held = nightsHeld(listing.id);
    for (const night of blockedNights(listing.id)) {
      const stay = held.get(night);
      if (stay !== undefined && stay.hold === "booked") {
        throw new Error(
          `${night} is blocked and booked by ${stay.guest} at "${listing.name}". ` +
            "A night cannot be both; fix BLOCKED_NIGHTS.",
        );
      }
    }
  }
}

if (process.env.NODE_ENV !== "production") assertBlockedNightsAreFree();
