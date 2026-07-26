"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, type ReactNode } from "react";

import { ArrowLeftIcon, LockIcon } from "@/components/icons";
import { FeesReceiptIcon, ShieldCheckIcon } from "@/components/home-icons";
import { CheckMark } from "@/components/ui/marks";
import { Num } from "@/components/numerals";
import { fieldLabel, focusRing, inlineAction, pressable } from "@/components/ui";
import { formatPkr } from "@/lib/money";
import { countedGuests, isOverCapacity, nights, staySubtotal } from "@/lib/booking/booking";
import type { GuestCounts } from "@/lib/booking/booking";
import { useBooking } from "@/lib/booking/booking-state";
import {
  checkoutHref,
  listingName,
  listingPlaceLine,
  listingSlug,
} from "@/lib/content/listings";
import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";
import { dateRange } from "./calendar-model";

/**
 * The checkout frame — `CHECKOUT-SHELL.md` §2's skeleton, and the one component
 * all seven steps sit inside.
 *
 * A step passes its number, its heading, its two destinations, the reason its
 * primary is blocked, and its body. It gets the back row, the page head, the
 * two-column split, the stepper, the sticky summary rail, the mobile identity
 * strip and the mobile action bar. **Nothing about the frame is a step's
 * decision** — the same argument `components/host/wizard-step.tsx` makes for the
 * nine host steps: seven steps drawing their own rails is seven chances for one
 * of them to reorder a row, lose the trust block, or give the rail a second
 * green thing.
 *
 * BUILD-DECISIONS ruling 0: **the card CSS is not ported.** The cards are the
 * specification; this is Tailwind against `@salamstay/design-tokens`, matching
 * the card's rendered result. Every class below names a token role.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT THE LAYOUT OWNS AND THIS DOES NOT
 * --------------------------------------
 * `app/book/[slug]/layout.tsx` owns the reduced header (§2 chrome), the reduced
 * footer, the `<main class="co-main">` landmark and mounting `BookingProvider`.
 * This component starts at `.wrap` and ends at the mobile bar.
 *
 * WHERE THE RAIL'S VALUES COME FROM
 * ---------------------------------
 * `useBooking()`, not props. §4 makes the rail invariant across all seven cards
 * — same rows, same order, nothing added or reordered — and a rail fed by seven
 * call sites is a rail seven authors can disagree about. The draft is the single
 * source: dates, guests and the stay subtotal are read here, so a step that
 * changes them does not also have to remember to tell the rail.
 *
 * THREE OPTIONAL SLOTS BEYOND THE AGREED API
 * ------------------------------------------
 * `banner`, `railRows` and `railMoney` are **additive** — every call site
 * written against the agreed prop list compiles untouched. They exist because
 * the contract requires three things the agreed list has nowhere to put:
 *
 *  · `banner` — §11.3 makes the page-level warning/error banner a register EVERY
 *    checkout card ships, and §2 fixes its position: above `.cols2`, full width.
 *    Without a slot it would land inside `.lmain`, in the wrong column at the
 *    wrong width.
 *  · `railRows` — §4: "Steps 1–4 add their own rows ONLY between `.sumrow` and
 *    `.pline`". That is the party step's chosen-party row and nothing else.
 *  · `railMoney` — §4/§6 and the §15 amendment: the Price step REPLACES `.pline`
 *    with the itemised `<dl>`, and the Confirm step shows subtotal → fees →
 *    total. Both are money the frame cannot compute (`booking.ts` deliberately
 *    owns no fee arithmetic, because a derived fee is an invented number).
 *
 * Supply none of them and the rail is exactly §4's default shape.
 */

/** The four named circles. Party → Verify → Price → Confirm, locked (§3). */
const STEP_NAMES = ["Party", "Verify", "Price", "Confirm"] as const;

export type CheckoutStepNumber = 1 | 2 | 3 | 4;

export interface CheckoutStepProps {
  /**
   * `1`–`4` draws the named-circle stepper. **`null` draws no stepper at all** —
   * step 0 (`/dates`) and the post-flow surfaces.
   *
   * THIS IS A KNOWN DIVERGENCE FROM `gw-021`, and it is deliberate rather than
   * an omission. The card draws a fifth stepper state on step 0 — PRE, four
   * unstarted circles with no `aria-current` — so the guest can see the shape of
   * what follows. The build brief overrides it: the stepper starts at Party.
   * `.done`/`.cur` are the only states this component draws, which is also why
   * it needs no PRE branch. Post-flow shipping no stepper is §3's own rule.
   */
  readonly step: CheckoutStepNumber | null;
  readonly listing: ListingContent;
  /** The page's one `<h1>`. Not an SEO artefact (§1) — its accessible title. */
  readonly heading: string;
  readonly sub: ReactNode;
  /**
   * §15: back means ONE STEP BACK inside the flow, and the listing only on step
   * 0. `Save & exit` in the header is the route out.
   *
   * **`null` draws no back row at all**, for the post-flow surfaces. It is not
   * the wizard's disabled-and-in-place `Back` (`wizard-step.tsx`), and the
   * difference is real: that footer keeps the control because its caption is
   * centred on a three-cell grid that would shift without it. Here the back row
   * is a line of its own, there is nothing to hold in place, and after a booking
   * exists there is genuinely nowhere back to — §15 is why the header action
   * reads `Done` on those screens rather than `Save & exit`. A disabled `Back`
   * on a confirmation would be a control offering a direction that does not
   * exist.
   */
  readonly backHref: string | null;
  /** "Back to Margalla View Apartment" on step 0; defaults to "Back". */
  readonly backLabel?: string | undefined;
  readonly nextHref: string;
  /**
   * Disabled means **visible, in place, same label** (TASTE §11.7), with the
   * reason in `note`. Never hidden, never removed, never a note that appears
   * and shoves the rail by a line.
   */
  readonly nextDisabled?: boolean | undefined;
  readonly nextLabel?: string | undefined;
  /**
   * §4's `.ctanote`, and it is **required** — that is the whole anti-reflow
   * mechanism. It is a fixed slot: the reassurance line when the primary is
   * live ("You will not be charged yet."), the blocking reason when it is not
   * ("Pick your dates to continue."). §12: every disabled control explains
   * itself. A plain string is run through `Num`; pass JSX to bold a payload.
   */
  readonly note: ReactNode;
  /** `false` only on the post-flow surfaces (§4 has no rail to keep there). */
  readonly showRail?: boolean | undefined;
  /** §11.3's page-level register. Above `.cols2`, full width. See the file note. */
  readonly banner?: ReactNode | undefined;
  /** §4: extra rail rows, between the summary rows and the money. Steps 1–4. */
  readonly railRows?: ReactNode | undefined;
  /** §4/§6: replaces the default `.pline` + deferral strip. Price and Confirm. */
  readonly railMoney?: ReactNode | undefined;
  readonly children: ReactNode;
}

/**
 * §4's collapse width is 1080. It is not a Tailwind breakpoint and not a design
 * token — it is the width at which the 1fr + 348 split stops fitting — so it is
 * written as the arbitrary variant it is rather than rounded to `lg` (1024),
 * where the rail would still be beside the form at 200-odd pixels wide.
 * `components/booking/date-range-picker.tsx` states the same number and drops to
 * one month there; the two must not disagree.
 *
 * **`min-[1080px]:` is spelled out at every single call site below, and it must
 * stay that way.** It was a `const WIDE = "min-[1080px]"` interpolated into
 * template strings for one pass, and every responsive rule in this file silently
 * did nothing: Tailwind extracts candidates by scanning source TEXT, so
 * `` `${WIDE}:hidden` `` is not a class it can see. The failure is quiet in the
 * worst way — `grid-cols-[minmax(0,1fr)_348px]` still appeared in the file, so
 * Tailwind generated the UNPREFIXED utility and the rail rendered at every
 * width... beneath the form, with the mobile bar stacked under it, at 1440px.
 * A partial class name is never a variable.
 */

/**
 * §2: `max-width:1100; padding:0 28`. `container.page` (1120) is the rung —
 * there is no 1100 on the scale and inventing one for a 20px difference would
 * put a raw width in app code. 28 is Tailwind's `7`, 20 (`.mob .wrap`) its `5`.
 */
const wrap = `mx-auto w-full max-w-page px-5 md:px-7`;

/**
 * §8: the rail is the ONE element on checkout allowed border AND shadow —
 * TASTE §1's sanctioned exception, because it genuinely is both a float over a
 * scrolling form and a form boundary. `elevation.floating`, not `card`: the
 * token's documented use is "sticky booking panels", which is this exactly.
 *
 * **`sticky` is on the CARD, not on the `<aside>` that holds it**, and that is
 * load-bearing rather than tidy. The `<aside>` is the grid item; a sticky grid
 * item whose column is `align-items: start` is sized to its own content, so its
 * constraint rectangle has no travel in it and the rule silently does nothing —
 * which is what shipped for one pass here: `position: sticky` was in the
 * stylesheet, applied, and the rail scrolled away regardless. Letting the item
 * stretch (the grid default) and sticking the card INSIDE it is the shape
 * `components/listing/listing-booking-card.tsx` already uses on the listing
 * page, where it works.
 */
const railCard =
  "rounded-xl border border-border-default bg-canvas p-5 shadow-floating min-[1080px]:sticky min-[1080px]:top-6";

/**
 * The primary's shape, shared by both states so the two renderings cannot drift
 * in width — which is the whole content of "same size, same place" (§5).
 *
 * `min-h-12` is 48 where §4 draws 50; there is no 50 rung and 48 is the
 * neighbour, and it is the height `wizard-step.tsx` already gives the same
 * button on the host side. `rounded-full` is TASTE §4's ladder, not gw-004's
 * `radius.md`.
 */
const ctaShape =
  "flex min-h-12 select-none items-center justify-center whitespace-nowrap rounded-full text-bodyMd font-semibold";

/**
 * §5: disabled is `bg.raised` + `text.disabled`, visible and in place.
 *
 * THE BORDER IS NOT DECORATION. `bg.raised` against `bg.canvas` measures 1.06:1
 * in light and 1.08:1 in dark, so without an edge the disabled primary renders
 * as dim text floating in the rail with no shape at all — and it is the FIRST
 * thing a guest sees on `/dates`, before any date is picked. `wizard-step.tsx`
 * hit this on the host side, measured it, and fixed it the same way. The label
 * keeps `text.disabled` deliberately: that is the house token for disabled text
 * everywhere, and its contrast is a system-level question logged at GO-LIVE C7.
 */
const ctaDisabled = "cursor-default border border-border-default bg-raised text-disabled";

/** §7 role 2 — the one enabled primary, and this surface's whole green budget
 *  after the wordmark dot and the verification shield. */
const ctaEnabled = `bg-interactive text-on-brand hover:bg-interactive-hover ${pressable}`;

export function CheckoutStep({
  step,
  listing,
  heading,
  sub,
  backHref,
  backLabel = "Back",
  nextHref,
  nextDisabled = false,
  nextLabel = "Continue",
  note,
  showRail = true,
  banner,
  railRows,
  railMoney,
  children,
}: CheckoutStepProps) {
  const { draft } = useBooking();
  /**
   * TWO ids, not one. The primary is drawn twice at two widths — in the rail
   * above 1080, in the sticky bar below it — and each rendering needs its own
   * `.ctanote` to point `aria-describedby` at. Sharing one id would mean the
   * mobile primary described itself with a `display:none` element in a column
   * that is not on screen, which is a blocked button on a phone whose reason a
   * guest may never be told. §11.2: no dead ends.
   */
  const noteBase = useId();
  const railNoteId = `${noteBase}-rail`;
  const barNoteId = `${noteBase}-bar`;

  const slug = listingSlug(listing);
  const datesHref = checkoutHref(slug, "dates");
  const subtotal = staySubtotal(draft);
  const span = nights(draft.dates);

  return (
    <>
      <div className={wrap}>
        {/* §1: no breadcrumb on any checkout route. One ink, underlined link
            (TASTE §8, underline-at-rest). §15: it points one step back inside
            the flow; only step 0 points at the listing; post-flow it is absent. */}
        {backHref === null ? null : (
          <div className="pt-5">
            <Link
              href={backHref}
              className={`${inlineAction} inline-flex items-center gap-2 text-bodySm font-medium`}
            >
              {/* Mirrored under RTL — the arrow means "the way I came", which is
                  the other side of the screen in an RTL layout. */}
              <ArrowLeftIcon className="size-4 shrink-0 rtl:-scale-x-100" />
              <span>
                <Num>{backLabel}</Num>
              </span>
            </Link>
          </div>
        )}

        {/* §4's mobile collapse, first half: the listing identity folds to a
            compact strip above the page head, because below 1080 the rail that
            carries it has left the flow and a guest should not have to reach the
            foot of a calendar to see which home they are booking. */}
        {showRail ? (
          <div className={`mt-4 flex items-center gap-3 min-[1080px]:hidden`}>
            <ListingThumb listing={listing} />
            <ListingIdentityText listing={listing} />
          </div>
        ) : null}

        <div className="pb-6 pt-5">
          <h1 className="text-h3 font-semibold text-primary">
            <Num>{heading}</Num>
          </h1>
          <p className="mt-2 max-w-[56ch] text-bodyMd text-secondary">
            {typeof sub === "string" ? <Num>{sub}</Num> : sub}
          </p>
        </div>

        {/* §2: the page-level banner sits HERE — above the split, full width, so
            a conflict the guest has to resolve is not narrower than the form it
            is about. */}
        {banner}

        <div
          /* No `items-start`: the rail column has to STRETCH so the sticky card
             inside it has somewhere to travel. See `railCard`. */
          className={`grid border-t border-hairline pb-2 min-[1080px]:grid-cols-[minmax(0,1fr)_348px] min-[1080px]:gap-12`}
        >
          <div className="pt-1">
            {/* §3: placement is fixed — main column, immediately below the page
                head, above the first form group. Never in the header (chrome
                must not scroll away from the form), never in the rail. */}
            {step === null ? null : <Stepper step={step} />}
            {children}

            {/* With no rail there is nowhere for the primary to live, so the
                action row lands at the foot of the column. Post-flow only. */}
            {showRail ? null : (
              <div className="max-w-overlay-dialogMd pb-10 pt-8">
                <PrimaryAction
                  href={nextHref}
                  label={nextLabel}
                  disabled={nextDisabled}
                  noteId={railNoteId}
                />
                <CtaNote id={railNoteId} note={note} />
              </div>
            )}
          </div>

          {showRail ? (
            <aside
              aria-label="Booking summary"
              className={`pb-8 pt-6 min-[1080px]:pb-0`}
            >
              <div className={railCard}>
                {/* Identity, money, primary and reassurance are the four things
                    the mobile strip and the mobile bar already carry, so below
                    1080 they are suppressed HERE rather than rendered twice.
                    One rail in the DOM, two shapes — nothing duplicated, and
                    nothing announced to a screen reader twice. */}
                <div className={`hidden items-center gap-3 min-[1080px]:flex`}>
                  <ListingThumb listing={listing} />
                  <ListingIdentityText listing={listing} />
                </div>
                <Rule className={`hidden min-[1080px]:block`} />

                <SummaryRow
                  label="Dates"
                  value={<DatesValue />}
                  empty={draft.dates === null}
                  /* §15: a slot resolves to nothing or it keeps its action — it
                     never gets a different one. With no dates there is nothing
                     to change, so the action is omitted, exactly as `gw-021`'s
                     empty panel omits it. */
                  changeHref={draft.dates === null ? undefined : datesHref}
                />
                <SummaryRow
                  label="Guests"
                  value={<GuestsValue listing={listing} />}
                  empty={isOverCapacity(draft.guests, listing.capacity)}
                  changeHref={datesHref}
                  className="mt-3.5"
                />

                {railRows}

                <Rule />

                {railMoney ?? (
                  <>
                    <p className="flex items-baseline justify-between gap-3 text-bodySm text-secondary">
                      <span>
                        {subtotal === null ? (
                          <Num>{`${formatPkr(listing.pricing.nightly)} per night`}</Num>
                        ) : (
                          <>
                            <span className="num">
                              {formatPkr(listing.pricing.nightly)}
                            </span>
                            {" × "}
                            <span className="num">{span}</span>
                            {span === 1 ? " night" : " nights"}
                          </>
                        )}
                      </span>
                      {subtotal === null ? null : (
                        <span className="num text-bodyMd font-semibold text-primary">
                          {formatPkr(subtotal)}
                        </span>
                      )}
                    </p>
                    <DeferralStrip priced={subtotal !== null} />
                  </>
                )}

                <div className={`hidden min-[1080px]:block`}>
                  <div className="mt-4">
                    <PrimaryAction
                      href={nextHref}
                      label={nextLabel}
                      disabled={nextDisabled}
                      noteId={railNoteId}
                    />
                  </div>
                  <CtaNote id={railNoteId} note={note} />
                </div>

                <Trust />
              </div>
            </aside>
          ) : null}
        </div>
      </div>

      {/* §4's mobile collapse, second half. TASTE §10's sticky anchor bar:
          hairline top, opaque, **no shadow, ever**. It carries the stay's money
          and the primary, which are the two things a guest scrolling a
          two-month calendar on a phone cannot otherwise reach. */}
      {showRail ? (
        <div
          className={`sticky bottom-0 z-sticky border-t border-hairline bg-canvas px-5 pb-3.5 pt-3 min-[1080px]:hidden`}
        >
          <div className="flex items-center justify-between gap-4">
            <span className="flex min-w-0 flex-col">
              <span className="num truncate text-bodyMd font-semibold text-primary">
                {subtotal === null ? formatPkr(listing.pricing.nightly) : formatPkr(subtotal)}
              </span>
              {/* `label` (13), not `caption` (12), where the card draws `.ms-s`
                  at 12: TASTE §7's ladder bottoms out at 13, and
                  `site-footer.tsx` already made the same correction for the same
                  reason — 12 is the size a bar uses when it does not expect the
                  line to be read. */}
              <span className="truncate text-label font-regular text-secondary">
                <Num>
                  {subtotal === null ? "per night" : mobileSummary(span, draft.guests, listing)}
                </Num>
              </span>
            </span>
            <span className="flex-none">
              <PrimaryAction
                href={nextHref}
                label={nextLabel}
                disabled={nextDisabled}
                noteId={barNoteId}
                compact
              />
            </span>
          </div>
          {/* The `.ctanote` rides the bar too, and it is the same fixed slot it
              is in the rail: a phone is where a guest is most likely to meet a
              blocked primary, and a Continue that will not go with no sentence
              saying why is the dead end §11.2 rules out. It is a line, not an
              appearing element — the bar's height does not change when the
              reason does. */}
          <CtaNote id={barNoteId} note={note} />
        </div>
      ) : null}
    </>
  );
}

/* ——— the stepper ——————————————————————————————————————————————————————————
 *
 * §3's locked canon, tier one: FOUR named circles. Never the host wizard's thin
 * bars — `ha-019` forbids the swap by name in both directions. Two tiers exist
 * and there is never a third.
 */

function Stepper({ step }: { readonly step: CheckoutStepNumber }) {
  const name = STEP_NAMES[step - 1] ?? STEP_NAMES[0];

  return (
    <div className="pb-6">
      <ol aria-label="Checkout progress" className="flex max-w-md list-none items-start">
        {STEP_NAMES.map((label, i) => {
          const position = i + 1;
          const done = position < step;
          const current = position === step;
          /* The connector runs from the previous circle's centre to this one, so
             it belongs to the item on its right and the first item has none.
             `-start-1/2` is logical, so it mirrors under RTL for free. */
          const reached = done || current;

          return (
            <li
              key={label}
              {...(current ? { "aria-current": "step" as const } : {})}
              className="relative flex flex-1 flex-col items-center"
            >
              {i === 0 ? null : (
                <span
                  aria-hidden="true"
                  className={`absolute -start-1/2 top-3.5 z-0 h-0.5 w-full -translate-y-1/2 ${
                    reached ? "bg-interactive" : "bg-border-default"
                  }`}
                />
              )}
              <span
                className={`relative z-raised flex size-7 items-center justify-center rounded-full bg-canvas text-caption font-semibold ${
                  done
                    ? "border border-interactive bg-interactive text-on-brand"
                    : current
                      ? "border-2 border-interactive text-interactive"
                      : "border border-border-default text-tertiary"
                }`}
              >
                {done ? (
                  <CheckMark className="size-3.5" />
                ) : (
                  <span className="num">{position}</span>
                )}
              </span>
              {/* `text-overline` without `uppercase`: the token carries 11/600
                  and the tracking, and §3 draws these labels in sentence case.
                  `fieldLabel` adds the transform and is the FORM-label role, so
                  it is deliberately not reused here. */}
              <span
                className={`mt-2 text-overline ${
                  done ? "text-secondary" : current ? "text-interactive" : "text-tertiary"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Ruling 2: the caption's digits are wrapped, everywhere. TASTE §12 is
          `.num` isolation on EVERY digit run with no carve-out for captions, and
          these captions ship in Urdu, where an unisolated run reverses. */}
      <p className="mt-3.5 text-label font-regular leading-normal text-secondary">
        Step{" "}
        <b className="font-semibold text-primary">
          <span className="num">{step}</span> of <span className="num">4</span> · {name}
        </b>
        .
      </p>
    </div>
  );
}

/* ——— rail parts ——————————————————————————————————————————————————————————— */

function Rule({ className = "" }: { readonly className?: string }) {
  return <div aria-hidden="true" className={`my-4 h-px bg-hairline ${className}`} />;
}

/**
 * The 56px identity thumbnail.
 *
 * `alt=""` because it is decorative: the home's name sits beside it in the very
 * next element, so a screen reader that announced the photograph too would read
 * the same fact twice. That is `gw-021`'s own markup.
 *
 * THE PATH IS DERIVED RATHER THAN LOOKED UP, and that is a bundle decision worth
 * stating. `lib/content/image-manifest.ts` is a 119-entry module and this is a
 * Client Component, so `image(id)` would ship the whole manifest to the browser
 * on all seven checkout routes. The manifest's own first invariant is that the
 * entry `id` IS the filename stem ("Stable key. Matches the filename stem"),
 * machine-checked by `scripts/verify-images.mjs` and true for 119 of 119 entries
 * today. The box is a fixed 56 square with `object-cover`, so the two things the
 * manifest would otherwise supply — real dimensions for CLS, alt text — are
 * respectively unnecessary and deliberately empty here.
 */
function ListingThumb({ listing }: { readonly listing: ListingContent }) {
  return (
    <span className="size-14 flex-none overflow-hidden rounded-md bg-sunken">
      <Image
        src={`/images/${listing.gallery.hero}.jpg`}
        alt=""
        width={56}
        height={56}
        className="size-14 object-cover"
      />
    </span>
  );
}

function ListingIdentityText({ listing }: { readonly listing: ListingContent }) {
  return (
    <span className="min-w-0">
      <span className="block text-bodyMd font-semibold leading-snug text-primary">
        <Num>{listingName(listing)}</Num>
      </span>
      <span className="mt-0.5 block text-label font-regular text-secondary">
        <Num>{listingPlaceLine(listing)}</Num>
      </span>
    </span>
  );
}

function SummaryRow({
  label,
  value,
  empty,
  changeHref,
  className = "",
}: {
  readonly label: string;
  readonly value: ReactNode;
  readonly empty: boolean;
  readonly changeHref?: string | undefined;
  readonly className?: string | undefined;
}) {
  return (
    <div className={`flex items-baseline gap-3 ${className}`}>
      <span className="min-w-0 flex-1">
        <span className={fieldLabel}>{label}</span>
        <span
          className={`mt-1 block text-bodySm ${empty ? "text-secondary" : "text-primary"}`}
        >
          {value}
        </span>
      </span>
      {changeHref === undefined ? null : (
        <Link href={changeHref} className={`${inlineAction} flex-none text-bodySm font-medium`}>
          Change
        </Link>
      )}
    </div>
  );
}

function DatesValue() {
  const { draft } = useBooking();
  if (draft.dates === null) return <>Not set</>;
  const span = nights(draft.dates);
  return (
    <Num>
      {`${dateRange(draft.dates.checkIn, draft.dates.checkOut)} · ${span} ${
        span === 1 ? "night" : "nights"
      }`}
    </Num>
  );
}

/**
 * "6 guests · 4 adults, 2 children", and "1 adult" when there is only one band
 * to name — `gw-021` panels 1 and 2 respectively. The head count is
 * `countedGuests`, so infants are named in the breakdown and absent from the
 * total, which is the host's own disclosed rule read off the listing rather
 * than restated here.
 */
function GuestsValue({ listing }: { readonly listing: ListingContent }) {
  const { draft } = useBooking();
  const { guests } = draft;

  if (isOverCapacity(guests, listing.capacity)) {
    return (
      <Num>{`${countedGuests(guests, listing.capacity)} guests · over this home's limit`}</Num>
    );
  }
  return <Num>{guestPhrase(guests, listing)}</Num>;
}

function guestPhrase(guests: GuestCounts, listing: ListingContent): string {
  const bands: string[] = [];
  if (guests.adults > 0) bands.push(`${guests.adults} ${guests.adults === 1 ? "adult" : "adults"}`);
  if (guests.children > 0)
    bands.push(`${guests.children} ${guests.children === 1 ? "child" : "children"}`);
  if (guests.infants > 0)
    bands.push(`${guests.infants} ${guests.infants === 1 ? "infant" : "infants"}`);

  const first = bands[0];
  if (first === undefined) return "No guests yet";
  if (bands.length === 1) return first;

  const counted = countedGuests(guests, listing.capacity);
  return `${counted} ${counted === 1 ? "guest" : "guests"} · ${bands.join(", ")}`;
}

function mobileSummary(
  span: number,
  guests: GuestCounts,
  listing: ListingContent,
): string {
  const counted = countedGuests(guests, listing.capacity);
  return `${span} ${span === 1 ? "night" : "nights"} · ${counted} ${
    counted === 1 ? "guest" : "guests"
  }`;
}

/**
 * §6, and it is the sentence that keeps this from being drip pricing: drip
 * pricing hides that fees exist; this names them, and names the step that
 * itemises them, before anything is charged.
 *
 * "Service fee", not the older vocabulary — `REPOSITIONING.md`, applied through
 * BUILD-DECISIONS ruling 23. The fee model itself is unchanged.
 */
function DeferralStrip({ priced }: { readonly priced: boolean }) {
  return (
    <p className="mt-3.5 rounded-md bg-raised px-3 py-2.5 text-label font-regular leading-relaxed text-secondary">
      {priced ? null : "Pick your nights and your total appears here. "}
      Service fee, payment processing and sales tax are added and itemised at{" "}
      {/* §12 / TASTE §11.12: bold the PAYLOAD, never the sentence. */}
      <b className="font-semibold text-primary">
        step <span className="num">3</span> · Price
      </b>
      , before anything is charged.
    </p>
  );
}

function PrimaryAction({
  href,
  label,
  disabled,
  noteId,
  compact = false,
}: {
  readonly href: string;
  readonly label: string;
  readonly disabled: boolean;
  readonly noteId: string;
  readonly compact?: boolean;
}) {
  /* The mobile bar's primary sits beside the money rather than filling a column,
     and takes one padding rung less so a long label ("Continue to party type")
     still clears a 390px bar without truncating either side.
     WIDTH AND PADDING ARE STATED HERE RATHER THAN OVERRIDDEN ON A BASE that
     carries them: Tailwind emits `.w-auto` before `.w-full` and `.px-4` before
     `.px-5`, so either append would lose to the base by stylesheet order no
     matter which order the two are written in the string. Same trap
     `btnSecondaryOnTint` documents in `components/ui.ts`. */
  const shape = compact ? `${ctaShape} px-4` : `${ctaShape} w-full px-5`;

  if (disabled) {
    /* `aria-disabled`, not `disabled`. A `disabled` button leaves the tab order,
       and the whole mechanism the required `note` builds is that a keyboard user
       who lands on the blocked primary is told WHY — which requires landing on
       it. No handler and no href, so it is inert either way. */
    return (
      <button
        type="button"
        aria-disabled="true"
        aria-describedby={noteId}
        className={`${shape} ${ctaDisabled}`}
      >
        {label}
      </button>
    );
  }
  return (
    <Link href={href} className={`${shape} ${ctaEnabled} ${focusRing}`}>
      {label}
    </Link>
  );
}

function CtaNote({ id, note }: { readonly id: string; readonly note: ReactNode }) {
  return (
    <p
      id={id}
      className="mt-3 text-center text-label font-regular leading-normal text-secondary"
    >
      {typeof note === "string" ? <Num>{note}</Num> : note}
    </p>
  );
}

/**
 * §4's `.trust` — at most three lines, and the shield is the only green glyph on
 * the surface after the wordmark dot and the enabled CTA (§7 role 3).
 *
 * Claims 1 and 9 are SEO-RULES §5 registry strings and ship **verbatim or not at
 * all** (§12). They are not paraphrased, not shortened, and not re-punctuated —
 * including the dash inside claim 9, which is part of the registered string.
 * The third line is plain neutral description and carries no claim.
 */
function Trust() {
  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-hairline pt-4">
      <p className="flex gap-2.5 text-label font-regular leading-relaxed text-secondary">
        <ShieldCheckIcon className="mt-px size-4 shrink-0 text-interactive" />
        <span className="font-semibold text-primary">
          CNIC-verified guests and hosts via NADRA Verisys
        </span>
      </p>
      <p className="flex gap-2.5 text-label font-regular leading-relaxed text-secondary">
        <FeesReceiptIcon className="mt-px size-4 shrink-0 text-secondary" />
        <span className="font-semibold text-primary">
          Transparent fees and tax — every rupee shown before you book or earn
        </span>
      </p>
      <p className="flex gap-2.5 text-label font-regular leading-relaxed text-secondary">
        <LockIcon className="mt-px size-4 shrink-0 text-secondary" />
        <span>
          Your payment is held in trust and released to the host only after you check in.{" "}
          <Link href="/help/payments/how-money-is-held" className={inlineAction}>
            How your payment is held
          </Link>
        </span>
      </p>
    </div>
  );
}

export default CheckoutStep;
