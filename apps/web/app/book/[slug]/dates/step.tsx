"use client";

import { useCallback, useState } from "react";

import { CheckoutStep } from "@/components/booking/checkout-step";
import { DateRangePicker } from "@/components/booking/date-range-picker";
import { dateRange, shortDate } from "@/components/booking/calendar-model";
import { AlertCircleIcon, InfoIcon } from "@/components/icons";
import { Num, Phrase } from "@/components/numerals";
import {
  fieldErrorLine,
  fieldGroup,
  fieldGroupInvalid,
  fieldLabel,
  inlineAction,
} from "@/components/ui";
import { GuestStepper, guestBandCeiling } from "@/components/ui/guest-stepper";
import {
  canView,
  countedGuests,
  isOverCapacity,
  nights,
  stayIssues,
} from "@/lib/booking/booking";
import type { GuestCounts } from "@/lib/booking/booking";
import { useBooking } from "@/lib/booking/booking-state";
import { checkoutHref, listingName, listingSlug } from "@/lib/content/listings";
import type { GuestBand, ListingContent } from "@/lib/content/listings/is-f7-2bed";

/**
 * GW-021 — `/book/{slug}/dates`, step 0 of web checkout and the screen the
 * `gw-004` booking widget opens.
 *
 * It owns two form groups and the copy around them. The frame — back row, page
 * head, two-column split, summary rail, mobile bar — is `CheckoutStep`; the
 * calendar is `components/booking/date-range-picker.tsx`; the money formatter is
 * `lib/money.ts`; the ± row is `components/ui/guest-stepper.tsx`. Nothing here
 * re-derives a date rule, a capacity rule or a price: every one of them comes
 * out of `lib/booking/booking.ts`, so this screen and the calendar drawn beneath
 * it cannot reach different conclusions about the same night.
 *
 * NO STEPPER ON THIS SCREEN
 * -------------------------
 * `step={null}`. `gw-021` draws a fifth state — PRE, four unstarted circles — and
 * the build brief overrides it: the stepper starts at Party. Dates and guests
 * precede step 1, so there is no position to claim. See `CheckoutStep`'s own
 * note; the divergence is deliberate and is logged rather than quietly made.
 *
 * WHY THE PRIMARY IS GATED BY `canView` AND NOT BY A LOCAL BOOLEAN
 * ----------------------------------------------------------------
 * `reachedStep` / `canView` in `lib/booking/booking.ts` are the guard model the
 * whole flow shares — the same functions a later step calls before it renders,
 * so a guest who deep-links to `/price` with nothing chosen is sent back here
 * rather than shown a total for dates nobody picked. Asking `canView("party")`
 * for the SAME question, rather than re-testing dates and capacity locally,
 * means the button that opens step 1 and the guard that admits step 1 can never
 * disagree. The blocking sentence below is the only thing this file derives, and
 * it derives it from `stayIssues` — the same function `canView` used.
 *
 * TIME IS A PROP, NOT A READING
 * -----------------------------
 * `today` arrives from the server component beside this one. `booking.ts` keeps
 * every date rule free of `Date.now()` so the same input always produces the
 * same screen, and a calendar that read the clock on the client would render one
 * grid on the server and a different one after hydration on any day that turns
 * over mid-request.
 */

export interface DatesStepProps {
  readonly listing: ListingContent;
  /** `YYYY-MM-DD` in Asia/Karachi. Resolved by `page.tsx`; never read here. */
  readonly today: string;
}

/** §2's `.fsec` — 28px of air, hairline-separated, the first one open at the top. */
const section = "border-t border-hairline py-7 first:border-t-0 first:pt-6";
const sectionHeading = "text-h5 text-primary";
const sectionSub = "mt-2 max-w-[62ch] text-bodySm text-secondary";
/** The payload inside a `sec-sub` — §12: bold the number, never the sentence. */
const payload = "font-semibold text-primary";

export default function DatesStep({ listing, today }: DatesStepProps) {
  const { draft, setDates, setGuests } = useBooking();
  const { guests } = draft;

  /**
   * Bumping this remounts the picker, which is how `DateRangePicker` documents
   * a full clear: `onChange(null)` drops a COMMITTED range, but a half-made
   * selection — a check-in waiting for its partner — lives inside the picker and
   * is not reachable from out here. "Clear dates" has to clear both or it is
   * lying about what it did.
   */
  const [pickerGeneration, setPickerGeneration] = useState(0);

  const clearDates = useCallback(() => {
    setDates(null);
    setPickerGeneration((n) => n + 1);
  }, [setDates]);

  const setBand = useCallback(
    (band: GuestBand, next: number) => {
      setGuests({ ...guests, [band]: next });
    },
    [guests, setGuests],
  );

  const slug = listingSlug(listing);
  const span = nights(draft.dates);
  const overCapacity = isOverCapacity(guests, listing.capacity);
  const blocked = blockingReason(draft.dates, guests, listing);
  const ready = canView("party", draft);

  return (
    <CheckoutStep
      step={null}
      listing={listing}
      heading="Your dates and guests"
      sub="Pick the nights and who is coming. Nothing is charged yet."
      backHref={listing.path}
      backLabel={`Back to ${listingName(listing)}`}
      nextHref={checkoutHref(slug, "party")}
      nextDisabled={!ready}
      nextLabel="Continue to party type"
      /* The `.ctanote` is a fixed slot, never an appearing one: the reassurance
         line when the primary is live, the blocking reason when it is not. §12:
         every disabled control explains itself. */
      note={blocked ?? "You will not be charged yet."}
    >
      {/*
        A real `<form>`, per §11.1's authoritative panel. It has no submit
        control of its own — the fixed frame API makes the primary a link — but
        `action` is the honest destination, so a stray Enter lands where the
        button would have.
      */}
      <form id="reserve-form" action={checkoutHref(slug, "party")} method="get">
        <section aria-labelledby="dates-h" className={section}>
          <h2 id="dates-h" className={sectionHeading}>
            Dates
          </h2>
          <p className={sectionSub}>
            <StayWindow listing={listing} />
          </p>

          {/*
            §4: ONE form group, two cells, hairline divider, interior corners
            square. `overflow-hidden` on the group is what makes "square
            interior corners" true for free — the cells draw square and the
            group's own radius clips the outer four, including the editing
            ring's inset stroke.

            The cells are NOT buttons. On `gw-021` they open a picker; here the
            picker is already open in the space directly below and never closes,
            so a button whose whole job is to reveal a visible thing would answer
            a press by doing nothing. They read the state instead.
          */}
          <div className={`mt-5 grid grid-cols-2 ${fieldGroup}`}>
            <DateCell
              label="Check-in"
              iso={draft.dates?.checkIn ?? null}
              /* §5's `.editing` — a 2px INSET ink ring, never a real border (it
                 would shift the row) and never a fill change (TASTE §11.18).
                 It marks the cell the next tap on the calendar fills, which is
                 the check-in until a stay exists and neither once one does. */
              editing={draft.dates === null}
              className="border-e border-hairline"
            />
            <DateCell
              label="Check-out"
              iso={draft.dates?.checkOut ?? null}
              editing={false}
            />
          </div>

          <div className="mt-3 flex max-w-overlay-dialogMd items-center gap-4">
            <span className="text-bodySm text-secondary">
              {draft.dates === null ? (
                "Pick a check-in night to start"
              ) : (
                <>
                  <b className={payload}>
                    <span className="num">{span}</span> {span === 1 ? "night" : "nights"}
                  </b>
                  {" · "}
                  <Num>{dateRange(draft.dates.checkIn, draft.dates.checkOut)}</Num>
                </>
              )}
            </span>

            {/* Disabled, visible, in place (TASTE §11.7) — and with the underline
                dropped, because §8's underline-at-rest marks a thing that acts
                and this one has nothing to clear. */}
            {draft.dates === null ? (
              <span
                aria-disabled="true"
                className="ms-auto flex-none cursor-default text-bodySm font-medium text-disabled"
              >
                Clear dates
              </span>
            ) : (
              <button
                type="button"
                onClick={clearDates}
                className={`${inlineAction} ms-auto flex-none text-bodySm font-medium`}
              >
                Clear dates
              </button>
            )}
          </div>

          {/* §4 / TASTE §1's "carries NEITHER", applied on purpose to the
              largest object on the page: the calendar sits in open space with no
              box, no card and no second border. Box-in-box is banned. */}
          <DateRangePicker
            key={pickerGeneration}
            listing={listing}
            value={draft.dates}
            onChange={setDates}
            today={today}
            labelledBy="dates-h"
          />
        </section>

        <section aria-labelledby="guests-h" className={section}>
          <h2 id="guests-h" className={sectionHeading}>
            Guests
          </h2>
          <p className={sectionSub}>
            {/* A17: a bolded `.num` mid-sentence, and the sentence broke around
                it under RTL — `. Infants do not count toward the limit. This
                home sleeps up to 6`. */}
            <Phrase>
              This home sleeps up to{" "}
              <b className={payload}>
                <span className="num">{listing.capacity.maxGuests}</span>
              </b>
              . Infants do not count toward the limit.
            </Phrase>
          </p>

          <div
            className={`mt-5 ${fieldGroup} ${overCapacity ? fieldGroupInvalid : ""}`}
          >
            <GuestStepper
              label="Adults"
              hint={<Num>Ages 13 and up</Num>}
              value={guests.adults}
              /* A stay needs one. §5's floor, and the reason `−` opens disabled
                 on a fresh draft rather than counting down to nobody. */
              min={1}
              max={guestBandCeiling("adults", guests, listing.capacity)}
              countLabel={plural(guests.adults, "adult", "adults")}
              decrementLabel="Remove one adult"
              incrementLabel="Add one adult"
              onChange={(next) => setBand("adults", next)}
            />
            <GuestStepper
              label="Children"
              hint={<Num>Ages 2–12</Num>}
              value={guests.children}
              max={guestBandCeiling("children", guests, listing.capacity)}
              countLabel={plural(guests.children, "child", "children")}
              decrementLabel="Remove one child"
              incrementLabel="Add one child"
              onChange={(next) => setBand("children", next)}
            />
            <GuestStepper
              label="Infants"
              hint={<Num>Under 2 · stays free</Num>}
              value={guests.infants}
              /* `null`, not a number. BUILD-DECISIONS §16 forbids inventing an
                 infant cap, and `guestBandCeiling` returns null for any band the
                 listing does not count — read off the host's own disclosure
                 rather than special-cased here. */
              max={guestBandCeiling("infants", guests, listing.capacity)}
              countLabel={plural(guests.infants, "infant", "infants")}
              decrementLabel="Remove one infant"
              incrementLabel="Add one infant"
              onChange={(next) => setBand("infants", next)}
            />
          </div>

          {/* §5: colour is never the only signal — the group's border moves to
              `error.fg` AND this line ships, with a glyph and a sentence that
              names the next action. Register is right: this is a fact about a
              FIELD, not a verdict on the guest (ruling 11). */}
          {overCapacity ? (
            <p className={fieldErrorLine}>
              <AlertCircleIcon className="mt-px size-4 shrink-0" />
              <span>
                <Num>
                  {`This booking has ${countedGuests(guests, listing.capacity)} guests and this home sleeps ${listing.capacity.maxGuests}. Remove one guest to continue.`}
                </Num>
              </span>
            </p>
          ) : null}

          {/* Ruling 4 fixes `.ghint` at 18px; the spacing scale runs 16 → 20 with
              nothing between, so `mt-5` is the rung. Flagged rather than bracketed
              — a raw px here would be the first one in this file. */}
          <p className="mt-5 flex max-w-[62ch] items-start gap-2.5 text-label font-regular leading-relaxed text-secondary">
            <InfoIcon className="mt-0.5 size-4 shrink-0 text-tertiary" />
            {/* ONE span, always: `Num` splits a string into a node per digit run,
                and as bare children of a `gap-2.5` row each run becomes its own
                flex item with 10px of air around the numeral (ruling 22). */}
            <span>
              <b className={payload}>Who is travelling together is the next step.</b> You
              will choose the party type on step <span className="num">1</span>, and only
              then share the document this host&rsquo;s policy needs. Nothing about your
              party is shared before that.
            </span>
          </p>
        </section>
      </form>
    </CheckoutStep>
  );
}

/* ——— pieces ——————————————————————————————————————————————————————————————— */

function DateCell({
  label,
  iso,
  editing,
  className = "",
}: {
  readonly label: string;
  readonly iso: string | null;
  readonly editing: boolean;
  readonly className?: string;
}) {
  return (
    <div
      className={`px-4 py-3 ${
        editing ? "rounded-md ring-2 ring-inset ring-selected" : ""
      } ${className}`}
    >
      <span className={fieldLabel}>{label}</span>
      {/* §5: an empty value is `text.secondary`, NEVER `text.tertiary` — that
          role is large-only (DESIGN §11) and this is 16px a guest has to read. */}
      <span
        className={`mt-1 block text-bodyMd ${iso === null ? "text-secondary" : "text-primary"}`}
      >
        {iso === null ? "Add a date" : <Num>{shortDate(iso)}</Num>}
      </span>
    </div>
  );
}

/**
 * "Check-in after 2:00 PM · Check-out before 11:00 AM. Minimum stay 2 nights."
 *
 * The times are READ OFF the listing's own house rules rather than written here:
 * they are a per-home host disclosure (`gw-004`'s rules list owns them), and a
 * second copy in a checkout step is a second copy that drifts the first time a
 * host changes a check-in window. If the rule is absent, the sentence is the
 * minimum stay alone — an absent fact is suppressed, never guessed at.
 */
function StayWindow({ listing }: { readonly listing: ListingContent }) {
  const rule = listing.rules.items.find((item) => item.id === "check-in");
  const minNights = listing.capacity.minNights;

  return (
    /*
     * A17: three isolates across two sentences, and the trailing one took the
     * paragraph direction under RTL — every `/book/{slug}` step opened this line
     * `. Minimum stay 2 nights. Check-in after 2:00 PM · Check-out before 11:00
     * AM`. The isolate is the whole note, so it belongs on the component that
     * composes it rather than on each of the seven surfaces that print it.
     */
    <Phrase>
      {rule === undefined ? null : (
        <>
          <Num>{rule.detail === undefined ? rule.title : `${rule.title} · ${rule.detail}`}</Num>.{" "}
        </>
      )}
      Minimum stay{" "}
      <b className={payload}>
        <span className="num">{minNights}</span> {minNights === 1 ? "night" : "nights"}
      </b>
      .
    </Phrase>
  );
}

/* ——— derivations ————————————————————————————————————————————————————————— */

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * Why the primary cannot be pressed yet, or `null` when it can — and it names
 * ONE action every time (§12: every error names its next action).
 *
 * The order is the order a guest hits them: no dates at all, then a range the
 * host cannot honour, then a party the home cannot hold. Each branch reads a
 * `StayIssue` straight out of `stayIssues`, which is the same function
 * `canView("party")` consults, so this sentence cannot claim a problem the guard
 * does not have or stay silent about one it does.
 */
function blockingReason(
  dates: { readonly checkIn: string; readonly checkOut: string } | null,
  guests: GuestCounts,
  listing: ListingContent,
): string | null {
  if (dates === null) return "Pick your dates to continue.";

  const issues = stayIssues(dates, listing);
  if (issues.includes("checkout-not-after-checkin")) {
    return "Pick a check-out night after your check-in.";
  }
  if (issues.includes("blocked-night")) {
    return "One of those nights is taken. Pick a run of free nights to continue.";
  }
  if (issues.includes("below-minimum")) {
    const min = listing.capacity.minNights;
    return `This host asks for at least ${min} nights. Add a night to continue.`;
  }
  if (isOverCapacity(guests, listing.capacity)) {
    return `This home sleeps ${listing.capacity.maxGuests}. Remove a guest to continue.`;
  }
  return null;
}
