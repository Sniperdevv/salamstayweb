import Link from "next/link";

import { FeesReceiptIcon } from "@/components/home-icons";
import { HostEmpty } from "@/components/host/host-empty";
import { ChevronLeftIcon } from "@/components/icons";
import { Num, Phrase } from "@/components/numerals";
import { btnSecondary, inlineAction } from "@/components/ui";
import { formatPkr } from "@/lib/money";

import { EarningsBreakdown } from "../reservations/reservation-parts";
import { reservationHref, type Reservation } from "../reservations/reservations";
import { DEDUCTION_TERMS, type PayoutGroup } from "./earnings";

/**
 * The furniture of `/host/earnings` — HA-055 at web width, honesty pass applied.
 *
 * Server-safe throughout. Nothing on this page holds state, so nothing here is
 * a client component and `page.tsx` keeps its `metadata` export (see its
 * header).
 *
 * THE ARITHMETIC IS NOT REDRAWN HERE. It is `EarningsBreakdown`, imported from
 * `../reservations/reservation-parts` — the same component the reservation
 * detail page draws, in the same order, with the same three labels and the one
 * formatter. `ha-055` specifies its own `.bktable` and `ha-048` specifies a
 * phone breakdown, and a host reading two renderings of one calculation on two
 * screens of one product has been given a reason to check whether they agree.
 * They cannot disagree if they are the same code.
 *
 * ELEVATION (TASTE §1, `HOST-SHELL.md` §8)
 * ----------------------------------------
 * A stay block carries a **border and no shadow** — the same treatment, the
 * same radius and the same padding as a reservation row, because it is the same
 * object seen from the money side. Nothing on a host surface floats over
 * scrolled content, so nothing here casts. The group headings, the totals and
 * the glossary carry **neither**: they are content in open space, which §1 says
 * is most of the premium read.
 *
 * NO BRAND GREEN ANYWHERE ON THIS PAGE. `ha-055` tints the upcoming-payout tile
 * with `interactive.primary` and sets its `Tax receipt`, `All bookings` and
 * explainer links in brand. `HOST-SHELL.md` §7 rules the host app surface
 * already over TASTE §2's four-role budget through inherited chrome, and says
 * exactly what to do about it: **"Add nothing to it."** So the money is ink
 * (§2: prices are ink), and every link is ink and underlined at rest (§8).
 */

/* ─────────────────────── chrome shared with the sub-routes ──────────────── */

/**
 * The way back from `/host/earnings/{payouts,tax}`.
 *
 * A SINGLE BACK LINK, NOT A BREADCRUMB. `HOST-SHELL.md` §1 rules a breadcrumb
 * out on every host route, and `/host/reservations/[id]` already ships this
 * exact shape for the same situation: a real page whose parent the section nav
 * names but whose own route it does not, so the nav cannot mark itself current
 * and something has to say where the host is. Ink, underlined at rest, never
 * brand (TASTE §8); the chevron mirrors under RTL.
 *
 * It lives here rather than in either sub-route because both need it and
 * because it belongs to the earnings family — the alternative was extending
 * `HostSetupContext`, whose link is hard-wired to `/host/onboarding` and which
 * three other pages depend on.
 */
export function BackToEarnings() {
  return (
    <Link href="/host/earnings" className={`inline-flex items-center gap-1 ${inlineAction}`}>
      <ChevronLeftIcon className="size-4 rtl:-scale-x-100" />
      Back to earnings
    </Link>
  );
}

/**
 * The two surfaces behind this one, at the foot of the page that owns the
 * money.
 *
 * WHY IT IS DOWN HERE AND NOT UP TOP: a host arrives at `/host/earnings` for
 * the figure and the itemisation, and both are above this. These are the two
 * questions they ask NEXT — where has it gone, and what about tax — so they sit
 * where those questions occur, after the fee glossary has answered the one
 * about deductions.
 *
 * OPEN SPACE, NO PLATE. Two rows of a title and a line is a content block, and
 * TASTE §1 is explicit that a content block gets no box: "this restraint is
 * most of the premium read." The titles ARE the links, ink and underlined at
 * rest (§8), because a title that is also the affordance is one target rather
 * than a heading with a "Learn more" hung off it.
 */
const SUBPAGES: readonly { href: string; title: string; body: string }[] = [
  {
    href: "/host/earnings/payouts",
    title: "Payouts",
    body: "Where each stay's money is right now, and what still has to happen before it reaches your account.",
  },
  {
    href: "/host/earnings/tax",
    title: "Tax on your earnings",
    body: "The withholding line from each booking, and what SalamStay can and cannot give you for filing.",
  },
];

export function MoneySubpages() {
  return (
    <section aria-labelledby="more-money-h" className="mt-12 border-t border-hairline pt-9">
      <h2 id="more-money-h" className="text-h6 font-semibold text-primary">
        More about your money
      </h2>

      <ul className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
        {SUBPAGES.map((item) => (
          <li key={item.href}>
            <p className="text-bodyMd font-semibold">
              <Link href={item.href} className={inlineAction}>
                {item.title}
              </Link>
            </p>
            <p className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ─────────────────────────── the first-run empty ────────────────────────── */

/**
 * A host who has never had a guest check in has earned NOTHING — not a zero,
 * not a flat line, not a table with four column headings and no rows.
 *
 * This is the state the real product ships in on day one, so it is the state
 * that had to be good. `HostEmpty` carries the shape (`hw-007`'s `.empty`) and
 * its three rules govern the copy: never a count of nothing, never a dead end,
 * never an apology. `ha-055`'s own empty is the same instinct — "a calm line
 * glyph and one next step, never an empty grid" — and only its destinations
 * change here, because both of the card's point at routes that do not exist.
 *
 * THE BODY PROMISES THE ITEMISATION, and that is the deliberate part. SCREENS
 * §1.2 names the itemised breakdown as the countermeasure to "where did my
 * money go?", and an empty earnings page is the earliest moment the product can
 * make that promise — before there is any money to distrust it about.
 *
 * A `<p>` title, not an `h1`: `page.tsx` owns the page's one heading, and this
 * sits under it.
 */
export function EarningsEmpty() {
  return (
    <HostEmpty
      className="mt-4"
      glyph={<FeesReceiptIcon className="size-6" />}
      title="No earnings yet"
      /* Three lines at `HostEmpty`'s 46ch measure. Centred prose past three
         lines makes the eye track back across a ragged left edge, which is the
         failure mode that component's own note names. */
      body="Nothing has been paid out yet. When a guest checks in, that stay's payout appears here, with every fee and deduction shown as an amount."
      actions={
        /*
         * NO GREEN, AND THE DESTINATION IS THE HONEST ONE.
         *
         * The obvious action is "Set up your payout method", which is what the
         * card offers — pointing at `/host/payout-settings`, a route that does
         * not exist and a settings screen nobody has built. The obvious
         * alternative, "Create a listing", asserts something about the account
         * this route cannot know, and would be a second green primary beside
         * the nav's identical one (TASTE §2).
         *
         * `/host/listings` answers both, exactly as the reservations empty
         * argues: it is the page that DOES know whether a listing exists, and
         * it already carries the green CTA for the case where one does not. The
         * §5 gray-fill secondary, then the §8 inline action beside it — a
         * ranked pair, not two identical plates with no rank between them.
         */
        <>
          <Link href="/host/listings" className={`${btnSecondary} no-underline`}>
            Go to your listings
          </Link>
          <Link href="/host/help/fees" className={`${inlineAction} text-bodySm`}>
            How payouts work
          </Link>
        </>
      }
    />
  );
}

/* ──────────────────────────── one stay's payout ─────────────────────────── */

/**
 * One booking, with its arithmetic open on the page.
 *
 * WHY THE LEDGER IS A COLUMN AND NOT THE FULL WIDTH — the one real layout
 * decision on this page.
 * -------------------------------------------------------------------------
 * `EarningsBreakdown` is a `justify-between` row: label at the reading start,
 * amount at the reading end. At the detail page's `max-w-prose` that is a
 * ~520px span and the eye carries `Service fee` straight to `-PKR 750`. Given
 * the host shell's full 1120px it becomes a 900px gap with a hairline across
 * it, and a host checking their own money has to track a rule the width of
 * their screen to find out what was taken. Same component, same code — and
 * unreadable, because the measure is wrong.
 *
 * So the block splits at `lg`: who and when on the leading side, the money on
 * the trailing side at `overlaySize.dialogMd`, which is the width the
 * calculation was drawn for. Below `lg` it stacks back into the phone shape
 * with a hairline between the two, which is `ha-048`'s order and the detail
 * page's. This is also the point of a card drawn at web width — `ha-055` is one
 * of only five in its namespace that is — and a 1120px column carrying a 520px
 * ledger and 600px of nothing would be the phone layout wearing a desktop.
 *
 * The identity side is three lines, not a flex row with something pushed to the
 * far edge: `HOST-SHELL.md` §6 wants every digit run isolated, and a two-child
 * flex row whose second child is a `.num` turns that isolate into a flex item
 * under RTL. `gap`, `ps` and `border-s` are all logical, so the whole split
 * mirrors with no RTL rule of its own.
 *
 * The link out is the §8 inline action — ink, underlined where it sits. It is
 * one line and not the whole block: a card that navigates wherever it is
 * clicked is a card a host cannot select a figure out of, and selecting the
 * figure is precisely what someone checking their own money does.
 */
export function StayPayout({ reservation: r }: { readonly reservation: Reservation }) {
  return (
    <li className="rounded-lg border border-hairline bg-canvas p-4 sm:p-5 lg:flex lg:gap-10">
      {/* Split, the columns stretch to a shared height and the link falls to the
          foot of its own (`mt-auto`), so the block is anchored at all four
          corners instead of trailing 150px of air under a four-line column.
          Stacked, `mt-4` is the rule and `lg:mt-auto` never applies. */}
      <div className="min-w-0 lg:flex lg:flex-1 lg:flex-col">
        {/* `Num` on the listing name, added with the payouts and tax routes:
            "Gulberg 2 Residence" is an unisolated digit run, and TASTE §12 /
            BUILD-DECISIONS #2 is "every digit run" with no carve-out for a name
            that happens to contain one. Caught by a mechanical sweep of the
            served HTML rather than by eye — it renders correctly in Latin
            because the whole name resolves as one LTR run, which is exactly why
            nobody spots it until the Urdu route lands. `Num` wraps the run and
            draws the phrase isolate around the name in one go. */}
        <p className="text-bodyMd font-semibold text-primary">
          <Num>{r.listing}</Num>
        </p>
        <p className="mt-1 text-bodySm font-regular text-secondary">{r.guest}</p>
        <p className="mt-0.5 text-bodySm font-regular text-secondary">
          {/* A17: `Phrase`, not a bare pair of `Num`s. Two isolates with a `·`
              and the unit word between them reordered under RTL and this read
              `nights 3 · Sat 1 – Tue 4 Aug 2026`. Same line, same fix, as
              `../reservations/tabs.tsx`. */}
          <Phrase>
            <Num>{r.dates}</Num> · <Num>{String(r.nights)}</Num>{" "}
            {r.nights === 1 ? "night" : "nights"}
          </Phrase>
        </p>

        <p className="mt-4 lg:mt-auto lg:pt-6">
          <Link href={reservationHref(r.id)} className={`${inlineAction} text-bodySm`}>
            Open this reservation
          </Link>
        </p>
      </div>

      {/*
        Stacked, the hairline separates who and when from how much, and the
        breakdown's own first row carries the space under it — two stacked
        paddings there would read as a gap in the block. Split, the 40px between
        the columns is the separation and the rule would be a stroke drawn
        across nothing, so it goes.
      */}
      <div className="mt-4 min-w-0 border-t border-hairline lg:mt-0 lg:w-1/2 lg:max-w-overlay-dialogMd lg:border-t-0">
        <EarningsBreakdown reservation={r} />
      </div>
    </li>
  );
}

/* ────────────────────────────── one group ───────────────────────────────── */

/**
 * A heading, the total under it, and the stays that add up to it.
 *
 * WHY THE FIGURE IS BIGGER THAN THE HEADING ABOVE IT
 * --------------------------------------------------
 * The heading ladder on this page is `h1` 20/600 → `h2` 18/600, one rung apart,
 * matching `/host/reservations` and `/host/listings` so the three sections of
 * one app do not each shout at a different volume. The total is set at 24, one
 * rung ABOVE the `h1`, and that is deliberate: 24 is a figure, not a heading.
 * A host opened this page for the number, the nav one row up already told them
 * the page is Earnings, and TASTE §7's "content pages never shout" is a rule
 * about display type at 52 and 64, not about the one datum a screen exists for.
 *
 * INK, NOT BRAND (TASTE §2: prices are ink). `ha-055` gives the upcoming-payout
 * tile a brand-coloured value; a host's own money is not a call to action.
 *
 * THE TOTAL IS ADDITION AND NOTHING ELSE. It is the sum of the stated `net`
 * figures in the rows directly below it, so the trace from headline to evidence
 * is one scroll and no arithmetic the host cannot check. There is no gross
 * total, no fee total and no "% of gross" line beside it — that comparison is
 * the one `ha-055` prints as `94.2% of gross`, and no rate is published in this
 * product.
 */
export function PayoutSection({ group }: { readonly group: PayoutGroup }) {
  const headingId = `payout-${group.key}`;

  return (
    <section aria-labelledby={headingId} className="mt-10">
      <h2 id={headingId} className="text-h6 font-semibold text-primary">
        {group.heading}
      </h2>

      <p className="mt-1.5 text-h4 font-semibold text-primary">
        <span className="num">{formatPkr(group.total)}</span>
      </p>

      <p className="mt-2 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
        {group.lead}
      </p>

      <ul className="mt-5 flex flex-col gap-3">
        {group.stays.map((r) => (
          <StayPayout key={r.id} reservation={r} />
        ))}
      </ul>
    </section>
  );
}

/* ───────────────────────────── the glossary ─────────────────────────────── */

/**
 * The three deducted lines, explained once, in the words a host would use.
 *
 * Open columns — no plate, no box, no tinted card. TASTE §1: a content block is
 * a title and a body in open space, and `ha-055`'s bordered `.explain`
 * disclosure is a box drawn around prose. Three terms, three columns, exactly:
 * a grid gets as many cells as there are things to put in it.
 *
 * **`Service fee`, not `Service fee (wakala)`** — `REPOSITIONING.md` replaces
 * the word, and `HOST-SHELL.md` §0.2 forbids carrying an `ha-*` string forward
 * without that check. The mechanism behind the fee is unchanged; what changes is
 * that nobody has to look a word up to find out where their money went.
 *
 * The link is the one place a host can go for more, and it resolves: the fees
 * explainer is a registered route. `ha-055`'s other three destinations — a
 * payout-settings page, a bookings index and a tax-receipt PDF — are not, and
 * are not linked here.
 */
export function DeductionGlossary() {
  return (
    <section aria-labelledby="deductions-h" className="mt-12 border-t border-hairline pt-9">
      <h2 id="deductions-h" className="text-h6 font-semibold text-primary">
        What comes off each booking
      </h2>

      <p className="mt-2 max-w-[68ch] text-bodySm font-regular leading-relaxed text-secondary">
        Every payout above lists these three, in this order, with the amount for that booking.
      </p>

      <dl className="mt-7 grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-3">
        {DEDUCTION_TERMS.map(({ term, body }) => (
          <div key={term}>
            <dt className="text-bodyMd font-semibold text-primary">{term}</dt>
            <dd className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">
              {body}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-7">
        <Link href="/host/help/fees" className={`${inlineAction} text-bodySm`}>
          See how each payout is calculated
        </Link>
      </p>
    </section>
  );
}
