import Link from "next/link";

import { FeesReceiptIcon } from "@/components/home-icons";
import { HostEmpty } from "@/components/host/host-empty";
import { Num, Phrase } from "@/components/numerals";
import { btnSecondary, focusRing, inlineAction } from "@/components/ui";
import { exampleStrip, exampleStripLead } from "@/components/ui/example-strip";
import { formatPkr } from "@/lib/money";

import { TAX_DOCUMENTS, WITHHOLDING_BODY, type WithholdingView } from "./tax";

/**
 * The furniture of `/host/earnings/tax` — `ha-061`'s hub with `ha-057`'s
 * withholding detail and `ha-059`'s receipt list folded in as sections.
 * Server-safe throughout; nothing on this page holds state.
 *
 * ELEVATION (TASTE §1, `HOST-SHELL.md` §8): nothing casts and nothing is a
 * plate. Rows are hairline-separated in open space, which is the grammar
 * `EarningsBreakdown` already uses for money on a host surface, and §1 is
 * explicit that a content block gets no box.
 *
 * NO BRAND GREEN. §7 caps the host app surface at what `ha-046` already spends
 * and says "Add nothing to it." Every link is ink and underlined at rest (§8),
 * the amounts are ink, and the two document actions are disabled — a disabled
 * control spends nothing.
 */

/* ─────────────────────────────── honesty ────────────────────────────────── */

/**
 * This page's own sentence on the shared recipe, and the lie it has to close is
 * the biggest one on any of these three surfaces: **a page called Tax implies
 * somebody is filing something.** Nobody is.
 *
 * Three separate absences, because a host who reads only one would draw the
 * wrong conclusion from the other two — no authority is connected, no record is
 * kept, no document is produced.
 */
export function NoTaxRecordStrip({ className = "" }: { readonly className?: string }) {
  return (
    <p className={`${exampleStrip} ${className}`}>
      <b className={exampleStripLead}>No tax record exists.</b> SalamStay is not connected to any
      tax authority, keeps no tax record and produces no documents. The amounts below are the
      withholding lines from the same written-in reservations your earnings page itemises.
    </p>
  );
}

/* ──────────────────────────── what was withheld ─────────────────────────── */

/**
 * `ha-057`, reduced to what is true — and to the one thing no surface in this
 * product does yet, which is add these up.
 *
 * WHY THE AMOUNTS ARE POSITIVE HERE AND NEGATIVE IN `EarningsBreakdown`
 * ---------------------------------------------------------------------
 * There, a withholding row sits inside a subtraction: gross at the top, a net
 * underneath, and the rule is that a deduction shown as a bare positive number
 * beside a smaller total is how a fee schedule reads as a trick, so
 * `formatPkr(-amount)` puts the sign outside `PKR` and keeps the run one LTR
 * isolate.
 *
 * Here there is no subtraction and no smaller total: the figure above these
 * lines is their SUM, larger than any of them, and the quantity being named is
 * an amount of tax rather than a line coming off something. A minus on every
 * row under a positive total would be arithmetic that does not resolve. The
 * subtraction still exists and still shows its signs — one click away, on the
 * page that owns it.
 *
 * NO RATE, NO FILER STATUS, NO BASE × RATE. `tax.ts` records each refusal by
 * name. `/host/verify` is the shipped owner of what filer status changes and
 * states it without a number; this page links there rather than restating it.
 */
export function WithholdingSection({ view }: { readonly view: WithholdingView }) {
  return (
    <section aria-labelledby="withheld-h" className="mt-10">
      <h2 id="withheld-h" className="text-h6 font-semibold text-primary">
        Withheld from your payouts
      </h2>

      <p className="mt-2 max-w-[68ch] text-bodySm font-regular leading-relaxed text-secondary">
        {WITHHOLDING_BODY}
      </p>

      {/*
        The total, and it is addition and nothing else — the sum of the stated
        amounts in the rows directly below it, so the trace from figure to
        evidence is one glance. 24, one rung above the `h1`, for the reason
        `/host/earnings` records: it is a figure, not a heading.

        It is suppressed entirely when no payout has released, rather than set
        to `PKR 0`. TASTE §12: null money is a skeleton or an absence, never a
        rendered zero, and "withheld so far: nothing" is the sentence under it
        rather than a zero in 24px.
      */}
      {view.hasDeducted ? (
        <>
          <p className="mt-5 text-label font-regular text-tertiary">Withheld so far</p>
          <p className="mt-0.5 text-h4 font-semibold text-primary">
            <span className="num">{formatPkr(view.deductedTotal)}</span>
          </p>
        </>
      ) : (
        <p className="mt-5 max-w-[68ch] text-bodySm font-regular leading-relaxed text-secondary">
          Nothing has been withheld yet. Withholding comes off a payout when it is released, and
          none of yours has been.
        </p>
      )}

      {view.hasPending ? (
        <p className="mt-3 max-w-[68ch] text-bodySm font-regular leading-relaxed text-secondary">
          It covers payouts that have already been released. A stay whose money is still held in
          trust has had nothing withheld from it yet, and its line below says so.
        </p>
      ) : null}

      <ul className="mt-6">
        {view.lines.map((line) => (
          <li
            key={line.reservation.id}
            className="flex flex-col gap-2 border-t border-hairline py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
          >
            <div className="min-w-0">
              {/* `Num` on the listing name too — "Gulberg 2 Residence" is a
                  digit run inside a name, and §12's rule has no carve-out for
                  one. It draws the isolate around the whole name. */}
              <p className="text-bodyMd font-medium text-primary">
                <Num>{line.reservation.listing}</Num>
              </p>
              <p className="mt-1 text-bodySm font-regular text-secondary">
                {/* A17: the isolate wraps the sentence, not the date inside it.
                    Two isolates with a `·` between them reorder past the prose
                    under RTL and the line comes out backwards. */}
                <Phrase>
                  {line.reservation.guest} · Stay <Num>{line.reservation.dates}</Num>
                </Phrase>
              </p>
              <p className="mt-1.5 text-label font-regular leading-relaxed text-tertiary">
                {line.deducted
                  ? "Deducted when this payout was released."
                  : "Not yet deducted. It comes off when this payout is released."}
              </p>
            </div>

            <span className="whitespace-nowrap text-bodyMd font-semibold text-primary sm:flex-none">
              <span className="num">{formatPkr(line.amount)}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-6 border-t border-hairline pt-6">
        <Link href="/host/verify" className={`${inlineAction} text-bodySm`}>
          What your filer status changes
        </Link>
      </p>
    </section>
  );
}

/* ──────────────────────── documents that do not exist ───────────────────── */

const DOCUMENTS_REASON_ID = "tax-documents-not-generated";

/**
 * The disabled action, and it is `../messages/[threadId]/composer.tsx`'s
 * Send-that-cannot-send wearing the §5 gray-fill secondary's geometry rather
 * than the primary pill's — a download is not this surface's primary call, and
 * this surface has none.
 *
 * `btnSecondary`'s shape (h-12, `radius.md`, 24px gutters, 16/500) with the
 * disabled skin swapped in, spelled out rather than composed: Tailwind emits
 * utilities in token order, so appending `text-disabled` to a string that
 * already carries `text-primary` is decided by the stylesheet and not by the
 * order written here. A state is a whole recipe (`components/ui.ts` records
 * this against `btnSecondaryMd`).
 *
 * THE BORDER IS NOT DECORATION. `bg.raised` against `bg.canvas` is 1.06:1 in
 * light and 1.08:1 in dark — measured in `checkout-step.tsx` — so without an
 * edge a disabled control is dim text floating with no shape at all. TASTE
 * §11.7: visible, in place, shadow-less.
 *
 * NO `pressable`. A control that cannot be pressed does not answer a press, and
 * that absence IS the signal. It keeps `focusRing` because it keeps focus.
 */
const downloadDisabled =
  "inline-flex h-12 shrink-0 cursor-default select-none items-center justify-center gap-2 " +
  "whitespace-nowrap rounded-md border border-border-default bg-raised px-6 text-bodyMd " +
  `font-medium text-disabled ${focusRing}`;

/**
 * `ha-061`'s document rows and `ha-059`'s per-booking receipt, with the one
 * thing both cards are actually about — the download — disabled.
 *
 * `aria-disabled`, NOT `disabled`, and the distinction is the composer's:
 * a `disabled` button leaves the tab order, so a keyboard or screen-reader user
 * meets a row that describes a document and then finds nothing where the action
 * should be — the silence is worse than the refusal. `aria-disabled` keeps the
 * control focusable, announces it as dimmed, and `aria-describedby` reads the
 * reason at the moment it matters.
 *
 * **Same size, same place, same label** (TASTE §11.7, `HOST-SHELL.md` §5). The
 * button still says `Download`, because renaming it to "Not available" would
 * hide the shape of the feature rather than state its absence.
 *
 * ONE reason for both, not one each. It is a single fact about the product —
 * nothing generates a document — and repeating it under each row would read as
 * two separate problems.
 */
export function TaxDocuments() {
  return (
    <section aria-labelledby="documents-h" className="mt-12 border-t border-hairline pt-9">
      <h2 id="documents-h" className="text-h6 font-semibold text-primary">
        Documents for filing
      </h2>

      <p className="mt-2 max-w-[68ch] text-bodySm font-regular leading-relaxed text-secondary">
        Two documents a host filing tax would want from SalamStay, and what each would carry.
      </p>

      <ul className="mt-6">
        {TAX_DOCUMENTS.map((doc) => (
          <li
            key={doc.title}
            className="flex flex-col gap-4 border-t border-hairline py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
          >
            <div className="min-w-0">
              <p className="text-bodyMd font-semibold text-primary">{doc.title}</p>
              <p className="mt-1 max-w-[56ch] text-bodySm font-regular leading-relaxed text-secondary">
                {doc.body}
              </p>
            </div>

            <button
              type="button"
              aria-disabled="true"
              aria-describedby={DOCUMENTS_REASON_ID}
              className={downloadDisabled}
            >
              Download
            </button>
          </li>
        ))}
      </ul>

      {/*
        The reason and the way onward, in one paragraph — §12's "every disabled
        control explains itself" and "never a dead end". The figures those
        documents would carry are already on a page the host has just come from,
        so that is where it points.
      */}
      <p
        id={DOCUMENTS_REASON_ID}
        className="mt-6 max-w-[68ch] border-t border-hairline pt-6 text-bodySm font-regular leading-relaxed text-secondary"
      >
        Neither button downloads anything. Nothing in SalamStay generates a tax document yet, so
        both are here without a file behind them. Every figure they would carry is already on{" "}
        <Link href="/host/earnings" className={inlineAction}>
          your earnings page
        </Link>
        , booking by booking.
      </p>
    </section>
  );
}

/* ───────────────────────────── the boundary ─────────────────────────────── */

/**
 * `ha-061`'s framing line, which is the boundary this product must never cross,
 * with its closing referral **verbatim**: *"Your tax consultant or the FBR
 * portal can help."*
 *
 * ONE CLAUSE OF THE CARD'S SENTENCE IS NOT CARRIED: *"SalamStay provides the
 * documents"* and *"We record what we withheld and paid you."* Both are false
 * here — it provides none and records nothing — and a boundary statement that
 * opens with a false claim is worse than no boundary statement.
 *
 * NAMING FBR, deliberately, and it is the narrow case rather than the broad
 * one. `../earnings.ts` refuses to name the authority where the card cites FBR
 * rules, an FBR e-invoice per payout and an ATL chip, because naming it there
 * would dress an unbuilt integration as a shipped one. This is the opposite
 * move: a hand-off AWAY from SalamStay to a public resource, claiming nothing
 * about what SalamStay does. `/host/verify` already names FBR's Active Taxpayer
 * List on a host surface and `lib/content/legal/privacy.ts` names FBR rules, so
 * the word is not new to the product — only this use of it is, and it is the
 * use that promises least.
 */
export function TaxBoundary() {
  return (
    <section aria-labelledby="boundary-h" className="mt-12 border-t border-hairline pt-9">
      <h2 id="boundary-h" className="text-h6 font-semibold text-primary">
        For your tax filing
      </h2>

      <p className="mt-2 max-w-[68ch] text-bodySm font-regular leading-relaxed text-secondary">
        SalamStay does not give tax advice. This page shows what was withheld from each payout;
        what you file, and how, is yours to decide. Your tax consultant or the FBR portal can help.
      </p>
    </section>
  );
}

/* ─────────────────────────── the first-run empty ────────────────────────── */

/**
 * A host who has never had a booking has had nothing withheld — not a zero, not
 * an empty table with a total of `PKR 0` over it. Same fixture and same
 * condition as `/host/earnings` and `/host/earnings/payouts`, so emptying
 * `RESERVATIONS` empties all three at once.
 */
export function TaxEmpty() {
  return (
    <HostEmpty
      className="mt-4"
      glyph={<FeesReceiptIcon className="size-6" />}
      title="Nothing withheld yet"
      body="Withholding tax comes off a payout when it is released. Once a guest has stayed, that booking's withholding appears here as an amount."
      actions={
        <>
          <Link href="/host/listings" className={`${btnSecondary} no-underline`}>
            Go to your listings
          </Link>
          <Link href="/host/verify" className={`${inlineAction} text-bodySm`}>
            What your filer status changes
          </Link>
        </>
      }
    />
  );
}
