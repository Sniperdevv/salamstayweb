import Link from "next/link";

import { FeesReceiptIcon } from "@/components/home-icons";
import { HostEmpty } from "@/components/host/host-empty";
import { Num, Phrase } from "@/components/numerals";
import { btnSecondary, inlineAction } from "@/components/ui";
import { exampleStrip, exampleStripLead } from "@/components/ui/example-strip";
import { formatPkr } from "@/lib/money";

import { StatusChip } from "../../reservations/reservation-parts";
import type { Reservation } from "../../reservations/reservations";
import type { PayoutGroup } from "../earnings";
import { SETTLEMENT } from "./payouts";

/**
 * The furniture of `/host/earnings/payouts` — `ha-060` at web width, honesty
 * pass applied. Server-safe throughout; nothing on this page holds state.
 *
 * ELEVATION (TASTE §1, `HOST-SHELL.md` §8)
 * ----------------------------------------
 * **Nothing on this page casts, and nothing on this page is a plate.** A ledger
 * line is content, and §1 is explicit that content blocks are open space with a
 * rule between them. `ha-060` draws every row as a bordered card because a
 * phone has no other way to separate one row from the next; at 1120px the
 * hairline does it, and eight bordered cards in a column would read as eight
 * objects rather than one ledger.
 *
 * That is also the mechanical difference between this page and
 * `/host/earnings`, where `StayPayout` IS a bordered block because it contains
 * a whole calculation. A host who lands on the wrong one can tell at a glance:
 * blocks mean arithmetic, rules mean a ledger.
 *
 * NO BRAND GREEN ANYWHERE. §7 caps the host app surface at what `ha-046`
 * already spends and says "Add nothing to it." Money is ink (TASTE §2: prices
 * are ink), state is a semantic chip, every link is ink and underlined at rest
 * (§8), and the one action on the page is the §5 gray-fill secondary.
 */

/* ─────────────────────────────── honesty ────────────────────────────────── */

/**
 * This page's own sentence, on the shared recipe.
 *
 * `components/ui/example-strip.ts` records why the class string is shared and
 * the wording is not: *the wording differs because the lie differs.* The lie
 * this page has to close is not "these bookings are written in" — the earnings
 * page one click away already said that, and it is imported there rather than
 * re-coined. It is the sharper one this route invites by existing: **a page
 * called Payouts implies payouts have happened.** None has.
 */
export function NoPayoutRecordStrip({ className = "" }: { readonly className?: string }) {
  return (
    <p className={`${exampleStrip} ${className}`}>
      <b className={exampleStripLead}>Nothing has been paid out.</b> SalamStay has no payout
      record, no transfer date and no destination on file, so nothing below is a transfer that
      happened. It is where each of your stays&rsquo; money sits today, from the same written-in
      reservations your earnings page itemises.
    </p>
  );
}

/* ────────────────────────────── one ledger line ─────────────────────────── */

/**
 * One stay's money, as a line rather than a ledger.
 *
 * WHAT IT DELIBERATELY DOES NOT CARRY: the fee chain. `/host/earnings` owns
 * that, in `EarningsBreakdown`, and a second rendering of one calculation is a
 * second thing that can drift — `earnings-parts.tsx` argues it at length and
 * the argument is not weaker one directory down. The figure here is the same
 * stated `net` that page totals, and the way to see what came off it is the
 * link at the foot of the section.
 *
 * THE DATES ARE THE STAY'S AND SAY SO. `ha-060` heads every row with a payout
 * date; nothing in this build schedules or records one. Printing the stay range
 * unlabelled where a host expects a payout date would be worse than printing
 * nothing, so the line reads "Stay" first and the page states the absence once,
 * up top, rather than in every row.
 *
 * `Phrase` wraps the whole sentence, not the numbers in it (GO-LIVE A17): three
 * isolates and two separators reorder past the prose under RTL and the line
 * comes out backwards with the digits individually correct.
 */
export function PayoutLine({
  reservation: r,
  stage,
}: {
  readonly reservation: Reservation;
  readonly stage: PayoutGroup["key"];
}) {
  const settlement = SETTLEMENT[stage];

  return (
    <li className="flex flex-col gap-3 border-t border-hairline py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <div className="min-w-0">
        {/* `Num`, not a bare string: "Gulberg 2 Residence" carries a digit run,
            and TASTE §12 / BUILD-DECISIONS #2 is "every digit run", with no
            carve-out for a name that happens to contain one. `Num` wraps the
            run AND draws the phrase isolate around the whole name in one go. */}
        <p className="text-bodyMd font-semibold text-primary">
          <Num>{r.listing}</Num>
        </p>
        <p className="mt-1 text-bodySm font-regular text-secondary">
          <Phrase>
            {r.guest} · Stay <Num>{r.dates}</Num> · <Num>{String(r.nights)}</Num>{" "}
            {r.nights === 1 ? "night" : "nights"}
          </Phrase>
        </p>
        {r.payoutNote === undefined ? null : (
          <p className="mt-1.5 text-label font-regular leading-relaxed text-tertiary">
            {r.payoutNote}
          </p>
        )}
      </div>

      {/* Amount then state, and in that order in the reading order too: a host
          scanning a ledger is looking for the figure. Stacked below `sm` the
          two sit on one row; split, the state falls under its own amount so the
          trailing edge stays a single column of figures. */}
      <div className="flex flex-none items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
        <span className="whitespace-nowrap text-bodyLg font-semibold text-primary">
          <span className="num">{formatPkr(r.money.net)}</span>
        </span>
        <StatusChip tone={settlement.tone}>{settlement.chip}</StatusChip>
      </div>
    </li>
  );
}

/* ─────────────────────────────── one stage ──────────────────────────────── */

/**
 * A stage, its total, and the lines that add up to it.
 *
 * **The heading, the lead and the total are `payoutGroups()`'s own** — the
 * exact strings and the exact sum `/host/earnings` prints, from the same call.
 * That is the reconciliation, and it is structural rather than checked: there
 * is no arithmetic in this file at all, so there is nothing here that can
 * disagree with the page next door.
 *
 * The total sits at the same rung it takes on `/host/earnings` (24, one above
 * the `h1`) for the same reason recorded there: it is a figure, not a heading,
 * and a host opened this page for it.
 */
export function PayoutStage({ group }: { readonly group: PayoutGroup }) {
  const headingId = `stage-${group.key}`;

  return (
    <section aria-labelledby={headingId} className="mt-10">
      <h2 id={headingId} className="text-h6 font-semibold text-primary">
        {group.heading}
      </h2>

      <p className="mt-1.5 text-h4 font-semibold text-primary">
        <span className="num">{formatPkr(group.total)}</span>
      </p>

      <p className="mt-2 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
        {group.lead}
      </p>

      <ul className="mt-5 border-b border-hairline">
        {group.stays.map((r) => (
          <PayoutLine key={r.id} reservation={r} stage={group.key} />
        ))}
      </ul>
    </section>
  );
}

/**
 * The one route to the arithmetic, once.
 *
 * It was a link per stage at first, which put two identical labels pointing at
 * one URL on a page whose header already carries `Back to earnings` — three
 * ways to the same place, which is not thoroughness, it is noise. A host does
 * not ask "what came off the released ones" separately from "what came off the
 * held ones"; they ask it about their money, and this asks it once, after both
 * stages, where the question has actually arrived.
 */
export function BreakdownLink() {
  return (
    <p className="mt-8">
      <Link href="/host/earnings" className={`${inlineAction} text-bodySm`}>
        See what came off each of these
      </Link>
    </p>
  );
}

/* ──────────────────────── the stage that never runs ─────────────────────── */

/**
 * THE POINT OF THIS ROUTE, and the reason it is a page rather than a paragraph
 * on `/host/earnings`.
 *
 * Released money has one thing left to do — reach a bank account — and this
 * build does none of it. `/host/earnings` deliberately stops at "released",
 * which is honest but leaves the host's actual question unanswered on every
 * surface in the product. Answering it is this section, and burying it under
 * a fee glossary would have been the wrong place for the one sentence a host
 * chasing their money is looking for.
 *
 * Three absences, stated rather than implied, because each is separately
 * missing and a host who reads only one of them would draw the wrong
 * conclusion from the other two:
 *  · no destination is saved (`/host/payout-settings` collects a KIND and a
 *    name, and says itself that it asks for no account number)
 *  · no transfer rail is connected
 *  · nothing publishes when a released payout would be sent
 *
 * The way onward is `/host/payout-settings`, which is built, is the surface
 * that owns the destination question, and is the §5 gray-fill secondary because
 * it is not this surface's primary call — this surface has none, and a page
 * with nothing to press spends no green (`HOST-SHELL.md` §7).
 */
export function TransferGap() {
  return (
    <section aria-labelledby="transfer-h" className="mt-12 border-t border-hairline pt-9">
      <h2 id="transfer-h" className="text-h6 font-semibold text-primary">
        Getting it to your account
      </h2>

      <p className="mt-2 max-w-[68ch] text-bodySm font-regular leading-relaxed text-secondary">
        Released money still has one step left: reaching your bank account or wallet. That step is
        not connected yet. SalamStay has no destination saved for you, no transfer has been
        attempted, and nothing here states when a released payout would be sent — so this page has
        no dates, no bank names and no sent-or-failed marks to show you.
      </p>

      <p className="mt-3 max-w-[68ch] text-bodySm font-regular leading-relaxed text-secondary">
        Payout details is where the destination is collected. It asks which kind of account you
        want paying and the name on it, and it explains why it does not ask for the number.
      </p>

      <p className="mt-6">
        <Link href="/host/payout-settings" className={`${btnSecondary} no-underline`}>
          Payout details
        </Link>
      </p>
    </section>
  );
}

/* ─────────────────────────── the first-run empty ────────────────────────── */

/**
 * The state the real product ships in on day one, and the same condition
 * `/host/earnings` branches on — both read one fixture, so emptying
 * `RESERVATIONS` empties both at once.
 *
 * `HostEmpty`'s three rules govern the copy: never a count of nothing, never a
 * dead end, never an apology. There is deliberately no `PKR 0` anywhere in it
 * (TASTE §12: null money is a skeleton or an absence, never a rendered zero),
 * and the destination is `/host/listings` for the reason the earnings empty
 * records — it is the page that knows whether a listing exists, and it already
 * carries the green CTA for the case where one does not.
 */
export function PayoutsEmpty() {
  return (
    <HostEmpty
      className="mt-4"
      glyph={<FeesReceiptIcon className="size-6" />}
      title="No money on its way yet"
      body="Once a guest books, that stay's money is held in trust and appears here, then moves to released when they check in."
      actions={
        <>
          <Link href="/host/listings" className={`${btnSecondary} no-underline`}>
            Go to your listings
          </Link>
          <Link href="/host/payout-settings" className={`${inlineAction} text-bodySm`}>
            Payout details
          </Link>
        </>
      }
    />
  );
}
