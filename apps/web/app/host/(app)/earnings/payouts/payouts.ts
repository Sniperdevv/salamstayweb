import type { StatusTone } from "../../reservations/reservations";
import type { PayoutGroup } from "../earnings";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  THERE IS NO PAYOUT RECORD. THIS FILE DERIVES NOTHING AND STORES NOTHING.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `/host/earnings/payouts` reads `payoutGroups()` from `../earnings` — the
 * SAME function `/host/earnings` renders — and adds a settlement vocabulary on
 * top of it. There is no second fixture, no second grouping and no second sum,
 * so the two pages cannot disagree about a rupee: they are one derivation seen
 * twice.
 *
 * That was the whole design constraint. A payout history whose totals differ
 * from the earnings page by one rupee destroys both screens at once, and the
 * only way to make that structurally impossible is to refuse to compute it
 * twice.
 *
 * WHY THE TWO PAGES ARE NOT THE SAME PAGE
 * ---------------------------------------
 * They partition the same money the same way, on purpose — the partition IS
 * the truth about it — but they answer different questions and carry different
 * content, and the split is enforced rather than described:
 *
 *   `/host/earnings`           what came off?   → the fee chain, per booking,
 *                                                 in `EarningsBreakdown`, plus
 *                                                 the deduction glossary
 *   `/host/earnings/payouts`   where is it?     → one figure per stay, a state
 *                                                 chip, and the destination
 *
 * **No fee chain appears on the payouts page and no state chip appears on the
 * earnings page.** One fact, one owner, in both directions. A row here is a
 * ledger LINE; a block there is the ledger.
 *
 * WHAT `ha-060` DRAWS THAT DOES NOT EXIST, and is therefore absent
 * ---------------------------------------------------------------
 *  · **The payout date.** Every row on the card is dated (`Sat 22 Aug 2026`),
 *    and the months are grouped by it. Nothing in this build schedules or
 *    records a transfer, so there is no date to group by. The stay's own dates
 *    are shown instead and are labelled as the stay's — a stay range printed
 *    where a host expects a payout date is a worse lie than no date at all.
 *  · **The destination.** `Meezan Bank ••••4821`, `JazzCash ••••7702`.
 *    `/host/payout-settings` refused exactly this and gave the reason at
 *    length: a mask is not a redaction of real data when there is no real datum
 *    behind it, and the dots make the assertion MORE credible rather than less.
 *    That page is the sibling this one links to; it cannot refuse an instrument
 *    while this one prints two.
 *  · **`sent` / `pending` / `failed`.** All three are facts about a transfer.
 *    No transfer has been attempted, so the states here are the two the fixture
 *    actually supports — held and released — and the third stage says plainly
 *    that it has never run.
 *  · **The whole failed-payout detail** (panel B): the returned transfer, the
 *    name-mismatch reason, the retry actions, the four-step settlement track.
 *    It is a recovery flow for an event that has not happened, off a rail that
 *    is not connected, to a destination that is not saved.
 *  · **Month subtotals.** `July 2026 · PKR 72,534` needs payout dates and five
 *    completed payouts. `/host/reservations` says this host has completed
 *    nothing, and its `past` bucket is empty on purpose.
 *  · **`amanah`.** `REPOSITIONING.md` replaces it with **held in trust**, and
 *    `HOST-SHELL.md` §0.2 forbids carrying an `ha-*` string forward unchecked.
 *    The replacement is not written here either — it is already in
 *    `payoutGroups()`'s own `lead`, and this page prints that.
 *  · **Every percentage.** No rate is published on any host surface.
 */

/**
 * What a stage is CALLED on this page, and the register it is said in.
 *
 * The chip is the only thing this file adds to a group. The sentence explaining
 * the stage is `PayoutGroup.lead`, written once in `../earnings` and printed by
 * both pages — a second sentence about one rule is a second sentence to keep
 * true.
 *
 * NO BRAND GREEN. `HOST-SHELL.md` §7 caps the host app surface at what
 * `ha-046` already spends and says **"Add nothing to it."** So a released
 * payout reads in the `success` semantic register — a status colour, not the
 * brand — and money still waiting reads `info`, which is the same muted
 * register `/host/reservations` uses for a state that is simply not finished
 * yet. Neither is a celebration and neither is a warning: nothing is wrong with
 * money that is held, and nothing is won by money that is released.
 */
export interface Settlement {
  readonly chip: string;
  readonly tone: StatusTone;
}

export const SETTLEMENT: Readonly<Record<PayoutGroup["key"], Settlement>> = {
  released: { chip: "Released", tone: "success" },
  held: { chip: "Held in trust", tone: "info" },
};
