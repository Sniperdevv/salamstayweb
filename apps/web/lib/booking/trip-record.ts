import { QUOTE } from "./quote";

/**
 * The one booked stay this build can talk about, and the arithmetic of undoing it.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * `/trips/{id}`, `/trips/{id}/receipt`, `/trips/{id}/cancel` and
 * `/trips/{id}/review` are four surfaces describing ONE record. Written four
 * times they are four chances to disagree about a date a guest is counting
 * nights against, or about a refund they are about to accept. So the facts live
 * once, the derived answers are computed rather than typed, and every figure is
 * traced back to a file that already publishes it.
 *
 * `lib/booking/quote.ts` owns what the stay COST and `lib/money.ts` owns how an
 * amount is SPELLED. Neither does this file's job and this file does neither of
 * theirs: nothing here formats money, and no amount below is a new number —
 * every one is `QUOTE.*` or a sum of `QUOTE.*`.
 *
 * GUEST-SHELL.md §12 / GO-LIVE A11 — THE RULE THIS FILE SERVES
 * ------------------------------------------------------------
 * "A surface keyed to a record that does not exist refuses to render. A
 * fabricated receipt is not a placeholder; it is a document that says money
 * changed hands." There is no booking store, so exactly one id resolves —
 * `TRIP_ID`, the id the route registry carries and the card fixtures use — and
 * every other id is a 404 raised by the route, not a page improvised around a
 * slug. `isTripId()` is how a route asks.
 *
 * WHAT IS DELIBERATELY ABSENT
 * ---------------------------
 * No booking reference (`SS-7F3K9Q`), no invoice number, no payment-method last
 * four digits, no email address. GUEST-SHELL.md §14 lists all of them as
 * things a phone card may draw and a live surface may not invent, and the
 * refund destination in particular already has a published, honest form on
 * `/legal/guest-refund-policy`: "the same card, wallet, or bank account you paid
 * with". A surface that needs one of these ships a labelled slot instead.
 */

/**
 * The canonical booking id. It appears verbatim in `lib/seo/route-registry.ts`
 * (`/trips/is-f7-2bed-aug2026` and its children) because G37 compares literal
 * hrefs, and GUEST-SHELL.md's Unresolved list records that the real shape of a
 * booking id is a backend decision nobody has taken yet.
 */
export const TRIP_ID = "is-f7-2bed-aug2026";

/**
 * Check-in and check-out as instants, not dates.
 *
 * The times are the listing's own house rules — `lib/content/listings/is-f7-2bed.ts`
 * ships "Check-in after 2:00 PM" and "Check-out before 11:00 AM" — and they are
 * load-bearing rather than decorative: the free-cancellation window is measured
 * in HOURS before check-in, so a date alone would put the boundary up to a day
 * out. The offset is Pakistan Standard Time, which observes no daylight saving,
 * so a fixed `+05:00` is exact rather than approximate.
 */
const CHECK_IN = "2026-08-14T14:00:00+05:00";
const CHECK_OUT = "2026-08-17T11:00:00+05:00";

/**
 * The listing's published free-cancellation window.
 *
 * `is-f7-2bed.ts` states it on the indexable listing page a guest read before
 * booking: *"Cancellation: Flexible — Free cancellation up to 48 hours before
 * check-in. After that the first night is non-refundable and the rest is
 * refunded."* That page is what this guest agreed to, so it is what this file
 * measures against.
 */
const FREE_CANCELLATION_HOURS = 48;

const HOUR_MS = 3_600_000;

const freeCancellationUntil = new Date(
  Date.parse(CHECK_IN) - FREE_CANCELLATION_HOURS * HOUR_MS,
).toISOString();

export const TRIP = {
  id: TRIP_ID,
  /** The home, and the second half of every registered title for these routes. */
  home: "Margalla View Apartment",
  where: "F-7, Islamabad",
  /** The listing itself — a registered, indexable page (`gw-004`). */
  listingHref: "/stays-in-islamabad/f-7/is-f7-2bed",
  /** `is-f7-2bed.ts` host block: "Hosted by Ayesha". First name, as she signs. */
  host: "Ayesha",
  checkIn: CHECK_IN,
  checkOut: CHECK_OUT,
  /** Always `QUOTE.nights`. Two night counts for one stay is the bug this avoids. */
  nights: QUOTE.nights,
  policy: "Flexible",
  freeCancellationHours: FREE_CANCELLATION_HOURS,
  /** Check-in minus the window. Computed, so moving either input moves this. */
  freeCancellationUntil,
} as const;

/**
 * The `/trips/{id}` root, and its children. One place the paths are spelled.
 *
 * The union is the set `lib/seo/route-registry.ts` carries for this booking, not
 * the set that is BUILT: `arrival`, `change` and `booking.ics` are registered
 * stubs the trip page links (ruling 7 — *"a booking confirmation that cannot
 * reach a receipt is a worse lie than a stub that says it is being written"*),
 * and typing them here is what stops a caller spelling one by hand. Widened
 * 2026-07-26 when `/trips/{id}` landed and needed all three.
 */
export function tripPath(
  child?: "receipt" | "cancel" | "review" | "arrival" | "change" | "booking.ics",
): string {
  return child ? `/trips/${TRIP_ID}/${child}` : `/trips/${TRIP_ID}`;
}

/**
 * GUEST-SHELL.md §12's guard, as a predicate. A route calls `notFound()` on
 * `false` — never renders a fixture under whatever slug it was handed.
 */
export function isTripId(id: string): boolean {
  return id === TRIP_ID;
}

/* ——— dates ——————————————————————————————————————————————————————————————— */

/**
 * Every date on these surfaces is read in Pakistan, so every date is formatted
 * in Pakistan — pinned rather than inherited from the server's locale and zone,
 * which are a deployment detail and would otherwise decide whether a guest sees
 * the 14th or the 13th. `en-PK` for the same reason `lib/money.ts` pins it: the
 * string must be identical whichever language the page is in.
 *
 * GUEST-SHELL.md §7: dates are plain Gregorian. No Hijri secondary numeral, no
 * moon-sighting note (BUILD-DECISIONS #21, which supersedes `ga-071`/`ga-082`).
 */
const PK = "Asia/Karachi";

const weekday = new Intl.DateTimeFormat("en-PK", { weekday: "short", timeZone: PK });
const dayNum = new Intl.DateTimeFormat("en-PK", { day: "numeric", timeZone: PK });
const monthYear = new Intl.DateTimeFormat("en-PK", {
  month: "short",
  year: "numeric",
  timeZone: PK,
});
const clock = new Intl.DateTimeFormat("en-PK", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: PK,
});

/** `"Wed 12 Aug 2026"`. */
export function formatTripDate(iso: string): string {
  const d = new Date(iso);
  return `${weekday.format(d)} ${dayNum.format(d)} ${monthYear.format(d)}`;
}

/**
 * `"Wed 12 Aug 2026, 2:00 PM"` — the form a boundary takes.
 *
 * A window that closes at an HOUR is stated with the hour. "Free until 12 Aug"
 * is the sentence that gets someone charged for a night at nine in the evening.
 *
 * The meridiem is upper-cased through `formatToParts` rather than by a regex on
 * the output: `en-PK` renders it "pm", and the listing this booking came from
 * writes its house rules as "Check-in after 2:00 PM" / "Check-out before 11:00
 * AM". One product should not spell a clock two ways, and touching the PART is
 * the only way to change it without also touching a month name that happens to
 * end in the same letters.
 */
export function formatTripDateTime(iso: string): string {
  const time = clock
    .formatToParts(new Date(iso))
    .map((part) => (part.type === "dayPeriod" ? part.value.toUpperCase() : part.value))
    .join("");
  return `${formatTripDate(iso)}, ${time}`;
}

/**
 * `"Fri 14 – Mon 17 Aug 2026"` — the stay, as one range.
 *
 * The month and year are printed once because both ends share them here; a
 * booking that crossed a month would need the fuller form, and this build has
 * exactly one booking. Stated rather than generalised.
 */
export function formatStayRange(): string {
  const from = new Date(TRIP.checkIn);
  const to = new Date(TRIP.checkOut);
  return (
    `${weekday.format(from)} ${dayNum.format(from)} – ` +
    `${weekday.format(to)} ${dayNum.format(to)} ${monthYear.format(to)}`
  );
}

/* ——— cancelling ——————————————————————————————————————————————————————————— */

/** One line of the refund ledger, in reading order. */
export interface RefundLine {
  readonly id: string;
  readonly title: string;
  /** Why this line is what it is. Never a percentage — none is published. */
  readonly note: string;
  readonly amount: number;
  /** `false` renders quiet grey, never red: not refunding is not a fault (ga-034). */
  readonly refunded: boolean;
}

export interface RefundOutcome {
  /** `full` inside the free window · `partial` after it · `over` once the stay ended. */
  readonly stage: "full" | "partial" | "over";
  readonly lines: readonly RefundLine[];
  /** The sum of the refunded lines. Computed from `lines`, never typed. */
  readonly total: number;
}

/**
 * What this guest gets back if they cancel AT A GIVEN INSTANT.
 *
 * The instant is a parameter rather than `new Date()` so the answer is computed
 * once, on the server, and handed to the client step as a fact — a client that
 * recomputed would disagree with the server for one hydration frame, and the
 * frame in question is a rupee figure on a screen about to take an irreversible
 * action. `/legal/guest-refund-policy` closes on the same promise: "you see this
 * ledger, for today's date, before you confirm."
 *
 * THE TWO LEDGERS, AND WHERE EACH IS PUBLISHED
 * --------------------------------------------
 * **Inside the window** the listing page says free cancellation, and the refund
 * policy defines what free means: "a full refund means everything you paid comes
 * back". So both parts of the bill return and the total is `QUOTE.total`.
 *
 * **After the window** the refund page's worked example IS this booking — the
 * same home, the same nights, the same `PKR 42,350` paid — and it publishes the
 * ledger line by line: `25,000 refunded + 12,500 first night + 4,850 fee and
 * taxes = 42,350`. Reproduced here from `QUOTE`, not retyped.
 *
 * There is no third branch that estimates anything. Once the stay is over there
 * is nothing to cancel, and the route says so rather than offering a number.
 */
export function refundIfCancelledAt(now: Date): RefundOutcome {
  const nights = QUOTE.nights;

  if (now.getTime() >= Date.parse(TRIP.checkOut)) {
    return { stage: "over", lines: [], total: 0 };
  }

  if (now.getTime() < Date.parse(TRIP.freeCancellationUntil)) {
    const lines: readonly RefundLine[] = [
      {
        id: "nights",
        title: `${nights} nights`,
        note: "Refunded in full",
        amount: QUOTE.stay,
        refunded: true,
      },
      {
        id: "fees",
        title: "Service fee, payment processing and sales tax",
        note: "Refunded in full",
        amount: QUOTE.feesAndTax,
        refunded: true,
      },
    ];
    return { stage: "full", lines, total: sumRefunded(lines) };
  }

  const lines: readonly RefundLine[] = [
    {
      id: "later-nights",
      title: `Nights 2 & ${nights}`,
      note: `${nights - 1} nights, refunded`,
      amount: QUOTE.nightly * (nights - 1),
      refunded: true,
    },
    {
      id: "first-night",
      title: "First night",
      note: "Held per policy · non-refundable",
      amount: QUOTE.nightly,
      refunded: false,
    },
    {
      id: "fees",
      title: "Service fee & taxes",
      note: "Already earned · non-refundable",
      amount: QUOTE.feesAndTax,
      refunded: false,
    },
  ];
  return { stage: "partial", lines, total: sumRefunded(lines) };
}

function sumRefunded(lines: readonly RefundLine[]): number {
  return lines.reduce((sum, line) => (line.refunded ? sum + line.amount : sum), 0);
}

/**
 * The cross-check, at module load rather than in a test — `quote.ts`'s own
 * pattern, for the same reason.
 *
 * Both ledgers describe the SAME payment, so both must account for every rupee
 * of it: the full one returns all of `QUOTE.total`, and the partial one's three
 * lines add back up to `QUOTE.total` with `25,000` of it refunded. That second
 * identity is the one published on `/legal/guest-refund-policy`, and an edit
 * that breaks it must fail here — in the module every trip surface imports —
 * rather than quietly shipping a refund page and a cancel screen that disagree.
 */
const insideWindow = refundIfCancelledAt(new Date(Date.parse(TRIP.checkIn) - 30 * 24 * HOUR_MS));
const afterWindow = refundIfCancelledAt(new Date(Date.parse(TRIP.checkIn) - HOUR_MS));
const afterWindowAllLines = afterWindow.lines.reduce((sum, line) => sum + line.amount, 0);

if (
  insideWindow.total !== QUOTE.total ||
  afterWindow.total !== 25_000 ||
  afterWindowAllLines !== QUOTE.total
) {
  throw new Error(
    "The cancellation ledgers no longer reconcile with the worked example on " +
      "/legal/guest-refund-policy (25,000 refunded + 12,500 first night + " +
      "4,850 fee and taxes = 42,350 paid). Change both, or neither.",
  );
}
