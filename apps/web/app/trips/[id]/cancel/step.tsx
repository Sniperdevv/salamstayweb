"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CheckMark } from "@/components/ui/marks";
import { RadioGroup, RadioRow } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Num } from "@/components/numerals";
import {
  btnBase,
  btnLg,
  btnPrimary,
  btnSecondary,
  focusRing,
  inlineAction,
  pressable,
} from "@/components/ui";
import { QUOTE } from "@/lib/booking/quote";
import { TRIP, type RefundOutcome, tripPath } from "@/lib/booking/trip-record";
import { formatPkr } from "@/lib/money";

import { ExampleBookingStrip, TripBackLink, TripPageHead, TripSection } from "../trip-chrome";

/**
 * GA-105's flow, at web width — reason → review → cancelled.
 *
 * WHY THREE STATES ON ONE ROUTE AND NOT THREE ROUTES
 * --------------------------------------------------
 * The card draws three phone screens and the registry carries one path. Three
 * routes would need three registry entries, three titles and three `<h1>`s for
 * one task, and would let a guest deep-link straight to the confirm step with
 * no reason chosen and no ledger read — which is the failure mode GO-LIVE A11
 * describes on the checkout side. One route, one record, state in the client.
 *
 * WHY THE LEDGER IS A PROP AND NOT A COMPUTATION
 * ----------------------------------------------
 * `page.tsx` computes it once, from one clock, for today. See its header.
 *
 * THE ORDER OF THE SCREEN IS THE ARGUMENT
 * ---------------------------------------
 * `ga-105`'s note: the refund is "shown literally before any confirmation" —
 * what comes back, what does not, the computed total, and only then an action.
 * Nothing on this screen says "you may be charged": every figure a guest could
 * be charged is on the page as a rupee amount before the destructive control
 * exists at all.
 *
 * GREEN BUDGET (GUEST-SHELL.md §8): one enabled primary per state, never two.
 * Step 1 spends it on **Continue**; step 2 spends it on **Keep my booking**,
 * which is `ga-105`'s ruling — cancelling stays one tap away, just never the
 * visually loudest one, because it is the irreversible half. The cancelled state
 * spends nothing.
 */

type Stage = "reason" | "confirm" | "cancelled";

/**
 * `ga-105`'s reason list, unchanged. Plain and non-judgmental: no option implies
 * fault, on either side. "Something else" is last because it is the fallback,
 * not because it is least important.
 */
const REASONS = [
  { id: "plans", label: "My plans changed" },
  { id: "dates", label: "The dates are wrong" },
  { id: "another", label: "I found another stay" },
  { id: "emergency", label: "A family emergency" },
  { id: "other", label: "Something else" },
] as const;

const payload = "font-semibold text-primary";

/** The `bg.raised` info strip — TASTE §6, one of its five jobs. Payload only bolded. */
const strip =
  "rounded-md bg-raised px-4 py-3 text-bodySm font-regular leading-relaxed text-secondary";

export default function CancelFlow({
  outcome,
  stayRange,
  freeUntilLabel,
}: {
  readonly outcome: RefundOutcome;
  readonly stayRange: string;
  /** `"Wed 12 Aug 2026, 2:00 PM"` — the hour the free window closes, not the day. */
  readonly freeUntilLabel: string;
}) {
  const [stage, setStage] = useState<Stage>("reason");
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const mounted = useRef(false);

  /*
    The step changes in place, so nothing moves the reader — the button they
    pressed simply stops existing and a screen reader is left on nothing. Moving
    focus to the new heading is the navigation this route does not perform.

    Skipped on mount: focusing an `<h1>` on first paint would scroll a fresh page
    to a heading the reader had not asked to be at.
  */
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [stage]);

  const insideWindow = outcome.stage === "full";
  const refundLabel = formatPkr(outcome.total);

  if (stage === "cancelled") {
    return (
      <>
        <TripBackLink href="/trips">Your trips</TripBackLink>

        <TripPageHead
          className="mt-5"
          headingRef={headingRef}
          title="Booking cancelled"
          sub={
            <>
              <span>
                <Num>{`${TRIP.home}, ${stayRange}`}</Num>
              </span>{" "}
              is cancelled, and {TRIP.host} has been told.
            </>
          }
        />

        <ExampleBookingStrip className="mt-6">
          Nothing was cancelled and no refund was started — this step saves nothing.
        </ExampleBookingStrip>

        {/*
          `ga-105`: "a quiet outline tick, not a celebration — this is a
          cancellation, not a win." Neutral, never the success register, and
          never green: §8 budgets green at three roles and a confirmation glyph
          is none of them.
        */}
        <div className="mt-8 flex max-w-[62ch] items-start gap-4 border-t border-hairline pt-6">
          <span
            aria-hidden="true"
            className="grid size-11 flex-none place-items-center rounded-full border border-border-default bg-sunken text-secondary"
          >
            <CheckMark className="size-5" />
          </span>
          <div>
            <p className="text-bodyMd font-semibold text-primary">
              <span className="num">{refundLabel}</span> is coming back to you
            </p>
            <p className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">
              Refunds return to the same card, wallet, or bank account you paid with. You do not
              choose a different destination and you do not need to ask for it.
            </p>
          </div>
        </div>

        <div className="mt-8 flex max-w-[62ch] flex-wrap items-center gap-x-6 gap-y-3 border-t border-hairline pt-6">
          <Link href="/search" className={`${btnSecondary} no-underline`}>
            Find another stay
          </Link>
          <Link href="/trips" className={`${inlineAction} text-bodySm font-medium`}>
            Back to your trips
          </Link>
          <Link
            href="/legal/guest-refund-policy"
            className={`${inlineAction} text-bodySm font-medium`}
          >
            How refunds reach you
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <TripBackLink href={tripPath()}>Your trip</TripBackLink>

      <TripPageHead
        className="mt-5"
        headingRef={headingRef}
        title="Cancel your booking"
        sub={
          stage === "reason" ? (
            <>
              Two short steps. Nothing is cancelled here — the next one shows exactly what comes
              back, to the rupee, before you decide anything.
            </>
          ) : (
            <>
              What cancelling costs and what comes back, for today&rsquo;s date. Read it, then
              choose.
            </>
          )
        }
      />

      <ExampleBookingStrip className="mt-6">
        Nothing here cancels a real reservation or moves any money.
      </ExampleBookingStrip>

      {stage === "reason" ? (
        <ReasonStep
          reason={reason}
          onReason={setReason}
          note={note}
          onNote={setNote}
          onContinue={() => setStage("confirm")}
        />
      ) : (
        <ConfirmStep
          outcome={outcome}
          stayRange={stayRange}
          freeUntilLabel={freeUntilLabel}
          insideWindow={insideWindow}
          refundLabel={refundLabel}
          hasNote={note.trim() !== ""}
          onBack={() => setStage("reason")}
          onCancel={() => setStage("cancelled")}
        />
      )}
    </>
  );
}

/* ——— step 1 ——————————————————————————————————————————————————————————————— */

function ReasonStep({
  reason,
  onReason,
  note,
  onNote,
  onContinue,
}: {
  readonly reason: string | null;
  readonly onReason: (value: string) => void;
  readonly note: string;
  readonly onNote: (value: string) => void;
  readonly onContinue: () => void;
}) {
  return (
    <>
      <TripSection
        id="reason"
        heading="Why are you cancelling?"
        sub="There is no wrong answer, and no answer here affects your refund. This one goes to SalamStay, not to your host."
        className="mt-8"
      >
        <RadioGroup
          name="cancel-reason"
          value={reason}
          onChange={onReason}
          labelledBy="reason-h"
          className="mt-4"
        >
          {REASONS.map((r) => (
            <RadioRow key={r.id} value={r.id} label={r.label} />
          ))}
        </RadioGroup>
      </TripSection>

      <TripSection id="note" heading={`A note for ${TRIP.host}`} className="mt-8">
        <Textarea
          className="mt-4 max-w-overlay-dialogMd"
          id="cancel-note"
          label="Anything you would like her to know?"
          hint={`Optional. ${TRIP.host} reads this exactly as you write it, alongside the cancellation.`}
          value={note}
          onChange={onNote}
          rows={4}
        />
      </TripSection>

      <div className="mt-8 flex max-w-[62ch] flex-wrap items-center gap-x-6 gap-y-3 border-t border-hairline pt-6">
        {/*
          The step's one primary. It advances to the ledger; it does not cancel
          anything, and the sub line above already said so — a button that
          advanced straight to a cancellation would make the reason picker the
          confirmation, which is the shape this flow exists to avoid.
        */}
        <button
          type="button"
          onClick={onContinue}
          disabled={reason === null}
          className={`${btnBase} ${btnLg} ${
            reason === null
              ? "cursor-default border-border-default bg-raised text-disabled"
              : btnPrimary
          }`}
        >
          See what comes back
        </button>

        <Link href={tripPath()} className={`${inlineAction} text-bodySm font-medium`}>
          Never mind, keep my booking
        </Link>
      </div>

      {/*
        §12: a disabled control explains itself and names what to do. Plain, never
        scolding — GUEST-SHELL.md §13's "the tone is a colleague's".
      */}
      {reason === null ? (
        <p className="mt-3 max-w-[62ch] text-bodySm font-regular text-secondary">
          Pick a reason above to see your refund.
        </p>
      ) : null}
    </>
  );
}

/* ——— step 2 ——————————————————————————————————————————————————————————————— */

function ConfirmStep({
  outcome,
  stayRange,
  freeUntilLabel,
  insideWindow,
  refundLabel,
  hasNote,
  onBack,
  onCancel,
}: {
  readonly outcome: RefundOutcome;
  readonly stayRange: string;
  readonly freeUntilLabel: string;
  readonly insideWindow: boolean;
  readonly refundLabel: string;
  readonly hasNote: boolean;
  readonly onBack: () => void;
  readonly onCancel: () => void;
}) {
  return (
    <>
      <TripSection id="booking" heading="You're cancelling" className="mt-8">
        <dl className="mt-4 max-w-[62ch] overflow-hidden rounded-md border border-border-default bg-canvas">
          <SummaryRow label="Stay" value={TRIP.home} />
          <SummaryRow label="Dates" value={stayRange} numerals />
          <SummaryRow label="Paid" value={formatPkr(QUOTE.total)} money />
        </dl>

        {/*
          The policy, named and dated. The listing this guest booked from
          publishes it in these words — "Cancellation: Flexible · Free
          cancellation up to 48 hours before check-in" — so the screen states the
          window rather than paraphrasing it, and states the HOUR it closes,
          because a window that closes at an hour and is quoted as a day is how
          somebody gets charged for a night at nine in the evening.
        */}
        <p className={`mt-4 max-w-[62ch] ${strip}`}>
          {insideWindow ? (
            <>
              This home is on the <b className={payload}>{TRIP.policy}</b> policy: free
              cancellation until{" "}
              <b className={payload}>
                <Num>{freeUntilLabel}</Num>
              </b>
              , <Num>{`${TRIP.freeCancellationHours} hours`}</Num> before check-in. Today you are
              inside that window, so everything you paid comes back.
            </>
          ) : (
            <>
              This policy&rsquo;s free-cancellation window closed{" "}
              <b className={payload}>
                <Num>{freeUntilLabel}</Num>
              </b>
              . Cancelling now, the first night is non-refundable — everything else comes back,
              exactly as below.
            </>
          )}
        </p>
      </TripSection>

      <TripSection id="refund" heading="What comes back" className="mt-8">
        {/*
          A real ledger, not a summary. Refunded lines carry the muted success
          figure; the lines that are kept sit in quiet grey — `ga-034`'s no-refund
          treatment, and never red. GUEST-SHELL.md §6: a cancellation is a fact,
          not a fault, and nothing on this page accuses anyone of anything.
        */}
        <div className="mt-4 max-w-[62ch]">
          {outcome.lines.map((line, i) => (
            <div
              key={line.id}
              className={`flex items-start justify-between gap-4 py-3 ${
                i === 0 ? "" : "border-t border-hairline"
              }`}
            >
              <span className="min-w-0">
                <span
                  className={`block text-bodySm font-medium ${
                    line.refunded ? "text-primary" : "text-tertiary"
                  }`}
                >
                  <Num>{line.title}</Num>
                </span>
                <span
                  className={`mt-0.5 block text-label font-regular leading-normal ${
                    line.refunded ? "text-secondary" : "text-tertiary"
                  }`}
                >
                  <Num>{line.note}</Num>
                </span>
              </span>
              <span
                className={`num shrink-0 whitespace-nowrap text-bodySm font-semibold ${
                  line.refunded ? "text-success" : "text-tertiary"
                }`}
              >
                {formatPkr(line.amount)}
              </span>
            </div>
          ))}

          <div className="mt-1 flex items-baseline justify-between gap-4 border-t-2 border-border-default pt-3">
            <span className="text-bodyMd font-semibold text-primary">Total refund</span>
            <span className="num whitespace-nowrap text-bodyLg font-semibold text-success">
              {refundLabel}
            </span>
          </div>
        </div>

        {/*
          What changes, and when — the honest complement to a full refund. Both
          figures are published: `/legal/guest-refund-policy`'s worked example is
          written against this exact booking and reads `25,000 refunded + 12,500
          first night + 4,850 fee and taxes = 42,350 paid`. Nothing is estimated
          and no percentage appears, because none is published anywhere.
        */}
        {insideWindow ? (
          <p className="mt-4 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
            After{" "}
            <b className={payload}>
              <Num>{freeUntilLabel}</Num>
            </b>{" "}
            this changes: the first night, <span className="num">{formatPkr(QUOTE.nightly)}</span>,
            and <span className="num">{formatPkr(QUOTE.feesAndTax)}</span> in fee and tax are kept,
            and{" "}
            <span className="num">
              {formatPkr(QUOTE.total - QUOTE.nightly - QUOTE.feesAndTax)}
            </span>{" "}
            comes back.
          </p>
        ) : null}

        <p className="mt-4 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
          Refunds return to the same card, wallet, or bank account you paid with.{" "}
          <Link href="/legal/guest-refund-policy" className={`${inlineAction} font-medium`}>
            How refunds reach you
          </Link>
        </p>
      </TripSection>

      <TripSection
        id="host"
        heading={`What ${TRIP.host} sees`}
        className="mt-8"
      >
        <p className="mt-4 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
          {TRIP.host} is told the booking is cancelled and{" "}
          <span>
            <Num>{stayRange}</Num>
          </span>{" "}
          goes back on her calendar.{" "}
          {hasNote ? (
            <>
              She reads the note you wrote, exactly as you wrote it. The reason you picked goes to
              SalamStay, not to her.
            </>
          ) : (
            <>
              She sees that you cancelled and nothing more — the reason you picked goes to
              SalamStay, not to her.
            </>
          )}
        </p>

        <p className="mt-3 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
          <b className={payload}>Cancelling cannot be undone.</b> To stay on these dates you would
          have to book the home again, and it may be taken by then.
        </p>
      </TripSection>

      <div className="mt-8 max-w-[62ch] border-t border-hairline pt-6">
        {/*
          `ga-105`: "Keep my booking is the visually prominent, filled default;
          cancelling is still one tap away, just never the visually loudest one."
          It is a link, not a button — keeping the booking is going back to it.
        */}
        <Link href={tripPath()} className={`${btnBase} ${btnLg} ${btnPrimary} w-full no-underline`}>
          Keep my booking
        </Link>

        {/*
          The irreversible half, in the muted error register and naming the exact
          amount, so the press is never a surprise. A `<button>`, not a link: it
          performs an action rather than going somewhere.
        */}
        <button
          type="button"
          onClick={onCancel}
          className={`mt-3 flex min-h-11 w-full items-center justify-center rounded-md px-4 text-bodySm font-semibold text-error hover:bg-error-bg ${focusRing} ${pressable}`}
        >
          {/*
            ONE `<span>`, not three children. BUILD-DECISIONS #22, found live:
            this button is a flex container, so a bare text node beside a
            `.num` span becomes a second flex item and the space between them
            renders as a gap inside the sentence. The whole label is one inline
            child; the isolation happens inside it.
          */}
          <span>
            Cancel this booking · <span className="num">{refundLabel}</span> refunded
          </span>
        </button>

        <button
          type="button"
          onClick={onBack}
          className={`${inlineAction} mt-4 inline-block text-bodySm font-medium`}
        >
          Back to the reason
        </button>
      </div>
    </>
  );
}

/** One labelled fact in the "You're cancelling" group. */
function SummaryRow({
  label,
  value,
  numerals = false,
  money = false,
}: {
  readonly label: string;
  readonly value: string;
  readonly numerals?: boolean;
  readonly money?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 border-t border-hairline px-4 py-3 first:border-t-0 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-24 shrink-0 text-bodySm text-secondary">{label}</dt>
      <dd className={`text-bodySm font-medium text-primary ${money ? "num" : ""}`}>
        {numerals ? (
          <span>
            <Num>{value}</Num>
          </span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
