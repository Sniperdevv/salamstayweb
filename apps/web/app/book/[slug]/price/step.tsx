"use client";

import { useState } from "react";
import Link from "next/link";

import { CheckoutStep } from "@/components/booking/checkout-step";
import { CardIcon, CreditIcon, TaxBarsIcon } from "@/components/booking/pay-glyphs";
import { FeesReceiptIcon } from "@/components/home-icons";
import { AlertCircleIcon, AlertTriangleIcon, HomeIcon, InfoIcon } from "@/components/icons";
import { CheckMark } from "@/components/ui/marks";
import { TextInput } from "@/components/ui/text-input";
import { btnSecondary, fieldErrorLine, inlineAction } from "@/components/ui";
import { PAYMENT_RAILS, nights, staySubtotal } from "@/lib/booking/booking";
import { useBooking } from "@/lib/booking/booking-state";
import { QUOTE, coversStay } from "@/lib/booking/quote";
import { RAIL_NAME } from "@/lib/booking/rails";
import { checkoutHref } from "@/lib/content/listings";
import { formatPkr } from "@/lib/money";

/**
 * GW-024 — `/book/{slug}/price`, checkout step 3 of 4.
 *
 * Contract: `CHECKOUT-SHELL.md` (§6 money, §4 the rail, §5 field anatomy, §11
 * states, and §15's amendments, which override the sections they name) with
 * `BUILD-DECISIONS.md` on top (§0 do not port the card CSS, §1 the back link,
 * §14 one money formatter, §17 `max-w-overlay-dialogMd`, §18 the promo button,
 * §22 `Num` inside a flex parent, §23 the repositioned vocabulary).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WHY THIS SCREEN CARRIES THE ARITHMETIC
 * ───────────────────────────────────────────────────────────────────────────
 * §6: this is the ONE checkout surface that itemises. Every other step shows
 * the stay subtotal and a strip pointing here. So the numbers go in the rail —
 * sticky, always on screen, checkable at a glance — through the frame's
 * `railMoney` slot, which exists for exactly this (§4: "the Price card replaces
 * `.pline` with the full itemised `<dl>`"). This column carries what each line
 * IS. Numbers on the right, meaning on the left: a guest can read the
 * explanation of the service fee without the amount ever leaving the viewport,
 * which is what makes SEO-RULES §5 claim 9 literal rather than decorative.
 *
 * §15 worried that the mobile collapse would delete the breakdown, because §4
 * sends the rail out of the flow below 1080. The frame resolves it a different
 * way — the rail card stays in the flow and only its identity block and primary
 * move — so the `<dl>` is on screen at every width and this column never has to
 * carry a second copy of the money.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * NO RATE IS EVER PRINTED, AND NO FEE IS EVER DERIVED
 * ───────────────────────────────────────────────────────────────────────────
 * `lib/booking/quote.ts` holds the amounts and says why they are content rather
 * than arithmetic. The consequence is visible here: when the guest's stay is
 * not the stay this quote was written for, the money is not estimated. The page
 * shows the un-quoted register instead (§11.2) — a page-level warning naming
 * its recovery, a skeleton where the figures go, and a primary that is
 * disabled, visible, in place and explained. Every fee is an AMOUNT with a
 * plain-language explanation and no percentage, because ARCHITECTURE.md fixes
 * the fee model without fixing a rate this product may quote.
 */

/* ————— section recipe (CHECKOUT-SHELL §5, TASTE §7's ladder) ——————————— */

/** `.fsec` — a hairline with air on both sides. The card's 28px rounds to `space-8`. */
const stepSection = "mt-8 border-t border-hairline pt-8";

/** `.fsec h2` — 22/600 on the card; `text-h5` (20/600) is the rung below it. */
const stepSectionTitle = "text-h5 font-semibold text-primary";

/** `.sec-sub` — 14/400 secondary, held to a reading measure. */
const stepSectionSub = "mt-2 max-w-[62ch] text-bodySm text-secondary";

/**
 * `.ghint` — icon and text in open space. TASTE §1: a content block casts no
 * shadow and draws no border. BUILD-DECISIONS §4 fixes the gap above it at
 * 18px, which is not a rung on the `space` scale (it steps 16 → 20), so this
 * takes `space-5` rather than an arbitrary `[18px]`.
 */
const stepHint =
  "mt-5 flex max-w-[62ch] items-start gap-3 text-label font-regular leading-relaxed text-secondary";

/** A fee explanation: 16/600 name over 14/400 body. */
const lineName = "block text-bodyMd font-semibold text-primary";
const lineBody = "mt-1 block text-bodySm leading-relaxed text-secondary";

/** The payload word inside a sentence. TASTE §7: never a whole sentence. */
const payload = "font-semibold text-primary";

/* ————— the itemised total, for the rail's money slot ————————————————————— */

const moneyRow = "flex items-baseline justify-between gap-3 py-2";
const moneyLabel = "text-bodySm text-secondary";
const moneyAmount = "num whitespace-nowrap text-bodySm text-primary";

/** `bg.skeleton` is a RESTING fill, not a sweep — nothing is in flight to wait on. */
const skeletonBar = "inline-block h-3 rounded-sm bg-skeleton align-middle";

export default function PriceStep({ slug }: { readonly slug: string }) {
  const { draft } = useBooking();
  const stayNights = nights(draft.dates);
  const quoted = coversStay(staySubtotal(draft), stayNights);

  /**
   * The promo field. Every code entered is rejected, and that is the honest
   * answer rather than a mock: this build has no promotion service, so there is
   * no code that applies. The §11.3 inline error register is therefore live
   * rather than merely drawn, and the guest gets a real recovery.
   */
  const [code, setCode] = useState("");
  const [rejected, setRejected] = useState(false);

  const railName = draft.rail === null ? null : RAIL_NAME[draft.rail];

  return (
    <CheckoutStep
      step={3}
      listing={draft.listing}
      heading="Your price breakdown"
      sub="Every line that makes up your total. Nothing is charged on this step."
      // BUILD-DECISIONS §1: inside the flow, back means one step back. The
      // header's `Save & exit` is the route out to the listing.
      backHref={checkoutHref(slug, "verify")}
      nextHref={checkoutHref(slug, "confirm")}
      nextLabel="Continue to payment"
      nextDisabled={!quoted}
      note={quoted ? "You will not be charged yet." : "Choose your dates to see your total."}
      showRail
      banner={quoted ? undefined : <NoQuoteBanner slug={slug} hasDates={draft.dates !== null} />}
      railMoney={<ItemisedTotal quoted={quoted} />}
    >
      <section aria-labelledby="lines-h">
        <h2 id="lines-h" className={stepSectionTitle}>
          What each line covers
        </h2>
        <p className={stepSectionSub}>
          Four lines, and that is the whole bill.{" "}
          {/* SEO-RULES §5 claim 9, byte-exact. The em dash is the claim's, not ours. */}
          <b className={payload}>
            Transparent fees and tax — every rupee shown before you book or earn
          </b>
        </p>

        <ul className="mt-5 flex max-w-[62ch] flex-col gap-5">
          <li className="flex items-start gap-3">
            <HomeIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Nightly rate</span>
              <span className={lineBody}>
                Set by the host, multiplied by your nights. SalamStay adds nothing to it, and
                the host cannot change it once your dates are held.
              </span>
            </span>
          </li>

          <li className="flex items-start gap-3">
            <FeesReceiptIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              {/* Ruling 23: "Service fee". Never "wakala service fee". */}
              <span className={lineName}>Service fee</span>
              <span className={lineBody}>
                SalamStay acts as your booking agent and charges a fixed, disclosed commission
                for arranging and safeguarding your stay. It is a flat agency fee shown up
                front: not interest, and not a hidden markup on the host&apos;s price.{" "}
                <Link className={inlineAction} href="/help/payments/how-fees-and-taxes-work">
                  How our fees and taxes work
                </Link>
              </span>
            </span>
          </li>

          <li className="flex items-start gap-3">
            <CardIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Payment processing (MDR)</span>
              <span className={lineBody}>
                The merchant-discount rate your card or wallet network charges to process the
                payment. We pass it through at cost and it changes with the method you pick, so{" "}
                {railName === null ? (
                  <>
                    the line in your breakdown is re-quoted and shown to you before you confirm
                    if you change it.
                  </>
                ) : (
                  <>
                    the line in your breakdown is quoted for{" "}
                    <b className={payload}>{railName}</b>, the method you chose.
                  </>
                )}
              </span>
            </span>
          </li>

          <li className="flex items-start gap-3">
            <TaxBarsIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Sales tax · ICT (Islamabad)</span>
              <span className={lineBody}>
                Charged in Pakistani Rupees. Tax lines follow the property&apos;s province, here
                Islamabad Capital Territory (ICT). We collect it and remit it; none of it is
                ours.
              </span>
            </span>
          </li>
        </ul>

        {/*
          ARCHITECTURE.md §6.9 applies withholding tax to HOST PAYOUTS. It is not
          on a guest bill, and one line saying so costs less than leaving a guest
          to wonder why a tax they have heard of is missing.
        */}
        <p className={stepHint}>
          <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
          <span>
            <b className={payload}>Withholding tax is not on your bill.</b> It applies to what
            the host is paid, is deducted from the host&apos;s payout, and never appears on a
            guest total.
          </span>
        </p>
      </section>

      <section className={stepSection} aria-labelledby="promo-h">
        <h2 id="promo-h" className={stepSectionTitle}>
          Promo code or credit
        </h2>
        <p className={stepSectionSub}>Optional. Codes are not case-sensitive.</p>

        {/*
          Its own form, not the step's. Enter inside the field should apply a
          code, and it must never be able to reach the rail's primary.
        */}
        <form
          id="promo-form"
          className="mt-5 flex max-w-overlay-dialogMd items-stretch gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setRejected(code.trim() !== "");
          }}
        >
          <TextInput
            id="promo-code"
            name="promo"
            label="Promo code"
            placeholder="Enter a code"
            value={code}
            autoComplete="off"
            invalid={rejected}
            describedBy={rejected ? "promo-error" : undefined}
            onChange={(next) => {
              setCode(next);
              setRejected(false);
            }}
          />
          {/*
            BUILD-DECISIONS §18: the shared §5 secondary is a FIXED height and
            changing it would be observable at `components/host/host-sections.tsx`,
            so the stretch is composed at this one call site — the card's
            `.prow` is `align-items: stretch` and its Apply matches the field.
            `self-stretch` alone does not do it, because `align-self: stretch`
            is inert against a definite height and `btnSecondary` carries
            `h-12`. `h-full` alone does not do it either — a percentage height
            against an auto-height flex container resolves to auto — so the
            stretch is bought with ONE `span`: the wrapper is the flex item that
            stretches, which gives it a definite height, and `h-full` inside it
            then resolves against that. `min-h-12` keeps the 48px floor for a
            field shorter than the button. No `!important`, which this codebase
            does not use anywhere, and no edit to the shared constant, which the
            same ruling forbids.
          */}
          <span className="flex self-stretch">
            <button
              type="submit"
              className={`${btnSecondary} h-full min-h-12 disabled:cursor-default disabled:text-disabled`}
              disabled={code.trim() === ""}
            >
              Apply
            </button>
          </span>
        </form>

        {rejected ? (
          <p id="promo-error" className={fieldErrorLine} role="alert">
            <AlertCircleIcon className="mt-0.5 size-4 flex-none" />
            <span>
              We couldn&apos;t find this code, or it has expired. Check the spelling and try
              again: codes aren&apos;t case-sensitive.{" "}
              <b className="font-semibold">Nothing was charged.</b> A code that doesn&apos;t
              apply never affects your balance or any booking.
            </span>
          </p>
        ) : null}

        <p className={stepHint}>
          <CreditIcon className="mt-0.5 size-4 flex-none text-tertiary" />
          <span>
            <b className={payload}>Credit comes off here, in plain sight.</b> Any SalamStay
            credit on your account is applied automatically as a line you can read in the
            breakdown, never as a silent discount. This account has none.
          </span>
        </p>
      </section>

      <section className={stepSection} aria-labelledby="methods-h">
        <h2 id="methods-h" className={stepSectionTitle}>
          How you&apos;ll pay
        </h2>
        <p className={stepSectionSub}>
          Processing (MDR) is quoted per method. You choose at{" "}
          <b className={payload}>
            step <span className="num">4</span> · Confirm
          </b>
          , and if you change method that line is re-quoted and shown to you first: your total
          never changes silently.
        </p>

        {/*
          A preview, not a control — the choice belongs to step 4 and the
          heading above says so. Selection is INK (TASTE §3), never the brand
          fill, and it appears only once a rail has actually been chosen; a chip
          filled in before then would be this page inventing a saved payment
          method for someone who has not named one.
        */}
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Payment methods, chosen at step 4">
          {PAYMENT_RAILS.map((rail) => {
            const chosen = draft.rail === rail;
            return (
              <li
                key={rail}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-bodySm ${
                  chosen
                    ? "border-selected bg-selected font-semibold text-selected-fg"
                    : "border-border-default bg-canvas font-medium text-primary"
                }`}
              >
                {chosen ? <CheckMark className="size-4" /> : null}
                {RAIL_NAME[rail]}
              </li>
            );
          })}
        </ul>
      </section>
    </CheckoutStep>
  );
}

/**
 * §11.3's page-level register, in the frame's full-width `banner` slot.
 *
 * The warning register rather than the error one: nothing has gone wrong and
 * nobody has made a mistake — there is simply no quote for these nights yet.
 * The recovery is named and it is one link away, which is §12's rule that every
 * blocked state says what to do next.
 */
function NoQuoteBanner({ slug, hasDates }: { readonly slug: string; readonly hasDates: boolean }) {
  return (
    <div
      role="status"
      className="mb-6 flex items-start gap-3 rounded-lg border border-warning-border bg-warning-bg p-4"
    >
      <AlertTriangleIcon className="mt-0.5 size-5 flex-none text-warning" />
      <span>
        <span className="block text-bodySm leading-relaxed text-secondary">
          <b className={payload}>Your total is not quoted yet.</b> Every line on this bill is
          quoted for your dates, and none of it is estimated. Pick your nights and the
          breakdown appears here, before anything is charged.
        </span>
        <Link
          className={`${inlineAction} mt-1.5 inline-block text-bodySm font-medium`}
          href={checkoutHref(slug, "dates")}
        >
          {hasDates ? "Change your dates" : "Choose your dates"}
        </Link>
      </span>
    </div>
  );
}

/**
 * The rail's money slot on this step — §4/§6's itemised `<dl>`, replacing the
 * `.pline` + deferral strip every other step shows.
 *
 * Nothing here is underlined. TASTE §8 puts an underline on a price that opens
 * a breakdown, and on this screen the price IS the breakdown; an underline
 * leading nowhere is a lie about what a click will do.
 */
function ItemisedTotal({ quoted }: { readonly quoted: boolean }) {
  return (
    <>
      <dl>
        <div className={moneyRow}>
          <dt className={moneyLabel}>
            {quoted ? (
              <>
                <span className="num">{formatPkr(QUOTE.nightly)}</span> ×{" "}
                <span className="num">{QUOTE.nights}</span> nights
              </>
            ) : (
              <span className={`${skeletonBar} w-24`} />
            )}
          </dt>
          <dd className={quoted ? moneyAmount : undefined}>
            {quoted ? formatPkr(QUOTE.stay) : <span className={`${skeletonBar} w-16`} />}
          </dd>
        </div>

        {QUOTE.lines.map((line) => (
          <div key={line.id} className={`${moneyRow} border-t border-hairline`}>
            <dt className={moneyLabel}>{line.label}</dt>
            <dd className={quoted ? moneyAmount : undefined}>
              {quoted ? formatPkr(line.amount) : <span className={`${skeletonBar} w-12`} />}
            </dd>
          </div>
        ))}

        <div className="mt-0.5 flex items-baseline justify-between gap-3 border-t-2 border-border-default pt-3">
          <dt className="text-bodyMd font-semibold text-primary">Total (PKR)</dt>
          <dd
            className={
              quoted ? "num whitespace-nowrap text-bodyLg font-semibold text-primary" : undefined
            }
          >
            {/*
              TASTE §12 from the money side: null money is a skeleton or an
              absence, never a dash and never a confident zero. The geometry
              matches the resolved row, so nothing shifts when a quote lands.
            */}
            {quoted ? formatPkr(QUOTE.total) : <span className={`${skeletonBar} h-4 w-20`} />}
          </dd>
        </div>
      </dl>

      {/* TASTE §6's `bg.raised` info strip: payload bolded, and nothing else. */}
      <p className="mt-3.5 rounded-md bg-raised px-3 py-2.5 text-label font-regular leading-relaxed text-secondary">
        {quoted ? (
          <>
            Charged in Pakistani Rupees. Nothing is charged on this step: you choose how to pay
            and confirm at{" "}
            <b className={payload}>
              step <span className="num">4</span> · Confirm
            </b>
            .
          </>
        ) : (
          <>
            Your nightly rate, service fee, processing and tax appear here once your dates are
            set. Nothing is charged on this step.
          </>
        )}
      </p>
    </>
  );
}
