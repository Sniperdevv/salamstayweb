"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";

import { Num } from "@/components/numerals";
import { Textarea } from "@/components/ui/textarea";
import { CheckMark } from "@/components/ui/marks";
import {
  btnBase,
  btnLg,
  btnPrimary,
  btnSecondary,
  controlRing,
  inlineAction,
  pressableCircle,
} from "@/components/ui";
import { TRIP, tripPath } from "@/lib/booking/trip-record";

import { ExampleBookingStrip, TripBackLink, TripPageHead, TripSection } from "../trip-chrome";

/**
 * GA-099's composer and GA-100's confirmation, as two states of one route.
 *
 * The route only reaches this file once check-out has passed — `page.tsx` owns
 * that decision and documents why.
 *
 * WHY ONE ROUTE
 * -------------
 * `ga-100` is the same task's last frame, not a separate destination: it recaps
 * what was just written and offers the way out. A second URL would be a page a
 * guest could load cold, with nothing to recap — the deep-link failure
 * GO-LIVE A11 describes. So the confirmation replaces the form in place, and
 * focus moves to the new heading because nothing navigated.
 *
 * STARS ARE INK (TASTE §11.4)
 * ---------------------------
 * `ga-099` and `ga-101` fill them `--warning-fg`; TASTE-RULES postdates both and
 * says stars are ink, never gold. The solid star is one of only two sanctioned
 * solid glyphs on the site (§11.3), so a chosen star is a solid ink star and an
 * unchosen one is the same shape in outline — the state never rides on colour
 * alone, which also carries it through a monochrome screen.
 */

interface Category {
  readonly id: string;
  readonly label: string;
}

/**
 * `ga-099`'s five required dimensions, unchanged.
 *
 * Its sixth — "Cultural fit", framed around prayer space — is retired rather
 * than renamed. See `page.tsx`.
 */
const CATEGORIES: readonly Category[] = [
  { id: "cleanliness", label: "Cleanliness" },
  { id: "accuracy", label: "Accuracy" },
  { id: "communication", label: "Communication" },
  { id: "location", label: "Location" },
  { id: "value", label: "Value" },
];

const STARS = [1, 2, 3, 4, 5] as const;

type Ratings = Record<string, number | null>;

const EMPTY: Ratings = Object.fromEntries(CATEGORIES.map((c) => [c.id, null]));

const payload = "font-semibold text-primary";

export default function ReviewComposer({ stayRange }: { readonly stayRange: string }) {
  const [ratings, setRatings] = useState<Ratings>(EMPTY);
  const [review, setReview] = useState("");
  const [privateNote, setPrivateNote] = useState("");
  const [sent, setSent] = useState(false);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [sent]);

  const rated = CATEGORIES.filter((c) => ratings[c.id] != null).length;
  const complete = rated === CATEGORIES.length;

  if (sent) {
    return (
      <Submitted
        headingRef={headingRef}
        ratings={ratings}
        review={review}
        hasPrivateNote={privateNote.trim() !== ""}
        stayRange={stayRange}
      />
    );
  }

  return (
    <>
      <TripBackLink href={tripPath()}>Your trip</TripBackLink>

      <TripPageHead
        className="mt-5"
        headingRef={headingRef}
        title="Write a review"
        sub={
          <>
            How was the stay? Take your time — what you write is read by the next guest, and by{" "}
            {TRIP.host}.
          </>
        }
      />

      <ExampleBookingStrip className="mt-6">
        No review written here is stored or sent to anyone.
      </ExampleBookingStrip>

      <p className="mt-6 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
        <span>
          <Num>{`${TRIP.home} · ${TRIP.where}`}</Num>
        </span>
        {" · "}
        <span>
          <Num>{stayRange}</Num>
        </span>
      </p>

      <TripSection
        id="ratings"
        heading="Rate your stay"
        sub="Five things, one to five stars each. All five are needed before you can send it."
        className="mt-8"
      >
        <div className="mt-4 max-w-[62ch]">
          {CATEGORIES.map((c) => (
            <StarTrack
              key={c.id}
              category={c}
              value={ratings[c.id] ?? null}
              onChange={(n) => setRatings((prev) => ({ ...prev, [c.id]: n }))}
            />
          ))}
        </div>
      </TripSection>

      <TripSection
        id="written"
        heading="Your review"
        sub={`This is the public part. ${TRIP.host} and anyone reading the listing will see it.`}
        className="mt-8"
      >
        <Textarea
          className="mt-4 max-w-overlay-dialogMd"
          id="review-text"
          label="What would help the next guest?"
          hint="What stood out, what you would tell a friend, and anything you wish you had known."
          value={review}
          onChange={setReview}
          rows={6}
        />
      </TripSection>

      <TripSection
        id="private"
        heading={`A private note to ${TRIP.host}`}
        className="mt-8"
      >
        {/*
          A separate channel, and it is drawn as one. TASTE §1: a bounded input
          group is a form boundary, so it carries a border and casts no shadow —
          the border is what makes "this goes somewhere else" visible rather than
          merely stated. `ga-099` puts the same content in a tinted panel; the
          tint is `bg.raised`'s five jobs and a form container is not one of them.
        */}
        <div className="mt-4 max-w-overlay-dialogMd rounded-lg border border-border-default bg-canvas p-4">
          <p className="text-bodySm font-regular leading-relaxed text-secondary">
            <b className={payload}>Only {TRIP.host} sees this.</b> It is not part of your public
            review and it does not appear on the listing.
          </p>
          <Textarea
            className="mt-3"
            id="review-private"
            label={`Anything just for ${TRIP.host}?`}
            hint="Optional."
            value={privateNote}
            onChange={setPrivateNote}
            rows={3}
          />
        </div>
      </TripSection>

      {/*
        The both-sides rule, without a number.

        GUEST-SHELL.md §14: DESIGN.md §9-J's 14-day PUBLIC-RESPONSE window may be
        stated verbatim; any other number is invented, and the cards' "or after
        14 days" reveal window is a different mechanism no document sets. What is
        true and useful is the mechanism itself, which the listing page already
        publishes: "after a stay, guest and host review each other, and nothing
        appears here until a real guest has written one."
      */}
      <p className="mt-8 max-w-[62ch] rounded-md bg-raised px-4 py-3 text-bodySm font-regular leading-relaxed text-secondary">
        <b className={payload}>Reviews are two-way.</b> Yours and {TRIP.host}&rsquo;s stay hidden
        until you have both written one, then they appear together — so neither of you is writing
        in answer to the other.
      </p>

      <div className="mt-8 max-w-[62ch] border-t border-hairline pt-6">
        <button
          type="button"
          disabled={!complete}
          onClick={() => setSent(true)}
          className={`${btnBase} ${btnLg} ${
            complete ? btnPrimary : "cursor-default border-border-default bg-raised text-disabled"
          }`}
        >
          Send your review
        </button>

        {/*
          §12: the disabled control explains itself and names the fix. The count
          is a fact about the form, not a scold — GUEST-SHELL.md §13's "the tone
          is a colleague's". Wrapped in one `<span>` so the `.num` run cannot
          become its own flex item.
        */}
        {complete ? null : (
          <p className="mt-3 text-bodySm font-regular text-secondary">
            <span>
              <Num>{`${rated} of ${CATEGORIES.length} rated`}</Num>
            </span>
            {" — rate the rest to send it."}
          </p>
        )}
      </div>
    </>
  );
}

/* ——— the star track ——————————————————————————————————————————————————————— */

/**
 * One dimension: a name, and five real radio inputs.
 *
 * NATIVE RADIOS, NOT BUTTONS. Five `<button role="radio">`s would need roving
 * tabindex and hand-written arrow keys; five `<input type="radio">` sharing a
 * `name` get all of that from the browser, in every locale, including the
 * right-to-left arrow mapping. The `role="radiogroup"` wrapper is only there to
 * carry the group's accessible name.
 *
 * `size-11` is 44px — the minimum target GUEST-SHELL.md §6 asks of a row, and
 * five of them still fit the 62ch column at every width.
 */
function StarTrack({
  category,
  value,
  onChange,
}: {
  readonly category: Category;
  readonly value: number | null;
  readonly onChange: (n: number) => void;
}) {
  const labelId = `${category.id}-label`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-hairline py-2 first:border-t-0">
      <span id={labelId} className="text-bodyMd font-medium text-primary">
        {category.label}
      </span>

      <div role="radiogroup" aria-labelledby={labelId} className="flex items-center">
        {STARS.map((n) => (
          <label
            key={n}
            className={`relative grid size-11 cursor-pointer place-items-center rounded-md hover:bg-raised ${pressableCircle}`}
          >
            <input
              type="radio"
              name={category.id}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              aria-label={n === 1 ? "1 star" : `${n} stars`}
              className="peer sr-only"
            />
            {/* Later sibling of the peer input — see `controlRing`. */}
            <span aria-hidden="true" className={`${controlRing} rounded-md`} />
            <StarGlyph filled={value != null && n <= value} className="size-6" />
          </label>
        ))}
      </div>
    </div>
  );
}

/**
 * The one glyph on this screen, drawn here rather than in `components/icons.tsx`.
 *
 * Every other icon on the site is an outline path on the shared `Glyph` wrapper,
 * which hard-codes `fill="none"`. A star is one of TASTE §11.3's two sanctioned
 * SOLID marks, so it cannot use that wrapper, and it is currently needed by one
 * screen. Flagged for hoisting into `components/icons.tsx` as its own solid
 * variant the moment a second surface renders a star — `pressableSurface` in
 * `components/ui.ts` records the same courtesy in the other direction.
 *
 * Ink in both states (§11.4): `text.primary` filled, `text.tertiary` in outline.
 * Never `warning.fg`, which is what the cards ship.
 */
function StarGlyph({
  filled,
  className = "",
}: {
  readonly filled: boolean;
  readonly className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      strokeLinejoin="round"
      className={`${className} ${filled ? "text-primary" : "text-tertiary"}`}
    >
      <path d="M12 3.2l2.7 5.7 6.1.9-4.4 4.4 1.1 6.2L12 17.5 6.5 20.4l1.1-6.2L3.2 9.8l6.1-.9z" />
    </svg>
  );
}

/* ——— GA-100 ——————————————————————————————————————————————————————————————— */

/**
 * The confirmation — `ga-064`'s success lineage: a quiet tick, no confetti, no
 * counting animation, no celebration.
 *
 * It recaps what was written and nothing else. No aggregate, no "your review
 * helps N travellers", no rating average: there are zero real reviews on this
 * product, and a number here would be the first one invented.
 */
function Submitted({
  headingRef,
  ratings,
  review,
  hasPrivateNote,
  stayRange,
}: {
  readonly headingRef: RefObject<HTMLHeadingElement | null>;
  readonly ratings: Ratings;
  readonly review: string;
  readonly hasPrivateNote: boolean;
  readonly stayRange: string;
}) {
  const written = review.trim();

  return (
    <>
      <TripBackLink href={tripPath()}>Your trip</TripBackLink>

      <TripPageHead
        className="mt-5"
        headingRef={headingRef}
        title="Review sent"
        sub={
          <>
            Thank you. Your review of{" "}
            <span>
              <Num>{TRIP.home}</Num>
            </span>{" "}
            is with {TRIP.host}.
          </>
        }
      />

      <ExampleBookingStrip className="mt-6">
        Nothing was sent and nothing was saved — this screen is what the real one would say.
      </ExampleBookingStrip>

      <div className="mt-8 flex max-w-[62ch] items-start gap-4 border-t border-hairline pt-6">
        <span
          aria-hidden="true"
          className="grid size-11 flex-none place-items-center rounded-full border border-border-default bg-sunken text-secondary"
        >
          <CheckMark className="size-5" />
        </span>
        <div>
          <p className="text-bodyMd font-semibold text-primary">Waiting on {TRIP.host}</p>
          <p className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">
            Your review stays hidden until {TRIP.host} writes hers. When she does, both appear
            together on the listing and on your profiles.
          </p>
        </div>
      </div>

      <TripSection id="recap" heading="What you sent" className="mt-8">
        <p className="mt-2 max-w-[62ch] text-bodySm font-regular text-secondary">
          <span>
            <Num>{`${TRIP.home} · ${stayRange}`}</Num>
          </span>
        </p>

        <dl className="mt-4 max-w-[62ch]">
          {CATEGORIES.map((c) => {
            const n = ratings[c.id] ?? 0;
            return (
              <div
                key={c.id}
                className="flex items-center justify-between gap-6 border-t border-hairline py-2.5 first:border-t-0"
              >
                <dt className="text-bodySm text-secondary">{c.label}</dt>
                <dd
                  className="flex items-center"
                  role="img"
                  aria-label={`${c.label}: ${n} out of 5`}
                >
                  {STARS.map((s) => (
                    <StarGlyph key={s} filled={s <= n} className="size-4" />
                  ))}
                </dd>
              </div>
            );
          })}
        </dl>

        {written === "" ? null : (
          <blockquote className="mt-5 max-w-[62ch] border-s-2 border-hairline ps-4 text-bodyMd font-regular leading-relaxed text-secondary">
            {written}
          </blockquote>
        )}

        {hasPrivateNote ? (
          <p className="mt-4 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
            Your private note went to {TRIP.host} on its own. It is not part of the review above.
          </p>
        ) : null}
      </TripSection>

      <div className="mt-8 flex max-w-[62ch] flex-wrap items-center gap-x-6 gap-y-3 border-t border-hairline pt-6">
        <Link href="/trips" className={`${btnSecondary} no-underline`}>
          Back to your trips
        </Link>
        <Link href={tripPath()} className={`${inlineAction} text-bodySm font-medium`}>
          Your trip
        </Link>
        <Link
          href="/messages/host-margalla-view"
          className={`${inlineAction} text-bodySm font-medium`}
        >
          Message {TRIP.host}
        </Link>
      </div>
    </>
  );
}
