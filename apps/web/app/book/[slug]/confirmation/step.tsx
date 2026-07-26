"use client";

import { CheckoutStep } from "@/components/booking/checkout-step";
import {
  Acts,
  ActionList,
  ActionRow,
  Banner,
  BannerText,
  CANONICAL,
  Fact,
  Facts,
  Hint,
  InlineLink,
  Outcome,
  PostFlowBody,
  Reference,
  Section,
  trip,
} from "@/components/booking/post-flow";
import { AlertTriangleIcon, CalendarIcon, MessageIcon, PinIcon } from "@/components/icons";
import { FeesReceiptIcon } from "@/components/home-icons";
import { LockIcon } from "@/components/listing/icons";
import { CheckMark } from "@/components/ui/marks";
import { Num } from "@/components/numerals";
import { btnSecondary } from "@/components/ui";
import { useBooking } from "@/lib/booking/booking-state";
import { formatPkr } from "@/lib/money";
import Link from "next/link";

/**
 * GW-026 — the confirmation. The last screen a guest sees after paying, and the
 * only surface in the flow that is allowed to be warm.
 *
 * It is still not allowed to be loud. No confetti, no entrance animation, no
 * stacked exclamation marks: a calm tick, the facts, and what happens next —
 * the register `hw-007`'s published state sets for the host side. The one piece
 * of motion on the page is the shell's press feedback on its own CTA.
 *
 * NO STEPPER, AND `Outcome` IN ITS SLOT
 * -------------------------------------
 * `step={null}`. HANDOFF §7.6a and `CHECKOUT-SHELL` §3 both say post-book
 * screens carry none, and `gw-026`'s ruling 1 says why four filled circles would
 * be the worse of the two options: a stepper answers "where am I in this?", and
 * there is no longer an "in this". `Outcome` takes the slot and the geometry and
 * answers the question that is left — what is true right now.
 *
 * WHAT THIS PAGE READS FROM THE SESSION, AND WHAT IT DOES NOT
 * -----------------------------------------------------------
 * Exactly one thing: the payment rail. **Cash on arrival is a materially
 * different confirmation** — what is owed, when, and to whom — and showing a
 * card confirmation to a guest who chose cash one screen ago would be a lie
 * about money they still have to hand over. That fork is the guest's own answer
 * and the session holds it.
 *
 * Everything else — the dates, the guests, the reference, the amounts — is the
 * canonical booking from `BUILD-DECISIONS`, not the draft, and that is the
 * honest position rather than a shortcut. There is no booking record to read.
 * The amounts are grounded content from `ga-050` and **no fee may be computed**
 * (ruling 14), so a page that printed the guest's own dates beside a total those
 * dates cannot produce would be a confirmation whose arithmetic does not
 * reconcile. One worked example, agreed across all seven cards, is the version
 * of this screen that is true.
 *
 * THE RAIL IS GONE, AND ITS PAYLOAD IS NOT
 * ----------------------------------------
 * `showRail={false}`: post-flow surfaces carry no summary rail. `gw-026`'s
 * ruling 2 keeps it; the administrator seat's brief for this build removes it,
 * on the same rule the host publish screens follow, and that is the later call.
 * Nothing the rail carried is lost — the total moved into the facts group (still
 * the one sanctioned underlined price, TASTE §8, because it opens the receipt),
 * the cancellation deadline into "If your plans change", the custody line into
 * "Where your money is", the CTA and its note into the shell's own footer.
 *
 * ROBOTS: `noindex, follow`, `<main class="co-main">`, no canonical, no
 * hreflang, no JSON-LD, no breadcrumb. All of it the shell's, declared in
 * `page.tsx` off the route registry.
 */

/** The three §5 claim strings this page carries, byte-exact or not at all. */
const CLAIM_TRANSPARENT_FEES =
  "Transparent fees and tax — every rupee shown before you book or earn";

/**
 * The custody sentence, repositioned 2026-07-26. The structure behind it is
 * unchanged — a Meezan custody account, not spent, not lent out, no interest,
 * released after check-in — and `amanah` is retired from what a guest reads
 * (ruling 23).
 */
function MoneyHint() {
  return (
    <Hint icon={<LockIcon className="size-4" />}>
      It sits in a custody account at Meezan Bank — not spent, not lent out, no interest earned
      on it. <InlineLink href="/help/payments/how-money-is-held">How your payment is held</InlineLink>
    </Hint>
  );
}

/**
 * The four ways on from here. Every destination is a registry route today and
 * three of the four are stubs that say they are being written — which is
 * ruling 7's whole point: a booking confirmation that cannot reach a receipt is
 * a worse lie than a stub that admits it is unfinished.
 */
function WhatHappensNext() {
  return (
    <Section
      id="next-h"
      heading="What happens next"
      sub="Your host has your dates. Everything else you might need is here."
    >
      <ActionList>
        <ActionRow
          href="/messages/host-margalla-view"
          icon={<MessageIcon className="size-5" />}
          title={`Message ${CANONICAL.host}`}
          sub="Say salam, ask about check-in. Messages stay inside SalamStay."
        />
        <ActionRow
          href={trip("arrival")}
          icon={<PinIcon className="size-5" />}
          title="Getting there and arrival"
          sub="Directions, check-in time and house rules"
        />
        {/*
          No `download` attribute. The route is a registry stub that serves the
          "being written" page, so a download would save that page to disk under
          an `.ics` name — a file that claims to be a calendar and is not. It
          navigates instead, and the stub says what is true. Restore `download`
          the day the route emits a real calendar file.
        */}
        <ActionRow
          href={trip("booking.ics")}
          icon={<CalendarIcon className="size-5" />}
          title="Add to your calendar"
          sub={<Num>Saves 14–17 Aug as a calendar file</Num>}
        />
        <ActionRow
          href={trip("receipt")}
          icon={<FeesReceiptIcon className="size-5" />}
          title="Receipt and tax invoice"
          sub={CLAIM_TRANSPARENT_FEES}
        />
      </ActionList>
    </Section>
  );
}

/**
 * The cancellation terms. Present on BOTH variants, where the card ships it on
 * the paid panel only — `CHECKOUT-SHELL` §11 lets panels 2–6 abbreviate and the
 * cash panel does, but a shipped page may not: a cash guest with no way to
 * cancel and no deadline in front of them is a worse outcome than a longer page.
 *
 * The refund arithmetic is deliberately absent from the cash variant. What is
 * refundable of a booking whose room cost was never taken is a policy nobody has
 * written, and inventing one on the screen that confirms the booking is exactly
 * the sentence this product exists not to write. The deadline is a fact about
 * the booking either way, so the deadline is what both variants state.
 */
function IfPlansChange({ refundLine }: { readonly refundLine: boolean }) {
  return (
    <Section
      id="change-h"
      heading="If your plans change"
      sub={
        <>
          Free cancellation up to <b className="font-semibold text-primary"><Num>48 hours</Num></b>{" "}
          before check-in — that is until{" "}
          <b className="font-semibold text-primary">
            <Num>{CANONICAL.cancelBy}</Num>
          </b>
          .{refundLine ? " After that the first night is non-refundable and the rest is refunded." : ""}
        </>
      }
    >
      <Acts>
        <Link href={trip("cancel")} className={btnSecondary}>
          Cancel this booking
        </Link>
        <InlineLink href={trip("change")}>Change your dates instead</InlineLink>
      </Acts>
    </Section>
  );
}

/** Stay · dates · check-in · check-out · guests · host · reference. */
function TripFacts({ total }: { readonly total: boolean }) {
  return (
    <Facts>
      <Fact label="Stay" sub={<Num>Entire apartment · F-7, Islamabad</Num>}>
        Margalla View Apartment
      </Fact>
      <Fact label="Dates" sub={<Num>{CANONICAL.nights}</Num>}>
        <Num>{CANONICAL.dates}</Num>
      </Fact>
      <Fact label="Check-in">
        <Num>{CANONICAL.checkIn}</Num>
      </Fact>
      <Fact label="Check-out">
        <Num>{CANONICAL.checkOut}</Num>
      </Fact>
      <Fact label="Guests" sub={<Num>{CANONICAL.guestBreakdown}</Num>}>
        <Num>{CANONICAL.guests}</Num>
      </Fact>
      <Fact label="Host">{CANONICAL.host}</Fact>
      <Fact label="Booking reference">
        <Reference>{CANONICAL.reference}</Reference>
      </Fact>
      {total ? (
        <Fact label="Total paid" sub="Itemised on your receipt">
          {/*
            TASTE §8: a price is underlined only where it opens a breakdown.
            This one does — it is the receipt — which makes it the page's one
            sanctioned price underline, and the itemisation still lives where §6
            puts it rather than being repeated here.
          */}
          <Link href={trip("receipt")} className="font-semibold text-primary underline underline-offset-4">
            <span className="num">{formatPkr(CANONICAL.total)}</span>
          </Link>
        </Fact>
      ) : null}
    </Facts>
  );
}

/** The confirmation a guest who paid online reads. */
function PaidConfirmation() {
  return (
    <>
      <Outcome
        tone="ok"
        icon={<CheckMark className="size-5" />}
        status="Confirmed and paid"
      >
        Booking reference <Reference>{CANONICAL.reference}</Reference> ·{" "}
        <b className="num font-semibold text-primary">{formatPkr(CANONICAL.total)}</b> paid on{" "}
        <Num>{CANONICAL.paidOn}</Num>. Checkout is finished; nothing further is needed from you
        before check-in.
      </Outcome>

      <Section
        id="trip-h"
        heading="Your trip"
        sub="The booking as it now stands. Your host sees the same facts."
      >
        <TripFacts total />
      </Section>

      <WhatHappensNext />

      <Section
        id="money-h"
        heading="Where your money is"
        sub="Your payment is held in trust and released to the host only after you check in."
      >
        <MoneyHint />
      </Section>

      <IfPlansChange refundLine />
    </>
  );
}

/**
 * The cash banner — §11.3's page-level register, handed to the shell's own
 * `banner` slot so it sits above the two-column split at full width rather than
 * inside the column it is about.
 *
 * It leads the page because carrying the exact amount is a thing the guest has
 * to DO, and it names the figure the host may ask for, so that anyone asking for
 * more is visibly asking for the wrong thing.
 */
function CashBanner() {
  return (
    <Banner tone="warning" icon={<AlertTriangleIcon className="size-5" />}>
      <BannerText>
        Carry <b className="num font-semibold text-primary">{formatPkr(CANONICAL.subtotal)}</b> in
        cash for {CANONICAL.host}. The host can only ask for this figure — if anyone asks for more,
        don&apos;t pay it, and tell us.
      </BannerText>
      {/*
        The card draws "Report a problem with this booking" with no href — no
        reporting route is designed or registered. `/help` is written, shipped
        and registered, so the label names where it actually goes. An action that
        names a page nobody has built is not an action.
      */}
      <p className="mt-1.5">
        <InlineLink href="/help">Get help with this booking</InlineLink>
      </p>
    </Banner>
  );
}

/**
 * The confirmation a guest who chose cash on arrival reads — a different page,
 * not the same page with a word swapped.
 *
 * `ga-121` splits the same canonical total the way the product splits it: the
 * SalamStay fee is paid online, the room cost is cash to the host at check-in.
 */
function CashConfirmation() {
  return (
    <>
      <Outcome
        tone="ok"
        icon={<CheckMark className="size-5" />}
        status="Confirmed · service fee paid"
      >
        Booking reference <Reference>{CANONICAL.reference}</Reference>. The SalamStay fee of{" "}
        <b className="num font-semibold text-primary">{formatPkr(CANONICAL.fees)}</b> is paid. The
        room cost of{" "}
        <b className="num font-semibold text-primary">{formatPkr(CANONICAL.subtotal)}</b> is{" "}
        <b className="font-semibold text-primary">not paid yet</b> — it is cash to {CANONICAL.host}{" "}
        when you arrive.
      </Outcome>

      <Section
        id="owed-h"
        heading="What you pay, and when"
        sub="The exact figures, with no rounding. Nothing else is owed online."
      >
        <Facts>
          {/*
            The card's sub reads "SalamStay fee · HBL •••• 8842". The masked card
            is dropped: this guest chose cash on arrival, so the session holds no
            instrument, and printing four digits of a card nobody has on file is
            an invented fact about the guest's own money.
          */}
          <Fact label="Paid now" sub="SalamStay fee">
            <b className="num font-semibold text-primary">{formatPkr(CANONICAL.fees)}</b>
          </Fact>
          <Fact
            label="Due at check-in"
            sub={`Room cost · cash to ${CANONICAL.host}, exact amount`}
          >
            <b className="num font-semibold text-primary">{formatPkr(CANONICAL.subtotal)}</b>
          </Fact>
          <Fact label="Total for your stay" sub="Fee paid + cash at check-in">
            <Link
              href={trip("receipt")}
              className="font-semibold text-primary underline underline-offset-4"
            >
              <span className="num">{formatPkr(CANONICAL.total)}</span>
            </Link>
          </Fact>
        </Facts>
      </Section>

      <Section
        id="trip-h"
        heading="Your trip"
        sub="The booking as it now stands. Your host sees the same facts."
      >
        <TripFacts total={false} />
      </Section>

      <Section
        id="checkin-h"
        heading="At check-in"
        sub="Two steps, and the second one is your host's."
      >
        <ActionList>
          <ActionRow
            icon={<FeesReceiptIcon className="size-5" />}
            title={`Hand ${CANONICAL.host} the cash`}
            sub={
              <>
                Give exactly <span className="num">{formatPkr(CANONICAL.subtotal)}</span> when you
                arrive — nothing online, nothing more.
              </>
            }
          />
          <ActionRow
            icon={<CheckMark className="size-5" />}
            title={`${CANONICAL.host} confirms she received it`}
            sub="She marks the cash as received, and your receipt updates here."
          />
        </ActionList>
      </Section>

      <WhatHappensNext />

      <Section
        id="money-h"
        heading="Where your money is"
        sub="The fee you paid online is held in trust and released to the host only after you check in. The cash never passes through SalamStay."
      >
        <MoneyHint />
      </Section>

      <IfPlansChange refundLine={false} />
    </>
  );
}

export default function ConfirmationStep() {
  const { draft } = useBooking();
  const cash = draft.rail === "cash-on-arrival";
  const listingName = draft.listing.crumbs[draft.listing.crumbs.length - 1]?.name ?? "";

  /*
   * §15 puts the back link one step back inside the flow, and the listing only
   * on step 0. Post-flow there is no step behind this one, so it points where
   * the card points — at the guest's own trips. The shell's `backHref` is not
   * nullable, and a confirmation with no way onward into the rest of the product
   * would be a worse answer than a link that resolves to a stub.
   */
  return (
    <CheckoutStep
      step={null}
      /*
       * GO-LIVE A11. `step={null}` is the same value `/dates` passes, and the
       * two need opposite answers on a cold load: step 0 must never bounce,
       * and this screen must never render. Without this prop the shell reads
       * `null` as "no gated step" and a deep link prints `SS-7F3K9Q` and a
       * total at a guest who has booked nothing. The shell shows "Booking not
       * found" instead — and does NOT redirect, because a confirmation URL a
       * guest kept is not an invitation to start a new booking.
       */
      guard="post-flow"
      listing={draft.listing}
      heading="You're booked"
      sub={
        <>
          Your stay at <b className="font-semibold text-primary">{listingName}</b> is confirmed.
          {cash ? " The room cost is cash to your host at check-in." : ""}
        </>
      }
      backHref="/trips"
      backLabel="Back to your trips"
      nextHref={trip()}
      nextLabel="View your trip"
      nextDisabled={false}
      note={cash ? "Nothing else is owed online." : "We have let your host know."}
      showRail={false}
      {...(cash ? { banner: <CashBanner /> } : {})}
    >
      <PostFlowBody>{cash ? <CashConfirmation /> : <PaidConfirmation />}</PostFlowBody>
    </CheckoutStep>
  );
}
