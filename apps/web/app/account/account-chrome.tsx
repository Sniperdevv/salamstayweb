import Link from "next/link";
import type { ReactNode } from "react";

import { iconStroke } from "@salamstay/design-tokens/icons";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { inlineAction, pressableSurface } from "@/components/ui";
import { exampleStripGuest } from "@/components/ui/example-strip";

/**
 * The furniture every `/account/*` surface shares.
 *
 * Five routes draw the same five things — a back link, a page head, the strip
 * that keeps them honest, a grouped list of chevron rows and a labelled section
 * — so they are written once here rather than five times. Server components
 * throughout: nothing below holds state, and a `"use client"` boundary drawn
 * around a heading would pull a whole settings page across it.
 *
 * The sixth shared thing, the identity summary, is NOT here. It reads
 * `SESSION_ACCOUNT` out of `lib/mode.ts`, which is a client module, and under
 * RSC a client module's exports reach the server as references rather than as
 * values — a Server Component reading `SESSION_ACCOUNT.initials` renders an
 * empty disc. It lives in `./account-identity.tsx` behind its own `"use client"`
 * so the boundary sits around the one block that needs it instead of around all
 * of this. The full argument is in that file.
 *
 * The contract these compose is `GUEST-SHELL.md` §4b/§4c (frames), §5 (the
 * settings sub-shell), §6 (row anatomy) and §9 (elevation). None of it is
 * restated in the pages.
 *
 * WHAT IS DELIBERATELY NOT HERE
 * -----------------------------
 * No `<main>`. `app/account/layout.tsx` renders the one landmark for the whole
 * tree, so a page under it returns a fragment and cannot nest a second one. That
 * is the shape `app/trips/layout.tsx` describes for its own tree.
 */

/* ── Glyphs the shared sets do not carry ──────────────────────────────────
 *
 * Six of the row glyphs already exist as corpus components and are imported by
 * the pages rather than redrawn (`PersonIcon`, `ShieldCheckIcon`, `HelpIcon`,
 * `LockIcon`, `MessageIcon`, `HeartIcon`, `CalendarIcon`, plus `CardIcon` and
 * friends from `components/booking/pay-glyphs.tsx`). Five do not exist anywhere.
 *
 * They land here rather than in `components/icons.tsx` for the reason
 * `account-menu.tsx` and `marks.tsx` both state at the top of their files: that
 * module is chrome-shared and owned elsewhere in this wave, so a parallel edit
 * into it is a race, not a decision. Merge candidate, flagged.
 *
 * Paths are the `ga-123` / `ga-069` / `ga-062` cards' own paths. Stroke is
 * `iconStroke.regular` — one weight across every row, or the row with the odd
 * hair is the row you see.
 */
function Glyph({
  className,
  children,
}: {
  readonly className: string;
  readonly children: ReactNode;
}) {
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
      className={className}
    >
      {children}
    </svg>
  );
}

/** Notifications — `ga-069`'s bell. */
export function BellIcon({ className }: { readonly className: string }) {
  return (
    <Glyph className={className}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M10.5 21a1.8 1.8 0 0 0 3 0" />
    </Glyph>
  );
}

/** Language & accessibility — `ga-123`'s globe. */
export function GlobeIcon({ className }: { readonly className: string }) {
  return (
    <Glyph className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </Glyph>
  );
}

/**
 * Settings — two sliders.
 *
 * NOT `ga-122`'s gear. That card draws an eight-tooth cog whose teeth read as a
 * cog at 24px inside a phone toolbar and as a sun at 20px inside a row disc —
 * checked on screen, and it was the one glyph in the tree that had to be worked
 * out rather than recognised. A pair of sliders is unambiguous at this size, and
 * §6 only fixes the disc, not the mark inside it.
 */
export function SlidersIcon({ className }: { readonly className: string }) {
  return (
    <Glyph className={className}>
      <path d="M4 8h8M17 8h3M4 16h3M12 16h8" />
      <circle cx="14.5" cy="8" r="2.5" />
      <circle cx="9.5" cy="16" r="2.5" />
    </Glyph>
  );
}

/**
 * Privacy settings — `ga-123`'s bare shield.
 *
 * Deliberately NOT `ShieldCheckIcon`: that glyph is the verification mark
 * everywhere on this site (§6, `gw-023`, `account-menu.tsx`), and a checked
 * shield beside "Privacy" would read as "your privacy is verified".
 */
export function ShieldIcon({ className }: { readonly className: string }) {
  return (
    <Glyph className={className}>
      <path d="M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6z" />
    </Glyph>
  );
}

/** Terms of Service — `ga-123`'s page-with-lines. */
export function DocumentIcon({ className }: { readonly className: string }) {
  return (
    <Glyph className={className}>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M9 9h6M9 13h6M9 17h4" />
    </Glyph>
  );
}

/** Offers and tips — `ga-069`'s parcel. The only marketing mark in the tree. */
export function OffersIcon({ className }: { readonly className: string }) {
  return (
    <Glyph className={className}>
      <path d="M4 8l7-4 9 5-7 4z" />
      <path d="M4 8v6l9 5 7-4V9" />
    </Glyph>
  );
}

/** Report a problem — `ga-123`'s flag. Never a warning register; it is a route. */
export function FlagIcon({ className }: { readonly className: string }) {
  return (
    <Glyph className={className}>
      <path d="M5 21V4h13l-2 4 2 4H5" />
    </Glyph>
  );
}

/**
 * Log out — `account-menu.tsx`'s glyph, redrawn rather than imported because
 * that file is `"use client"` and this one is not: importing a component from a
 * client module into a server tree pulls the whole module across the boundary.
 * NOT mirrored under RTL, following the card panel that draws it (see the note
 * in `account-menu.tsx`, which flags the same question).
 */
export function LogOutIcon({ className }: { readonly className: string }) {
  return (
    <Glyph className={className}>
      <path d="M15 5h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-3" />
      <path d="M10 8l-4 4 4 4" />
      <path d="M6 12h9" />
    </Glyph>
  );
}

/* ── Frame ───────────────────────────────────────────────────────────────── */

/**
 * `.backrow` — §4b/§4c, and `CHECKOUT-SHELL.md` §5's `.inlink` for the anatomy:
 * ink, **underlined at rest** (TASTE §8), chevron leading.
 *
 * `rtl:-scale-x-100` because the chevron means "back", and back swaps sides with
 * the reading direction.
 *
 * This is `TripBackLink`'s twin, deliberately declared rather than imported:
 * `app/trips/[id]/trip-chrome.tsx` is another tree's file and its own header
 * says one of its exports is due for deletion. Both compose the same shared
 * `inlineAction`, which is the primitive §15 actually asks to be reused. Hoist
 * the pair into a shared guest module when someone owns that move.
 */
export function AccountBackLink({
  href,
  children,
}: {
  readonly href: string;
  readonly children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${inlineAction} inline-flex items-center gap-1.5 text-bodySm font-medium`}
    >
      <ChevronLeftIcon className="size-4 shrink-0 rtl:-scale-x-100" />
      {children}
    </Link>
  );
}

/**
 * `.pagehead` — the page's one `<h1>` plus its support line.
 *
 * The `h4` rung (24), not the 26 the cards draw: the type scale has no 26, and
 * every other signed-in surface on both sides of the product already takes `h4`
 * here (§4b asks the flows to read as one product). `56ch` is §4a/§4b's measure
 * for the support line.
 *
 * G30 wants exactly one `<h1>` per page and G43 wants it to align with the
 * registered title, so the two are written together — see each page's header.
 */
export function AccountPageHead({
  title,
  sub,
  className = "",
}: {
  readonly title: ReactNode;
  readonly sub?: ReactNode;
  readonly className?: string;
}) {
  return (
    <div className={className}>
      <h1 className="text-h4 font-semibold text-primary">{title}</h1>
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
 * `ExampleBookingStrip` (`app/trips/[id]/trip-chrome.tsx`) and `SampleDataStrip`
 * (`app/host/(app)/reservations/reservation-parts.tsx`) are the two shipped
 * instances of this one strip, each worded for what its own surface claims.
 * This is the third instance and NOT a third pattern: same TASTE §6 `bg.raised`
 * info strip, same payload-only bold, same neutral register — nothing has gone
 * wrong and nobody is being cautioned, so it is not the warning register.
 *
 * The lead is deliberately about the ACCOUNT rather than about the person: four
 * of the five surfaces draw a name and the fifth (payment methods) draws nobody
 * at all, and a strip that announced an example person on a page with no person
 * on it would be a second thing to explain. The `children` carry what each
 * particular screen would be claiming.
 *
 * The wording differs from the other two because the lie differs. A trips page
 * would be claiming a booking; these pages would be claiming **a person** —
 * `GUEST-SHELL.md` §14
 * lists "member since", verification dates, trip counts and login history among
 * the things that are fabrications until a record exists, and `lib/mode.ts` is
 * explicit that there is no stored user at all: *"there is no stored user, no
 * stored token and no stored expiry, because none of those exist."*
 *
 * It is not a substitute for suppressing invented values — no page under
 * `/account` renders a phone number, a card tail, a join date or a count. This
 * stops the one name that IS rendered being read as somebody's account.
 */
export function ExampleAccountStrip({
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
      <b className="font-semibold text-primary">Example account.</b> SalamStay has no accounts
      yet, so nothing on this page is read from one. {children}
    </p>
  );
}

/**
 * A labelled `<section>` — §4b's rhythm: `h2` at the `h5` rung (20/600, no
 * letter-spacing) over an optional 14/400 gray support line at `62ch`.
 *
 * Sections are separated by a hairline and a heading, never by a card: TASTE §1
 * puts content blocks in the "carries NEITHER" column, and "that restraint is
 * most of the premium read."
 */
export function AccountSection({
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

/* ── Rows ────────────────────────────────────────────────────────────────── */

/**
 * A group label — §4a's *"separated by a `border-top` hairline and a label,
 * never by a card"*, and the one place `ga-123` has to be overruled.
 *
 * The card draws `.scap` at 11/600 uppercase with `+0.05em` tracking, which is
 * the `overline` token. TASTE §7: *"`overline` is a **form-label** token. It is
 * NEVER a section eyebrow. Zero eyebrows, everywhere."* TASTE postdates the
 * corpus and wins (§0.3). So the label is sentence-case ink at 13/600 — one rung
 * BELOW the 14/600 row titles it introduces, which is TASTE §10's footer rule
 * applied to the same relationship: the rows are the destinations and the label
 * is the shelf they sit on.
 */
export function RowGroupLabel({
  id,
  children,
  className = "",
}: {
  readonly id: string;
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <h2 id={id} className={`text-label font-semibold text-primary ${className}`}>
      {children}
    </h2>
  );
}

/**
 * The grouped container — §6: *"Grouped inside one `radius.lg` container with a
 * hairline between rows and square interior corners — the `CHECKOUT-SHELL.md` §5
 * form-group idiom, reused."*
 *
 * `overflow-hidden` is load-bearing rather than tidiness, exactly as `fieldGroup`
 * documents: the rows draw square, and the group's own radius clips the first
 * and last row's outer corners — including a hovered row's fill, which would
 * otherwise poke square corners through a rounded box.
 *
 * Border, no shadow (§9). It bounds a set of controls; it does not float.
 */
export function RowGroup({
  labelledBy,
  children,
  className = "",
}: {
  readonly labelledBy: string;
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <ul
      aria-labelledby={labelledBy}
      className={`overflow-hidden rounded-lg border border-hairline bg-canvas ${className}`}
    >
      {children}
    </ul>
  );
}

/**
 * `.srow` — §6's chevron row.
 *
 * 60px minimum in the card; `min-h-16` (64) is the rung above it and is what the
 * content measures anyway (a 40px disc plus `py-3` twice). Title 14/600 ink,
 * hint 13/400 secondary, chevron `text.tertiary` **mirrored under RTL**.
 *
 * THE WHOLE ROW IS ONE `<a>` (§6, and the card validator's R-rule): no
 * `<button>` is ever nested inside it. Nothing on these rows needs a second
 * control, so the question does not arise here — it is stated so that the next
 * person adding a `⋯` puts it in as a sibling.
 *
 * MOTION: §11 budgets `scale(.995)` for rows and cards, which is
 * `pressableSurface`. Hover fills to `bg.raised`; the icon disc keeps its own
 * hairline so it survives the fill arriving underneath it (the card gives
 * `.sic` that border for the same reason).
 */
export function SettingsRow({
  href,
  icon,
  title,
  hint,
}: {
  readonly href: string;
  /** Decorative — the title and hint are already the accessible name. `size-5`. */
  readonly icon: ReactNode;
  readonly title: ReactNode;
  /** The row's current value, or what the row holds. Never hard-coded state. */
  readonly hint: ReactNode;
}) {
  return (
    <li className="border-t border-hairline first:border-t-0">
      <Link
        href={href}
        className={`flex min-h-16 items-center gap-3 px-3 py-3 hover:bg-raised ${pressableSurface}`}
      >
        <span
          aria-hidden="true"
          className="flex size-10 flex-none items-center justify-center rounded-full border border-hairline bg-raised text-secondary"
        >
          {icon}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-bodySm font-semibold text-primary">{title}</span>
          <span className="mt-0.5 block text-label font-regular leading-normal text-secondary">
            {hint}
          </span>
        </span>

        <ChevronRightIcon className="size-5 flex-none text-tertiary rtl:-scale-x-100" />
      </Link>
    </li>
  );
}
