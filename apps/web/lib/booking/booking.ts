import type { ListingContent, NightRange } from "@/lib/content/listings/is-f7-2bed";

/**
 * The booking model — the vocabulary of a checkout in progress, and the handful
 * of derivations every step needs, in one place with no React in sight.
 *
 * WHY THIS IS SPLIT FROM THE PROVIDER
 * -----------------------------------
 * `booking-state.tsx` holds the session and carries `"use client"`. This file
 * carries no directive, so a Server Component may import a type or a pure
 * function from it without dragging a client boundary along. Everything here is
 * a value in, a value out: no state, no storage, no fetch, no `Date.now()`.
 *
 * WHY THE DERIVATIONS LIVE HERE AND NOT IN THE STEPS THAT USE THEM
 * ----------------------------------------------------------------
 * Four of them decide whether a screen tells the truth, and each would
 * otherwise be re-derived on several screens by several hands:
 *
 *  · `countedGuests` owns "infants do not count toward the limit". Every ±
 *    control, the rail's GUESTS line and the over-capacity hint all have to
 *    agree about a rule that lives on gw-021 in one sentence.
 *  · `canCheckInOn` owns why 8 Aug 2026 is struck through when nothing is
 *    booked on it. It is arithmetic, not a list, so it keeps being right.
 *  · `requiredDocuments` owns gw-007's party-to-document matrix, which is a
 *    Shariah-policy statement before it is a form. Two screens disagreeing
 *    about which document a family owes is not a UI bug.
 *  · `reachedStep` owns what a guest is allowed to see after a hard reload,
 *    which is the difference between an honest recovery and a page confidently
 *    printing a total for dates nobody picked.
 *
 * WHAT IS NOT HERE
 * ----------------
 * Fees, taxes and totals beyond the stay subtotal. gw-024 is explicit that no
 * rate is ever printed, because ARCHITECTURE.md fixes the fee engine without
 * fixing a rate; the fee amounts are the Price step's own grounded content
 * (ga-050). A `serviceFee()` function here would have to invent a multiplier.
 *
 * Money FORMATTING. These functions return numbers. The rendered string is
 * always `PKR 12,500` — three-letter code, one space, thousands separator, each
 * digit run wrapped in `.num` — and it belongs to whichever shared formatter the
 * UI wave settles on. Never the bare rupee sign, U+20A8, which ships in no
 * rendered string on this site.
 */

/**
 * Auth, stubbed. Every checkout surface renders as if a guest is already signed
 * in, so no step builds a login gate and no step invents a name, an email or an
 * avatar to greet. One constant instead of eleven quiet assumptions.
 */
export const GUEST_IS_SIGNED_IN = true;

/**
 * Which identity document the guest verifies with. gw-022 calls this a real
 * fork rather than a flag: choosing a foreign passport replaces the CNIC row
 * with passport + Pakistan visa, it does not relabel it.
 */
export type Nationality = "pk" | "foreign";

/** The six rows of gw-022's party ladder, in the order the card renders them. */
export type PartyType = "solo" | "couple" | "siblings" | "family" | "women" | "proxy";

export const PARTY_TYPES: readonly PartyType[] = [
  "solo",
  "couple",
  "siblings",
  "family",
  "women",
  "proxy",
];

/** The six rails on gw-025, in the order the card renders them. */
export type PaymentRail =
  | "jazzcash"
  | "hbl-card"
  | "easypaisa"
  | "raast"
  | "overseas-card"
  | "cash-on-arrival";

export const PAYMENT_RAILS: readonly PaymentRail[] = [
  "jazzcash",
  "hbl-card",
  "easypaisa",
  "raast",
  "overseas-card",
  "cash-on-arrival",
];

/**
 * Ids only, no labels, in both lists above. The visible names and one-line
 * descriptions are the cards' copy and belong in a content module beside the
 * step that renders them, byte-exact; a second copy of "A married man and
 * woman" living in a types file is a second copy that will drift. Order is
 * carried here because order IS part of the contract — gw-022's ladder reads
 * the way it reads on purpose.
 */

/** The documents the flow can ask for. Nothing outside gw-007's matrix + ga-039. */
export type DocumentId =
  | "cnic"
  | "passport"
  | "visa"
  | "selfie"
  | "nikah-nama"
  | "frc"
  | "b-form"
  | "poa-wakala";

/**
 * What a document slot can be in a SESSION, which is not the same as what
 * gw-023 can render.
 *
 * These three are the only states a client with no backend can honestly hold:
 * the guest has not attached a file, a file is on its way up, a file is
 * attached. gw-023 also shows "Verified" and "Needs one more", and both are
 * verdicts from a review nobody has built — a session that stored them would be
 * storing an answer it made up. When that review exists it arrives from the
 * server and joins this union then.
 *
 * Note what is absent and stays absent: there is no "rejected" and no "failed".
 * CHECKOUT-SHELL §15 is explicit — a document outcome uses the WARNING
 * register, never the error register, and never renders a verdict on the guest.
 * The error register belongs to a genuine form fault, such as an unsupported
 * file type, where the red is about the file.
 */
export type DocumentState = "not-added" | "sending" | "added";

export interface DocumentSlot {
  readonly state: DocumentState;
  /** As the guest's device reported it; `null` until a file exists. */
  readonly fileName: string | null;
}

/** Sparse by design: a slot exists once the guest has touched it. */
export type DocumentSlots = Readonly<Partial<Record<DocumentId, DocumentSlot>>>;

export interface GuestCounts {
  readonly adults: number;
  readonly children: number;
  readonly infants: number;
}

/**
 * `checkIn` is the first night, `checkOut` is the morning the keys go back, so
 * the stay covers `checkOut - checkIn` nights and `checkOut` is NOT one of them.
 * Same night arithmetic as `NightRange`, from the other direction.
 */
export interface StayDates {
  readonly checkIn: string;
  readonly checkOut: string;
}

/** The five checkout screens a guest moves through, in order. */
export type CheckoutStep = "dates" | "party" | "verify" | "price" | "confirm";

const STEP_ORDER: readonly CheckoutStep[] = ["dates", "party", "verify", "price", "confirm"];

/**
 * One booking, mid-flight.
 *
 * `listing` is the whole `ListingContent` rather than a copied-out subset. The
 * summary rail needs the thumbnail, the name and the area; the calendar needs
 * the blocks and the minimum; the rail's price line needs the nightly rate. A
 * mapping layer between them would be one more place for the rail to disagree
 * with the page the guest arrived from, and `ListingContent` is plain data, so
 * a Server Component can hand it straight to the provider.
 *
 * Every answer the guest has not given is `null`, never a plausible default.
 * `nationality` is the one seeded value, because gw-022 ships that radio
 * checked: it is a fork with a starting side, not a claim about the guest, and
 * flipping it is one tap.
 */
export interface BookingDraft {
  readonly listing: ListingContent;
  readonly dates: StayDates | null;
  readonly guests: GuestCounts;
  readonly party: PartyType | null;
  readonly nationality: Nationality;
  readonly documents: DocumentSlots;
  readonly rail: PaymentRail | null;
}

/** A fresh draft: gw-021's empty panel, which opens at one adult and no dates. */
export function newDraft(listing: ListingContent): BookingDraft {
  return {
    listing,
    dates: null,
    guests: { adults: 1, children: 0, infants: 0 },
    party: null,
    nationality: "pk",
    documents: {},
    rail: null,
  };
}

// ——— dates ———————————————————————————————————————————————————————————————
//
// All date arithmetic runs in UTC and every comparison is a string comparison.
// `new Date("2026-08-05")` is parsed as UTC midnight and then read back through
// the local zone, so `.getDate()` returns the 4th on any machine west of
// Greenwich — a calendar that is correct in Karachi and off by one on a CI box
// in Virginia. Nothing below ever constructs a local date. ISO dates also sort
// chronologically as plain strings, so `a <= b` is a real comparison and no
// parsing is needed to ask whether a night falls inside a range.

const DAY_MS = 86_400_000;

function toUtcMs(iso: string): number {
  return Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
}

function toIso(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** `YYYY-MM-DD` shifted by whole days. Negative moves back. */
export function addDays(iso: string, days: number): string {
  return toIso(toUtcMs(iso) + days * DAY_MS);
}

/** Whole days from `from` to `to`. Negative when `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / DAY_MS);
}

/** Nights in a stay. `0` when no dates are chosen, so callers never render a guess. */
export function nights(dates: StayDates | null): number {
  return dates ? daysBetween(dates.checkIn, dates.checkOut) : 0;
}

// ——— availability ————————————————————————————————————————————————————————

export function isNightBlocked(night: string, blocked: readonly NightRange[]): boolean {
  return blocked.some((range) => night >= range.from && night <= range.to);
}

/**
 * True when a stay may BEGIN on this night: the night itself is free and enough
 * free nights follow it to reach this host's minimum.
 *
 * This is the function that strikes 8 Aug 2026 through on gw-021. The 8th is
 * not booked — it sits alone between the 5–7 and 9–10 blocks, so the longest
 * stay starting there is one night and the host asks for two. The card's own
 * note says exactly this, and saying it in arithmetic means the calendar keeps
 * saying it correctly as bookings land.
 *
 * Bounded on purpose: it looks forward `minNights` and stops, so an open-ended
 * calendar with no blocks left in it terminates.
 */
export function canCheckInOn(night: string, listing: ListingContent): boolean {
  for (let i = 0; i < listing.capacity.minNights; i += 1) {
    if (isNightBlocked(addDays(night, i), listing.availability.blockedNights)) return false;
  }
  return true;
}

/** Why a chosen range cannot be booked. Empty means it can. */
export type StayIssue = "checkout-not-after-checkin" | "below-minimum" | "blocked-night";

export function stayIssues(dates: StayDates, listing: ListingContent): readonly StayIssue[] {
  const span = nights(dates);
  if (span <= 0) return ["checkout-not-after-checkin"];

  const issues: StayIssue[] = [];
  if (span < listing.capacity.minNights) issues.push("below-minimum");
  for (let i = 0; i < span; i += 1) {
    if (isNightBlocked(addDays(dates.checkIn, i), listing.availability.blockedNights)) {
      issues.push("blocked-night");
      break;
    }
  }
  return issues;
}

// ——— guests ——————————————————————————————————————————————————————————————

/**
 * Guests who count against the home's limit — which is to say, not infants.
 * The bands are read from the listing rather than hard-coded, so the rule the
 * host disclosed is the rule the picker enforces.
 */
export function countedGuests(
  guests: GuestCounts,
  capacity: ListingContent["capacity"],
): number {
  return capacity.countsTowardLimit.reduce((sum, band) => sum + guests[band], 0);
}

export function isOverCapacity(
  guests: GuestCounts,
  capacity: ListingContent["capacity"],
): boolean {
  return countedGuests(guests, capacity) > capacity.maxGuests;
}

// ——— money ———————————————————————————————————————————————————————————————

/**
 * Nightly rate × nights. `null` until dates exist, so a rail cannot print
 * `PKR 0` at a guest who has picked nothing — TASTE §12 again, from the money
 * side: null is a skeleton or an absence, never a rendered zero or a dash.
 *
 * This is the STAY subtotal and it is the only money the flow computes. Fees
 * and tax are itemised once, on the Price step, from ga-050's amounts.
 */
export function staySubtotal(draft: BookingDraft): number | null {
  const span = nights(draft.dates);
  return span > 0 ? draft.listing.pricing.nightly * span : null;
}

// ——— documents ————————————————————————————————————————————————————————————

/**
 * Which documents this booking owes, from gw-007's matrix as gw-022 renders it.
 *
 *   identity   Pakistani → CNIC + selfie          (gw-023 collects both)
 *              foreign   → passport + Pakistan visa, IN PLACE OF the CNIC
 *   party      solo, group of women → nothing further
 *              couple    → Nikah Nama
 *              siblings  → FRC
 *              family    → FRC, plus a B-Form when children are on the booking
 *              proxy     → PoA or Wakala          (ga-039; the one row gw-007
 *                                                  does not list, carried from
 *                                                  the app corpus rather than
 *                                                  invented or dropped)
 *
 * The Bayan-e-Halfi affidavit is an equal path to the FRC, not a lesser one
 * (gw-022). It is the same slot, not a fallback, and copy should say so.
 *
 * ONE B-Form, not one per child. gw-022's header and CHECKOUT-SHELL §15 both
 * say "a B-Form per child", and gw-023 — the card that actually collects them —
 * ships a single row reading "For the 2 children on this booking" against a
 * booking with two. The rendering is followed here because it is the thing that
 * shipped; the child count is on the draft, so a row that needs to say how many
 * it covers can. Worth a founder ruling before the Verify step is built.
 *
 * Order matches gw-023's rendering: CNIC, selfie, FRC, B-Form.
 *
 * OPEN, and not decided here: whether the foreign branch also takes a liveness
 * selfie. gw-022's panel 4 lists passport + visa + Nikah Nama and no selfie;
 * gw-023 only ever renders the Pakistani branch. Nothing in the corpus answers
 * it, so nothing here answers it either.
 */
export function requiredDocuments(draft: BookingDraft): readonly DocumentId[] {
  const identity: readonly DocumentId[] =
    draft.nationality === "pk" ? ["cnic", "selfie"] : ["passport", "visa"];

  const party: readonly DocumentId[] = ((): readonly DocumentId[] => {
    switch (draft.party) {
      case "couple":
        return ["nikah-nama"];
      case "siblings":
        return ["frc"];
      case "family":
        return draft.guests.children > 0 ? ["frc", "b-form"] : ["frc"];
      case "proxy":
        return ["poa-wakala"];
      case "solo":
      case "women":
      case null:
        return [];
    }
  })();

  return [...identity, ...party];
}

/** A slot the guest has not touched reads `not-added`, the same as an empty one. */
export function documentState(draft: BookingDraft, id: DocumentId): DocumentState {
  return draft.documents[id]?.state ?? "not-added";
}

export function documentsComplete(draft: BookingDraft): boolean {
  return requiredDocuments(draft).every((id) => documentState(draft, id) === "added");
}

// ——— progress ————————————————————————————————————————————————————————————

/**
 * The furthest step this draft has earned.
 *
 * A checkout step is a route, so a guest can arrive at `/price` by reload,
 * bookmark or back button with a draft that holds nothing. Nothing is persisted
 * — that is the design — so the honest response is a recovery, not a total
 * computed from absences. This function is what a step asks before it renders.
 *
 * `dates` covers guests too, because gw-021 is one screen carrying both, and a
 * party of seven in a home that sleeps six is unfinished business on that
 * screen rather than a problem for a later one.
 */
export function reachedStep(draft: BookingDraft): CheckoutStep {
  if (!draft.dates || stayIssues(draft.dates, draft.listing).length > 0) return "dates";
  if (isOverCapacity(draft.guests, draft.listing.capacity)) return "dates";
  if (draft.party === null) return "party";
  if (!documentsComplete(draft)) return "verify";
  return "confirm";
}

/** True when `step` is at or before the furthest step the draft has earned. */
export function canView(step: CheckoutStep, draft: BookingDraft): boolean {
  return STEP_ORDER.indexOf(step) <= STEP_ORDER.indexOf(reachedStep(draft));
}
