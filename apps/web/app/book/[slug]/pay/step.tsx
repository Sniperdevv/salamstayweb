"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { CheckoutStep } from "@/components/booking/checkout-step";
import {
  BankTransferIcon,
  CardIcon,
  CashIcon,
  CustodyIcon,
  GlobeIcon,
  LockIcon,
  WalletPhoneIcon,
} from "@/components/booking/pay-glyphs";
import { ShieldCheckIcon } from "@/components/home-icons";
import { AlertTriangleIcon, HomeIcon, InfoIcon } from "@/components/icons";
import { Num, Phrase } from "@/components/numerals";
import { fieldHint, fieldName, inlineAction } from "@/components/ui";
import { nights, staySubtotal, type PaymentRail } from "@/lib/booking/booking";
import { useBooking } from "@/lib/booking/booking-state";
import { QUOTE, coversStay } from "@/lib/booking/quote";
import { RAIL_NAME } from "@/lib/booking/rails";
import { checkoutHref } from "@/lib/content/listings";
import { formatPkr } from "@/lib/money";

/**
 * `/book/{slug}/pay` — the pay moment, step 4 of 4, after a rail is chosen and
 * before anything is handed to it.
 *
 * Sources: `ga-053` (HBL card / 3DS) · `ga-054` (JazzCash) · `ga-055`
 * (EasyPaisa) · `ga-056` (Raast) · `ga-057` (overseas card) · `ga-058` (cash on
 * arrival), all phone frames, translated to the web checkout shell. Contract:
 * `CHECKOUT-SHELL.md` §3 (the stepper), §4 (the rail), §5 (field anatomy), §6
 * (money), §7 (green rarity), §11 (states), with `BUILD-DECISIONS.md` §0 (no
 * ported card CSS), §1 (one step back), §14 (one money formatter) and §23 (the
 * repositioned vocabulary) on top.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WHY THIS IS ONE ROUTE, AND WHY IT IS A ROUTE AT ALL
 * ───────────────────────────────────────────────────────────────────────────
 * The eight cards this build was handed describe one surface and seven states,
 * not eight surfaces. Sorting them is the whole design decision, so it is
 * written down here rather than left in a return message:
 *
 *  · **A route.** Each rail's hand-off screen is a full body with its own back
 *    link — `ga-053`'s app bar reads "Back to payment methods", which is a
 *    navigation, not a dismissal — and the app corpus addresses them directly
 *    (`ga-117` links `/checkout/{slug}/pay/{rail}`). `/confirm` is the REVIEW:
 *    its H1 is "Review and confirm" and its body is the rail chooser, the facts
 *    being agreed to, and where the money goes. Grafting six rail anatomies
 *    onto it would give one route two jobs.
 *  · **One route, not six.** The rail is a fact about the DRAFT, not about the
 *    address. `/pay/jazzcash` would put the same fact in two places, and two
 *    places can disagree — a guest who typed `/pay/raast` having chosen
 *    JazzCash would have to be reconciled by something. On web the alternate-
 *    rail list is `/confirm`'s radiogroup, so nothing here ever needs to
 *    address a rail directly, and the ambiguity buys nothing.
 *  · **The stepper does not move.** `ga-053`, `ga-116` and `ga-117` all draw
 *    step 4 of 4 · Confirm as current on these screens. §3 fixes four circles,
 *    not one route per circle, and `/dates` already proves a route can sit
 *    outside the four.
 *
 * WHAT IS A STATE AND THEREFORE HAS NO ROUTE HERE
 * ----------------------------------------------
 *  · The processing overlay (`ga-053` panel 3, `ga-057` panel 2) and the
 *    wallet app-switch / returned-pending panels (`ga-054`/`ga-055`). The cards
 *    say it in their own headers — "the pay moment becomes a state over the
 *    confirm step, never a route" — and `components/booking/payment-in-flight.tsx`
 *    says why: a URL is a thing a guest can reach twice and a charge is a thing
 *    that must happen once.
 *  · The 3-D Secure challenge (`ga-053` panel 2): a modal above checkout,
 *    served by the bank. Not built. See NOT BUILT below.
 *  · The redirect return and its timeout (`ga-116`): a state read off the URL
 *    the guest LEFT FROM, which is this one. A separate return route would be
 *    reachable only by a gateway redirect, and there is no gateway to issue
 *    one — a route whose sole entrance does not exist is a claim about a
 *    surface nobody can enter.
 *  · The declined / alternate-rail recovery (`ga-117`): already shipped, as
 *    `/confirm?payment=declined`. Banner naming the rail, primary relabelled
 *    "Try {rail} again", the six-row radiogroup as the alternate list. Nothing
 *    to add and nothing to duplicate.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * THE HAND-OFF IS INERT, AND THAT IS THE LABEL
 * ───────────────────────────────────────────────────────────────────────────
 * No gateway exists, so nothing on this page can move money. The register is
 * the one this codebase already ships for exactly this shape — the messages
 * composer's Send that cannot send: the control is **disabled, visible, in
 * place, keeping its own label**, `aria-disabled` so a keyboard user can still
 * land on it and be told why, with the reason and the next action in the
 * `.ctanote` it is described by (TASTE §11.7, `CHECKOUT-SHELL.md` §12).
 *
 * Everything ABOVE the hand-off is true today and is the reason the surface is
 * worth having: your MPIN never leaves the wallet, your card number is
 * tokenised by the acquirer, Raast moves money from your own bank, the rupee
 * price does not become a dollar price, the host may ask for the cash figure on
 * this page and not one rupee more. None of that needed a gateway to be true,
 * and none of it existed anywhere on web before this route.
 *
 * The simulation is therefore of the rail's SHAPE, never of a transaction, and
 * there is no fake wait: a spinner with nothing behind it is a spinner that
 * never ends.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * NOT BUILT, DELIBERATELY — each of these would have to be invented
 * ───────────────────────────────────────────────────────────────────────────
 *  · **Any masked instrument.** `ga-053`'s `•••• 8842`, `ga-054`'s
 *    `0300 ••• 4021`, `ga-055`'s `0345 ••• 1190`, `ga-056`'s `•••• 5567`,
 *    `ga-057`'s `•••• 4487`, `ga-058`'s fee card. A masked number asserts that
 *    a stranger's money is already reachable. `booking.ts` stubs auth with one
 *    constant precisely so no step invents a name, an email or an avatar; this
 *    is the same class of invention on the screen where it is worst.
 *  · **Card, CVV, Raast-ID and IBAN fields.** A form that collects a card
 *    number with nowhere to send it is worse than no form.
 *  · **The 3-D Secure challenge and its OTP boxes.** A realistic-looking bank
 *    challenge is a phishing lesson. The expectation is stated in prose
 *    instead, which is the honest half of `ga-053` panel 2.
 *  · **`ga-056`'s bank picker.** It lists UBL, Alfalah, MCB and ABL, none of
 *    which is named anywhere in this build; only HBL (the acquirer) and Meezan
 *    (the custody account) are. Naming a bank is naming a partner.
 *  · **`ga-057`'s FX lock.** `≈ USD 152.30`, a 15-minute lock and a `14:52`
 *    countdown are an exchange rate, a policy and a clock, and there is no rate
 *    source. The honest paragraph under it survives; the numbers do not.
 *  · **Settlement times.** `ga-056`'s "settles in seconds" is an SLA this
 *    product cannot honour, so Raast is described by what it is rather than by
 *    how fast it will be.
 *  · **`payment-in-flight.tsx`.** Still no consumer, and correctly so — see the
 *    note on `PayNotConnectedBanner`.
 */

/* ————— section recipe — `confirm/step.tsx`'s, verbatim ——————————————————— */

const stepSection = "mt-8 border-t border-hairline pt-8";
const stepSectionTitle = "text-h5 font-semibold text-primary";
const stepSectionSub = "mt-2 max-w-[62ch] text-bodySm text-secondary";
const stepHint =
  "mt-5 flex max-w-[62ch] items-start gap-3 text-label font-regular leading-relaxed text-secondary";
const lineName = "block text-bodyMd font-semibold text-primary";
const lineBody = "mt-1 block text-bodySm leading-relaxed text-secondary";
const payload = "font-semibold text-primary";

/** §4's rail money rows: label left, amount right, baselines aligned. */
const railRow = "flex items-baseline justify-between gap-3 text-bodySm text-secondary";
const railAmount = "num whitespace-nowrap text-bodyMd font-semibold text-primary";

/**
 * `ga-054`'s `.flow` — a numbered procedure, not a numbered section.
 *
 * TASTE §11.20 bans section numbers as an AI tell; these are steps in a thing
 * the guest is about to do, which is what the card draws and what a numeral is
 * for. The discs are `bg.raised` and ink rather than ringed brand, so they read
 * as a list and never compete with the stepper's four circles above them (§7
 * budgets this surface at three greens and the stepper's carve-out; a fifth
 * ringed circle would blur that line even in neutral).
 */
const flowDisc =
  "flex size-8 flex-none items-center justify-center rounded-full bg-raised text-label font-semibold text-primary";

export default function PayStep({ slug }: { readonly slug: string }) {
  const { draft } = useBooking();
  const quoted = coversStay(staySubtotal(draft), nights(draft.dates));
  const rail = draft.rail;
  const confirmHref = checkoutHref(slug, "confirm");

  const railName = rail === null ? null : RAIL_NAME[rail];
  const copy = rail === null ? null : RAIL_COPY[rail];

  return (
    <CheckoutStep
      step={4}
      listing={draft.listing}
      /*
        THE FALLBACK IS THE REGISTRY'S TITLE, WORD FOR WORD, and that is
        mechanical rather than stylistic. `rail` lives in client state, so the
        SERVER always renders the no-rail branch — which is the only HTML a
        crawler or a gate ever sees — and G43 warns when the served H1's words
        are absent from the served title. The per-rail headings below are the
        `/status` precedent (registry title state-neutral, H1 specific) and are
        reached only after hydration.
      */
      heading={copy?.heading ?? "Pay for your stay"}
      sub={
        copy?.sub ??
        "This step describes the payment method chosen at the review. None has been chosen for this booking yet."
      }
      // §15 / ruling 1: back means one step back inside the flow. `/pay` sits
      // behind `/confirm`, which is also where the rail was chosen, so the way
      // back and the way to change your mind are the same door.
      backHref={confirmHref}
      /*
        THE PRIMARY IS DISABLED IN EVERY STATE OF THIS SURFACE, and that is not
        a missing branch. The only thing it could do is spend money, and there
        is nothing behind it to spend. `nextHref` is therefore never used —
        `PrimaryAction` renders a `<button>` with no handler and no href when
        disabled — and it is set to the one destination that would be honest if
        this control ever became a link, so a future reader is not left guessing.
      */
      nextHref={confirmHref}
      nextDisabled
      nextLabel={copy === null ? "Continue" : copy.ctaLabel(quoted)}
      note={
        railName === null ? (
          <Phrase>
            <Link className={inlineAction} href={confirmHref}>
              Choose how you&apos;d like to pay
            </Link>{" "}
            to continue.
          </Phrase>
        ) : (
          <Phrase>
            {railName} is not connected yet, so nothing is charged here.{" "}
            <Link className={inlineAction} href={confirmHref}>
              Choose another way to pay
            </Link>
            .
          </Phrase>
        )
      }
      showRail
      banner={
        railName === null ? (
          <NoRailBanner confirmHref={confirmHref} />
        ) : (
          <PayNotConnectedBanner rail={railName} />
        )
      }
      /*
        §4: steps 1–4 add their own rows ONLY between the summary rows and the
        money. The same slot `/confirm` spends on the chosen rail, saying the
        same thing, so moving between the two screens does not move the fact.
      */
      railRows={
        railName === null ? undefined : (
          <div className="mt-3.5 flex items-baseline gap-3">
            <span className="min-w-0 flex-1">
              <span className="block text-overline uppercase text-tertiary">Paying with</span>
              <span className="mt-1 block text-bodySm text-primary">{railName}</span>
            </span>
          </div>
        )
      }
      railMoney={<PayMoney quoted={quoted} slug={slug} rail={railName} />}
    >
      {rail === null ? <NoRailBody confirmHref={confirmHref} /> : <RailBody rail={rail} quoted={quoted} />}
    </CheckoutStep>
  );
}

/* ————— the label ————————————————————————————————————————————————————————— */

/**
 * §11.3's page-level register, in the frame's full-width `banner` slot — and
 * the reason this surface is a labelled simulation rather than a lie with a
 * footnote. It is unconditional, because the condition it reports is
 * unconditional: there is no gateway on any rail, in any state, ever.
 *
 * The WARNING register, not the error one. `CHECKOUT-SHELL.md` §15 draws that
 * line and it holds here: red is a fact about a transaction or a file, and
 * there is no transaction. Nothing has gone wrong; there is simply nothing
 * behind the door yet, which is the same shape as `/confirm`'s "there is no
 * total to confirm yet".
 *
 * ITS NEXT ACTION IS THE HELP CENTRE, a built page, exactly as the messages
 * composer's is. `CHECKOUT-SHELL.md` §12: never a dead end.
 *
 * WHY `PaymentInFlight` IS STILL NOT MOUNTED, decided here rather than left
 * open: its copy asserts a live conversation with a bank — "Confirming with
 * your bank", "This usually takes a few seconds", "returning will not charge
 * you twice" — and those strings are exported constants shared with a
 * `beforeunload` guard, so they cannot be softened at a call site without
 * splitting the promise on screen from the promise in the browser dialog.
 * Mounting it over a simulation would put the one untrue sentence on this
 * surface inside a modal that scrims and `inert`s everything behind it,
 * including this banner. It stays consumerless until an adapter makes it true.
 */
function PayNotConnectedBanner({ rail }: { readonly rail: string }) {
  return (
    <div
      role="status"
      className="mb-6 flex items-start gap-3 rounded-lg border border-warning-border bg-warning-bg p-4"
    >
      <AlertTriangleIcon className="mt-0.5 size-5 flex-none text-warning" />
      <span>
        <span className="block text-bodySm leading-relaxed text-secondary">
          <b className={payload}>Payments are not connected yet.</b> Nothing on this page can
          charge a card, take money from a wallet or hold a reservation. It sets out what {rail}{" "}
          asks of you, and what SalamStay does and does not see, so that none of it is a
          surprise later.
        </span>
        <Link className={`${inlineAction} mt-1.5 inline-block text-bodySm font-medium`} href="/help">
          Reach the SalamStay team through the help centre
        </Link>
      </span>
    </div>
  );
}

/** A guest who typed this URL, or came back to it after clearing their choice. */
function NoRailBanner({ confirmHref }: { readonly confirmHref: string }) {
  return (
    <div
      role="status"
      className="mb-6 flex items-start gap-3 rounded-lg border border-warning-border bg-warning-bg p-4"
    >
      <AlertTriangleIcon className="mt-0.5 size-5 flex-none text-warning" />
      <span>
        <span className="block text-bodySm leading-relaxed text-secondary">
          <b className={payload}>No payment method is chosen.</b> This step describes the one you
          picked at the review, and nothing has been picked for this booking.
        </span>
        <Link
          className={`${inlineAction} mt-1.5 inline-block text-bodySm font-medium`}
          href={confirmHref}
        >
          Choose how you&apos;d like to pay
        </Link>
      </span>
    </div>
  );
}

function NoRailBody({ confirmHref }: { readonly confirmHref: string }) {
  return (
    <section aria-labelledby="norail-h">
      <h2 id="norail-h" className={stepSectionTitle}>
        Nothing to hand over yet
      </h2>
      <p className={stepSectionSub}>
        Six ways to pay are set out at the review step, with what each one asks of you. Pick one
        there and this page explains it before anything is handed over.
      </p>
      <p className={stepHint}>
        <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
        <span>
          <b className={payload}>Your dates and your price are untouched.</b> Coming back here
          later changes nothing about them.{" "}
          <Link className={inlineAction} href={confirmHref}>
            Back to the review
          </Link>
        </span>
      </p>
    </section>
  );
}

/* ————— the rail bodies ——————————————————————————————————————————————————— */

function RailBody({ rail, quoted }: { readonly rail: PaymentRail; readonly quoted: boolean }) {
  switch (rail) {
    case "jazzcash":
      return <WalletBody wallet="JazzCash" credential="MPIN" quoted={quoted} />;
    case "easypaisa":
      return <WalletBody wallet="EasyPaisa" credential="PIN" quoted={quoted} />;
    case "hbl-card":
      return <CardBody />;
    case "raast":
      return <RaastBody />;
    case "overseas-card":
      return <OverseasCardBody quoted={quoted} />;
    case "cash-on-arrival":
      return <CashBody quoted={quoted} />;
  }
}

/**
 * `ga-054` and `ga-055` are the same card twice — the same three-step round
 * trip, the same trust boundary, one word apart (MPIN / PIN) — so they are one
 * component with that word as a parameter rather than two files that will drift.
 *
 * Translated from the phone: the cards say "we'll open the app on this phone",
 * which is an app-switch. On web the hand-off is a redirect, so the steps say
 * that instead. The promise underneath is unchanged and is the reason this
 * screen exists at all.
 */
function WalletBody({
  wallet,
  credential,
  quoted,
}: {
  readonly wallet: string;
  readonly credential: string;
  readonly quoted: boolean;
}) {
  return (
    <>
      <section aria-labelledby="flow-h">
        <h2 id="flow-h" className={stepSectionTitle}>
          What happens next
        </h2>
        <p className={stepSectionSub}>
          <Num>{`Three moves, and you approve the payment inside ${wallet} rather than here.`}</Num>
        </p>

        <FlowList>
          <FlowItem
            n={1}
            title={`Go to ${wallet}`}
            body={`You leave SalamStay for ${wallet}'s own screen. Your booking stays exactly as it is while you are there.`}
          />
          <FlowItem
            n={2}
            title={`Approve with your ${credential}`}
            body={
              quoted ? (
                <Phrase>
                  {wallet} shows you{" "}
                  <b className={payload}>
                    <span className="num">{formatPkr(QUOTE.total)}</span>
                  </b>{" "}
                  and asks you to confirm it. Check the amount before you do.
                </Phrase>
              ) : (
                `${wallet} shows you the amount and asks you to confirm it. Check it before you do.`
              )
            }
          />
          <FlowItem
            n={3}
            title="Come back here"
            body={`${wallet} returns you to this page, and the booking is confirmed once the payment is matched to it.`}
          />
        </FlowList>
      </section>

      <section className={stepSection} aria-labelledby="boundary-h">
        <h2 id="boundary-h" className={stepSectionTitle}>
          <Num>{`Your ${credential} stays in ${wallet}`}</Num>
        </h2>
        <p className={stepSectionSub}>
          <Num>{`The one line worth reading twice, because it is what tells a real ${wallet} screen from a fake one.`}</Num>
        </p>

        <ul className="mt-5 flex max-w-[62ch] flex-col gap-5">
          <li className="flex items-start gap-3">
            <WalletPhoneIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>
                <Num>{`You type it in ${wallet}, never in SalamStay`}</Num>
              </span>
              <span className={lineBody}>
                <Num>{`SalamStay never sees your ${credential} and never asks for it. If anything wearing our name asks you for it, close it and tell us.`}</Num>
              </span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <ShieldCheckIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Check the amount on their screen</span>
              <span className={lineBody}>
                <Num>{`The figure ${wallet} shows you is the figure you are approving. If it does not match your total here, do not approve it.`}</Num>
              </span>
            </span>
          </li>
        </ul>
      </section>

      <NoDeductionUntil what={`you approve it in ${wallet}`} />
    </>
  );
}

/**
 * `ga-053`, minus its form.
 *
 * The card draws a saved card, an expiry, a CVV and a bank challenge with an
 * OTP in it. All four are refused above, and what is left is not a remainder —
 * it is the part of that card that carries its argument: where the number goes,
 * who holds it, and that a bank challenge is the bank's screen and not ours.
 */
function CardBody() {
  return (
    <>
      <section aria-labelledby="card-h">
        <h2 id="card-h" className={stepSectionTitle}>
          Where your card number goes
        </h2>
        <p className={stepSectionSub}>
          Not into SalamStay. Card details are taken by the acquiring bank on its own secure page.
        </p>

        <ul className="mt-5 flex max-w-[62ch] flex-col gap-5">
          <li className="flex items-start gap-3">
            <CardIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Tokenised by HBL</span>
              <span className={lineBody}>
                The card is secured by our acquiring bank, HBL. SalamStay never sees or stores
                your full card number, and nothing on a SalamStay page is where you type it.
              </span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <ShieldCheckIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Your bank may ask a security question</span>
              <span className={lineBody}>
                Some cards need a 3-D Secure check: your own bank asks you to confirm it is you,
                on its own screen. Many cards clear without one, and nothing extra is asked of you
                when they do.
              </span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CustodyIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Never in a SalamStay account</span>
              <span className={lineBody}>
                The charge settles through the card acquirer into the custody account. SalamStay
                does not hold your money in its own name.{" "}
                <Link className={inlineAction} href="/help/payments/how-money-is-held">
                  How your payment is held
                </Link>
              </span>
            </span>
          </li>
        </ul>
      </section>

      <NoDeductionUntil what="your bank approves the charge" />
    </>
  );
}

/**
 * `ga-056`, minus its bank list and its account fields.
 *
 * The card names six banks and resolves an account to initials. Four of those
 * banks appear nowhere else in this build, and a resolved account is a masked
 * instrument. What survives is what Raast IS and where the approval happens,
 * which is the whole reason a guest would pick it.
 */
function RaastBody() {
  return (
    <>
      <section aria-labelledby="raast-h">
        <h2 id="raast-h" className={stepSectionTitle}>
          A transfer from your own bank account
        </h2>
        <p className={stepSectionSub}>
          Raast is the State Bank of Pakistan&apos;s payment system. No card is involved.
        </p>

        <ul className="mt-5 flex max-w-[62ch] flex-col gap-5">
          <li className="flex items-start gap-3">
            <BankTransferIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Bank to bank, run by the State Bank</span>
              <span className={lineBody}>
                The money moves from your own Pakistani bank account into the custody account. It
                does not pass through a card network, and there is no card number to give anyone.
              </span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <LockIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>You approve it at your own bank</span>
              <span className={lineBody}>
                You choose your bank and confirm the transfer in your bank&apos;s own app or
                portal. SalamStay never asks for your bank login and never sees it.
              </span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CustodyIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Held in trust either way</span>
              <span className={lineBody}>
                However the money arrives, it is held in trust and released to the host only after
                you check in.{" "}
                <Link className={inlineAction} href="/help/payments/how-money-is-held">
                  How your payment is held
                </Link>
              </span>
            </span>
          </li>
        </ul>
      </section>

      <NoDeductionUntil what="you approve the transfer at your bank" />
    </>
  );
}

/**
 * `ga-057`, minus the FX lock.
 *
 * The card's rate, its countdown and its 15-minute lock are three inventions
 * stacked on each other, and its re-quote panel is a fourth. Its honest
 * paragraph — the one that says the conversion is between the guest and their
 * own bank — needs none of them, and is the only thing on that card a diaspora
 * guest actually has to be told.
 */
function OverseasCardBody({ quoted }: { readonly quoted: boolean }) {
  return (
    <>
      <section aria-labelledby="fx-h">
        <h2 id="fx-h" className={stepSectionTitle}>
          The price is in rupees, and stays there
        </h2>
        <p className={stepSectionSub}>
          Your card is issued outside Pakistan. The booking is not.
        </p>

        <ul className="mt-5 flex max-w-[62ch] flex-col gap-5">
          <li className="flex items-start gap-3">
            <GlobeIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Charged in Pakistani Rupees</span>
              <span className={lineBody}>
                {quoted ? (
                  <Phrase>
                    This booking is{" "}
                    <b className={payload}>
                      <span className="num">{formatPkr(QUOTE.total)}</span>
                    </b>{" "}
                    and that is the amount your card is charged. The rupee figure does not become
                    a different currency on the way.
                  </Phrase>
                ) : (
                  "The amount your card is charged is the rupee total for this stay. The rupee figure does not become a different currency on the way."
                )}
              </span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <InfoIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Your bank does the conversion</span>
              <span className={lineBody}>
                Your card issuer converts at its own rate and may add a foreign-transaction fee.
                That is between you and them, and SalamStay neither sets it nor receives it. Your
                statement will show your own currency; your receipt shows the rupee total.
              </span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <ShieldCheckIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Your bank may ask a security question</span>
              <span className={lineBody}>
                Some cards need a 3-D Secure check, on your bank&apos;s own screen. Overseas cards
                are also more often blocked for international charges, and your bank can lift that
                faster than anyone else can.
              </span>
            </span>
          </li>
        </ul>

        {/*
          The one thing this build cannot show, said rather than faked. `ga-057`
          leads with a live rate and a countdown; naming the absence is the only
          honest version of that banner while no rate source exists.
        */}
        <p className={stepHint}>
          <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
          <span>
            <b className={payload}>No estimate in your own currency is shown here.</b> One would
            need a live rate, and quoting a rate this product cannot hold to would be worse than
            leaving it to the bank that actually sets it.
          </span>
        </p>
      </section>

      <NoDeductionUntil what="your bank approves the charge" />
    </>
  );
}

/**
 * `ga-058` — the one rail that splits the money, and the one whose figures are
 * already grounded: `PKR 37,500` in cash to the host at check-in and
 * `PKR 4,850` of fees and tax charged to confirm, the same `PKR 42,350` total
 * with two destinations. `/confirm`'s own rail hint already says this in one
 * line; this is that line with the arithmetic laid out.
 *
 * The fee's destination on the card is a masked card number. It is refused, and
 * nothing replaces it: the row says WHEN it is charged, which is the fact, and
 * not WHERE, which would be the invention.
 */
function CashBody({ quoted }: { readonly quoted: boolean }) {
  return (
    <>
      <section aria-labelledby="split-h">
        <h2 id="split-h" className={stepSectionTitle}>
          Two amounts, one total
        </h2>
        <p className={stepSectionSub}>
          The room cost is cash to your host when you arrive. The fees and tax are charged now, to
          hold the reservation.
        </p>

        {quoted ? (
          <div className="mt-5 max-w-overlay-dialogMd overflow-hidden rounded-md border border-border-default bg-canvas">
            <div className="flex items-baseline gap-4 border-t border-hairline px-4 py-3 first:border-t-0">
              <span className="min-w-0 flex-1">
                <span className={fieldName}>Cash to the host at check-in</span>
                <span className={fieldHint}>The exact amount. Nothing is rounded.</span>
              </span>
              <span className="num flex-none text-bodyMd font-semibold text-primary">
                {formatPkr(QUOTE.stay)}
              </span>
            </div>
            <div className="flex items-baseline gap-4 border-t border-hairline px-4 py-3 first:border-t-0">
              <span className="min-w-0 flex-1">
                <span className={fieldName}>Charged now, to reserve</span>
                <span className={fieldHint}>Service fee, payment processing and sales tax.</span>
              </span>
              <span className="num flex-none text-bodyMd font-semibold text-primary">
                {formatPkr(QUOTE.feesAndTax)}
              </span>
            </div>
          </div>
        ) : (
          <p className={stepHint}>
            <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
            <span>
              <b className={payload}>The split appears once your dates are set.</b> Your dates
              decide the room cost, and nothing here is estimated.
            </span>
          </p>
        )}
      </section>

      <section className={stepSection} aria-labelledby="cashflow-h">
        <h2 id="cashflow-h" className={stepSectionTitle}>
          What happens
        </h2>
        <p className={stepSectionSub}>
          Reserve now, pay the host at the door, and the receipt follows.
        </p>

        <FlowList>
          <FlowItem
            n={1}
            title="Reserve now"
            body={
              quoted ? (
                <Phrase>
                  Your dates and your price are held, and{" "}
                  <b className={payload}>
                    <span className="num">{formatPkr(QUOTE.feesAndTax)}</span>
                  </b>{" "}
                  is charged to confirm the reservation.
                </Phrase>
              ) : (
                "Your dates and your price are held, and the fees and tax are charged to confirm the reservation."
              )
            }
          />
          <FlowItem
            n={2}
            title="Pay the host cash at check-in"
            body={
              quoted ? (
                <Phrase>
                  Hand over{" "}
                  <b className={payload}>
                    <span className="num">{formatPkr(QUOTE.stay)}</span>
                  </b>{" "}
                  when you arrive. Nothing more, and nothing to the host online.
                </Phrase>
              ) : (
                "Hand over the room cost when you arrive. Nothing more, and nothing to the host online."
              )
            }
          />
          <FlowItem
            n={3}
            title="Get your receipt"
            body="Your receipt is issued once the host confirms they have received the cash."
          />
        </FlowList>
      </section>

      <section className={stepSection} aria-labelledby="door-h">
        <h2 id="door-h" className={stepSectionTitle}>
          No surprises at the door
        </h2>
        <p className={stepSectionSub}>
          The cash figure on this page is the only figure the host may ask for.
        </p>

        <ul className="mt-5 flex max-w-[62ch] flex-col gap-5">
          <li className="flex items-start gap-3">
            <CashIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Bring the exact amount</span>
              <span className={lineBody}>
                {quoted ? (
                  <Phrase>
                    The host can only ask for{" "}
                    <b className={payload}>
                      <span className="num">{formatPkr(QUOTE.stay)}</span>
                    </b>
                    . If anyone asks for more, do not pay it, and tell us.{" "}
                    <Link className={inlineAction} href="/help">
                      Reach the SalamStay team through the help centre
                    </Link>
                  </Phrase>
                ) : (
                  <>
                    The host can only ask for the room cost shown on your booking. If anyone asks
                    for more, do not pay it, and tell us.{" "}
                    <Link className={inlineAction} href="/help">
                      Reach the SalamStay team through the help centre
                    </Link>
                  </>
                )}
              </span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <HomeIcon className="mt-0.5 size-5 flex-none text-secondary" />
            <span>
              <span className={lineName}>Your dates are held from the moment you reserve</span>
              <span className={lineBody}>
                These nights and this price are not offered to anyone else while your reservation
                stands.
              </span>
            </span>
          </li>
        </ul>
      </section>
    </>
  );
}

/* ————— shared parts —————————————————————————————————————————————————————— */

function FlowList({ children }: { readonly children: ReactNode }) {
  return <ol className="mt-5 flex max-w-[62ch] list-none flex-col gap-5">{children}</ol>;
}

function FlowItem({
  n,
  title,
  body,
}: {
  readonly n: number;
  readonly title: string;
  readonly body: ReactNode;
}) {
  return (
    <li className="flex items-start gap-3.5">
      <span aria-hidden="true" className={flowDisc}>
        <span className="num">{n}</span>
      </span>
      <span className="min-w-0">
        <span className={lineName}>
          <Num>{title}</Num>
        </span>
        <span className={lineBody}>{typeof body === "string" ? <Num>{body}</Num> : body}</span>
      </span>
    </li>
  );
}

/**
 * The sentence every rail card ends on — "nothing is charged until you approve
 * it" — which is true of the real rail AND true of this build, for different
 * reasons. Both reasons are stated, because saying only the first on a page
 * that cannot charge anything would be technically true and practically a lie.
 */
function NoDeductionUntil({ what }: { readonly what: string }) {
  return (
    <p className={stepHint}>
      <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
      <span>
        <b className={payload}>Nothing is deducted until {what}.</b> On this build nothing is
        deducted at all: no payment method is connected, so the button below stays inactive and
        your booking is not placed from here.
      </span>
    </p>
  );
}

/**
 * §4/§6 and §15's amendment, matching `/confirm`: subtotal, aggregated fees,
 * then the total as the ONE underlined price on the surface (TASTE §8), because
 * it opens step 3's itemisation and nothing else here does.
 *
 * Every figure comes from `QUOTE`, which is the module that throws if the three
 * published numbers stop reconciling with `/legal/guest-refund-policy`, so this
 * rail and `/confirm`'s cannot disagree about what a guest owes. The prose
 * differs because the surfaces differ: `/confirm` says the total was itemised
 * at step 3, and this one says what would be asked for, since nothing is.
 *
 * FOLLOW-UP FOR WHOEVER OWNS BOTH FILES: these three rows are now written
 * twice. They should be one component in `components/booking/`, hoisted out of
 * `confirm/step.tsx`. It was not done here because that file belongs to another
 * agent this wave and a shared component landing in a file two agents are
 * editing is a merge conflict over money.
 */
function PayMoney({
  quoted,
  slug,
  rail,
}: {
  readonly quoted: boolean;
  readonly slug: string;
  readonly rail: string | null;
}) {
  if (!quoted) {
    return (
      <p className="rounded-md bg-raised px-3 py-2.5 text-label font-regular leading-relaxed text-secondary">
        <Phrase>
          Your total is itemised at{" "}
          <b className={payload}>
            step <span className="num">3</span> · Price
          </b>{" "}
          once your dates are set. Nothing is charged until then.
        </Phrase>
      </p>
    );
  }

  return (
    <>
      <p className={railRow}>
        <span>
          <Phrase>
            <span className="num">{formatPkr(QUOTE.nightly)}</span> ×{" "}
            <span className="num">{QUOTE.nights}</span> nights
          </Phrase>
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
        {rail === null ? (
          "This is the total for these nights. Nothing has been charged."
        ) : (
          <Phrase>
            <b className={payload}>Nothing has been charged.</b> This is the amount {rail} would
            be asked for, and the total above links back to how it was reached.
          </Phrase>
        )}
      </p>
    </>
  );
}

/* ————— per-rail page copy ————————————————————————————————————————————————— */

interface RailCopy {
  readonly heading: string;
  readonly sub: string;
  /** `ga-053`/`ga-058` put money on the button; the wallets and Raast do not. */
  readonly ctaLabel: (quoted: boolean) => string;
}

/**
 * Headings, subs and the label the disabled primary keeps.
 *
 * TASTE §11.7 is "same label" — a control that cannot act still says what it
 * would do, so the guest is told what is unavailable rather than shown a
 * different, smaller button. The money on the card rails' labels is `/confirm`'s
 * own idiom (`Confirm and pay · PKR 42,350`) and matches it deliberately.
 */
const RAIL_COPY: Readonly<Record<PaymentRail, RailCopy>> = {
  jazzcash: {
    heading: "Pay with JazzCash",
    sub: "You approve this payment inside the JazzCash app, then come back here.",
    ctaLabel: () => "Continue to JazzCash",
  },
  "hbl-card": {
    heading: "Pay by card",
    sub: "A debit or credit card issued in Pakistan, taken by our acquiring bank.",
    ctaLabel: (quoted) => (quoted ? `Pay · ${formatPkr(QUOTE.total)}` : "Pay"),
  },
  easypaisa: {
    heading: "Pay with EasyPaisa",
    sub: "You approve this payment inside the EasyPaisa app, then come back here.",
    ctaLabel: () => "Continue to EasyPaisa",
  },
  raast: {
    heading: "Pay with Raast",
    sub: "A transfer straight from your own Pakistani bank account. No card involved.",
    ctaLabel: () => "Continue to Raast",
  },
  "overseas-card": {
    heading: "Pay with an overseas card",
    sub: "For a card issued outside Pakistan. Your booking stays in Pakistani Rupees.",
    ctaLabel: (quoted) => (quoted ? `Pay · ${formatPkr(QUOTE.total)}` : "Pay"),
  },
  "cash-on-arrival": {
    heading: "Pay the host in cash at check-in",
    sub: "You reserve online now, and hand the host the room cost when you arrive.",
    ctaLabel: () => "Reserve · pay cash at check-in",
  },
};
