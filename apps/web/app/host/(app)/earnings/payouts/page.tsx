import type { Metadata } from "next";

import { BackToEarnings } from "../earnings-parts";
import { payoutGroups } from "../earnings";
import {
  BreakdownLink,
  NoPayoutRecordStrip,
  PayoutStage,
  PayoutsEmpty,
  TransferGap,
} from "./payout-parts";

/**
 * `/host/earnings/payouts` — HA-060 at web width.
 *
 * WHY THIS IS A ROUTE AND NOT A SECTION OF `/host/earnings`
 * ---------------------------------------------------------
 * The two pages partition the same money the same way, and that is deliberate:
 * held and released is what is TRUE about it, and two surfaces disagreeing
 * about the partition would be the defect. What differs is the question.
 *
 *   `/host/earnings`   **what came off?**  → the fee chain per booking, the
 *                                             deduction glossary
 *   this page          **where is it?**    → one figure per stay, its state,
 *                                             and the destination
 *
 * The split is enforced in both directions rather than described: no fee chain
 * appears here, no state chip appears there. Blocks mean arithmetic, rules mean
 * a ledger, and a host who lands on the wrong page can tell at a glance.
 *
 * The load-bearing half is `TransferGap`. Released money has one thing left to
 * do — reach a bank account — and this build does none of it. `/host/earnings`
 * stops at "released", which is honest and leaves a host's actual question
 * unanswered on every surface in the product. Answering it needs a page,
 * because under a fee glossary is the wrong place for the one sentence a host
 * chasing their money is looking for.
 *
 * IT COMPUTES NOTHING. Every figure comes from `payoutGroups()` in
 * `../earnings` — the same function `/host/earnings` renders — so the totals
 * here cannot differ from the totals there by a rupee. There is no second
 * fixture, no second grouping and no arithmetic anywhere in this route's three
 * files. `payouts.ts` records what `ha-060` draws that does not exist: the
 * payout date, the masked destination, sent/pending/failed, the failed-payout
 * recovery flow, the month subtotals, and every percentage.
 *
 * `robots: noindex, follow` comes from `app/host/layout.tsx`. No canonical, no
 * hreflang, no JSON-LD, no breadcrumb, and `<main class="co-main">` arrives
 * from `HostAppShell` via the `(app)` route group — `HOST-SHELL.md` §1, not
 * restated here.
 *
 * ONE `<h1>`: "Payouts", at the `h4` rung rather than the `h5` the six nav
 * sections take. The nav says "Earnings" and cannot mark itself current on a
 * sub-route, so this heading is a real page title — the same reasoning
 * `/host/reservations/[id]` and `/host/payout-settings` both record, and the
 * reason `BackToEarnings` sits above it.
 *
 * A Server Component with its own `metadata`, holding no state: `ha-060`'s
 * month accordions group by a payout date this build does not have, so there is
 * nothing to open or close and G41's title trap never opens.
 */
export const metadata: Metadata = {
  title: { absolute: "Payouts — SalamStay hosting" },
};

export default function HostPayoutsPage() {
  /*
   * Empty stages are dropped, not drawn empty — `/host/earnings`'s rule,
   * applied to the same groups it applies it to. A host with confirmed stays
   * and nobody checked in yet must not read `Released · PKR 0`: a zero set in
   * 24px beside a real figure is a metric, and this account has no such metric.
   */
  const stages = payoutGroups().filter((group) => group.stays.length > 0);

  if (stages.length === 0) {
    return (
      <div className="max-w-prose">
        <BackToEarnings />
        <h1 className="mt-3 text-h4 font-semibold text-primary">Payouts</h1>
        <PayoutsEmpty />
      </div>
    );
  }

  /*
   * `max-w-prose` (720), NOT the shell's full 1120.
   *
   * `earnings-parts.tsx` diagnosed this exact failure for `EarningsBreakdown`
   * and it applies harder to a ledger line: at 1120 a `justify-between` row
   * puts "Gulberg 2 Residence" at one edge and "PKR 47,100" at the other with
   * ~700px of nothing between them, and a host checking their own money has to
   * track a rule the width of their screen to pair a name with a figure. That
   * page bought its way out with a second column, because it has a whole
   * calculation to put there. This one has one figure per row and no second
   * column, so it takes the measure instead — the same `max-w-prose` every
   * other single-column host surface uses (`/host/payout-settings`,
   * `/host/verify`, `/host/reservations/[id]`).
   *
   * Left-aligned rather than centred, matching those three: the section nav
   * above starts at the shell's gutter, and a column centred under a
   * left-aligned nav reads as a different page.
   */
  return (
    <div className="max-w-prose">
      <BackToEarnings />

      <h1 className="mt-3 text-h4 font-semibold text-primary">Payouts</h1>
      <p className="mt-1 max-w-[68ch] text-bodyMd font-regular leading-relaxed text-secondary">
        Where each stay&rsquo;s money is, and what has to happen before it reaches you.
      </p>

      <NoPayoutRecordStrip className="mt-5" />

      {stages.map((group) => (
        <PayoutStage key={group.key} group={group} />
      ))}

      <BreakdownLink />

      <TransferGap />
    </div>
  );
}
