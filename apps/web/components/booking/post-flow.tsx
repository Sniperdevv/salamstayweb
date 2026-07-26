import Link from "next/link";
import type { ReactNode } from "react";

import { ChevronRightIcon } from "@/components/icons";
import { focusRing, inlineAction, tintTransition } from "@/components/ui";

/**
 * The post-flow anatomy — the four shell additions `gw-026` proposes and
 * `gw-027` reuses, in one module because those two cards are the only surfaces
 * that draw them and they must not drift apart.
 *
 * `gw-027`'s own header comment says so outright: "The `.outcome`, `.frows`,
 * `.alist`, `.gbtn` additions are shared with gw-026 and documented there." Two
 * copies of a hairline-divided row anatomy in two route folders is two chances
 * for one of them to grow a shadow or lose a divider.
 *
 * WHAT A POST-FLOW SURFACE IS
 * ---------------------------
 * A screen the guest reaches when checkout has ended — confirmed, pending, or
 * declined. Three things follow, and all three are already written down rather
 * than decided here:
 *
 *  · **No stepper.** `CLAUDE-DESIGN-HANDOFF` §7.6a and `CHECKOUT-SHELL` §3 both
 *    say post-book cards ship none. A stepper answers "where am I in this?" and
 *    there is no longer an "in this"; four filled circles would turn a wayfinder
 *    into a trophy. `Outcome` takes the stepper's exact slot and geometry — main
 *    column, directly under the page head, a status row plus a caption — and
 *    answers the same question with the one fact that is true.
 *  · **No form.** Everything here is a fact or a way out, so nothing carries a
 *    focus ring except the things that are genuinely actionable.
 *  · **No error or empty register.** `CHECKOUT-SHELL` §15 amends §11 for exactly
 *    this: a confirmed booking is never empty and has no failure mode on its own
 *    surface. The registers are honoured by analogue — a page-level `Banner`,
 *    and a control that is disabled, visible, in place and explains itself.
 *
 * ELEVATION (TASTE §1, CHECKOUT-SHELL §8)
 * ---------------------------------------
 * `Facts` and `ActionList` carry a border and **no shadow** — they are form-group
 * geometry borrowed for content, and neither floats over anything. `Outcome`,
 * `Hint` and `Strip` carry **neither**: they are content blocks in open space,
 * which is most of the premium read. Nothing on a post-flow surface casts.
 *
 * GREEN (TASTE §2, CHECKOUT-SHELL §7)
 * -----------------------------------
 * Nothing in this file spends brand green. The wordmark dot and the one primary
 * CTA live in the shell; the success tick on `Outcome` is `feedback.success`, a
 * different semantic role, spent once on the one page whose whole job is to say
 * a thing succeeded. Icons here are `text.secondary`, discs are `bg.raised`
 * (`ga-064`'s phone panel tints them brand — on web that would be a fourth green
 * role, repeated four times down the page).
 */

/* ─── The canonical booking ──────────────────────────────────────────────────
 *
 * `BUILD-DECISIONS.md`'s "canonical thread — every surface must agree with
 * this". One booking runs through all seven checkout cards, and these are the
 * facts it is made of. They live here rather than in either route folder so the
 * confirmation and the status page cannot tell two different stories about the
 * same stay.
 *
 * They are FIXTURES, and that is the honest position rather than a shortcut:
 * there is no booking record, no backend and no reservation to read. The
 * approved cards render this exact stay and so does the flow that leads here.
 * Every amount is grounded content from `ga-050` — nothing is computed, and no
 * fee is ever derived from a percentage (ruling 14).
 */
export const CANONICAL = {
  /** `SS-7F3K9Q` — the shipped reference for this stay. Confirmation only: a
   *  pending or declined request has produced no booking and shows none. */
  reference: "SS-7F3K9Q",
  /** The trip this booking becomes, once it exists. Carried from `ga-064`. */
  tripSlug: "is-f7-2bed-aug2026",
  host: "Ayesha",
  dates: "Fri 14 – Mon 17 Aug 2026",
  nights: "3 nights",
  checkIn: "From 2:00 PM, Fri 14 Aug",
  checkOut: "Before 11:00 AM, Mon 17 Aug",
  guests: "6 guests",
  guestBreakdown: "4 adults, 2 children · Family",
  paidOn: "Sat 1 Aug 2026",
  /** 48 hours before a 2:00 PM check-in on Fri 14 Aug. Arithmetic, not policy. */
  cancelBy: "2:00 PM on Wed 12 Aug",
  /** `12,500 × 3 = 37,500` · `+ 2,250 service fee + 720 MDR + 1,880 ICT tax`. */
  total: 42350,
  fees: 4850,
  subtotal: 37500,
} as const;

/** `/trips/{id}` and its four children, so no surface spells the slug twice. */
export const trip = (leaf?: string): string =>
  leaf ? `/trips/${CANONICAL.tripSlug}/${leaf}` : `/trips/${CANONICAL.tripSlug}`;

/* ─── Shared measures ────────────────────────────────────────────────────── */

/**
 * `CHECKOUT-SHELL` §5 fixes a group at 520px, which is `overlaySize.dialogMd` to
 * the pixel and reachable as a class since BUILD-DECISIONS ruling 17 folded
 * `overlaySize` into the preset's `maxWidth` map. Written out rather than
 * composed onto `fieldGroup` (which still carries the 512px `max-w-lg` it
 * settled for): Tailwind emits `maxWidth` utilities in theme order, so which of
 * two `max-w-*` classes wins is decided by the stylesheet, not by the order they
 * appear in a string.
 */
const GROUP_WIDTH = "max-w-overlay-dialogMd";

/** A measure for prose. `CHECKOUT-SHELL` §5's `62ch` for a section sub. */
const PROSE = "max-w-[62ch]";

/* ─── The column ─────────────────────────────────────────────────────────── */

/**
 * The body's own width, and the reason a post-flow surface needs one.
 *
 * With `showRail={false}` the shell's split collapses to a single cell and the
 * main column inherits the whole 1120px wrap. Every section rule would then run
 * the full width of the page while the group under it stops at 520 — a hairline
 * with 600px of nothing after it, which reads as a layout that lost its right
 * half rather than as a page that never had one.
 *
 * `container.prose` (720) is the rung, and it is very close to the width the
 * cards actually draw these sections at: 1100 minus the 348 rail and its 48
 * gutter leaves ~704. So capping here restores the card's proportion rather than
 * inventing a new one, and it does it with a token instead of a measurement.
 */
export function PostFlowBody({ children }: { readonly children: ReactNode }) {
  return <div className="max-w-prose">{children}</div>;
}

/* ─── Section ────────────────────────────────────────────────────────────── */

/**
 * One `.fsec` — a hairline rule, 28px of air either side, an `h2` and an
 * optional sub. `text-h5` (20/600) is the rung below the card's 22; the type
 * scale has no 22 and the host wizard's steps already settled on this one.
 */
export function Section({
  id,
  heading,
  sub,
  children,
}: {
  readonly id: string;
  readonly heading: ReactNode;
  readonly sub?: ReactNode;
  readonly children?: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-hairline py-7">
      <h2 id={id} className="text-h5 font-semibold text-primary">
        {heading}
      </h2>
      {sub === undefined ? null : (
        <p className={`mt-2 ${PROSE} text-bodySm leading-relaxed text-secondary`}>{sub}</p>
      )}
      {children}
    </section>
  );
}

/* ─── Outcome — the stepper's slot, and what stands in it ────────────────── */

/**
 * `ok` paints the tick `feedback.success`; `neutral` leaves the glyph
 * `text.secondary`.
 *
 * There is deliberately no `error` tone. Nothing on either post-flow surface
 * failed: a declined request is an availability fact, not a fault, and
 * `gw-027`'s dignity constraint is explicit that nothing on that panel is red.
 * A tone that does not exist cannot be reached for by mistake.
 */
export function Outcome({
  tone = "neutral",
  icon,
  status,
  children,
}: {
  readonly tone?: "ok" | "neutral";
  readonly icon: ReactNode;
  readonly status: string;
  readonly children: ReactNode;
}) {
  return (
    <div className="pb-6">
      <p
        className={`inline-flex items-center gap-2.5 text-bodyMd font-semibold ${
          tone === "ok" ? "text-success" : "text-primary"
        }`}
      >
        <span className={tone === "ok" ? "flex text-success" : "flex text-secondary"}>{icon}</span>
        <span className="text-primary">{status}</span>
      </p>
      <p className={`mt-2.5 ${PROSE} text-label font-regular leading-relaxed text-secondary`}>
        {children}
      </p>
    </div>
  );
}

/**
 * The booking reference, wherever it appears.
 *
 * Four decisions, none of them decoration:
 *
 *  · **`.num` on the WHOLE string**, not `withNumerals()`. `SS-7F3K9Q` is one
 *    code, and splitting it would isolate `7` and `9` and leave the letters loose
 *    in the text flow for the bidi algorithm to reorder around them under RTL.
 *    Same idiom money uses, for the same reason.
 *  · **`normal-nums` cancels the tabular figures `.num` carries.** Tabular
 *    numerals exist so a column of amounts does not jitter between states; this
 *    is not a column and not an amount. In Inter, `tnum` also widens the
 *    hyphen-minus to a figure slot, which renders the reference as `SS - 7F3K9Q`
 *    — a guest reading that aloud says the wrong thing. Utilities beat the
 *    `@layer components` rule that sets it, so this is one class, not an
 *    override war.
 *  · **`tracking-wide`** (0.02em, the card's `.ocode`) opens a mixed
 *    alphanumeric string enough to read it character by character, which is what
 *    someone reading it down a phone line has to do.
 *  · **`select-all`** makes one click take the whole code. This is the one
 *    string on the page a guest copies, and a double-click that grabs `7F3K9Q`
 *    and leaves `SS-` behind is a support call.
 */
export function Reference({ children }: { readonly children: string }) {
  return (
    <b className="num normal-nums select-all font-semibold tracking-wide text-primary">
      {children}
    </b>
  );
}

/* ─── Facts — the §5 form group, borrowed for content ────────────────────── */

export function Facts({ children }: { readonly children: ReactNode }) {
  return (
    <dl
      className={`mt-4 ${GROUP_WIDTH} overflow-hidden rounded-md border border-border-default bg-canvas`}
    >
      {children}
    </dl>
  );
}

/**
 * One row. The divider is FULL-BLEED, which is §5's word and the deliberate
 * exception to TASTE §11.9: the group has no padding of its own — the rows carry
 * it — so the hairline is the row edge, and stopping it short would draw a
 * floating stroke.
 *
 * `items-baseline` so a two-line value's first line still sits on the label's
 * baseline.
 *
 * The label column narrows on a phone, exactly as the card's `.mob .fdt` does:
 * 112 below `sm`, 128 above it. The card draws 132 and 112; there is no 132 rung
 * and `w-32` is the neighbour, which is worth four pixels rather than a bracketed
 * literal. The narrowing is not cosmetic — at 390 the wide column leaves ~200px
 * for a value like "Before 11:00 AM, Mon 17 Aug", and 16px of label width is a
 * whole word back on the line that matters.
 */
export function Fact({
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
      <dt className="w-28 max-w-[40%] shrink-0 text-label font-regular text-secondary sm:w-32">
        {label}
      </dt>
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

/* ─── Actions — the same anatomy, so facts and next steps read as one family ─ */

export function ActionList({ children }: { readonly children: ReactNode }) {
  return (
    <ul
      className={`mt-4 ${GROUP_WIDTH} list-none overflow-hidden rounded-md border border-border-default bg-canvas`}
    >
      {children}
    </ul>
  );
}

const ROW = "flex min-h-16 items-center gap-3.5 px-4 py-3";
const DISC = "flex size-10 flex-none items-center justify-center rounded-full bg-raised";

/**
 * A next-step row.
 *
 * `href` present → an anchor that tints on hover and carries the focus ring.
 * `href` absent → a statement of what will happen, drawn identically minus the
 * chevron, because a row that lifts under the pointer and then does nothing is a
 * worse failure than one that never offered.
 *
 * No press feedback. `CHECKOUT-SHELL` §10 budgets `transform` to four controls —
 * the CTA, the ± stepper, the calendar nav and a day cell — and a list row is
 * none of them; a row that scaled under the finger would read as a button.
 * `tintTransition` is the colour-only rung for exactly this case.
 *
 * `disabled` is the third shape: visible, in place, and explaining itself in its
 * own sub (TASTE §11.7). It loses the chevron because there is nowhere to go.
 */
export function ActionRow({
  href,
  icon,
  title,
  sub,
  disabled = false,
}: {
  readonly href?: string;
  readonly icon: ReactNode;
  readonly title: ReactNode;
  readonly sub: ReactNode;
  readonly disabled?: boolean;
}) {
  const body = (
    <>
      <span className={`${DISC} ${disabled ? "text-disabled" : "text-secondary"}`} aria-hidden="true">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block text-bodyMd font-medium ${disabled ? "text-disabled" : "text-primary"}`}
        >
          {title}
        </span>
        <span className="mt-0.5 block text-label font-regular leading-normal text-secondary">
          {sub}
        </span>
      </span>
      {href === undefined ? null : (
        <span className="flex flex-none text-tertiary" aria-hidden="true">
          <ChevronRightIcon className="size-4 rtl:-scale-x-100" />
        </span>
      )}
    </>
  );

  return (
    <li className="border-t border-hairline first:border-t-0">
      {href === undefined ? (
        <span className={ROW}>{body}</span>
      ) : (
        <Link
          href={href}
          className={`${ROW} ${tintTransition} hover:bg-raised ${focusRing}`}
        >
          {body}
        </Link>
      )}
    </li>
  );
}

/* ─── Secondary actions ──────────────────────────────────────────────────── */

/**
 * The row under a section: TASTE §5's gray-fill secondary beside an §8 inline
 * action. Never two buttons — the pair has a rank, and the rank is what says
 * which one the guest is expected to reach for.
 */
export function Acts({ children }: { readonly children: ReactNode }) {
  return (
    <div className={`mt-4 flex ${GROUP_WIDTH} flex-wrap items-center gap-4`}>{children}</div>
  );
}

/** An §8 inline action that is a link. Ink, underlined AT REST, never green. */
export function InlineLink({
  href,
  children,
}: {
  readonly href: string;
  readonly children: ReactNode;
}) {
  return (
    <Link href={href} className={`text-bodySm font-medium ${inlineAction}`}>
      {children}
    </Link>
  );
}

/* ─── Strips, hints and banners ──────────────────────────────────────────── */

/**
 * The §6 info strip: `bg.raised`, `radius.md`, payload-only bold. No border and
 * no shadow — one tint doing one of its five jobs.
 *
 * `label` renders the §15 `.striplab`, a 13/600 ink line above the body, so a
 * quoted note can carry its attribution without bolding a whole sentence (§12).
 */
export function Strip({
  label,
  children,
}: {
  readonly label?: string;
  readonly children: ReactNode;
}) {
  return (
    <p
      className={`mt-4 ${GROUP_WIDTH} rounded-md bg-raised px-3.5 py-3 text-label font-regular leading-relaxed text-secondary`}
    >
      {label === undefined ? null : (
        <span className="mb-0.5 block text-label font-semibold text-primary">{label}</span>
      )}
      {children}
    </p>
  );
}

/**
 * A reassurance line under a section — icon and text in open space, no box.
 * `CHECKOUT-SHELL` §8 puts `.ghint` in the "carries neither" column, and ruling 4
 * reconciles its spacing to 18px; `mt-4` is the token rung under it.
 */
export function Hint({
  icon,
  children,
}: {
  readonly icon: ReactNode;
  readonly children: ReactNode;
}) {
  return (
    <p
      className={`mt-4 flex ${PROSE} items-start gap-2.5 text-label font-regular leading-relaxed text-secondary`}
    >
      <span className="mt-px flex flex-none text-tertiary" aria-hidden="true">
        {icon}
      </span>
      <span>{children}</span>
    </p>
  );
}

/**
 * The page-level banner — `CHECKOUT-SHELL` §11.3's register, above the two-column
 * body and full width.
 *
 * Two tones ship here and the third is absent on purpose. `warning` is for a
 * fact the guest must act on (carry the exact cash); `info` is for a fact they
 * only need to know (the stay registration is filed for them). `error` is not
 * reachable from a post-flow surface: §15 keeps payment failure on `/confirm` at
 * step 4, where money and a form are still in play.
 *
 * Border, no shadow (§8). Colour is never the only signal — the glyph and the
 * sentence both carry the register.
 */
export function Banner({
  tone,
  icon,
  children,
}: {
  readonly tone: "warning" | "info";
  readonly icon: ReactNode;
  readonly children: ReactNode;
}) {
  return (
    <div
      className={`mt-5 flex items-start gap-3 rounded-lg border p-4 ${
        tone === "warning" ? "border-warning-border bg-warning-bg" : "border-info-border bg-info-bg"
      }`}
    >
      <span
        className={`mt-px flex flex-none ${tone === "warning" ? "text-warning" : "text-info"}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="min-w-0">{children}</span>
    </div>
  );
}

/** Body copy inside a `Banner`. Ink payload, gray sentence. */
export function BannerText({ children }: { readonly children: ReactNode }) {
  return <p className="text-bodySm leading-relaxed text-secondary">{children}</p>;
}
