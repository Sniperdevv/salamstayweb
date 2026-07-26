import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Num } from "@/components/numerals";
import { inlineAction } from "@/components/ui";
import { QUOTE } from "@/lib/booking/quote";
import {
  TRIP,
  formatStayRange,
  formatTripDate,
  isTripId,
  tripPath,
} from "@/lib/booking/trip-record";
import { formatPkr } from "@/lib/money";
import { pageMetadata } from "@/lib/seo/metadata";

import PrintReceiptButton from "./print-button";
import { ExampleBookingStrip, TripBackLink, TripPageHead, TripSection } from "../trip-chrome";

/**
 * GA-134 — `/trips/{id}/receipt`, the receipt for a stay, at web width.
 *
 * THE MOST DANGEROUS SCREEN IN THIS WAVE, AND WHY IT IS A SERVER COMPONENT
 * ------------------------------------------------------------------------
 * GUEST-SHELL.md §12 lifts GO-LIVE A11 into a hard rule for exactly this page:
 * "A surface keyed to a record that does not exist refuses to render — 404, or
 * a redirect to its index. It never renders a fixture. A fabricated receipt is
 * not a placeholder; it is a document that says money changed hands."
 *
 * The id arrives in the URL, so the refusal can happen on the SERVER, before a
 * byte of the document is emitted — `notFound()` in `generateMetadata` and again
 * in the route body. That is strictly better than checkout's client-side guard
 * (`components/booking/checkout-step.tsx`), which has to run in the browser
 * because a draft is React state; here nothing is guessed and nothing flashes.
 *
 * The page holds no state, so nothing below is a Client Component except the
 * print control, which is one leaf.
 *
 * WHAT THE CARD DRAWS THAT THIS DOES NOT SHIP
 * -------------------------------------------
 *  · **"Service fee (wakala)"** — retired. `REPOSITIONING.md`'s money table and
 *    BUILD-DECISIONS #23: a guest reads **Service fee**, and money is **held in
 *    trust until you check in**. The mechanism is unchanged; only the words a
 *    guest has to look up are gone. `ga-134` predates that ruling (GUEST-SHELL
 *    §0.2: never copy content forward from a `ga-*` card without checking).
 *  · **`Confirmation SS-7F3K9Q`** and **`Invoice INV-2026-000482`** — §14's
 *    first row: booking references and invoice numbers are fabrications until a
 *    record issues one. Neither is replaced by a dash (TASTE §12); the reference
 *    row is absent and the invoice is a labelled slot that says so.
 *  · **Two "Download PDF" rows** — there is no PDF. A control that promises a
 *    file and produces nothing is the misleading CTA SEO-RULES §6 names. What
 *    ships instead is the affordance that genuinely exists: print, which the
 *    browser turns into a PDF.
 *  · **The FBR e-invoicing note** — "a document compliant with FBR e-invoicing"
 *    is a regulatory claim about a document that does not exist, and it is in no
 *    registry. The slot states the absence instead.
 *  · **"Also emailed to you · Resend"** — no mail is sent by this build, so the
 *    row asserts a delivery that never happened and offers to repeat it.
 *
 * ROUTE CONTRACT (GUEST-SHELL.md §2): `noindex, follow` from the registry entry
 * via `pageMetadata`; no canonical; no hreflang; no JSON-LD; no breadcrumb;
 * `<main class="co-main">`, never `indexable`.
 */

const RECEIPT_PATH = tripPath("receipt");

/** §4/§6's money row, at the anatomy `/book/{slug}/price` already ships. */
const moneyRow = "flex items-baseline justify-between gap-3 py-2.5";
const moneyLabel = "text-bodySm text-secondary";
const moneyAmount = "num whitespace-nowrap text-bodySm text-primary";
const payload = "font-semibold text-primary";

/**
 * Rendered per request, not frozen at build.
 *
 * One sentence on this page is decided by the calendar — money is "held in
 * trust until you check in" before 14 Aug 2026 and was held "until you checked
 * in" after it — and a statically rendered page would keep whichever tense was
 * true on the day it was built. A receipt that describes a check-in which has
 * not happened is a small lie of exactly the kind this screen exists not to
 * tell. `noindex` throughout, so there is no caching benefit being spent.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!isTripId(id)) notFound();
  return pageMetadata(RECEIPT_PATH);
}

export default async function TripReceiptRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isTripId(id)) notFound();

  const checkedIn = Date.now() >= Date.parse(TRIP.checkIn);
  const stayRange = formatStayRange();

  return (
    <>
      <TripBackLink href={tripPath()}>Your trip</TripBackLink>

      <TripPageHead
        className="mt-5"
        title="Receipt"
        sub={
          <>
            What you paid for this stay, line by line — the same breakdown you saw before you
            confirmed. Nothing has been added since.
          </>
        }
      />

      <ExampleBookingStrip className="mt-6">
        Nothing was charged, and this page is not a record of a payment.
      </ExampleBookingStrip>

      <TripSection id="stay" heading="Your stay" className="mt-8">
        {/*
          A form group's anatomy for a read-only summary: `radius.md`, one
          `border.default`, hairline-divided cells with square interior corners
          (`overflow-hidden` does that for free). TASTE §1 — a bounded block of
          facts carries a border and casts nothing, because it does not float.

          Not `fieldGroup` from `components/ui.ts`: that recipe caps at 520px for
          a column of inputs, and this is a document's header at page width.
        */}
        <dl className="mt-4 max-w-[62ch] overflow-hidden rounded-md border border-border-default bg-canvas">
          <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4">
            <dt className="w-24 shrink-0 text-bodySm text-secondary">Home</dt>
            <dd className="text-bodySm font-medium text-primary">
              <Link className={inlineAction} href={TRIP.listingHref}>
                {TRIP.home}
              </Link>
              <span className="ms-2 font-regular text-secondary">
                <Num>{TRIP.where}</Num>
              </span>
            </dd>
          </div>
          <div className="flex flex-col gap-1 border-t border-hairline px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4">
            <dt className="w-24 shrink-0 text-bodySm text-secondary">Dates</dt>
            <dd className="text-bodySm font-medium text-primary">
              <span>
                <Num>{`${stayRange} · ${TRIP.nights} nights`}</Num>
              </span>
            </dd>
          </div>
          <div className="flex flex-col gap-1 border-t border-hairline px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4">
            <dt className="w-24 shrink-0 text-bodySm text-secondary">Host</dt>
            <dd className="text-bodySm font-medium text-primary">{TRIP.host}</dd>
          </div>
        </dl>
      </TripSection>

      <TripSection
        id="paid"
        heading="What you paid"
        sub="Your nightly rate, the service fee, payment processing and sales tax — the four lines that made the total."
        className="mt-8"
      >
        {/*
          The itemisation is `QUOTE`, imported rather than retyped. Two screens
          already print these figures — `/book/{slug}/price` itemises them and
          `/book/{slug}/confirm` aggregates them onto the button that charges —
          and a receipt that disagreed with either would be the worst of the
          three places to find out.

          Nothing here is underlined. TASTE §8 underlines a price that OPENS a
          breakdown, and on this screen the price IS the breakdown.
        */}
        <dl className="mt-4 max-w-[62ch]">
          <div className={moneyRow}>
            <dt className={moneyLabel}>
              <span className="num">{formatPkr(QUOTE.nightly)}</span> ×{" "}
              <span className="num">{QUOTE.nights}</span> nights
            </dt>
            <dd className={moneyAmount}>{formatPkr(QUOTE.stay)}</dd>
          </div>

          {QUOTE.lines.map((line) => (
            <div key={line.id} className={`${moneyRow} border-t border-hairline`}>
              <dt className={moneyLabel}>
                <Num>{line.label}</Num>
              </dt>
              <dd className={moneyAmount}>{formatPkr(line.amount)}</dd>
            </div>
          ))}

          <div className="mt-0.5 flex items-baseline justify-between gap-3 border-t-2 border-border-default pt-3">
            <dt className="text-bodyMd font-semibold text-primary">Total paid (PKR)</dt>
            <dd className="num whitespace-nowrap text-bodyLg font-semibold text-primary">
              {formatPkr(QUOTE.total)}
            </dd>
          </div>
        </dl>

        {/*
          SEO-RULES §5 claim 9, byte-exact, on the one screen it is actually
          about. TASTE §6's `bg.raised` info strip; §7's "bold the payload only"
          is why the claim is the bolded lead-in and the sentence after it is not.
        */}
        <p className="mt-4 max-w-[62ch] rounded-md bg-raised px-4 py-3 text-bodySm font-regular leading-relaxed text-secondary">
          <b className={payload}>
            Transparent fees and tax — every rupee shown before you book or earn.
          </b>{" "}
          Every line above appeared at checkout before anything was charged.
        </p>

        <p className="mt-3 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
          {checkedIn ? (
            <>
              Your payment was <b className={payload}>held in trust until you checked in</b> on{" "}
              <span>
                <Num>{formatTripDate(TRIP.checkIn)}</Num>
              </span>
              .
            </>
          ) : (
            <>
              Your payment is <b className={payload}>held in trust until you check in</b> on{" "}
              <span>
                <Num>{formatTripDate(TRIP.checkIn)}</Num>
              </span>
              .
            </>
          )}{" "}
          <Link className={inlineAction} href="/legal/guest-refund-policy">
            What happens if you cancel
          </Link>
        </p>
      </TripSection>

      <TripSection id="invoice" heading="Tax invoice" className="mt-8">
        {/*
          A labelled slot, not an invented document — the idiom
          `components/legal/legal-page.tsx` ships for a clause SalamStay has not
          settled: "an empty, labelled row, never plausible legal text."

          Everything a tax invoice needs beyond the figures above is a fact about
          a company registration this build does not hold: an invoice number
          series, an STRN, an NTN, a registered address, an FBR e-invoicing
          reference. Not one of them may be drafted here, and a receipt is the
          last document on which to draft one. So the row says what is missing
          and stops.
        */}
        <div className="mt-4 max-w-[62ch] rounded-md bg-raised px-4 py-4">
          <p className="border-b border-hairline pb-3 text-bodySm font-semibold text-secondary">
            Not issued yet
          </p>
          <p className="mt-3 text-bodyMd font-semibold text-primary">
            A numbered tax invoice for this stay
          </p>
          <p className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">
            The sales tax you paid is itemised above and was charged when you paid. A separate
            numbered invoice, carrying SalamStay&rsquo;s tax registration details, is not issued
            yet. When it is, it will appear here — the figures will not change, because they are
            the figures above.
          </p>
        </div>
      </TripSection>

      {/*
        The one thing a guest actually wants from a receipt and the one this
        build can genuinely give: a copy. Not a section — it is an action, and a
        heading over a single button is a heading over nothing.

        TASTE §5's gray-fill secondary carries it: this is not the surface's
        primary CTA (a receipt has no call to action; nothing here is green) and
        it is not an inline text link either.
      */}
      <div className="mt-8 flex max-w-[62ch] flex-col gap-3 border-t border-hairline pt-6 print:hidden">
        <PrintReceiptButton />
        <p className="text-bodySm font-regular leading-relaxed text-secondary">
          Printing opens your browser&rsquo;s own dialog, where &ldquo;Save as PDF&rdquo; keeps a
          copy on your device.
        </p>
      </div>
    </>
  );
}
