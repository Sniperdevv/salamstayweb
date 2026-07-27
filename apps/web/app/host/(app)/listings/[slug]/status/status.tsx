"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";

import { iconStroke } from "@salamstay/design-tokens/icons";
import { overlaySize } from "@salamstay/design-tokens/layout";

import {
  AlertCircleIcon,
  AlertTriangleIcon,
  ChevronLeftIcon,
  LockIcon,
  RetryIcon,
} from "@/components/icons";
import { ShieldCheckIcon } from "@/components/home-icons";
import { Phrase } from "@/components/numerals";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { CheckMark } from "@/components/ui/marks";
import {
  btnBase,
  btnLg,
  btnOutline,
  btnSecondary,
  focusRing,
  inlineAction,
  pressable,
} from "@/components/ui";

import { StatusChip } from "../../../reservations/reservation-parts";
import { ListingPhrase, ListingSampleStrip } from "../listing-parts";
import { editHref, stayCountPhrase, type HostListing } from "../listing";

/**
 * HA-076 — publish / unpublish / delete — at web width.
 *
 * THREE EXITS, DELIBERATELY UNEQUAL IN WEIGHT, AND ONE OF THEM DOES NOT SHIP
 * -------------------------------------------------------------------------
 * `ha-076` draws snooze, unpublish and delete. Two are built here.
 *
 * **Snooze is not**, and it is marked rather than approximated. A snooze takes
 * a reopen date and its whole promise is that the listing "republishes itself
 * that morning — you don't have to remember." That is a scheduled job running
 * on a date, against a listing record, on a server. This build has none of the
 * three. `GO-LIVE` A13 and A18 are both open — publishing creates nothing, and
 * the wizard already tells hosts their progress saves when it does not — and a
 * date picker that silently forgot its own date would be the third promise of
 * that class. So the row is present with a `Not built` chip, in the shape
 * `/host/onboarding` ships, and it says what would happen rather than offering
 * to do it. Unpublish survives the same test because it is a STATE, not a
 * schedule: this page holds it, this page says how long it holds it for, and
 * the strip above says the rest.
 *
 * WHAT THE CARD PRINTS THAT IS NOT HERE, EACH WITH ITS REASON
 * -----------------------------------------------------------
 *  · **`PKR 12,000 per night`.** `../listing.ts` records why no rate appears on
 *    either listing surface: two files in this repo disagree about Cantt View
 *    Residence's nightly rate, and the price is the pricing section's fact
 *    anyway. A status screen that printed it would be a second place for it to
 *    drift, which is the rule `ha-036` is built around.
 *  · **`Live since 18 July 2026` and `Unpublished 24 July 2026`.** Nothing in
 *    this product records when a listing went live or when it came off, so both
 *    are timestamps nobody wrote down. Same class as a view count, a quality
 *    score or a completeness percentage, and none of those appears here either.
 *  · **`reviews are kept`.** Zero reviews exist anywhere in this build and no
 *    host profile route exists to keep them on. The unpublish and delete
 *    consequence lists lose that clause and keep everything that is true.
 *  · **The `.stcard` plate.** TASTE §1: a shadow means it floats, a border means
 *    a form boundary or an unselected choice, and a status summary is neither.
 *    `/host/reservations/[id]` states its own status as a chip, a heading and a
 *    line in open space, and this does the same.
 *
 * "CONFIRMED STAY", NOT "UPCOMING BOOKING" — see `../listing.ts`. One of the two
 * stays this fixture counts for Gulberg 2 Residence has already checked in.
 *
 * NO GREEN ON THIS PAGE. `HOST-SHELL.md` §7 rules the host app surface already
 * over TASTE §2's four-role budget through `ha-046`'s inherited chip, nav
 * underline and avatar, and says **"Add nothing to it."** `ha-076` fills its
 * `Unpublish` and `Republish` with `interactive.primary`; on this shell the
 * affirmative control takes TASTE §2's own yielding shape instead — the ink
 * outline that stands in for a primary whose green is spent elsewhere
 * (`components/header-cta.ts` states the rule; `btnOutline` is the recipe). The
 * nav keeps the surface's one green on every branch of this route.
 *
 * MOTION: press feedback only, from `pressable`. No entrance transition on the
 * outcome blocks — `HOST-SHELL.md` §10 bans one on a surface the host will
 * revisit, and the register matters more than the rule here: unpublishing is a
 * host stepping back from something, and animating it in would be the product
 * being pleased with itself. The dialog's own enter and exit are the motion
 * this interaction gets.
 */

type Lifecycle = "live" | "unpublished" | "removed";

/* ─────────────────────────── control recipes ────────────────────────────── */

/**
 * The affirmative control on a shell where green is unavailable — TASTE §2's
 * yielding shape at body scale. `btnOutline` is `border.strong` + ink on
 * transparent, which is the same substitution `components/header-cta.ts` makes
 * for `Sign up` on a route whose body already owns the one green.
 *
 * Composed rather than written out: nothing here overrides a property
 * `btnBase` already sets, so the stylesheet-order trap `btnSecondaryOnTint` and
 * `btnSecondaryMd` both document does not apply.
 */
const btnCall = `${btnBase} ${btnOutline} ${btnLg}`;

/**
 * The one destructive control on this surface, and the one place the error
 * register is allowed to appear (§10.8: the muted error tone belongs only at a
 * genuinely irreversible point of action).
 *
 * BYTE-IDENTICAL to `../../../reservations/[id]/detail.tsx`'s
 * `declineConfirmButton` and `declineConfirmDisabled`, which are private to that
 * file. Same situation as `ListingSampleStrip` and `HostSetupStrip`: one recipe,
 * a second call site, and no shared export to reach for. **Do not fork the class
 * string** — if the destructive button changes, both move together. The correct
 * end state is one exported recipe, which is an edit to a file outside this
 * pass's scope.
 *
 * Not green, and not the §5 gray-fill. Gray-fill would make an irreversible
 * action look like `Show more`.
 */
const destructiveConfirm =
  "inline-flex h-12 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md " +
  `border border-error-border bg-canvas px-6 text-bodyMd font-semibold text-error hover:bg-error-bg ${focusRing} ${pressable}`;

/** TASTE §11.7 / `HOST-SHELL.md` §5: same size, same place, same label. */
const destructiveBlocked =
  "inline-flex h-12 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md " +
  `border border-transparent bg-raised px-6 text-bodyMd font-semibold text-disabled ${focusRing}`;

/** A section rule — `hw-001`'s `.fsec`: hairline top, `space-7` above and below. */
const section = "mt-7 border-t border-hairline pt-7";
const sectionHeading = "text-h6 font-semibold text-primary";

/* ────────────────────────────── the page ────────────────────────────────── */

export default function ListingStatus({
  listing,
  confirmed,
}: {
  readonly listing: HostListing;
  readonly confirmed: number;
}) {
  const [state, setState] = useState<Lifecycle>("live");
  const [unpublishing, setUnpublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const unpublishTrigger = useRef<HTMLButtonElement>(null);
  const deleteTrigger = useRef<HTMLButtonElement>(null);
  const outcomeHeading = useRef<HTMLHeadingElement>(null);

  const baseId = useId();
  const unpublishTitleId = `${baseId}-unpublish`;
  const deleteTitleId = `${baseId}-delete`;
  const deleteCaptionId = `${baseId}-delete-caption`;

  /* The delete gate. A listing guests are still booked into cannot be removed,
     and the count is the reservations fixture's rather than this file's. */
  const gated = confirmed > 0;
  const stays = `${String(confirmed)} ${stayCountPhrase(confirmed)}`;

  /*
   * Focus follows the outcome — the same move `../../../reservations/[id]`
   * makes after a decision. The host pressed a control and the page answered
   * somewhere else; without this a screen-reader user is left on a button that
   * no longer exists.
   */
  useEffect(() => {
    if (state !== "removed") return;
    outcomeHeading.current?.focus();
  }, [state]);

  const chip =
    state === "live"
      ? { tone: "success" as const, text: "Live" }
      : state === "unpublished"
        ? { tone: "neutral" as const, text: "Unpublished" }
        : { tone: "neutral" as const, text: "Removed" };

  const summary =
    state === "live"
      ? "Guests can find this listing in search and book it."
      : state === "unpublished"
        ? gated
          ? "Guests can’t find or book it. The stays you have already confirmed are going ahead as agreed."
          : "Guests can’t find or book it. Nobody is booked in, so no stay is affected."
        : "It is gone from SalamStay, and nothing on this page can bring it back.";

  return (
    <div className="max-w-prose">
      {/* TASTE §8 — ink, underlined at rest. A single Back, not a trail:
          `HOST-SHELL.md` §1 rules out a breadcrumb on every host route. The
          chevron mirrors under RTL.

          THE WHOLE LABEL IS ONE `ListingPhrase`, and it has to be. The link is
          `inline-flex`, so "Back to " as a bare text node beside the name would
          be a SECOND flex item and the underline would break at the `gap-1`
          between them — visible on the first build of this page, and the same
          flex-item trap `../../../reservations/reservation-parts.tsx` records
          for `.num` inside its earnings row. Putting the lead inside the phrase
          fixes the underline and the RTL isolate in the same move. */}
      <Link
        href={editHref(listing.id)}
        className={`inline-flex items-center gap-1 ${inlineAction}`}
      >
        <ChevronLeftIcon className="size-4 rtl:-scale-x-100" />
        <ListingPhrase lead="Back to " name={listing.name} />
      </Link>

      <div className="mt-5">
        <StatusChip tone={chip.tone}>{chip.text}</StatusChip>
      </div>

      {/* `h4`, the rung `/host/reservations/[id]` and `/host/onboarding` take:
          the nav says "Listings" but not which one, so this is a real page
          title rather than a region label (TASTE §7). */}
      <h1 className="mt-3 text-h4 font-semibold text-primary">
        <ListingPhrase lead="Status of " name={listing.name} />
      </h1>

      {/*
        `role="status"` because this sentence is the whole answer to what the
        host just did. Unpublishing changes the chip above and this line, and
        both sit at the top of a page the host may have scrolled away from — a
        state change nothing announces is a state change a screen-reader user
        has to go hunting for.
      */}
      <p role="status" className="mt-1 text-bodyMd font-regular leading-relaxed text-secondary">
        {summary}
      </p>

      {/*
        The two facts about this home that are not owned by an editor: where it
        is, and how many guests are booked into it. The count is what both
        consequential controls below are about, so it is stated before either of
        them is offered. `dir="auto"` on an inline span — `GO-LIVE` A17: `.num`
        isolates a digit run and inside an RTL container that isolate reorders
        past the Latin words beside it.

        IT GOES WHEN THE LISTING DOES. A removed listing still reporting a city
        and a stay count is a page describing something it has just said no
        longer exists, and a count of nothing is not a fact worth keeping on
        screen (`components/host/host-empty.tsx`'s rule, applied to a line
        rather than a page).
      */}
      {state === "removed" ? null : (
        <p className="mt-1 text-bodySm font-regular text-tertiary">
          <Phrase>
            {listing.city} · <span className="num">{confirmed}</span> {stayCountPhrase(confirmed)}
          </Phrase>
        </p>
      )}

      <ListingSampleStrip className="mt-5" />

      {state === "removed" ? (
        <Removed listing={listing} headingId={`${baseId}-gone`} headingRef={outcomeHeading} />
      ) : (
        <>
          <section className={section} aria-labelledby={`${baseId}-search`}>
            <h2 id={`${baseId}-search`} className={sectionHeading}>
              {state === "live" ? "Take it off search" : "Put it back"}
            </h2>

            <ul className="mt-4 divide-y divide-hairline">
              {state === "live" ? (
                <ActionRow
                  title="Unpublish"
                  body="Guests stop seeing it until you publish it again. Stays you have already confirmed are honoured, and everything you have set is kept."
                  action={
                    <button
                      ref={unpublishTrigger}
                      type="button"
                      className={btnSecondary}
                      onClick={() => setUnpublishing(true)}
                    >
                      Unpublish
                    </button>
                  }
                />
              ) : (
                <ActionRow
                  title="Publish it again"
                  body="It goes back into search exactly as you left it. No review, and no waiting."
                  action={
                    <button
                      type="button"
                      className={btnCall}
                      onClick={() => setState("live")}
                    >
                      Republish
                    </button>
                  }
                />
              )}

              {/*
                The third exit, named and not built. It is a row rather than a
                silence because a host who wants to close their home for August
                will look for it, and "there is no such control" is a better
                answer than an empty page. The body says what it WOULD do, in
                the conditional, so nothing here reads as a promise about a
                release nobody has scheduled.
              */}
              <ActionRow
                title="Snooze until a date"
                chip={<StatusChip tone="neutral">Not built</StatusChip>}
                body="It would take the listing off search and put it back on a morning you choose, without you having to remember. Nothing on this site can run a job on a future date, so it is marked rather than offered."
              />
            </ul>

            {/*
              The single most reassuring fact on a page about withdrawing a
              listing, and `ha-076` puts it on every panel. Icon and text in
              open space, no plate — TASTE §1, and the same shape
              `/host/reservations/[id]` uses for its privacy line. Payload word
              bolded only (TASTE §7).
            */}
            <p className="mt-6 flex items-start gap-2 text-bodySm font-regular leading-relaxed text-secondary">
              <ShieldCheckIcon className="mt-0.5 size-4 flex-none text-tertiary" />
              <span>
                <b className="font-semibold text-primary">
                  Nothing here touches a stay a guest has already booked.
                </b>{" "}
                Whatever you choose, those check-ins go ahead as agreed.
              </span>
            </p>
          </section>

          {/*
            The quiet delete entry — §10.8, never pre-emptively red. It is an
            inline text action (TASTE §8: ink, underlined at rest), separated by
            a rule rather than by a colour, and the error register waits until
            the confirm inside the dialog.
          */}
          <div className={section}>
            <button
              ref={deleteTrigger}
              type="button"
              className={`${inlineAction} text-bodySm`}
              onClick={() => setDeleting(true)}
            >
              Delete this listing
            </button>
          </div>
        </>
      )}

      {/* ───────────────────── the unpublish dialog ─────────────────────── */}
      <Dialog
        open={unpublishing}
        onClose={() => setUnpublishing(false)}
        labelledBy={unpublishTitleId}
        maxWidth={overlaySize.dialogMd}
        restoreFocusRef={unpublishTrigger}
        panelClassName="flex max-h-[85dvh] flex-col"
      >
        <DialogHeader
          id={unpublishTitleId}
          title="Unpublish this listing?"
          onClose={() => setUnpublishing(false)}
        />

        <DialogBody className="min-h-0 flex-1 overflow-y-auto">
          <p className="text-bodySm font-regular leading-relaxed text-secondary">
            Exactly what changes, and what does not.
          </p>

          {/*
            Three of the four rows are REASSURANCES, because the honest answer
            to "what happens to my guests?" is "nothing", and saying so plainly
            is what stops a host cancelling real stays out of confusion
            (`ha-076`'s own note). The discs stay neutral: the card tints the
            reassuring ones with the success roles, and three green discs in one
            dialog is a lot of colour for a distinction the check mark already
            makes on its own.
          */}
          <ul className="mt-5 flex flex-col gap-4">
            <Consequence
              glyph={<LockIcon className="size-4" />}
              title="Guests can’t find or book it"
              body="It comes off search, and a link to it stops taking bookings."
            />
            {gated ? (
              <Consequence
                glyph={<CheckMark className="size-4" />}
                title={
                  <Phrase>
                    Your <span className="num">{confirmed}</span> {stayCountPhrase(confirmed)}{" "}
                    {confirmed === 1 ? "is" : "are"} honoured
                  </Phrase>
                }
                body="Those guests check in exactly as agreed. Nothing about their stay changes."
              />
            ) : (
              <Consequence
                glyph={<CheckMark className="size-4" />}
                title="No stay is affected"
                body="Nobody is booked in right now, so there is no check-in to keep."
              />
            )}
            <Consequence
              glyph={<CheckMark className="size-4" />}
              title="Your calendar, prices and photos are kept"
              body="Everything stays as you left it, ready for the day you come back."
            />
            <Consequence
              glyph={<RetryIcon className="size-4" />}
              title="You can publish it again whenever you want"
              body="It comes back the moment you are ready. No review, and no waiting."
            />
          </ul>
        </DialogBody>

        <DialogFooter divided>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setUnpublishing(false)}
          >
            Keep it live
          </button>
          <button
            type="button"
            className={btnCall}
            onClick={() => {
              setUnpublishing(false);
              setState("unpublished");
            }}
          >
            Unpublish
          </button>
        </DialogFooter>
      </Dialog>

      {/* ─────────────────────── the delete dialog ──────────────────────── */}
      <Dialog
        open={deleting}
        onClose={() => setDeleting(false)}
        labelledBy={deleteTitleId}
        maxWidth={overlaySize.dialogMd}
        restoreFocusRef={deleteTrigger}
        panelClassName="flex max-h-[85dvh] flex-col"
      >
        {/*
          The title is handed in as a NODE rather than a string, so the home's
          name keeps its `.num` isolation and its `dir="auto"` wrapper inside
          the heading. `DialogHeader` supplies the `<h2>` and the id; passing a
          heading of our own through `children` would nest one inside it.
        */}
        <DialogHeader
          id={deleteTitleId}
          title={
            <>
              <ListingPhrase lead="Delete " name={listing.name} trail="?" />
            </>
          }
          onClose={() => setDeleting(false)}
        />

        <DialogBody className="min-h-0 flex-1 overflow-y-auto">
          {/*
            THE GATE IS STATED BEFORE THE CONSEQUENCES, with its own way out, so
            the host never meets a blocked control without being told why it is
            blocked and what unlocks it (`ha-076`'s no-dead-ends rule). The
            warning register, not the error one: nothing has gone wrong, there
            is simply something to finish first.
          */}
          {gated ? (
            <div className="flex items-start gap-3 rounded-lg border border-warning-border bg-warning-bg px-4 py-3">
              <span aria-hidden="true" className="mt-0.5 flex-none text-warning">
                <AlertTriangleIcon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-bodySm font-semibold text-warning">
                  <Phrase>{stays} to resolve first</Phrase>
                </p>
                <p className="mt-1 text-bodySm font-regular leading-relaxed text-secondary">
                  A listing guests are still booked into can’t be deleted. Let those stays finish,
                  or agree a cancellation with the guests, and this unlocks.
                </p>
                <p className="mt-2">
                  <Link href="/host/reservations" className={`${inlineAction} text-bodySm`}>
                    See those stays
                  </Link>
                </p>
              </div>
            </div>
          ) : null}

          <p className={`text-bodySm font-semibold text-primary ${gated ? "mt-5" : ""}`}>
            What deleting does
          </p>

          {/*
            One of the three is something the host KEEPS, and it is the
            load-bearing line: completed bookings and receipts stay because tax
            records require it — the same honesty `ga-080` uses for account
            deletion. The card's fourth row, "your past reviews stay on your
            host profile", is dropped: no review exists in this product and no
            host profile route exists to keep one on.
          */}
          <ul className="mt-4 flex flex-col gap-4">
            <Consequence
              glyph={<TrashGlyph />}
              title="The listing and everything in it is removed"
              body="Its photos, prices and calendar go with it, and it stops appearing anywhere on SalamStay."
            />
            <Consequence
              glyph={<CheckMark className="size-4" />}
              title="Completed bookings and receipts are kept"
              body="Your earnings records and your guests’ receipts stay available, as tax records require."
            />
            <Consequence
              glyph={<AlertCircleIcon className="size-4" />}
              title="This can’t be undone"
              body="If you only need a break, unpublishing keeps everything and takes one click to reverse."
            />
          </ul>

          {/*
            A FIXED SLOT, always populated — `HOST-SHELL.md` §3's `.capnote`
            rule applied to a dialog, exactly as the decline dialog applies it.
            It is how the blocked confirm below explains itself without a
            message that appears, disappears and shoves the footer by a line.
          */}
          <p
            id={deleteCaptionId}
            className="mb-1 mt-4 min-h-10 text-label font-regular leading-relaxed text-tertiary"
          >
            {gated
              ? "Resolve those stays first. Nothing is deleted until you confirm."
              : "This cannot be undone. Nothing is deleted until you confirm."}
          </p>
        </DialogBody>

        <DialogFooter divided>
          <button type="button" className={btnSecondary} onClick={() => setDeleting(false)}>
            Keep my listing
          </button>
          {/*
            `aria-disabled`, not `disabled`: TASTE §11.7 keeps a blocked control
            visible AND reachable, so a keyboard user can land on it and find
            the sentence that says what is missing. `aria-describedby` is what
            actually delivers that sentence to them: the caption sits at the end
            of a scrollable body, so reading order alone does not guarantee they
            have met it before they reach the button.
          */}
          <button
            type="button"
            aria-disabled={gated || undefined}
            aria-describedby={deleteCaptionId}
            onClick={() => {
              if (gated) return;
              setDeleting(false);
              setState("removed");
            }}
            className={gated ? destructiveBlocked : destructiveConfirm}
          >
            Delete this listing
          </button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

/* ─────────────────────────── small parts ────────────────────────────────── */

/**
 * A row in the lifecycle list — title, optional chip, body, optional control.
 *
 * The same anatomy the edit hub's rows take, so a host moving between the two
 * pages reads one grammar: open rows divided by one hairline PER GAP, no
 * plates. TASTE §1 — a row here neither floats nor bounds a form.
 */
function ActionRow({
  title,
  body,
  chip,
  action,
}: {
  readonly title: string;
  readonly body: string;
  readonly chip?: ReactNode | undefined;
  readonly action?: ReactNode | undefined;
}) {
  return (
    <li className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h3 className="text-bodyMd font-semibold text-primary">{title}</h3>
          {chip}
        </div>
        <p className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">{body}</p>
      </div>
      {action === undefined ? null : <div className="flex-none">{action}</div>}
    </li>
  );
}

/**
 * One consequence — `ha-076`'s `.conseq` row, and the same shape
 * `../../../reservations/[id]/detail.tsx` draws for its two outcomes: a 28px
 * neutral disc, a 16/600 title, a 14/400 body. Plain and calm, never
 * guilt-tripping.
 */
function Consequence({
  glyph,
  title,
  body,
}: {
  readonly glyph: ReactNode;
  readonly title: ReactNode;
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

/**
 * The one glyph the shared sets do not carry.
 *
 * Drawn here for the reason `/host/onboarding` and `/host/insights` both
 * record for theirs: `components/icons.tsx` is chrome-shared,
 * `components/home-icons.tsx` is the `gw-001` claim set, and a mark used on one
 * surface belongs on that surface until a second one needs it. Decorative — it
 * sits beside a real title — so `aria-hidden`, and the stroke comes from
 * `iconStroke` rather than a literal (TASTE §11.3).
 */
function TrashGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.regular}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="size-4"
    >
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="M6 7l1 13h10l1-13" />
    </svg>
  );
}

/**
 * What the host reads once the listing is gone.
 *
 * It states the outcome and then states the truth about it, in that order,
 * because the strip at the top of the page already told them this build keeps
 * nothing and the sentence here has to agree with it rather than contradict it.
 * The same arrangement `/host/reservations/[id]` uses after a decline: the page
 * says what happened, and the honesty about what was actually saved lives one
 * line away rather than inside a modal nobody will re-open.
 *
 * REACHABLE EXACTLY WHEN A HOME HAS NO CONFIRMED STAY. Both homes in the
 * reservations fixture have one today, so the delete gate holds for both, and
 * emptying or re-dating that fixture is the whole change needed to see this —
 * the single lever `reservations.ts` and `calendar-data.ts` already promise for
 * their own states.
 */
function Removed({
  listing,
  headingId,
  headingRef,
}: {
  readonly listing: HostListing;
  readonly headingId: string;
  readonly headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <section className={section} aria-labelledby={headingId}>
      <h2
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className={`${sectionHeading} outline-none`}
      >
        <ListingPhrase lead="You deleted " name={listing.name} />
      </h2>
      <p className="mt-2 text-bodyMd font-regular leading-relaxed text-secondary">
        Your earnings records and your guests’ receipts are unaffected. Nothing was actually
        removed, because there is no listing store to remove it from — reload this page and the
        example home is back.
      </p>

      <div className="mt-6">
        <Link href="/host/listings" className={`${btnSecondary} no-underline`}>
          Back to your listings
        </Link>
      </div>
    </section>
  );
}
