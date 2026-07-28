import Link from "next/link";
import type { ReactNode, RefObject } from "react";

import { ChevronLeftIcon } from "@/components/icons";
import { inlineAction } from "@/components/ui";
import { exampleStripGuest } from "@/components/ui/example-strip";

/**
 * The furniture every `/trips/{id}/*` child shares — back link, page head, and
 * the one strip that keeps these screens honest.
 *
 * Three routes render the same three things, so they are written once here
 * rather than three times in three step files. Server components throughout:
 * nothing below holds state, and a `"use client"` boundary drawn around a
 * heading would pull the whole page across it.
 *
 * GUEST-SHELL.md §4b is the frame these compose: `.backrow` (ink, underlined at
 * rest, chevron leading, mirrored under RTL) → `.pagehead` (title + support
 * line) → labelled `<section>`s. §2 keeps the landmark `class="co-main"`, never
 * `indexable`, with no breadcrumb — these are app surfaces, not a document
 * hierarchy.
 */

/**
 * THE `<main>` IS NOT HERE ANY MORE, AND THIS IS THE SHIM THAT SAYS SO.
 *
 * `app/trips/layout.tsx` renders the landmark — one `<main class="co-main">` on
 * the `container.page` column (`px-6 pb-10 pt-7`, the same column
 * `HostAppShell` renders) for the whole tree — so §2's contract is a structural
 * fact rather than something four page authors have to spell identically. A
 * page under that layout returns a fragment; a page that wrapped its own
 * `<main>` would nest two landmarks in one document, which is the defect this
 * component USED to introduce.
 *
 * It survives as a passthrough rather than being deleted outright because
 * `/trips/{id}` was written against the earlier shape, in parallel, and a
 * dangling import fails the whole app's typecheck rather than one page's. As a
 * fragment it is correct either way: a call site that still wraps in it emits
 * exactly the same HTML as one that does not.
 *
 * **Delete this with its last call site.** A component that renders nothing is
 * a note to a colleague, not a component.
 */
export function TripMain({ children }: { readonly children: ReactNode }) {
  /**
   * A passthrough, deliberately — `app/trips/layout.tsx` renders the landmark
   * for the whole tree.
   *
   * It has to live there and not here. The three child surfaces (receipt,
   * cancel, review) return fragments and never call this, so a landmark that
   * only existed inside `TripMain` reached `/trips/[id]` and nothing else. For
   * one pass NOTHING rendered it: the layout's comment said `TripMain` owned it
   * and `TripMain` was `<>{children}</>` — two files each describing a division
   * of labour, each assuming the other held up its end, and five routes shipping
   * with no `<main>` and no `co-main`.
   *
   * `validate-pages --all` did not catch it. It reads `co-main` on routes that
   * declare one; a route with no landmark declares nothing to compare. A gate
   * that can only fail on a wrong value cannot fail on an absent element.
   *
   * Kept rather than deleted only because `app/trips/[id]/page.tsx` still calls
   * it; delete both together.
   */
  return <>{children}</>;
}

/**
 * `.backrow` — GUEST-SHELL.md §4b, and CHECKOUT-SHELL.md §5's `.inlink` for the
 * anatomy: ink, **underlined at rest** (TASTE §8), chevron leading.
 *
 * `rtl:-scale-x-100` because the chevron means "back", and back swaps sides with
 * the reading direction — the same rule `wizard-step.tsx` applies to the same
 * glyph. `print:hidden`: navigation is not part of a printed receipt.
 */
export function TripBackLink({
  href,
  children,
}: {
  readonly href: string;
  readonly children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${inlineAction} inline-flex items-center gap-1.5 text-bodySm font-medium print:hidden`}
    >
      <ChevronLeftIcon className="size-4 shrink-0 rtl:-scale-x-100" />
      {children}
    </Link>
  );
}

/**
 * `.pagehead` — the page's one `<h1>` plus its support line.
 *
 * The `h4` rung (24), not a 26 the scale does not carry: `HOST-SHELL.md`'s
 * detail pages take `h4` for exactly this position and GUEST-SHELL.md §4b asks
 * the two sides to read as one product. `56ch` is §4a/§4b's measure for the
 * support line — long enough for a sentence, short enough that it never becomes
 * a paragraph.
 *
 * G30 wants exactly one `<h1>` per page and G43 wants its first word to appear
 * in the registered title, so the title and this string are written together.
 */
export function TripPageHead({
  title,
  sub,
  headingRef,
  className = "",
}: {
  readonly title: ReactNode;
  readonly sub?: ReactNode;
  /**
   * For a surface whose step changes in place rather than by navigation. The
   * step client moves focus here when the state changes, so a screen reader is
   * told it is on a new step instead of being left on a button that no longer
   * exists. Requires `tabIndex={-1}`, which is applied whenever a ref is passed.
   */
  readonly headingRef?: RefObject<HTMLHeadingElement | null>;
  readonly className?: string;
}) {
  return (
    <div className={className}>
      <h1
        ref={headingRef}
        {...(headingRef ? { tabIndex: -1 } : {})}
        className="text-h4 font-semibold text-primary outline-none"
      >
        {title}
      </h1>
      {sub ? (
        <p className="mt-2 max-w-[56ch] text-bodyMd font-regular leading-relaxed text-secondary">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The sentence standing between a reader and mistaking a fixture for a record.
 *
 * `SampleDataStrip` in `app/host/(app)/reservations/reservation-parts.tsx` is
 * the shipped precedent and this is its guest twin, worded for what these three
 * screens each claim: a receipt says money changed hands, a cancellation says a
 * host was told, a review says something was sent to a person. None of that is
 * true, because there is no booking store and no review store — GUEST-SHELL.md
 * §14 lists booking references, totals, receipt numbers and review records among
 * the things that are fabrications until a record exists.
 *
 * It is NOT a substitute for the §12 guard: the route still 404s on any id but
 * the canonical one. The guard stops a receipt being minted for an arbitrary
 * slug; this stops the one receipt that does render being read as a payment
 * record. Both are needed, and neither does the other's job.
 *
 * TASTE §6's `bg.raised` info strip, payload bolded and nothing else. Not the
 * warning register: nothing has gone wrong and nobody is being cautioned.
 */
export function ExampleBookingStrip({
  children,
  className = "",
}: {
  /** What this particular screen would be claiming if it were real. */
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <p
      className={`${exampleStripGuest} ${className}`}
    >
      <b className="font-semibold text-primary">Example booking.</b> SalamStay has no booking
      store yet, so this stay is written into the site rather than made by anyone. {children}
    </p>
  );
}

/**
 * A bounded block of facts — TASTE §1's "form boundary": `radius.md`, one
 * `border.default`, hairline-divided cells, square interior corners
 * (`overflow-hidden` does that for free), and **no shadow**, because it does not
 * float over anything.
 *
 * HOISTED, NOT INVENTED. `/trips/{id}`, `/trips/{id}/receipt` and the cancel
 * flow's summary each spelled this same string; `/trips/{id}/arrival` would have
 * been the fourth. `GUEST-SHELL.md` §15 — *"these primitives exist and are the
 * vocabulary; adding a parallel one is the defect"* — and `example-strip.ts`
 * records the same lesson from the other side: eight surfaces had forked one
 * class string because the only shared thing on offer was a component with the
 * wrong props.
 *
 * Not `fieldGroup` from `components/ui.ts`: that recipe caps at 520px for a
 * column of inputs, and these are documents' headers at page width.
 */
export function TripFacts({
  children,
  className = "",
}: {
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <dl
      className={`max-w-[62ch] overflow-hidden rounded-md border border-border-default bg-canvas ${className}`}
    >
      {children}
    </dl>
  );
}

/**
 * One row of a `TripFacts` group.
 *
 * The divider is FULL-BLEED, `CHECKOUT-SHELL.md` §5's word and the deliberate
 * exception to TASTE §11.9: the group carries no padding of its own, the rows
 * do, so the hairline IS the row edge and stopping it short would draw a
 * floating stroke.
 *
 * The label column is `w-32` rather than `post-flow.tsx`'s `Fact` at
 * `w-28 sm:w-32`, because that one is sized for a 520px group and these sit in a
 * 720 column beside values like "Wed 12 Aug 2026, 2:00 PM". The anatomy, the
 * type roles and the divider are identical; only the measure moves.
 */
export function TripFactRow({
  label,
  sub,
  children,
}: {
  readonly label: string;
  readonly sub?: ReactNode;
  readonly children: ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-4 border-t border-hairline px-4 py-3 first:border-t-0">
      <dt className="w-32 max-w-[40%] shrink-0 text-label font-regular text-secondary">{label}</dt>
      <dd className="min-w-0 flex-1 text-bodyMd text-primary">
        {children}
        {sub === undefined ? null : (
          <span className="mt-0.5 block text-label font-regular leading-normal text-secondary">
            {sub}
          </span>
        )}
      </dd>
    </div>
  );
}

/**
 * A labelled slot — the shape `components/legal/legal-page.tsx` ships for a
 * clause SalamStay has not settled: *"an empty, labelled row, never plausible
 * legal text."*
 *
 * It is how a trip surface names something a real record would carry and this
 * build does not hold, WITHOUT drawing a plausible version of it. `PKR —` and
 * an em-dash placeholder are both ruled out by TASTE §12; a slot that says what
 * is missing, and why, and what to do instead, is what replaces them.
 *
 * **The whole block is the removable unit.** That is what makes it the right
 * home for a sentence about a gap: when the gap closes the slot is deleted
 * entire, rather than a future feature turning a clause of surviving body prose
 * into a lie. Durable facts about the booking stay OUTSIDE it.
 *
 * `bg.raised`, `radius.md`, no border and no shadow — TASTE §6, one tint doing
 * one of its five jobs. Never the warning register: nothing has gone wrong.
 *
 * ONE SLOT PER REASON, not one per missing thing. `app/host/(app)/earnings/tax/
 * tax-parts.tsx` settled that for its two undownloadable documents: *"it is a
 * single fact about the product … repeating it under each row would read as two
 * separate problems."*
 */
export function TripSlot({
  lead,
  title,
  children,
  className = "",
}: {
  /** What state the slot is in — "Not issued yet", "Not shared yet". */
  readonly lead: string;
  /** The thing that is missing, named as the document or fact it would be. */
  readonly title: string;
  /** Why it is missing, and what to do instead. */
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <div className={`max-w-[62ch] rounded-md bg-raised px-4 py-4 ${className}`}>
      <p className="border-b border-hairline pb-3 text-bodySm font-semibold text-secondary">
        {lead}
      </p>
      <p className="mt-3 text-bodyMd font-semibold text-primary">{title}</p>
      <p className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">{children}</p>
    </div>
  );
}

/**
 * A labelled `<section>` — §4b's rhythm: `h2` at the `h5` rung (20/600, no
 * letter-spacing) over an optional 14/400 gray support line at `62ch`.
 *
 * The same rhythm `gw-021` and `HOST-SHELL.md` §5 ship. Sections are separated
 * by a hairline and a heading, never by a card: TASTE §1 says a content block
 * carries neither border nor shadow, and "that restraint is most of the premium
 * read."
 */
export function TripSection({
  id,
  heading,
  sub,
  children,
  className = "",
}: {
  readonly id: string;
  readonly heading: string;
  readonly sub?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <section aria-labelledby={`${id}-h`} className={`border-t border-hairline pt-6 ${className}`}>
      <h2 id={`${id}-h`} className="text-h5 font-semibold text-primary">
        {heading}
      </h2>
      {sub ? (
        <p className="mt-2 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
          {sub}
        </p>
      ) : null}
      {children}
    </section>
  );
}
