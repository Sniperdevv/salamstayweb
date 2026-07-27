import type { ReactNode } from "react";

import { CheckMark } from "@/components/ui/marks";
import { formatPkr } from "@/lib/money";

import type { Reservation, StatusTone } from "./reservations";
import { NET_LABEL } from "./reservations";

/**
 * The furniture `/host/reservations` and `/host/reservations/[id]` both draw.
 *
 * Server-safe on purpose — none of it holds state, so the list's tab client and
 * the detail's decision client can each render it without pulling a second
 * component tree over the wire.
 *
 * Everything here is `ha-047` / `ha-048` translated to the web shell, which
 * means two systematic changes from the phone cards and no others:
 *
 *  1. **No brand green.** The cards fill the guest avatar, the selected tab, the
 *     request count and the "Checked in" pill with `interactive.primary` or
 *     `interactive.subtle`. `HOST-SHELL.md` §7 says the app surface is already
 *     over TASTE §2's four-role budget through `ha-046`'s chip, nav underline
 *     and avatar, and that the correct response is **"Add nothing to it."** So
 *     status reads in the semantic registers (`info` / `success` / neutral),
 *     the avatar is `bg.raised`, and the one green on a reservation surface is
 *     the detail page's `Accept request` — the surface's single primary CTA.
 *  2. **Elevation.** Rows and blocks carry a border and cast nothing (TASTE §1,
 *     `HOST-SHELL.md` §8 — nothing here floats over scrolled content), and the
 *     money breakdown carries neither: it is a content block, and §1 says a
 *     content block is icon, title and body in open space.
 */

/* ───────────────────────────── honesty ──────────────────────────────────── */

/**
 * The strip that keeps this whole surface honest — TASTE §6's `bg.raised` info
 * strip, payload word bolded and nothing else.
 *
 * It is not a dismissible banner and it is not styled as a warning. A warning
 * would suggest something is wrong; nothing is wrong, the product simply does
 * not have a booking store yet, and the host is entitled to know that before
 * they read a name and a set of dates as though someone were coming.
 */
export function SampleDataStrip({ className = "" }: { readonly className?: string }) {
  return (
    <p
      className={`max-w-prose rounded-md bg-raised px-4 py-3 text-bodySm font-regular leading-relaxed text-secondary ${className}`}
    >
      <b className="font-semibold text-primary">Example data.</b> SalamStay has no booking store
      yet, so the reservations on this page are written into it. They are not bookings on your
      account, and accepting or declining one saves nothing.
    </p>
  );
}

/* ───────────────────────────── identity ─────────────────────────────────── */

/**
 * Initials, never a photograph.
 *
 * TASTE §10's avatar ladder starts at 28; 40 (`size-10`) is the rung a row
 * wants. Neutral fill rather than the card's brand tint, per the note above.
 * `aria-hidden` because the guest's name is already beside it — an avatar that
 * announced "F" would put a letter into the reading order twice.
 */
export function GuestAvatar({
  initials,
  ground = "canvas",
  className = "",
}: {
  readonly initials: string;
  /**
   * What it is sitting ON, not what it should look like.
   *
   * The disc is one neutral step off its ground, which means the fill has to
   * invert on the request card — that card is `bg.raised`, and a `bg.raised`
   * disc on it is a pair of initials floating with no disc at all. Exactly the
   * relationship `components/ui.ts` spells out for `btnSecondaryOnTint`, and
   * the same fix: the step inverts rather than disappearing.
   */
  readonly ground?: "canvas" | "raised";
  readonly className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-10 flex-none place-items-center rounded-full text-bodySm font-semibold text-secondary ${
        ground === "raised" ? "bg-canvas" : "bg-raised"
      } ${className}`}
    >
      {initials}
    </span>
  );
}

/**
 * TASTE §2 role 4 — a verification mark is one of the four sanctioned green
 * roles, and `success.fg` is the status token rather than `interactive.primary`,
 * so it spends nothing from the interactive budget either.
 *
 * It states identity verification and nothing more. It is NOT a rating, a
 * badge, a tier or a "superhost" mark, and it must not grow into one.
 */
export function VerifiedChip() {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-success-border bg-success-bg px-2 py-0.5 text-caption font-semibold text-success">
      <CheckMark className="size-3" />
      Verified
    </span>
  );
}

/* ─────────────────────────────── status ─────────────────────────────────── */

const TONE: Readonly<Record<StatusTone, string>> = {
  info: "border-info-border bg-info-bg text-info",
  success: "border-success-border bg-success-bg text-success",
  neutral: "border-hairline bg-sunken text-secondary",
};

export function StatusChip({
  tone,
  icon,
  children,
  className = "",
}: {
  readonly tone: StatusTone;
  readonly icon?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-label font-semibold ${TONE[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

/**
 * The listing a row belongs to — `ha-047`'s `.lchip`, and the reason it exists:
 * a host with two properties must never have to guess which one a guest is
 * coming to. Neutral, quiet, and always present, even on a single-listing
 * account, because the day a second listing arrives the row must not change
 * shape.
 */
export function ListingChip({ children }: { readonly children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-hairline bg-sunken px-3 py-1 text-label font-medium text-secondary">
      {children}
    </span>
  );
}

/* ─────────────────────────────── money ──────────────────────────────────── */

/**
 * The host's earnings view — `hw-004` panel D's breakdown grammar, which is the
 * one this codebase already draws for money on a host surface: rows in open
 * space separated by hairlines, **no box, no plate, no shadow, no rail**
 * (TASTE §1; `HOST-SHELL.md` §8 is explicit that the checkout's border-and-
 * shadow summary rail "is not imported here").
 *
 * The fee chain is `ha-048`'s and `HA-055`'s, in their order, so a host reads
 * the same four lines here that the earnings dashboard will show them. The
 * `(wakala)` parenthetical is gone — `REPOSITIONING.md` replaces it with plain
 * `Service fee`, and the mechanism behind it is unchanged.
 *
 * **Nothing here is computed from a percentage.** Every figure is a literal in
 * the fixture; this component only spells them, via the one formatter.
 */
export function EarningsBreakdown({
  reservation,
  netLabel,
  payoutNote,
}: {
  readonly reservation: Reservation;
  /**
   * Overrides `NET_LABEL[status]`, and it exists for exactly one case: the
   * detail page's request has just been ACCEPTED, so "If you accept, you
   * receive" has become a sentence about something that already happened. The
   * status on the fixture cannot change — nothing is saved — so the label the
   * host is reading has to.
   */
  readonly netLabel?: string | undefined;
  readonly payoutNote?: string | undefined;
}) {
  const { money, nights, status } = reservation;

  const note = payoutNote ?? reservation.payoutNote;

  return (
    <div>
      {/*
        Gross first, and stated as its own arithmetic — "PKR 12,500 × 3 nights"
        — so the host can check the top line against their own rate without
        opening anything. Both digit runs are isolated INSIDE a single plain
        span, so the flex row has exactly two children: `.num` is
        `display:inline-block` under RTL and a bare one here would become a flex
        item and break the sentence apart.
      */}
      <div className="flex items-baseline justify-between gap-4 py-3">
        {/*
          `dir="auto"` — GO-LIVE A17, found on `/host/calendar` and confirmed
          here. The two `.num` runs each isolate correctly, which solves the
          flex-item problem this row was built for but NOT the bidi-reorder
          one: inside an RTL container the isolates reorder past the prose and
          this rendered `nights 3 × PKR 9,500`. The isolate has to wrap the
          SENTENCE, not each number in it.

          It goes on this span because the span is already inline and already
          wraps the whole phrase. Never on the block — a block would take its
          text-align from the resolved direction and pull the line to the wrong
          edge. `auto` resolves from the first strong character, so it is right
          in Latin now and in Nastaliq on the future `/ur/` route.

          Reaches `/host/earnings` and `/host/reservations/[id]`, which both
          render this component.
        */}
        <span dir="auto" className="text-bodySm font-regular text-secondary">
          <span className="num">{formatPkr(money.nightly)}</span> ×{" "}
          <span className="num">{nights}</span> {nights === 1 ? "night" : "nights"}
        </span>
        <span className="whitespace-nowrap text-bodySm font-regular text-primary">
          <span className="num">{formatPkr(money.gross)}</span>
        </span>
      </div>

      {money.deductions.map((line) => (
        <div
          key={line.label}
          className="flex items-baseline justify-between gap-4 border-t border-hairline py-3"
        >
          <span className="text-bodySm font-regular text-secondary">{line.label}</span>
          {/*
            The minus comes from `formatPkr` rather than a hand-written glyph, so
            the sign sits outside `PKR` and the whole run stays one LTR isolate
            under RTL. A deduction shown as a bare positive number beside a
            smaller total is how a fee schedule reads as a trick.
          */}
          <span className="whitespace-nowrap text-bodySm font-regular text-secondary">
            <span className="num">{formatPkr(-line.amount)}</span>
          </span>
        </div>
      ))}

      {/* `border.default`, one rung up from the hairlines above it — the total
          is a different kind of line and the rule says so without a plate. */}
      <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-border-default pt-4">
        <span className="text-bodyMd font-semibold text-primary">
          {netLabel ?? NET_LABEL[status]}
        </span>
        <span className="whitespace-nowrap text-bodyLg font-semibold text-primary">
          <span className="num">{formatPkr(money.net)}</span>
        </span>
      </div>

      {note === undefined ? null : (
        <p className="mt-3 text-label font-regular leading-relaxed text-tertiary">{note}</p>
      )}
    </div>
  );
}
