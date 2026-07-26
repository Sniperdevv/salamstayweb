"use client";

import { useRef, type ComponentType } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { CheckoutStep } from "@/components/booking/checkout-step";
import { shortDate, shortDayMonth } from "@/components/booking/calendar-model";
import {
  BankTransferIcon,
  CardIcon,
  CashIcon,
  CustodyIcon,
  GlobeIcon,
  LockIcon,
  WalletPhoneIcon,
} from "@/components/booking/pay-glyphs";
import { BoltIcon } from "@/components/home-icons";
import { AlertCircleIcon, AlertTriangleIcon, HomeIcon, InfoIcon } from "@/components/icons";
import { Num } from "@/components/numerals";
import { CheckMark } from "@/components/ui/marks";
import { RadioGroup, RadioRow } from "@/components/ui/radio-group";
import { fieldErrorLine, fieldLabel, inlineAction } from "@/components/ui";
import {
  PAYMENT_RAILS,
  addDays,
  countedGuests,
  nights,
  staySubtotal,
  type PaymentRail,
} from "@/lib/booking/booking";
import { useBooking } from "@/lib/booking/booking-state";
import { QUOTE, coversStay } from "@/lib/booking/quote";
import { RAIL_NAME } from "@/lib/booking/rails";
import { checkoutHref, listingName } from "@/lib/content/listings";
import { formatPkr } from "@/lib/money";

/**
 * GW-025 — `/book/{slug}/confirm`, checkout step 4 of 4. The last screen before
 * money moves.
 *
 * Contract: `CHECKOUT-SHELL.md` (§4 the rail, §5 field anatomy, §6 money, §7
 * green rarity, §11 states, §15's amendments) with `BUILD-DECISIONS.md` on top
 * (§0 no card CSS, §1 one step back, §10 Instant Book only, §14 one money
 * formatter, §15 payment failure lives here, §20 the selection mark is a check,
 * §22 `Num` inside a flex parent, §23 the repositioned vocabulary).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WHAT THIS SCREEN OWES THE GUEST
 * ───────────────────────────────────────────────────────────────────────────
 * Three things are non-negotiable on the surface that charges: the total is on
 * the button and not only in a summary; that total is a link back to step 3's
 * itemisation, which is TASTE §8's one sanctioned underlined price; and no
 * figure appears here that step 3 did not already show.
 *
 * §6 gives the itemisation to the Price step alone, and §15 amends what THIS
 * card's money slot shows: subtotal → aggregated fees → total. Three rows a
 * guest can add up in their head, with the total pointing at step 3 for the
 * line by line. A subtotal-only rail on the screen that charges would read as
 * the drip pricing §6 exists to forbid.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * GREEN RARITY, AND WHY "VERIFIED" IS INK HERE
 * ───────────────────────────────────────────────────────────────────────────
 * §7 spends brand on three roles per checkout surface: the wordmark dot, the
 * one enabled primary, the verification shield in the rail's trust block.
 * ga-063 renders "Verified" as a success-green pill; on web that would be a
 * fourth green role competing with the pay button on the one screen where the
 * pay button must win, so the document rows carry an INK check in a hairline
 * pill. Same information, quieter. Selection on the rails is ink too, and it is
 * said twice — a 2px inset ring and a solid disc carrying a check — so the
 * state survives a monochrome screen (§20: the check ships on every radiogroup,
 * including the one this card draws with a plain dot).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * THREE PLACES THIS DEPARTS FROM THE CARD, AND WHY
 * ───────────────────────────────────────────────────────────────────────────
 * 1. **No saved wallet, and no masked account number.** The card ships "Saved
 *    wallet · 0300 ••• 4021" and a masked HBL card. `booking.ts` stubs auth with
 *    one constant and is explicit that no step invents a name, an email or an
 *    avatar to greet; a masked phone number is the same class of invention, on
 *    the screen where inventing it is worst. Every rail therefore describes what
 *    it IS, and none claims to already know the guest.
 * 2. **The specific decline reason is absent.** gw-025 says "Not enough balance
 *    in your JazzCash wallet", which is a sentence the gateway supplies. There
 *    is no payment adapter here to supply one, so the register states the
 *    outcome and the recovery — both true — and invents no cause. Everything
 *    else in it is the card's, including gw-027's double-charge guarantee
 *    verbatim.
 * 3. **The payment-in-flight overlay is not mounted here.** A charge begins at
 *    the rail's primary, which is the frame's;
 *    `components/booking/payment-in-flight.tsx` names its four seams and three
 *    of them (the header's exit, the back link, the primary itself) are chrome
 *    this file does not own. Mounting it with an `active` nothing can set would
 *    be dead code; setting it with no adapter to resolve it would be a spinner
 *    that never ends. It belongs to whoever owns the control that spends money.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * HOW THE FAILURE STATE IS REACHED
 * ───────────────────────────────────────────────────────────────────────────
 * `?payment=declined`. Not a demo switch: every rail here is redirect-based —
 * the wallet or the acquirer takes the guest away and returns them to this URL
 * with a result — so a result read off the return URL is the shape this state
 * genuinely arrives in. BUILD-DECISIONS §15 is why it is a state of this route
 * and not a route of its own: no money moved, no booking exists, and the guest
 * never left step 4, so the stepper does not move either. `/status` is
 * post-flow and carries pending and declined only.
 *
 * A declined result with no rail chosen renders nothing. A failure register
 * with no payment behind it would be its own lie.
 */

/* ————— section recipe (CHECKOUT-SHELL §5, TASTE §7's ladder) ——————————— */

const stepSection = "mt-8 border-t border-hairline pt-8";
const stepSectionTitle = "text-h5 font-semibold text-primary";
const stepSectionSub = "mt-2 max-w-[62ch] text-bodySm text-secondary";
const stepHint =
  "mt-5 flex max-w-[62ch] items-start gap-3 text-label font-regular leading-relaxed text-secondary";
const lineName = "block text-bodyMd font-semibold text-primary";
const lineBody = "mt-1 block text-bodySm leading-relaxed text-secondary";
const payload = "font-semibold text-primary";

/**
 * `.frow` — a fact, its value, and room for a trailing chip or action.
 *
 * The same anatomy `fieldRow` describes (§5: full-bleed hairlines, square
 * interior corners) and the same classes, spelled out rather than imported
 * because these rows are baseline-aligned around a fixed label column while
 * `fieldRow`'s consumers align to the top of a control.
 */
const factRow = "flex items-baseline gap-4 border-t border-hairline px-4 py-3 first:border-t-0";
const factTerm = "w-32 max-w-[40%] flex-none text-label text-secondary";
const factValue = "min-w-0 flex-1 text-bodyMd text-primary";
const factSub = "mt-0.5 block text-label text-secondary";

/** `.vchip` — the INK verified pill. See the green-rarity note above. */
const verifiedChip =
  "inline-flex flex-none items-center gap-2 self-center whitespace-nowrap rounded-full border border-border-default px-3 py-1 text-label font-semibold text-primary";

/** §4's rail money rows: label left, amount right, baselines aligned. */
const railRow = "flex items-baseline justify-between gap-3 text-bodySm text-secondary";
const railAmount = "num whitespace-nowrap text-bodyMd font-semibold text-primary";

/** The six rails' marks, in `PAYMENT_RAILS` order. */
const RAIL_ICON: Readonly<Record<PaymentRail, ComponentType<{ className?: string }>>> = {
  jazzcash: WalletPhoneIcon,
  "hbl-card": CardIcon,
  easypaisa: WalletPhoneIcon,
  raast: BankTransferIcon,
  "overseas-card": GlobeIcon,
  "cash-on-arrival": CashIcon,
};

export default function ConfirmStep({ slug }: { readonly slug: string }) {
  const { draft, setRail } = useBooking();
  const stayNights = nights(draft.dates);
  const quoted = coversStay(staySubtotal(draft), stayNights);
  const params = useSearchParams();

  /** Focus target for the failure banner's recovery: the group, not the page top. */
  const railsRef = useRef<HTMLDivElement>(null);

  const declined = params.get("payment") === "declined" && draft.rail !== null;
  const declinedRail = draft.rail === null ? null : RAIL_NAME[draft.rail];

  /**
   * The free-cancellation date, derived from what THIS listing publishes rather
   * than from a platform default: gw-004 says "Free cancellation up to 48 hours
   * before check-in", and 48 hours is two days. The guard is not ceremony — a
   * Moderate home gives 5 or 7 days and states its window as prose in the same
   * field, so a home whose published window is not this one shows the policy
   * without a date rather than inheriting a Flexible one it never offered.
   */
  const freeUntil =
    draft.dates && draft.listing.rules.cancellation.bold === "48 hours"
      ? addDays(draft.dates.checkIn, -2)
      : null;

  const guestCount = countedGuests(draft.guests, draft.listing.capacity);
  const home = listingName(draft.listing);

  return (
    <CheckoutStep
      step={4}
      listing={draft.listing}
      heading="Review and confirm"
      sub="Choose how you'd like to pay and check everything once. This is the last step before your wallet or card is charged."
      // BUILD-DECISIONS §1: one step back, not back to the listing.
      backHref={checkoutHref(slug, "price")}
      nextHref={checkoutHref(slug, "confirmation")}
      /*
        §10: Instant Book only, so the primary reads "Confirm and pay" and the
        total rides it — ga-063's first non-negotiable, and the reason a guest
        never has to look away from the button to know what it costs. On a
        declined attempt it becomes the card's retry label, naming the rail that
        turned the payment down.
      */
      nextLabel={
        declined
          ? `Try ${declinedRail} again`
          : quoted
            ? `Confirm and pay · ${formatPkr(QUOTE.total)}`
            : "Confirm and pay"
      }
      nextDisabled={draft.rail === null || !quoted}
      /*
        The blocking reason, earliest first: dates decide the total, so a guest
        with no dates is told about dates rather than about payment methods.
        §11.2 / §12 — the disabled primary explains itself, and it explains the
        thing the guest has to fix first.
      */
      note={
        !quoted ? (
          "Choose your dates to see what you are confirming."
        ) : draft.rail === null ? (
          "Choose how you'd like to pay to continue."
        ) : declined ? (
          "You aren't charged until a payment goes through."
        ) : (
          /*
            The card's `.ctanote`, and it stays JSX because both destinations
            are documents a guest is entitled to open BEFORE agreeing to them.
            A plain string would have flattened them to unlinked words.
          */
          <>
            By confirming you agree to the{" "}
            <Link className={inlineAction} href="/legal/terms">
              Terms
            </Link>{" "}
            and the{" "}
            <Link className={inlineAction} href="/legal/guest-refund-policy">
              guest refund policy
            </Link>
            .
          </>
        )
      }
      showRail
      banner={
        declined || !quoted ? (
          <div className="mb-6 flex flex-col gap-4">
            {declined ? (
              <DeclinedBanner
                rail={declinedRail ?? ""}
                onChooseAnother={() => railsRef.current?.querySelector("input")?.focus()}
              />
            ) : null}
            {!quoted ? <NoQuoteBanner slug={slug} hasDates={draft.dates !== null} /> : null}
          </div>
        ) : undefined
      }
      /*
        §4: steps 1–4 add their own rows ONLY between the summary rows and the
        money. This is the one this step owns — the rail should never make a
        guest scroll back up the form to remember what they chose to pay with.
      */
      railRows={
        draft.rail === null ? undefined : (
          <div className="mt-3.5 flex items-baseline gap-3">
            <span className="min-w-0 flex-1">
              {/* §15: a slot resolves to nothing or it keeps its action, never a
                  different one. "Tried with" is the same slot reporting the same
                  fact after a decline; the choice below it is the change. */}
              <span className={fieldLabel}>{declined ? "Tried with" : "Paying with"}</span>
              <span className="mt-1 block text-bodySm text-primary">{declinedRail}</span>
            </span>
          </div>
        )
      }
      railMoney={<ConfirmMoney quoted={quoted} slug={slug} />}
    >
      <section aria-labelledby="rails-h">
        <h2 id="rails-h" className={stepSectionTitle}>
          How you&apos;d like to pay
        </h2>
        <p className={stepSectionSub}>
          Six ways, all settled through licensed partners in Pakistan.
        </p>

        <div ref={railsRef} className="mt-5">
          <RadioGroup
            name="rail"
            value={draft.rail}
            // No cast: the group only ever emits the values these rows carry,
            // and a lookup proves that rather than asserting it.
            onChange={(value) => {
              const chosen = PAYMENT_RAILS.find((rail) => rail === value);
              if (chosen) setRail(chosen);
            }}
            labelledBy="rails-h"
            describedBy={declined ? "rail-error" : undefined}
            invalid={declined}
            className="max-w-overlay-dialogMd"
          >
            {PAYMENT_RAILS.map((rail) => {
              const Icon = RAIL_ICON[rail];
              return (
                <RadioRow
                  key={rail}
                  value={rail}
                  label={RAIL_NAME[rail]}
                  icon={<Icon className="size-5" />}
                  hint={railHint(rail, quoted)}
                />
              );
            })}
          </RadioGroup>
        </div>

        {declined ? (
          <p id="rail-error" className={fieldErrorLine}>
            <AlertCircleIcon className="mt-0.5 size-4 flex-none" />
            <span>
              <b className="font-semibold">Nothing was deducted.</b> Pick {declinedRail} again
              to retry, or choose another method above.
            </span>
          </p>
        ) : null}

        {/*
          MDR is `expense.mdr.{rail}` and VARIES BY RAIL (ARCHITECTURE.md §6.1),
          so the AMOUNT is named and the rate is not: there is no rate this
          product may quote.
        */}
        <p className={stepHint}>
          <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
          <span>
            <b className={payload}>Processing (MDR) is quoted per method.</b>{" "}
            {quoted ? (
              <>
                The <span className="num">{formatPkr(QUOTE.mdr)}</span> line in your breakdown
                is quoted for the method you choose here.{" "}
              </>
            ) : null}
            Pick a different one and that single line is re-quoted and shown to you before you
            confirm: your total never changes silently.
          </span>
        </p>

        {declined ? (
          /* gw-027's sentence, verbatim, because both surfaces tell one story. */
          <p className={stepHint}>
            <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
            <span>
              Whichever you choose,{" "}
              <b className={payload}>the failed attempt is cancelled first</b>, so a payment can
              never be taken twice for these nights.
            </span>
          </p>
        ) : null}
      </section>

      <section className={stepSection} aria-labelledby="review-h">
        <h2 id="review-h" className={stepSectionTitle}>
          What you&apos;re confirming
        </h2>
        <p className={stepSectionSub}>
          {draft.dates ? (
            <>
              <span>
                <Num>{`${shortDayMonth(draft.dates.checkIn)} → ${shortDate(draft.dates.checkOut)}`}</Num>
              </span>{" "}
              ·{" "}
              <span>
                <Num>{`${stayNights} ${stayNights === 1 ? "night" : "nights"}`}</Num>
              </span>{" "}
              ·{" "}
              <span>
                <Num>{`${guestCount} ${guestCount === 1 ? "guest" : "guests"}`}</Num>
              </span>{" "}
              at {home},{" "}
              <span>
                <Num>{`${draft.listing.place.areaLabel}, ${draft.listing.place.cityLabel}`}</Num>
              </span>
              .
            </>
          ) : (
            <>Your dates and party, as you set them earlier in this flow.</>
          )}
        </p>

        <div className="mt-5 max-w-overlay-dialogMd overflow-hidden rounded-md border border-border-default bg-canvas">
          <div className={factRow}>
            <span className={factTerm}>Identity</span>
            <span className={factValue}>
              {draft.nationality === "pk" ? "CNIC" : "Passport and Pakistan visa"}
            </span>
            <span className={verifiedChip}>
              <CheckMark className="size-4" />
              Verified
            </span>
          </div>

          {draft.party === "family" ? (
            <div className={factRow}>
              <span className={factTerm}>Family booking</span>
              <span className={factValue}>
                Family Registration Certificate
                {draft.guests.children > 0 ? " and B-Form" : ""}
                <span className={factSub}>
                  {draft.guests.children > 0
                    ? "An FRC, and a B-Form for each child on this booking. Both issued by NADRA."
                    : "Issued by NADRA."}
                </span>
              </span>
              <span className={verifiedChip}>
                <CheckMark className="size-4" />
                Verified
              </span>
            </div>
          ) : null}

          <div className={factRow}>
            <span className={factTerm}>Cancellation</span>
            <span className={factValue}>
              {freeUntil === null ? (
                draft.listing.rules.cancellation.heading
              ) : (
                <>
                  Free until{" "}
                  <span>
                    <Num>{shortDayMonth(freeUntil)}</Num>
                  </span>
                </>
              )}
              <span className={factSub}>After that, the guest refund policy applies.</span>
            </span>
            <Link
              className={`${inlineAction} flex-none self-center text-label font-medium`}
              href="/legal/guest-refund-policy"
            >
              Policy
            </Link>
          </div>
        </div>

        {/* §10: Instant Book only. Request-to-book is designed nowhere on web. */}
        <p className={stepHint}>
          <BoltIcon className="mt-0.5 size-4 flex-none text-tertiary" />
          <span>
            <b className={payload}>This home confirms automatically.</b> Your stay is booked the
            moment your payment goes through, and you will not wait on the host.
          </span>
        </p>
      </section>

      <section className={stepSection} aria-labelledby="money-h">
        <h2 id="money-h" className={stepSectionTitle}>
          Where your money goes
        </h2>
        <p className={stepSectionSub}>
          Not straight to the host, and not into a SalamStay account.
        </p>

        <ul className="mt-5 flex max-w-[62ch] flex-col gap-5">
          <li className="flex items-start gap-3">
            <LockIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              {/* Ruling 23: "held in trust". The custody structure is unchanged; the word went. */}
              <span className={lineName}>Held in trust</span>
              <span className={lineBody}>
                It sits in a custody account at Meezan Bank: not spent, not lent out, no
                interest earned on it.
              </span>
            </span>
          </li>

          <li className="flex items-start gap-3">
            <HomeIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Released after you check in</span>
              <span className={lineBody}>
                Your payment is held in trust and released to the host only after you check in.{" "}
                <Link className={inlineAction} href="/help/payments/how-money-is-held">
                  How your payment is held
                </Link>
              </span>
            </span>
          </li>

          <li className="flex items-start gap-3">
            <CustodyIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Never in a SalamStay account</span>
              <span className={lineBody}>
                SalamStay does not hold your money in its own name. Every payment settles
                through a licensed partner: the bank, the wallet operator or the card acquirer.
              </span>
            </span>
          </li>
        </ul>
      </section>
    </CheckoutStep>
  );
}

/**
 * §11.3's page-level error register, in the frame's full-width `banner` slot.
 *
 * The error register, not the warning one, and the distinction is the one
 * `CHECKOUT-SHELL.md` §15 draws: red is for a fact about a transaction or a
 * file, never a verdict on a person. A wallet declining a charge is a fact
 * about the charge.
 */
function DeclinedBanner({
  rail,
  onChooseAnother,
}: {
  readonly rail: string;
  readonly onChooseAnother: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-error-border bg-error-bg p-4"
    >
      <AlertCircleIcon className="mt-0.5 size-5 flex-none text-error" />
      <span>
        <span className="block text-bodySm leading-relaxed text-secondary">
          <b className={payload}>{rail} turned this payment down.</b>{" "}
          <b className={payload}>Nothing was deducted</b> and no booking was made. Try {rail}{" "}
          again, or pay another way. Your price and your dates are still held.
        </span>
        <button
          type="button"
          className={`${inlineAction} mt-1.5 inline-block text-bodySm font-medium`}
          onClick={onChooseAnother}
        >
          Choose another way to pay
        </button>
      </span>
    </div>
  );
}

/** The warning register: nothing went wrong, there is simply nothing to charge for yet. */
function NoQuoteBanner({ slug, hasDates }: { readonly slug: string; readonly hasDates: boolean }) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-lg border border-warning-border bg-warning-bg p-4"
    >
      <AlertTriangleIcon className="mt-0.5 size-5 flex-none text-warning" />
      <span>
        <span className="block text-bodySm leading-relaxed text-secondary">
          <b className={payload}>There is no total to confirm yet.</b> Your dates decide every
          line on this bill, and nothing here is estimated.
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
 * The rail's money slot on this step — §15's amendment: subtotal → aggregated
 * fees → total, and the total is the ONE underlined price on this surface
 * (TASTE §8), because it opens step 3's breakdown and nothing else here does.
 *
 * The fee line is aggregated rather than itemised because §6 gives the
 * itemisation to step 3 and to no other screen; it is named rather than hidden
 * because a subtotal alone on the screen that charges is the drip pricing §6
 * forbids. Both figures come from `QUOTE`, so the three rows cannot disagree
 * with the three rows on step 3.
 */
function ConfirmMoney({ quoted, slug }: { readonly quoted: boolean; readonly slug: string }) {
  if (!quoted) {
    return (
      <p className="rounded-md bg-raised px-3 py-2.5 text-label font-regular leading-relaxed text-secondary">
        Your total is itemised at{" "}
        <b className={payload}>
          step <span className="num">3</span> · Price
        </b>{" "}
        once your dates are set. Nothing is charged until then.
      </p>
    );
  }

  return (
    <>
      <p className={railRow}>
        <span>
          <span className="num">{formatPkr(QUOTE.nightly)}</span> ×{" "}
          <span className="num">{QUOTE.nights}</span> nights
        </span>
        <span className={railAmount}>{formatPkr(QUOTE.stay)}</span>
      </p>
      <p className={`${railRow} mt-3`}>
        <span>Service fee, processing and tax</span>
        <span className={railAmount}>{formatPkr(QUOTE.feesAndTax)}</span>
      </p>
      <p className={`${railRow} mt-3 border-t-2 border-border-default pt-3`}>
        <span className="text-bodyMd font-semibold text-primary">Total (PKR)</span>
        <Link
          href={checkoutHref(slug, "price")}
          className={`${inlineAction} num whitespace-nowrap text-bodyLg font-semibold`}
        >
          {formatPkr(QUOTE.total)}
        </Link>
      </p>

      <p className="mt-3.5 rounded-md bg-raised px-3 py-2.5 text-label font-regular leading-relaxed text-secondary">
        Every line was itemised at{" "}
        <b className={payload}>
          step <span className="num">3</span> · Price
        </b>
        , and the total above links back to it. No hidden charges after this screen.
      </p>
    </>
  );
}

/**
 * What each rail IS — the one-line descriptions, which stay on this screen
 * rather than in `lib/booking/rails.ts` because one of them carries money and
 * has to be built through `formatPkr` as elements rather than stored as a
 * string with a number baked into it.
 *
 * The cash split is ga-058's, and it is the only place on this screen where a
 * figure is broken out: `PKR 37,500` in cash to the host at check-in, and the
 * `PKR 4,850` of fees and tax charged now to confirm the reservation. The same
 * `PKR 42,350` total, two destinations. With no quote covering the guest's
 * stay, the split is described without amounts rather than with borrowed ones.
 */
function railHint(rail: PaymentRail, quoted: boolean) {
  switch (rail) {
    case "jazzcash":
      return "Pay from your JazzCash wallet";
    case "hbl-card":
      return "Debit or credit card issued in Pakistan";
    case "easypaisa":
      return "Pay from your EasyPaisa wallet";
    case "raast":
      return "Instant transfer from a Pakistani bank account";
    case "overseas-card":
      return "For a card issued outside Pakistan. Your booking stays in Pakistani Rupees.";
    case "cash-on-arrival":
      return quoted ? (
        <>
          Hand the host{" "}
          <b className="font-semibold text-primary">
            <span className="num">{formatPkr(QUOTE.stay)}</span>
          </b>{" "}
          in cash at check-in. The <span className="num">{formatPkr(QUOTE.feesAndTax)}</span> in
          fees and tax is charged now, to confirm the reservation.
        </>
      ) : (
        "Hand the host the accommodation in cash at check-in. Fees and tax are charged now, to confirm the reservation."
      );
  }
}
