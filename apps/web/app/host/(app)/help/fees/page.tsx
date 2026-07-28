import type { Metadata } from "next";
import Link from "next/link";

import { Num } from "@/components/numerals";
import { inlineAction } from "@/components/ui";
import { HOST_FEES } from "@/lib/content/become-a-host";

import { HostHelpContext } from "../help-chrome";

/**
 * `/host/help/fees` — the article `/become-a-host`'s fees block has been
 * pointing at since it shipped ("See exactly how each payout is calculated"),
 * and `ha-070`'s Payouts category leads with.
 *
 * It replaces a registry stub. **The `<title>` below is the stub's own title,
 * byte for byte** — `stub("/host/help/fees", "How host fees and payouts are
 * calculated — SalamStay")` — so the row can become a `page()` without the
 * served title changing and G41 comparing two different strings. The H1's first
 * word is "How", which is in that title, so G43 is quiet too.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE FEE SCHEDULE IS IMPORTED, NOT RETYPED — AND NOT DERIVED FROM
 * ═══════════════════════════════════════════════════════════════════════════
 * `HOST_FEES` in `lib/content/become-a-host.ts` is the only file in this repo
 * that publishes a rate, and it publishes it live on `/become-a-host` today:
 * `Service fee · 3%`, `Payment processing (MDR) · at cost`, `Withholding tax ·
 * filer / non-filer`. Three ways that could have gone here, and only one of
 * them is safe:
 *
 *  · **Retype the rate.** A second copy of a number that `GO-LIVE.md` A16
 *    records as an *undeclared* founder question, free to drift from the first.
 *    Refused.
 *  · **Omit it**, as `/host/earnings` does. Defensible — that surface is a
 *    host's own ledger and states amounts, not a schedule — but on the one page
 *    in the product whose entire subject is how the number is arrived at, the
 *    reader would go back to the marketing page to find it.
 *  · **Import it.** One owner, no drift, no second number. If A16 resolves by
 *    removing the rate, it leaves this page in the same edit; if it resolves by
 *    making the rate authoritative, this page was already reading the
 *    authority.
 *
 * WHAT IS STILL REFUSED, and this is the part A16 actually warns about: **no
 * arithmetic anywhere on this page.** No worked example, no percentage applied
 * to an amount, no illustrative payout. `HOST-SHELL.md` §6 — "never derive a
 * number the host did not give you" — and `lib/money.ts` refuses the same
 * derivation for the same reason. A rate stated as the schedule is a fact about
 * the product; a rupee figure computed from it would be a claim about a booking.
 *
 * ALSO REFUSED, EACH BECAUSE NOTHING HOLDS IT:
 *  · **A withholding percentage.** `/host/verify` states the direction — a host
 *    on FBR's Active Taxpayer List is withheld at a lower rate than one who is
 *    not — and prints no number, because the rate is a tax position this build
 *    has not settled. Same here.
 *  · **A payout date, a payout schedule, or a cut-off.** `ha-055` names one
 *    ("Expected Monday 28 Jul 2026"); nothing in this product schedules a
 *    payment. The article says what releases the money, which is a fact, and
 *    not when it lands, which is not.
 *  · **A tax certificate, an e-invoice, or a year-to-date total.** Documents
 *    nothing issues and a record nothing keeps.
 *  · **`Service fee (wakala)`.** `REPOSITIONING.md` replaces it with `Service
 *    fee`, and `HOST-SHELL.md` §0.2 forbids carrying an `ha-*` string forward
 *    unchecked. `HOST_FEES` already ships the corrected label, which is a third
 *    reason to read it rather than the card.
 *
 * SEO-RULES §5 claim 9 appears once, byte-exact, with the sentence stop outside
 * it. It is the claim this page exists to make good on.
 *
 * ROUTE CONTRACT: `noindex, follow` from `app/host/layout.tsx`; no canonical, no
 * hreflang, no JSON-LD, no breadcrumb (`HOST-SHELL.md` §1). The "Help for hosts
 * · Payouts" line is §7.6a chrome and emits no markup.
 *
 * NO GREEN, and nothing plated: rows are hairline-divided open space (TASTE §1,
 * `HOST-SHELL.md` §8). Links are ink and underlined at rest (TASTE §8).
 */
export const metadata: Metadata = {
  title: { absolute: "How host fees and payouts are calculated — SalamStay" },
};

const sectionHeading = "text-h5 font-semibold text-primary";
const section = "mt-8 border-t border-hairline pt-8";
const body = "mt-3 text-bodyMd font-regular leading-relaxed text-secondary";

/**
 * The three moves a guest's payment makes. An `<ol>` because they are genuinely
 * ordered — nothing comes off before the money is held, and nothing is released
 * before a check-in.
 */
const STAGES = [
  {
    term: "Your guest pays the whole booking",
    detail:
      "The full amount for the stay is taken when they book, not at check-in and not in parts.",
  },
  {
    term: "It is held in trust with Meezan Bank",
    detail:
      "It is not spent, not lent out, and earns nothing while it waits. SalamStay does not hold it in its own name.",
  },
  {
    term: "It is released to you once they check in",
    detail:
      "Arrival is what releases it. The three items below come off on the way, and what is left is yours.",
  },
] as const;

export default function HostFeesHelpPage() {
  return (
    <div className="max-w-prose">
      <HostHelpContext section="Payouts" />

      <h1 className="mt-3 text-h4 font-semibold text-primary">How each payout is calculated</h1>
      <p className="mt-2 text-bodyMd font-regular leading-relaxed text-secondary">
        Between your guest paying and the money reaching you, three things come off and one thing
        waits. Nothing else happens to it.
      </p>

      <section aria-labelledby="order-h" className={section}>
        <h2 id="order-h" className={sectionHeading}>
          The order it moves in
        </h2>

        <ol className="mt-6 divide-y divide-hairline">
          {STAGES.map(({ term, detail }) => (
            <li key={term} className="py-5 first:pt-0 last:pb-0">
              <p className="text-bodyMd font-semibold text-primary">{term}</p>
              <p className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">
                {detail}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="off-h" className={section}>
        <h2 id="off-h" className={sectionHeading}>
          What comes off
        </h2>

        <p className={body}>
          {/* Registry claim 9, byte-exact. The stop is sentence punctuation and
              sits OUTSIDE the claim, exactly as `host-sections.tsx` sets it, so
              §5's verbatim rule holds and TASTE §7 keeps a claim inside a line
              rather than a bolded whole sentence. */}
          <strong className="font-semibold text-primary">
            Transparent fees and tax — every rupee shown before you book or earn
          </strong>
          . Each of the three is shown as an amount on the booking it comes off, on your
          reservation and again on your earnings.
        </p>

        {/*
          Hairline PER GAP, no outer box, no rule above the first row or below
          the last — the same list `/become-a-host` draws from the same array,
          because it is the same three items and a host should not meet two
          renderings of one fee schedule.
        */}
        <ul className="mt-6 divide-y divide-hairline">
          {HOST_FEES.map(({ name, detail, rate, numeric }) => (
            <li
              key={name}
              className="flex items-start justify-between gap-6 py-5 first:pt-0 last:pb-0"
            >
              <span className="min-w-0">
                <span className="block text-bodyMd font-semibold text-primary">{name}</span>
                <span className="mt-1 block text-bodySm font-regular leading-relaxed text-secondary">
                  {detail}
                </span>
              </span>
              {/* A bare value in its own cell, with no prose around it to
                  reorder past — `Num` is the isolate either way, and a no-op
                  where the run has no strong character beside it. */}
              <span className="shrink-0 text-bodySm font-semibold text-secondary">
                {numeric ? <Num>{rate}</Num> : rate}
              </span>
            </li>
          ))}
        </ul>

        <p className={body}>
          Withholding tax is advance tax, collected under Pakistan’s tax rules and deposited
          against your name — SalamStay does not keep it. A host who appears on FBR’s Active
          Taxpayer List is withheld at a lower rate than one who does not, which is a fact about
          that list rather than something you fill in.
        </p>
      </section>

      <section aria-labelledby="see-h" className={section}>
        <h2 id="see-h" className={sectionHeading}>
          Where to see your own numbers
        </h2>
        <p className={body}>
          Every stay carries its own figures rather than a rate applied to a total.{" "}
          <Link href="/host/reservations" className={inlineAction}>
            A reservation
          </Link>{" "}
          shows what that booking earns and what comes off it;{" "}
          <Link href="/host/earnings" className={inlineAction}>
            your earnings
          </Link>{" "}
          groups the same stays by what has been released and what is still held. Where the money
          goes when it is released is{" "}
          <Link href="/host/payout-settings" className={inlineAction}>
            your payout account
          </Link>
          .
        </p>
        <p className={body}>
          What SalamStay does with a guest’s money before it becomes yours is set out in full
          under{" "}
          <Link href="/trust-and-safety" className={inlineAction}>
            how your money is protected
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
