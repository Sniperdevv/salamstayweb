"use client";

import Image from "next/image";
import Link from "next/link";

import { CheckoutStep } from "@/components/booking/checkout-step";
import {
  Acts,
  ActionList,
  ActionRow,
  CANONICAL,
  Fact,
  Facts,
  InlineLink,
  Outcome,
  PostFlowBody,
  Section,
  Strip,
} from "@/components/booking/post-flow";
import { ArrowRightIcon, CalendarIcon, ChevronRightIcon, ClockIcon } from "@/components/icons";
import { Num } from "@/components/numerals";
import { ATTRIBUTES } from "@/components/stays/attributes";
import { btnSecondary, focusRing, tintTransition } from "@/components/ui";
import { CheckMark } from "@/components/ui/marks";
import { f7Islamabad } from "@/lib/content/areas/f7-islamabad";
import { image } from "@/lib/content/image-manifest";
import { useBooking } from "@/lib/booking/booking-state";
import { formatPkr } from "@/lib/money";

/**
 * GW-027 — the two ways a booking ends that are not success.
 *
 * TWO STATES, AND ONLY TWO. `BUILD-DECISIONS` ruling 15 is explicit: `/status`
 * carries **pending and declined**. Payment failure stays on `/confirm` at step
 * 4 with the full stepper, because no money moved, no booking exists and the
 * guest never left the step — `/status` is post-flow, `/confirm` is mid-flow,
 * and the stepper's presence is the signal for "you are still inside this".
 *
 * NEITHER STATE IS REACHABLE FROM THE FLOW, AND THAT IS RECORDED, NOT HIDDEN.
 * Ruling 10 builds Instant Book only; request-to-book is designed nowhere on
 * web. Both outcomes still ship, because the corpus specifies them and a state
 * nobody can reach is still a state a guest will one day land on. `?state=`
 * names which one renders. It is a review affordance and nothing links to it —
 * no surface on the site offers a guest a URL that decides its own outcome.
 *
 * NO REFERENCE ON EITHER PANEL, and that is the point: a pending request and a
 * declined one have produced no booking, so there is nothing to reference. Only
 * `gw-026` shows `SS-7F3K9Q`.
 *
 * NO STEPPER, NO STEP, NO RAIL. `CHECKOUT-SHELL` §3: post-book cards ship none.
 * `Outcome` takes the slot on both panels, and its glyph is `text.secondary` on
 * both — **no success register, because nothing succeeded, and no error
 * register, because nothing failed.**
 *
 * DIGNITY IS THE LOAD-BEARING CONSTRAINT ON THE DECLINED PANEL
 * ------------------------------------------------------------
 * `DESIGN.md` §0.2, dignity-through-normalcy, and `ga-066` sets the tone:
 *
 *  · The title names AVAILABILITY, never the guest.
 *  · "It happens sometimes — this is about the dates, not about you." is carried
 *    verbatim, and so is "Your verification and your profile are unaffected" —
 *    the sentence that answers the fear the guest actually has.
 *  · Nothing on the panel is red. The glyph is a neutral calendar; there is no
 *    error register, no alarm hue, no verdict.
 *  · A host is never required to explain. The note is quoted plainly where there
 *    is one, and nothing implies the guest was owed it.
 *  · The alternatives are real homes with real photographs, so the exit is a
 *    genuine next step rather than a consolation.
 */

/** Which outcome this route is rendering. */
export type BookingState = "pending" | "declined";

/**
 * The alternatives, read from the F-7 area page's own inventory rather than
 * retyped.
 *
 * `gw-027` draws Cedar Lodge and a G-6 family house at `PKR 14,200` and
 * `PKR 8,900` a night. Two things about that did not survive contact with the
 * shipped site, and both are honesty calls rather than taste ones:
 *
 *  · **The G-6 house is a registry stub with no photograph in the manifest.** A
 *    row with no image beside a row with one is a broken list, and a stand-in
 *    photograph for a home nobody has photographed is exactly what §8's
 *    `authentic` flag exists to prevent. It is replaced by a second real F-7
 *    home that has a page, a photograph and published facts.
 *  · **No nightly price is published anywhere on this site.** The listing page
 *    itself renders a skeleton where its rate would go. Printing `PKR 14,200`
 *    here would make this the one surface that publishes a price, and it would
 *    disagree with the very page it links to. TASTE §12 sanctions suppressing
 *    the row, and that is what happens: two rows of identical gray bars tell a
 *    reader nothing twice, where the home's own attributes tell them something
 *    different each time.
 */
const ALTERNATIVE_HREFS = [
  "/stays-in-islamabad/f-7/cedar-lodge-f7",
  "/stays-in-islamabad/f-7/family-portion-jinnah-super",
];

const ALTERNATIVES = f7Islamabad.stays.items.filter(
  (stay) => stay.href !== null && ALTERNATIVE_HREFS.includes(stay.href),
);

/**
 * One alternative. Hairline-divided rows in OPEN SPACE — no outer border, no
 * card, no shadow. Deliberately NOT the bordered group anatomy the facts and
 * next-step lists use: those are things to read, these are places to go, and
 * TASTE §1 puts content blocks in the "carries neither" column.
 *
 * The photograph is a square crop at `radius.md` (TASTE §9: cards sit between
 * 1:1 and 1.2:1, and squarer shows more of the room). It does not scale under
 * the pointer — the row is 64px tall, and a 1.03 on a thumbnail that size is a
 * jitter rather than a lift. The title takes the underline instead, which is the
 * §8 language the rest of the page already speaks.
 */
function Alternative({ stay }: { readonly stay: (typeof ALTERNATIVES)[number] }) {
  const img = image(stay.image);

  return (
    <li className="border-t border-hairline first:border-t-0">
      <Link
        href={stay.href ?? "#"}
        className={`group flex items-center gap-3.5 py-3.5 ${tintTransition} ${focusRing}`}
      >
        <span className="block size-16 flex-none overflow-hidden rounded-md bg-sunken">
          <Image
            src={img.file}
            alt={img.alt}
            width={img.width}
            height={img.height}
            sizes="64px"
            loading="lazy"
            className="size-full object-cover"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-bodyMd font-semibold text-primary underline-offset-4 group-hover:underline">
            <Num>{stay.title}</Num>
          </span>
          <span className="mt-0.5 block truncate text-label font-regular text-tertiary">
            <Num>{stay.location}</Num>
          </span>
          <span className="mt-0.5 block truncate text-label font-regular text-secondary">
            {stay.attributes.map((a) => ATTRIBUTES[a].label).join(" · ")}
          </span>
        </span>
        <span className="flex flex-none text-tertiary" aria-hidden="true">
          <ChevronRightIcon className="size-4 rtl:-scale-x-100" />
        </span>
      </Link>
    </li>
  );
}

/**
 * PENDING MEANS NOT CHARGED, and this panel says so three times in three
 * registers on purpose: in the sub under the H1, in the outcome caption, and in
 * the facts group beside the amount itself.
 *
 * `ga-065`'s "Most hosts reply well before the window closes." is deliberately
 * NOT carried forward — it is an unverifiable claim about host behaviour with no
 * data behind it, which SEO-RULES §5 does not permit. What replaces it is the
 * plain fact: she has until the window closes, and we will say so the moment she
 * answers. No SLA, no estimate, no promise about when.
 */
function Pending() {
  return (
    <>
      <Outcome icon={<ClockIcon className="size-5" />} status="Awaiting your host">
        Request sent <Num>{CANONICAL.paidOn}</Num> ·{" "}
        <b className="font-semibold text-primary">nothing has been charged</b>. About{" "}
        <b className="font-semibold text-primary">
          <Num>18 hours</Num>
        </b>{" "}
        are left in {CANONICAL.host}&apos;s <Num>24</Num>-hour window. We&apos;ll tell you the moment
        she answers — until then there is nothing for you to do.
      </Outcome>

      <Section
        id="req-h"
        heading="Your request"
        sub={`These are the details ${CANONICAL.host} is looking at.`}
      >
        <Facts>
          <Fact label="Stay" sub={<Num>Entire apartment · F-7, Islamabad</Num>}>
            Margalla View Apartment
          </Fact>
          <Fact label="Dates" sub={<Num>{CANONICAL.nights}</Num>}>
            <Num>{CANONICAL.dates}</Num>
          </Fact>
          <Fact label="Guests" sub={<Num>{CANONICAL.guestBreakdown}</Num>}>
            <Num>{CANONICAL.guests}</Num>
          </Fact>
          <Fact label="Host">{CANONICAL.host}</Fact>
          <Fact label="If she accepts" sub="Not charged yet · your price is held at this figure">
            <b className="num font-semibold text-primary">{formatPkr(CANONICAL.total)}</b>
          </Fact>
        </Facts>
      </Section>

      <Section
        id="branch-h"
        heading="Two ways this can go"
        sub="Whichever way she answers, there is a next step waiting. Neither one charges you now."
      >
        <ActionList>
          <ActionRow
            icon={<CheckMark className="size-5" />}
            title="She accepts — then you confirm and pay"
            sub="Your dates and your price stay held until then. Payment is the last step, and the message thread opens once it goes through."
          />
          <ActionRow
            icon={<ArrowRightIcon className="size-5" />}
            title="She can't this time — then nothing is charged"
            sub={
              <>
                We&apos;ll show you stays that are free for{" "}
                <Num>Fri 14 – Mon 17 Aug</Num>, with your guests already filled in.
              </>
            }
          />
        </ActionList>
      </Section>

      <Section
        id="withdraw-h"
        heading="If you change your mind"
        sub={`You can withdraw this request at any point before ${CANONICAL.host} replies. It costs nothing, because nothing has been taken.`}
      >
        <Acts>
          <Link
            href={`/trips/requests/${CANONICAL.tripSlug}/cancel`}
            className={btnSecondary}
          >
            Cancel this request
          </Link>
          <InlineLink href="/stays-in-islamabad">Keep browsing stays</InlineLink>
        </Acts>
      </Section>
    </>
  );
}

function Declined({ slug, listingPath }: { readonly slug: string; readonly listingPath: string }) {
  return (
    <>
      {/*
        A neutral calendar, not the card's calendar-with-a-cross. The glyph set
        carries no crossed calendar and a hand-drawn SVG path is not something
        this codebase does — every glyph on the site is lifted from a card. The
        neutral mark is also the safer of the two here: a cross inside a box is
        one stroke away from the red X this panel exists to never draw.
      */}
      <Outcome icon={<CalendarIcon className="size-5" />} status="Not available for your dates">
        <b className="font-semibold text-primary">Nothing was charged.</b> A request never takes
        payment, so there is nothing to refund. You can request this stay again for other dates
        whenever you like.
      </Outcome>

      <Section
        id="note-h"
        heading={`A note from ${CANONICAL.host}`}
        sub={`Hosts don't have to explain a decline. ${CANONICAL.host} left this.`}
      >
        <Strip label={CANONICAL.host}>
          &ldquo;These dates are already booked — you&apos;d be very welcome another time.&rdquo;
        </Strip>
      </Section>

      {/*
        The heading does NOT claim these homes are free for the guest's dates.
        The card does, and there is no availability data behind it — no calendar,
        no engine, nothing this build can check. What IS checkable is where they
        are, how many they sleep and what they offer, so that is what the heading
        promises and the rows deliver. The dates question is answered one click
        away, by the home's own page, which is where it can be answered honestly.
      */}
      <Section
        id="alt-h"
        heading={<Num>Other homes in F-7</Num>}
        sub="Verified homes a few minutes from this one, for the same size of party. Open one to check your dates."
      >
        <ul className="mt-2 max-w-overlay-dialogMd list-none">
          {ALTERNATIVES.map((stay) => (
            <Alternative key={stay.href} stay={stay} />
          ))}
        </ul>
      </Section>

      <Section
        id="again-h"
        heading="Or come back to this one"
        sub={`${CANONICAL.host}'s calendar shows which nights are open. A decline for one set of dates does not close the door on another.`}
      >
        <Acts>
          <Link href={`/book/${slug}/dates`} className={btnSecondary}>
            Try different dates for this stay
          </Link>
          <InlineLink href={listingPath}>See the listing again</InlineLink>
        </Acts>
      </Section>
    </>
  );
}

export default function StatusStep({
  slug,
  state,
}: {
  readonly slug: string;
  readonly state: BookingState;
}) {
  const { draft } = useBooking();
  const declined = state === "declined";

  /*
   * Post-flow, back means the list this request belongs to. `backHref` is not
   * nullable on the shell and the card points both panels at the same place, so
   * both go there — a declined guest who cannot get back to their own requests
   * has been shown the door twice.
   */
  return (
    <CheckoutStep
      step={null}
      /*
       * GO-LIVE A11, and the same reasoning as `/confirmation`: both panels
       * here report on a request the guest is supposed to have made, and a
       * cold load has made none. "Your request is with Ayesha now. Nothing is
       * charged yet" is a statement about a real person's inbox.
       *
       * The `?state=` review affordance this file documents survives, with one
       * more step in front of it: a reviewer walks the flow to the end and
       * then edits the URL. That is the honest version of it — the panels
       * render for a session that actually completed a checkout, and for no
       * other.
       */
      guard="post-flow"
      listing={draft.listing}
      heading={
        declined
          ? "This stay isn't available for your dates"
          : `Waiting for ${CANONICAL.host} to reply`
      }
      sub={
        declined ? (
          <>
            {CANONICAL.host} couldn&apos;t take your booking for{" "}
            <b className="font-semibold text-primary">
              <Num>Fri 14 – Mon 17 Aug</Num>
            </b>
            . It happens sometimes — this is about the dates, not about you.
          </>
        ) : (
          <>
            Your request is with <b className="font-semibold text-primary">{CANONICAL.host}</b> now.
            Nothing is charged yet — you&apos;ll pay only if she accepts.
          </>
        )
      }
      backHref="/trips/requests"
      backLabel="Back to your requests"
      nextHref={declined ? "/stays-in-islamabad" : `/trips/requests/${CANONICAL.tripSlug}`}
      nextLabel={declined ? "Explore stays in Islamabad" : "View your request"}
      nextDisabled={false}
      note={
        declined
          ? "Your verification and your profile are unaffected."
          : "You can cancel any time before she replies."
      }
      showRail={false}
    >
      <PostFlowBody>
        {declined ? <Declined slug={slug} listingPath={draft.listing.path} /> : <Pending />}
      </PostFlowBody>
    </CheckoutStep>
  );
}
