"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import { overlaySize } from "@salamstay/design-tokens/layout";

import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ClockIcon,
  InfoIcon,
  LockIcon,
  MessageIcon,
} from "@/components/icons";
import { Num } from "@/components/numerals";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { RadioGroup, RadioRow } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CheckMark } from "@/components/ui/marks";
import {
  btnSecondary,
  focusRing,
  hostFieldLabel,
  inlineAction,
  pressable,
} from "@/components/ui";
import { hostPrimaryPill } from "@/components/host/host-ui";

import {
  EarningsBreakdown,
  GuestAvatar,
  SampleDataStrip,
  StatusChip,
  VerifiedChip,
} from "../reservation-parts";
import { STATUS_LABEL, reservationTitle, type Reservation } from "../reservations";

/**
 * HA-048 (the reservation) and HA-049 (the decision), on one web route.
 *
 * WHY THE TWO CARDS COLLAPSE INTO ONE PAGE
 * ----------------------------------------
 * On the phone they are two screens because a phone cannot hold the request and
 * the decision at once: `ha-048` ends in `Review & respond`, which pushes
 * `ha-049` on top of it and repeats the guest, the listing and the dates in its
 * own header so the host can still see what they are deciding about. At web
 * width there is nothing to push. The facts and the two buttons fit on one
 * screen, and a host who can see the dates, the note and the payout WHILE they
 * press Accept is better informed than one who had to remember them across a
 * navigation. So `ha-049`'s summary header is not reproduced — the page it
 * would summarise is directly above it.
 *
 * WHY THE WHOLE PAGE IS A CLIENT COMPONENT
 * ----------------------------------------
 * Accepting or declining changes the status pill at the top, the heading, and
 * the block at the foot. Splitting the static half onto the server would leave
 * those three in two trees with no shared state and a pill that went stale the
 * moment the host pressed a button. `./page.tsx` stays a Server Component and
 * keeps `generateMetadata`, which is the part that actually cannot cross the
 * boundary.
 *
 * COPY THAT IS NOT THE CARDS', AND WHY — `HOST-SHELL.md` §0.2 forbids copying
 * an `ha-*` card forward without checking `REPOSITIONING.md`:
 *  · `Service fee (wakala)` → `Service fee`; `held in amanah` → `held in trust`.
 *  · `ha-049`'s decline note ties "declining is okay" to a **response rate**.
 *    No response rate, acceptance rate or reply-time figure is computed, stored
 *    or displayed anywhere in this product, and a reassurance that leans on an
 *    invented metric is an invented metric. The reassurance is kept and the
 *    metric is dropped.
 *  · `ha-048`'s `View Fatima's profile`, `Message Fatima` and `Guest
 *    registration` point at three surfaces nobody has built. A live link into a
 *    404 is worse than no link, so the affordances are gone and the one fact
 *    they carried that matters before a decision — contact details stay private
 *    until the booking is confirmed — is stated as the plain sentence it is.
 */

type Decision = "pending" | "accepted" | "declined";

interface DeclineReason {
  readonly value: string;
  readonly label: string;
  readonly hint: string;
}

/**
 * `ha-049`'s three, and they are **internal categorisation only**. The guest
 * never reads one of these strings; the preview block below shows the host
 * exactly what does reach them, which is the same sentence whichever row is
 * picked. That is the whole reason the reason list can be this blunt.
 */
const DECLINE_REASONS: readonly DeclineReason[] = [
  {
    value: "dates",
    label: "Dates unavailable",
    hint: "These dates do not work for this listing.",
  },
  {
    value: "not-suitable",
    label: "Not the right fit",
    hint: "The listing is not suited to this booking.",
  },
  {
    value: "other",
    label: "Something else",
    hint: "Add a note below if you would like to.",
  },
];

/**
 * `ha-049`'s `.btn.outline-error` — an outline in the error register, on
 * `bg.canvas`, for the one control on this surface that ends something.
 *
 * NOT green and not the §5 gray-fill. Green is the accept, and a decline
 * wearing the same fill as an accept is the single worst button on this page.
 * Gray-fill would make the irreversible action look like `Show more`. The error
 * register is doing what `BUILD-DECISIONS` #11 permits it to do — marking a
 * consequence, on an action, about a set of dates. There is no red mark on the
 * guest anywhere: the person, their name and their documents stay neutral, and
 * the preview block spells out that what they read is not a rejection of them.
 */
const declineConfirmButton =
  "inline-flex h-12 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md " +
  `border border-error-border bg-canvas px-6 text-bodyMd font-semibold text-error hover:bg-error-bg ${focusRing} ${pressable}`;

/** TASTE §11.7 / `HOST-SHELL.md` §5: same size, same place, same label. */
const declineConfirmDisabled =
  "inline-flex h-12 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md " +
  `border border-transparent bg-raised px-6 text-bodyMd font-semibold text-disabled ${focusRing}`;

/** A section rule — `hw-001`'s `.fsec`: hairline top, `space-7` above and below. */
const section = "mt-7 border-t border-hairline pt-7";
const sectionHeading = "text-h5 font-semibold text-primary";

export default function ReservationDetail({ reservation: r }: { readonly reservation: Reservation }) {
  const [decision, setDecision] = useState<Decision>("pending");
  const [declining, setDeclining] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const declineTrigger = useRef<HTMLButtonElement>(null);
  const outcomeHeading = useRef<HTMLHeadingElement>(null);
  const baseId = useId();
  const reasonLabelId = `${baseId}-reason`;
  const dialogTitleId = `${baseId}-decline`;

  const isRequest = r.status === "request";

  /*
   * Focus follows the outcome. The host pressed a button and the page answered
   * three screenfuls further down; without this a screen-reader user is left
   * with their cursor on a control that no longer exists. A heading with
   * `tabIndex={-1}` is the standard landing place — it announces the outcome
   * and puts the reading position at the top of what changed.
   *
   * No entrance animation on the block itself, deliberately. `HOST-SHELL.md`
   * §10 already bans one on a surface the host will revisit, and the register
   * matters more than the rule here: a decline is a small disappointment for
   * somebody, and animating it in would be the product being pleased with
   * itself. The dialog's own exit and the button's press are the motion this
   * interaction gets.
   */
  useEffect(() => {
    if (decision === "pending") return;
    outcomeHeading.current?.focus();
  }, [decision]);

  const chosenReason = DECLINE_REASONS.find((entry) => entry.value === reason);

  const confirmDecline = () => {
    if (chosenReason === undefined) return;
    setDeclining(false);
    setDecision("declined");
  };

  const pill =
    decision === "accepted"
      ? { tone: "success" as const, text: "Accepted · awaiting payment" }
      : decision === "declined"
        ? { tone: "neutral" as const, text: "Declined" }
        : STATUS_LABEL[r.status];

  return (
    <div className="max-w-prose">
      {/* TASTE §8 — an inline text action, ink and underlined at rest, never
          brand. The chevron mirrors under RTL; `HOST-SHELL.md` §1 rules out a
          breadcrumb here, and this is a single Back rather than a trail. */}
      <Link href="/host/reservations" className={`inline-flex items-center gap-1 ${inlineAction}`}>
        <ChevronLeftIcon className="size-4 rtl:-scale-x-100" />
        Back to reservations
      </Link>

      <div className="mt-5">
        <StatusChip tone={pill.tone}>{pill.text}</StatusChip>
      </div>

      {/* `h4` here where the list takes `h5`: the nav says "Reservations" but
          not which one, so this heading is a real page title (TASTE §7 puts a
          content page's H1 at the 24-26 rung). */}
      <h1 className="mt-3 text-h4 font-semibold text-primary">{reservationTitle(r)}</h1>
      <p className="mt-1 text-bodyMd font-regular text-secondary">
        <span>
          {r.listing}, {r.city} · <Num>{r.dates}</Num>
        </span>
      </p>

      <SampleDataStrip className="mt-5" />

      {/* ─────────────────────────── guest ──────────────────────────────── */}
      <section className={section} aria-labelledby={`${baseId}-guest`}>
        <h2 id={`${baseId}-guest`} className={sectionHeading}>
          Guest
        </h2>

        <div className="mt-4 flex items-start gap-3">
          <GuestAvatar initials={r.initials} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-bodyMd font-semibold text-primary">{r.guest}</span>
              {r.verified ? <VerifiedChip /> : null}
            </div>
            <p className="mt-0.5 text-bodySm font-regular text-secondary">{r.party}</p>
          </div>
        </div>

        {isRequest ? (
          /*
           * `ga-061`'s privacy line, from the host's side. It is a fact about
           * the product rather than a promise about this booking, which is why
           * it survives having no messaging surface to link to.
           */
          <p className="mt-4 flex items-start gap-2 text-bodySm font-regular leading-relaxed text-secondary">
            <MessageIcon className="mt-0.5 size-4 flex-none text-tertiary" />
            <span>
              Contact details stay private until the booking is confirmed. Until then you can only
              reach {r.guest} through SalamStay.
            </span>
          </p>
        ) : null}
      </section>

      {/* ──────────────────────── the guest’s note ──────────────────────── */}
      {r.note === undefined ? null : (
        <section className={section} aria-labelledby={`${baseId}-note`}>
          <h2 id={`${baseId}-note`} className={sectionHeading}>
            What {r.guest} wrote
          </h2>
          {/*
            An incoming message in `bg.raised` — TASTE §6's fourth job for the
            tint, and the same shape the chat bubble takes elsewhere. Quoted
            because it is somebody else's words and the host should be able to
            see where they start and stop.
          */}
          <blockquote className="mt-4 rounded-lg bg-raised px-4 py-3 text-bodyMd font-regular leading-relaxed text-secondary">
            {r.note}
          </blockquote>
        </section>
      )}

      {/* ───────────────────────── cantonment ───────────────────────────── */}
      {r.cantonment === undefined ? null : (
        /*
         * The `info` register, exactly as `app/host/listings/new/location/step.tsx`
         * draws it, and grounded in the same place: `COMPLIANCE_MAP.md` CB1–CB6.
         * It is not an error and not a warning — the host has done nothing
         * wrong, a true address simply has a consequence attached — and it never
         * blocks the decision. It is also never a mark against the guest: the
         * rule is about the land.
         */
        <div className="mt-7">
          <div className="flex items-start gap-3 rounded-lg border border-info-border bg-info-bg px-4 py-3">
            <span aria-hidden="true" className="mt-0.5 flex-none text-info">
              <InfoIcon className="size-5" />
            </span>
            <p className="text-bodySm font-regular leading-relaxed text-secondary">
              <b className="font-semibold text-primary">This property is inside a cantonment.</b>{" "}
              {r.cantonment} asks for a No-Objection Certificate before a property can host guests
              from outside Pakistan, and some zones are closed to those stays entirely. It is a rule
              about the land, not about {r.guest}. Check your certificate covers these dates before
              you answer.
            </p>
          </div>
        </div>
      )}

      {/* ──────────────────── dates and the payout ──────────────────────── */}
      <section className={section} aria-labelledby={`${baseId}-money`}>
        {/*
          THE HEADING AND THE NET LINE BOTH FOLLOW THE DECISION, because nothing
          is saved and the fixture's `status` cannot follow it for them:
           · pending  → "Dates and your earnings" / "If you accept, you receive"
           · accepted → the same block, but the conditional is spent, so the net
             line reads "You receive" and gains the trust-and-release note every
             confirmed reservation carries.
           · declined → THE EARNINGS BLOCK GOES. There is no payout from a
             request that was declined, and leaving `PKR 35,325` under a heading
             that says "your earnings" on a page that says "You declined this
             request" is the page contradicting itself in the one register where
             it must not. The dates stay, because the record of what was asked
             for is still true.
        */}
        <h2 id={`${baseId}-money`} className={sectionHeading}>
          {decision === "declined" ? "Dates" : "Dates and your earnings"}
        </h2>

        <dl className="mt-4 flex flex-col gap-2">
          <Fact term="Listing" detail={r.listing} />
          <Fact
            term="Dates"
            detail={
              <span>
                <Num>{r.dates}</Num>
              </span>
            }
          />
          <Fact
            term="Nights"
            detail={
              <span>
                <Num>{String(r.nights)}</Num>
              </span>
            }
          />
        </dl>

        {decision === "declined" ? null : (
          <div className="mt-5 border-t border-hairline pt-1">
            <EarningsBreakdown
              reservation={r}
              netLabel={decision === "accepted" ? "You receive" : undefined}
              payoutNote={
                decision === "accepted"
                  ? `Held in trust until ${r.guest} checks in.`
                  : undefined
              }
            />
          </div>
        )}
      </section>

      {/* ───────────────────────── the decision ─────────────────────────── */}
      {isRequest ? (
        <section className={section} aria-labelledby={`${baseId}-respond`}>
          {decision === "pending" ? (
            <PendingDecision
              reservation={r}
              headingId={`${baseId}-respond`}
              declineRef={declineTrigger}
              onAccept={() => setDecision("accepted")}
              onDecline={() => setDeclining(true)}
            />
          ) : decision === "accepted" ? (
            <Accepted reservation={r} headingId={`${baseId}-respond`} headingRef={outcomeHeading} />
          ) : (
            <Declined
              reservation={r}
              headingId={`${baseId}-respond`}
              headingRef={outcomeHeading}
              reasonLabel={chosenReason?.label ?? ""}
              note={note}
            />
          )}
        </section>
      ) : null}

      {/*
        ───────────────────── the decline dialog ─────────────────────────
        Mounted for the whole life of a request, including after the host has
        decided. `dialog.tsx` is explicit that its panel is always mounted and
        `inert` when closed, because "mounting on open would mean either no exit
        animation or a timer to defer unmount, and a timer is a race" — and
        unmounting on CLOSE costs the same exit. Confirming a decline is exactly
        the moment the sheet should be seen leaving rather than blinking out, so
        the guard is `isRequest` and nothing more.
      */}
      {isRequest ? (
        <Dialog
          open={declining}
          onClose={() => setDeclining(false)}
          labelledBy={dialogTitleId}
          maxWidth={overlaySize.dialogMd}
          restoreFocusRef={declineTrigger}
          /*
           * The panel becomes a column so the footer can stay pinned while the
           * body scrolls. `dialog.tsx` caps no height of its own — correct for
           * the short confirmations it was extracted from, and not enough for a
           * radio group, a textarea and a preview on a 667px phone. `dvh`
           * rather than `vh` for the same reason `min-h-[100dvh]` is the rule
           * elsewhere: the iOS address bar.
           */
          panelClassName="flex max-h-[85dvh] flex-col"
        >
          <DialogHeader
            id={dialogTitleId}
            title={`Decline ${r.guest}’s request?`}
            onClose={() => setDeclining(false)}
          />

          <DialogBody className="min-h-0 flex-1 overflow-y-auto">
            {/* The reason is internal, and saying so is what lets the reason
                list be this blunt. No claim is made about what SalamStay does
                with it beyond who does not see it. */}
            <p className="text-bodySm font-regular leading-relaxed text-secondary">
              Pick a reason. It goes to SalamStay, not to {r.guest} — they read the message below,
              whichever one you pick.
            </p>

            <p id={reasonLabelId} className={`mt-5 ${hostFieldLabel}`}>
              Reason
            </p>
            <RadioGroup
              name="decline-reason"
              value={reason}
              onChange={setReason}
              labelledBy={reasonLabelId}
              className="mt-2"
            >
              {DECLINE_REASONS.map((entry) => (
                <RadioRow
                  key={entry.value}
                  value={entry.value}
                  label={entry.label}
                  hint={entry.hint}
                />
              ))}
            </RadioGroup>

            <Textarea
              className="mt-5"
              id={`${baseId}-decline-note`}
              label={`Note to ${r.guest} (optional)`}
              value={note}
              onChange={setNote}
              rows={3}
              placeholder="These dates are already taken, but you would be very welcome another time."
              hint="Whatever you write is shown to them exactly as you type it."
            />

            <GuestPreview reservation={r} note={note} className="mt-5" />

            {/*
              A FIXED SLOT, always populated — `HOST-SHELL.md` §3's `.capnote`
              rule applied to a dialog. It is how the disabled confirm below
              explains itself without a message that appears, disappears and
              shoves the footer by a line every time the host changes their mind.
            */}
            <p className="mb-1 mt-4 min-h-10 text-label font-regular leading-relaxed text-tertiary">
              {chosenReason === undefined
                ? "Pick a reason to continue. Nothing is sent until you confirm."
                : "Nothing has been charged, so there is nothing to refund. This cannot be undone."}
            </p>
          </DialogBody>

          <DialogFooter divided>
            <button type="button" className={btnSecondary} onClick={() => setDeclining(false)}>
              Keep the request
            </button>
            {/*
              `aria-disabled`, not `disabled`: TASTE §11.7 keeps a blocked
              control visible AND reachable, so a keyboard user can land on it
              and find the sentence above that says what is missing.
            */}
            <button
              type="button"
              aria-disabled={chosenReason === undefined || undefined}
              onClick={confirmDecline}
              className={
                chosenReason === undefined ? declineConfirmDisabled : declineConfirmButton
              }
            >
              Confirm decline
            </button>
          </DialogFooter>
        </Dialog>
      ) : null}
    </div>
  );
}

/* ─────────────────────────── small parts ────────────────────────────────── */

/** `ha-048`'s `.dl-row` — term and detail on one baseline, mirrored for free. */
function Fact({ term, detail }: { readonly term: string; readonly detail: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="flex-none text-bodySm font-regular text-secondary">{term}</dt>
      <dd className="text-end text-bodySm font-medium text-primary">{detail}</dd>
    </div>
  );
}

/**
 * The two outcomes, stated before either is chosen — `ha-049`'s "Two ways this
 * can go", and the reason `Accept request` needs no confirmation dialog of its
 * own. A confirmation modal that repeats what the host just read two inches
 * above it is a speed bump, not consent; the consent is the paragraph, and the
 * paragraph is on screen while the button is pressed.
 *
 * Decline gets a dialog anyway, and the asymmetry is the point: accepting holds
 * dates and a price and can still lapse if the guest never pays, while
 * declining ends the request for good and sends someone a message. One of those
 * needs a second deliberate act.
 */
function PendingDecision({
  reservation: r,
  headingId,
  declineRef,
  onAccept,
  onDecline,
}: {
  readonly reservation: Reservation;
  readonly headingId: string;
  readonly declineRef: RefObject<HTMLButtonElement | null>;
  readonly onAccept: () => void;
  readonly onDecline: () => void;
}) {
  return (
    <>
      <h2 id={headingId} className={sectionHeading}>
        Your response
      </h2>

      <ul className="mt-4 flex flex-col gap-4">
        <Path
          glyph={<CheckMark className="size-4" />}
          title={`Accept — ${r.guest} confirms and pays`}
          body="Your price and these dates are held for them. Nothing is confirmed until the payment goes through, and your money is held in trust until check-in."
        />
        <Path
          glyph={<ArrowRightIcon className="size-4 rtl:-scale-x-100" />}
          title="Decline — nothing is charged"
          body={`${r.guest} is told the stay is not available for these dates. No card is charged at this stage, so there is nothing to refund.`}
        />
      </ul>

      {r.respondBy === undefined ? null : (
        <p className="mt-5 flex items-center gap-2 text-bodySm font-regular text-secondary">
          <ClockIcon className="size-4 flex-none text-tertiary" />
          <span>
            Respond by <Num>{r.respondBy}</Num>
          </span>
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {/*
          THE SURFACE'S ONE PRIMARY CTA (TASTE §2 role 3) — which is exactly why
          `host-nav.tsx` makes `＋ Create a listing` yield to ink-outline on
          every `/host/reservations/{id}` route. One green per surface, and on
          this one it belongs to the decision.
        */}
        <button type="button" className={hostPrimaryPill} onClick={onAccept}>
          Accept request
        </button>
        <button ref={declineRef} type="button" className={btnSecondary} onClick={onDecline}>
          Decline
        </button>
      </div>
    </>
  );
}

function Path({
  glyph,
  title,
  body,
}: {
  readonly glyph: ReactNode;
  readonly title: string;
  readonly body: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="mt-0.5 grid size-7 flex-none place-items-center rounded-full bg-raised text-secondary"
      >
        {glyph}
      </span>
      <span>
        <span className="block text-bodyMd font-semibold text-primary">{title}</span>
        <span className="mt-0.5 block text-bodySm font-regular leading-relaxed text-secondary">
          {body}
        </span>
      </span>
    </li>
  );
}

function Accepted({
  reservation: r,
  headingId,
  headingRef,
}: {
  readonly reservation: Reservation;
  readonly headingId: string;
  readonly headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <>
      <h2 id={headingId} ref={headingRef} tabIndex={-1} className={`${sectionHeading} outline-none`}>
        You accepted {r.guest}’s request
      </h2>
      <p className="mt-2 text-bodyMd font-regular leading-relaxed text-secondary">
        {r.guest} has been notified. Your price and these dates are held for them; nothing is
        confirmed until they pay.
      </p>

      <ul className="mt-5 flex flex-col gap-4">
        <Path
          glyph={<CheckMark className="size-4" />}
          title={`${r.guest} confirms and pays`}
          body="Until then the dates stay held and the listing is not bookable by anyone else for them."
        />
        <Path
          glyph={<MessageIcon className="size-4" />}
          title="Contact details are shared once they pay"
          body="Not before. Until the payment goes through you reach each other through SalamStay."
        />
        <Path
          glyph={<LockIcon className="size-4" />}
          title="You are paid after check-in"
          body={`The payment is held in trust and released to you once ${r.guest} checks in.`}
        />
      </ul>

      <div className="mt-6">
        <Link href="/host/reservations" className={`${btnSecondary} no-underline`}>
          Back to reservations
        </Link>
      </div>
    </>
  );
}

function Declined({
  reservation: r,
  headingId,
  headingRef,
  reasonLabel,
  note,
}: {
  readonly reservation: Reservation;
  readonly headingId: string;
  readonly headingRef: RefObject<HTMLHeadingElement | null>;
  readonly reasonLabel: string;
  readonly note: string;
}) {
  return (
    <>
      <h2 id={headingId} ref={headingRef} tabIndex={-1} className={`${sectionHeading} outline-none`}>
        You declined this request
      </h2>
      <p className="mt-2 text-bodyMd font-regular leading-relaxed text-secondary">
        Reason logged: <b className="font-semibold text-primary">{reasonLabel}</b>. Nothing was
        charged, so there is nothing to refund.
      </p>

      <GuestPreview reservation={r} note={note} className="mt-5" />

      {/*
        `ha-049`'s reassurance, with its metric removed. The card ties this to a
        response rate; nothing in this product computes one, and a comfort built
        on a number that does not exist is a number that does not exist.
      */}
      <p className="mt-4 flex items-start gap-2 text-bodySm font-regular leading-relaxed text-secondary">
        <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
        <span>
          <b className="font-semibold text-primary">Declining is okay.</b> Answering — either way —
          is what a guest needs from you. A home that is not free is not a failure.
        </span>
      </p>

      <div className="mt-6">
        <Link href="/host/reservations" className={`${btnSecondary} no-underline`}>
          Back to reservations
        </Link>
      </div>
    </>
  );
}

/**
 * WHAT THE GUEST ACTUALLY READS.
 *
 * This is the block that makes a decline safe to press, and it appears twice on
 * purpose — inside the dialog while the host is still deciding, and again on
 * the declined state so they can see afterwards that nothing harsh went out in
 * their name. A host who cannot see the message their decline sends is being
 * asked to sign something they have not read.
 *
 * `ga-066`'s framing, and the load-bearing sentence in it is the last one: the
 * guest is told this is about the dates. The internal reason category is never
 * shown, and the preview says so.
 *
 * Dashed border and `bg.sunken` — `ha-049`'s `.previewcard`. Dashed is doing
 * real work here rather than decorating: it says "this is a rendering of
 * another screen", not a control on this one.
 */
function GuestPreview({
  reservation: r,
  note,
  className = "",
}: {
  readonly reservation: Reservation;
  readonly note: string;
  readonly className?: string;
}) {
  const wrote = note.trim().length > 0;

  return (
    <div className={`rounded-lg border border-dashed border-border-default bg-sunken p-4 ${className}`}>
      <p className="text-label font-semibold text-tertiary">What {r.guest} sees</p>
      <p className="mt-2 text-bodyMd font-semibold text-primary">
        “This stay isn’t available for your dates”
      </p>
      <p className="mt-1 text-bodySm font-regular leading-relaxed text-secondary">
        <span>
          “The host couldn’t take your booking for <Num>{r.dates}</Num>. It happens sometimes — this
          is about the dates, not about you.”
        </span>
      </p>
      <p className="mt-2 text-label font-regular leading-relaxed text-tertiary">
        {wrote
          ? "Your note is shown underneath, word for word."
          : "No note is shown, and that is fine. The reason you pick above is never shown."}
      </p>
    </div>
  );
}
