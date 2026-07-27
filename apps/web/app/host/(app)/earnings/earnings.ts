import {
  RESERVATIONS,
  type Reservation,
  type ReservationStatus,
} from "../reservations/reservations";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  THERE IS NO PAYOUT RECORD. THIS FILE INVENTS NO MONEY.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * SalamStay has no payouts table, no ledger and no booking store. So instead of
 * writing a second fixture, `/host/earnings` reads the ONE booking-shaped
 * fixture the product already has — `../reservations/reservations.ts` — and
 * groups it. Every rupee on the earnings page is a literal from that file, and
 * the only arithmetic here is adding stated `net` figures together.
 *
 * WHY THIS AND NOT A FIXTURE OF ITS OWN, which is the obvious move
 * ---------------------------------------------------------------
 * `ha-055` draws six months of history: `PKR 1,181,471` paid out across
 * `11 payouts`, a gross-vs-net trend line, a next payout on a named date to a
 * named bank account. Writing that would have put two fictional accounts in one
 * product — `/host/reservations` says this host has completed NOTHING (its
 * `past` bucket is deliberately empty, its own header explains why), while
 * `/host/earnings` would say they had been paid eleven times. A host who
 * noticed would be right to stop trusting both screens, and the whole reason
 * this surface exists (SCREENS §1.2: "host distrust of *where did my money go?*
 * → the itemised breakdown IS the countermeasure") dies at that moment.
 *
 * Reading the reservations fixture buys three things instead:
 *  · **One account, two views.** The stay a host reads on `/host/reservations`
 *    is the stay whose payout they read here, to the rupee, in the same order,
 *    with the same three deduction labels — because it is literally the same
 *    record rendered by the same component.
 *  · **The empty state stays reachable.** Emptying `RESERVATIONS` empties both
 *    surfaces at once, which is exactly what that file's header promises.
 *  · **No date arithmetic.** A trend chart needs months; grouping needs none.
 *
 * WHAT IS DELIBERATELY NOT COMPUTED
 * ---------------------------------
 * No rate, no multiplier, no projection, no comparison. `HOST-SHELL.md` §6:
 * "Never derive a number the host did not give you." Summing three stated net
 * amounts is not derivation — it is addition over figures the fixture already
 * prints, and a host can check it by eye against the rows underneath. Anything
 * that would need a percentage to produce it is absent from this file and from
 * the page, including the card's `94.2% of gross`.
 */

/**
 * Money has been RELEASED once the guest is in the property.
 *
 * `payoutNote` on the fixture is the authority, not an assumption made here:
 * the checked-in stay reads *"Released now that Ayesha Khan has checked in"*
 * and the confirmed ones read *"Held in trust until … checks in"*. So the split
 * below is the fixture's own sentence, expressed as a status test.
 *
 * `past` rides with `current` because a completed stay was released at check-in
 * and stayed released. The fixture has none today; the day it does, it lands in
 * the right group without an edit here.
 */
const RELEASED_STATUSES: readonly ReservationStatus[] = ["current", "past"];

/** Accepted, paid, and waiting on a check-in. */
const HELD_STATUSES: readonly ReservationStatus[] = ["upcoming"];

/**
 * A REQUEST IS NOT EARNINGS, and leaving it out is the honest call rather than
 * a simplification.
 *
 * `ha-055` has no request concept at all, so nothing is being dropped from the
 * card. But `/host/reservations` shows two requests worth `PKR 35,325` and
 * `PKR 8,949` net, and a host who arrives here from that page will look for
 * them. They are not here because nobody has agreed to anything yet: the guest
 * has asked, the host has not answered, and no money exists. Counting it would
 * be a projection — the exact thing this surface must never print.
 *
 * The page says so in one line rather than leaving the host to work it out.
 */
const isRequest = (r: Reservation): boolean => r.status === "request";

/**
 * Whether the page owes the host that sentence at all.
 *
 * An account with no waiting requests has no absence to explain, and a line
 * explaining one would invent the gap it was written to close.
 */
export function hasUnansweredRequests(): boolean {
  return RESERVATIONS.some(isRequest);
}

export interface PayoutGroup {
  readonly key: "released" | "held";
  /** The `<h2>`. Also the phrase the total underneath it is a total OF. */
  readonly heading: string;
  /** What has to happen for money to be in this group. One sentence, no dates. */
  readonly lead: string;
  readonly stays: readonly Reservation[];
  /** The sum of the stated `net` figures below it. Nothing else. */
  readonly total: number;
}

const sumNet = (stays: readonly Reservation[]): number =>
  stays.reduce((total, r) => total + r.money.net, 0);

const inStatuses = (statuses: readonly ReservationStatus[]): readonly Reservation[] =>
  RESERVATIONS.filter((r) => !isRequest(r) && statuses.includes(r.status));

/**
 * The two groups, in the order a host cares about them: what has reached you,
 * then what is coming.
 *
 * **An empty group is not rendered** (`page.tsx` filters). `HostEmpty`'s own
 * rule — *"never a count of nothing"* — applies just as hard to money: a host
 * with confirmed stays and nobody checked in yet must not read
 * `Released to you · PKR 0`, because a zero set in 24px beside a real figure is
 * a metric, and this account has no such metric. The heading disappears with
 * its rows.
 */
export function payoutGroups(): readonly PayoutGroup[] {
  const released = inStatuses(RELEASED_STATUSES);
  const held = inStatuses(HELD_STATUSES);

  return [
    {
      key: "released",
      heading: "Released to you",
      lead: "A stay's payout is released once your guest checks in.",
      stays: released,
      total: sumNet(released),
    },
    {
      key: "held",
      heading: "Held in trust",
      /*
       * "held in trust with Meezan Bank" is the phrasing already shipping on
       * `/become-a-host` (`components/host/host-sections.tsx`), and it is the
       * repositioning's own replacement for the retired `amanah` vocabulary —
       * `REPOSITIONING.md`: *held in amanah* → **held in trust**. Reused byte
       * for byte rather than paraphrased, so the promise a host read before they
       * signed up is the promise they read on their own money.
       *
       * No date. `ha-055` names one ("Expected Monday 28 Jul 2026") and no
       * system in this product schedules it.
       */
      lead: "Held in trust with Meezan Bank, and released to you as each guest checks in.",
      stays: held,
      total: sumNet(held),
    },
  ];
}

/* ─────────────────────────── the three deductions ───────────────────────── */

export interface DeductionTerm {
  /**
   * **Byte-identical to the row label** in `../reservations/reservations.ts`'s
   * `deductions()`. That identity is the whole mechanic: a host reads
   * `Service fee` in the arithmetic and finds `Service fee` in the glossary,
   * with no translation step in between. If one side is ever renamed, both are.
   */
  readonly term: string;
  readonly body: string;
}

/**
 * What comes off a booking, in plain words.
 *
 * NO RATE APPEARS HERE, IN ANY FORM. `ha-055` prints `−3%`, `−1.8%`, `−1%` and
 * `94.2% of gross`, and its explainer calls the service fee "a fixed 3% of the
 * gross booking value". None of that is carried forward: no percentage, no
 * multiplier and no fee schedule is published on this surface, so the amounts
 * stand as amounts. `lib/money.ts` refuses to derive one for the same reason
 * and says so at length.
 *
 * FOUR THINGS THE CARD SAYS THAT ARE NOT SAID HERE, each for a stated reason:
 *  · **`Service fee (wakala)` → `Service fee`** — `REPOSITIONING.md`, and
 *    `HOST-SHELL.md` §0.2 forbids copying an `ha-*` string forward unchecked.
 *  · **the tax authority is not named.** The card cites FBR rules, an FBR
 *    e-invoice per payout and an ATL filer/non-filer chip. This build has no
 *    filer status to read, issues no certificate and files nothing, so naming
 *    the authority would dress an unbuilt integration as a shipped one.
 *  · **no withholding total.** Per-booking amounts are the fixture's; a
 *    year-to-date tax figure is a record nothing keeps.
 *  · **no download.** The card offers a tax receipt PDF. There is no document.
 */
export const DEDUCTION_TERMS: readonly DeductionTerm[] = [
  {
    term: "Service fee",
    body: "SalamStay's commission for listing your home, taking the booking, and holding the guest's payment until they check in.",
  },
  {
    term: "Payment processing",
    body: "What the card network and the bank charge to collect your guest's payment. It is passed through at what it costs, and not marked up.",
  },
  {
    term: "Withholding tax",
    body: "Advance tax, collected under Pakistan's tax rules and deposited against your name. SalamStay does not keep it.",
  },
];
