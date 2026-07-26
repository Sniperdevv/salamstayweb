/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  SAMPLE DATA. THERE IS NO BOOKING STORE.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Every reservation below is written by hand in this file. Nothing reads a
 * database, an API or a session, because none of the three exists yet: the web
 * app has no auth, no host account and no bookings table. These rows exist so
 * the two reservation surfaces are real, reviewable code with a real shape
 * rather than a promise, and **both surfaces say so on screen** — the strip
 * under each `<h1>` states it in plain words, because a host must never be left
 * wondering whether the name in front of them is a person who is actually
 * coming to their home.
 *
 * WHAT THIS MEANS FOR ANYONE EDITING THIS
 * ---------------------------------------
 *  · Do NOT quietly delete the sample strip when a real store lands. Delete the
 *    strip and this fixture in the same commit, or neither.
 *  · Do NOT add a rating, a review count, a response rate, an acceptance rate,
 *    a "usually replies within…" line, or a guest photo. None of those exist as
 *    data anywhere in this product, and a fixture is not a licence to invent
 *    one — a sample row that carries an invented metric teaches the next author
 *    that the metric is a field.
 *  · The amounts are literals, not arithmetic. `HOST-SHELL.md` §6 and
 *    `lib/money.ts` both refuse to derive money from a rate, because no rate is
 *    published in any file. `ha-048`'s worked case is reproduced exactly
 *    (`PKR 12,500` × 3 → 37,500 − 1,125 − 675 − 375 = 35,325) and every other
 *    row is written to the same three deductions in the same proportion, so no
 *    two rows imply two different fee schedules. `net` is stated, not computed;
 *    `assertSums` below is a dev-time guard that the stated figures add up.
 *
 * WHY THE FIRST-RUN EMPTY IS STILL THE STATE THAT MATTERS
 * ------------------------------------------------------
 * A host with no listing has no reservations, so `RESERVATIONS.length === 0` is
 * the condition the real product ships in on day one. `page.tsx` renders the
 * first-run empty for it INSTEAD of the tab strip — four empty tabs is not an
 * empty state, it is a broken one — and emptying the array below is the whole
 * change needed to see it. The `past` bucket is left empty on purpose so the
 * per-tab empty is on screen without anyone having to edit a file.
 *
 * COPY PROVENANCE
 * ---------------
 * `ha-047` / `ha-048` / `ha-049` are phone cards drawn before
 * `REPOSITIONING.md` (2026-07-26), and `HOST-SHELL.md` §0.2 forbids copying
 * their content forward unchecked. Two strings are therefore NOT the cards':
 * `Service fee (wakala)` → **`Service fee`**, and `held in amanah` → **`held in
 * trust`**. Both are the repositioning's own replacements, verbatim.
 */

export type ReservationStatus = "request" | "upcoming" | "current" | "past";

/** One deducted line in the host's earnings view. Label and amount are both content. */
export interface Deduction {
  readonly label: string;
  readonly amount: number;
}

export interface ReservationMoney {
  /** The nightly rate the guest is paying. */
  readonly nightly: number;
  /** `nightly × nights`, stated rather than multiplied — see the header note. */
  readonly gross: number;
  readonly deductions: readonly Deduction[];
  /** What reaches the host. Stated; `assertSums` checks it against the lines. */
  readonly net: number;
}

export interface Reservation {
  readonly id: string;
  readonly status: ReservationStatus;
  /** Display name as the guest gave it. Never abbreviated, never a placeholder. */
  readonly guest: string;
  /** Derived from the name by the fixture author, not by a photo we do not have. */
  readonly initials: string;
  /** NADRA-verified identity — the product's own differentiator, not a badge. */
  readonly verified: boolean;
  /** "Couple · 2 guests". No document status here; the Verified chip carries that. */
  readonly party: string;
  readonly listing: string;
  readonly city: string;
  /** Full form for the detail page: "Fri 14 – Mon 17 Aug 2026". */
  readonly dates: string;
  /** Row form for the list: "14–17 Aug". */
  readonly datesShort: string;
  readonly nights: number;
  readonly money: ReservationMoney;
  /**
   * Requests only. **Absolute, never relative.** `ha-047` draws "Respond by
   * tomorrow, 3:00 PM" and on a phone with a live clock that is correct; in a
   * fixture it becomes a lie the day after it is written. The calm register the
   * card is protecting — a deadline, never a ticking countdown — survives the
   * change intact.
   */
  readonly respondBy?: string;
  /** What the guest wrote when they asked. Requests only, and often absent. */
  readonly note?: string;
  /**
   * The property sits inside a cantonment and the guest is travelling on a
   * passport from outside Pakistan. Grounded in `COMPLIANCE_MAP.md` CB1–CB6, the
   * same source `app/host/listings/new/location/step.tsx` reads. Informational
   * on the detail page and never a block.
   */
  readonly cantonment?: string;
  /** One line under the earnings block. Status-specific, always a plain fact. */
  readonly payoutNote?: string;
}

/**
 * The three deducted lines, in the order `ha-048` and `HA-055` print them, so a
 * host reads the same chain here that the earnings dashboard will show.
 * `Service fee` has lost its parenthetical (`REPOSITIONING.md`).
 */
const deductions = (service: number, processing: number, withholding: number): readonly Deduction[] => [
  { label: "Service fee", amount: service },
  { label: "Payment processing", amount: processing },
  { label: "Withholding tax", amount: withholding },
];

export const RESERVATIONS: readonly Reservation[] = [
  {
    id: "fatima-gulberg2-aug2026",
    status: "request",
    guest: "Fatima",
    initials: "F",
    verified: true,
    party: "Couple · 2 guests",
    listing: "Gulberg 2 Residence",
    city: "Lahore",
    dates: "Fri 14 – Mon 17 Aug 2026",
    datesShort: "14–17 Aug",
    nights: 3,
    money: {
      nightly: 12500,
      gross: 37500,
      deductions: deductions(1125, 675, 375),
      net: 35325,
    },
    respondBy: "Mon 27 Jul, 3:00 PM",
    /*
     * Adapted from `ga-061`'s written state, with the religious greeting dropped
     * per `REPOSITIONING.md`. The shape is kept because the shape is the point:
     * a greeting, who is coming, when they arrive, one practical question, a
     * sign-off. Dropping the framing did not license a colder guest either.
     */
    note: "Hello! We're a married couple coming for a family wedding nearby and would like somewhere quiet for a few nights. We'd reach around 4 pm on Friday — is early check-in possible? Is there parking for one car?",
  },
  {
    id: "jonathan-canttview-aug2026",
    status: "request",
    guest: "Jonathan",
    initials: "J",
    verified: true,
    party: "Solo · 1 guest",
    listing: "Cantt View Residence",
    city: "Rawalpindi Cantonment",
    dates: "Sat 22 – Sun 23 Aug 2026",
    datesShort: "22–23 Aug",
    nights: 1,
    money: {
      nightly: 9500,
      gross: 9500,
      deductions: deductions(285, 171, 95),
      net: 8949,
    },
    respondBy: "Tue 28 Jul, 6:00 PM",
    cantonment: "Rawalpindi Cantonment",
  },
  {
    id: "bilal-gulberg2-aug2026",
    status: "upcoming",
    guest: "Bilal Khan",
    initials: "BK",
    verified: true,
    party: "Business · 1 guest",
    listing: "Gulberg 2 Residence",
    city: "Lahore",
    dates: "Wed 5 – Fri 7 Aug 2026",
    datesShort: "5–7 Aug",
    nights: 2,
    money: {
      nightly: 12500,
      gross: 25000,
      deductions: deductions(750, 450, 250),
      net: 23550,
    },
    payoutNote: "Held in trust until Bilal Khan checks in.",
  },
  {
    id: "omar-sana-canttview-aug2026",
    status: "upcoming",
    guest: "Omar & Sana",
    initials: "OS",
    verified: true,
    party: "Couple · 2 guests",
    listing: "Cantt View Residence",
    city: "Rawalpindi Cantonment",
    dates: "Sat 1 – Tue 4 Aug 2026",
    datesShort: "1–4 Aug",
    nights: 3,
    money: {
      nightly: 9500,
      gross: 28500,
      deductions: deductions(855, 513, 285),
      net: 26847,
    },
    payoutNote: "Held in trust until Omar & Sana check in.",
  },
  {
    id: "ayesha-khan-gulberg2-jul2026",
    status: "current",
    guest: "Ayesha Khan",
    initials: "AK",
    verified: true,
    party: "Family · 4 guests",
    listing: "Gulberg 2 Residence",
    city: "Lahore",
    dates: "Thu 23 – Mon 27 Jul 2026",
    datesShort: "checkout Mon 27 Jul",
    nights: 4,
    money: {
      nightly: 12500,
      gross: 50000,
      deductions: deductions(1500, 900, 500),
      net: 47100,
    },
    payoutNote: "Released now that Ayesha Khan has checked in.",
  },
  /*
   * `past` is deliberately empty. A host in their first season has completed
   * nothing yet, and it puts the per-tab empty on screen without anyone having
   * to edit this file to see it.
   */
];

/**
 * A dev-time arithmetic check, not a formatter.
 *
 * Every amount above is a hand-written literal, which means a typo in one of
 * them is a page that prints a subtraction that does not subtract, in front of
 * a host reading their own money. This throws in development the moment the
 * stated `net` stops agreeing with `gross` minus the lines. It is stripped in
 * production because the fixture is static: if it holds in dev it holds
 * everywhere, and a throw on a live page would be worse than the typo.
 */
function assertSums(): void {
  for (const r of RESERVATIONS) {
    const deducted = r.money.deductions.reduce((sum, d) => sum + d.amount, 0);
    if (r.money.gross - deducted !== r.money.net) {
      throw new Error(
        `Reservation fixture "${r.id}" does not add up: ` +
          `${String(r.money.gross)} − ${String(deducted)} ≠ ${String(r.money.net)}.`,
      );
    }
  }
}

if (process.env.NODE_ENV !== "production") assertSums();

/* ───────────────────────────── lookups ──────────────────────────────────── */

export interface ReservationTab {
  readonly value: ReservationStatus;
  readonly label: string;
  /** Shown when this bucket is empty. One sentence, never an apology. */
  readonly emptyTitle: string;
  readonly emptyBody: string;
}

/** The four buckets, in `ha-047`'s order. */
export const RESERVATION_TABS: readonly ReservationTab[] = [
  {
    value: "request",
    label: "Requests",
    emptyTitle: "No requests waiting",
    emptyBody:
      "When a guest asks to stay, their request appears here with the dates, what you would earn, and how long you have to answer.",
  },
  {
    value: "upcoming",
    label: "Upcoming",
    emptyTitle: "No confirmed stays yet",
    emptyBody: "A request becomes a stay here once you accept it and the guest pays.",
  },
  {
    value: "current",
    label: "Current",
    emptyTitle: "Nobody is staying right now",
    emptyBody: "A guest moves here on the day they check in, and stays until they check out.",
  },
  {
    value: "past",
    label: "Past",
    emptyTitle: "No completed stays yet",
    emptyBody: "Stays move here after checkout, with what you were paid for each one.",
  },
];

export function reservationsIn(status: ReservationStatus): readonly Reservation[] {
  return RESERVATIONS.filter((r) => r.status === status);
}

export function findReservation(id: string): Reservation | undefined {
  return RESERVATIONS.find((r) => r.id === id);
}

export function reservationHref(id: string): string {
  return `/host/reservations/${id}`;
}

/**
 * The `<title>` and the `<h1>`, from one place.
 *
 * `G41` is a HARD gate that rejects duplicate titles across the whole run, and
 * a dynamic route is the easiest place in a Next app to ship one title for many
 * pages. Deriving it from the guest's name makes every reservation's title
 * unique by construction, and keeps the tab, the heading and the registry entry
 * saying the same thing.
 */
export function reservationTitle(r: Reservation): string {
  return r.status === "request" ? `Request from ${r.guest}` : `Reservation for ${r.guest}`;
}

/* ───────────────────────── status vocabulary ────────────────────────────── */

export type StatusTone = "info" | "success" | "neutral";

export interface StatusLabel {
  readonly text: string;
  readonly tone: StatusTone;
}

/**
 * One word per state, and the register it is said in.
 *
 * NO BRAND GREEN ANYWHERE IN HERE. `ha-047`'s `.rpill.checked` and `ha-048`'s
 * `.stpill.current` reach for `interactive.subtle` / `interactive.primary`;
 * `HOST-SHELL.md` §7 rules the app surface already over TASTE §2's budget and
 * says **"Add nothing to it."** So a checked-in guest reads in the `success`
 * semantic register — which is a status colour, not the brand — and everything
 * finished reads neutral. Completion is a fact, not a celebration (§10.6).
 */
export const STATUS_LABEL: Readonly<Record<ReservationStatus, StatusLabel>> = {
  request: { text: "Awaiting your response", tone: "info" },
  upcoming: { text: "Confirmed", tone: "success" },
  current: { text: "Checked in", tone: "success" },
  past: { text: "Completed", tone: "neutral" },
};

/** The list row says it shorter than the detail page's pill does. */
export const ROW_STATUS_LABEL: Readonly<Record<ReservationStatus, string>> = {
  request: "Awaiting you",
  upcoming: "Confirmed",
  current: "Checked in",
  past: "Completed",
};

/** How the net line is introduced, which is a tense question before it is a copy one. */
export const NET_LABEL: Readonly<Record<ReservationStatus, string>> = {
  request: "If you accept, you receive",
  upcoming: "You receive",
  current: "You receive",
  past: "You received",
};
