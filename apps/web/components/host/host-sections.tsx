import Link from "next/link";
import {
  ChatIcon,
  DocumentDateIcon,
  NoAlcoholIcon,
  PersonIcon,
  QiblaIcon,
  ShieldCheckIcon,
  WholeHomeIcon,
} from "@/components/home-icons";
import { HouseRulesIcon, IdCardIcon, UserPlusIcon } from "@/components/host/host-icons";
import { btnSecondary, focusRing, inlineAction } from "@/components/ui";
import { headingGap, sectionH2, shell } from "@/components/discovery/shell";
import {
  EARNINGS,
  HOST_CONTROLS,
  HOST_FEES,
  HOST_STEPS,
  HOST_TRUST,
} from "@/lib/content/become-a-host";

/**
 * HA-001, everything below the hero.
 *
 * ── One rule decides the whole look of this file ─────────────────────────
 * TASTE-RULES §1: shadow means the element floats over content the reader
 * scrolls; border means a form boundary or an unselected choice; **content
 * carries neither**. The card draws four of these five blocks as bordered
 * plates — `.attr`, `.tcard`, `.feelist`, `.teaser` — and none of them floats
 * and none of them is a form. So every one of them ships here as an open
 * column: a gray glyph, a 16/600 subhead, a 14/400 body, and air. That
 * restraint is most of the premium read, and it is also what keeps a long
 * marketing page from looking like eleven boxes stacked in a column.
 *
 * The page's ONE hairline that is not a divider between rows is the rule above
 * the closing block, and its ONE brand-coloured thing is the hero pill's submit
 * circle, one screen up. Nothing below is green, plated or boxed.
 *
 * ── Type ladder, fixed here ──────────────────────────────────────────────
 *   h2 sections 20/600 (`sectionH2`) → column headings 18/600 (`h6`) →
 *   item subheads 16/600 (`bodyMd`) → bodies 14/400 gray (`bodySm`).
 * Never 14 under 14: an item whose title and body are the same size is a
 * paragraph with a bold first phrase, not a titled block.
 *
 * ── Copy ─────────────────────────────────────────────────────────────────
 * Every string comes from `lib/content/become-a-host.ts`, which is the card
 * verbatim. The six §5 claims on this page are byte-exact. The earnings
 * arithmetic is a stated multiplication carrying its own "not a market average
 * or a promise" sentence, and there is no market rate anywhere on the page.
 */

const section = `${shell} pb-12 md:pb-16`;

/** Section support line — one measure for all four of them. */
const sectionSub = "mt-3 max-w-[68ch] text-bodyMd text-secondary";

/** Item subhead / body pair, per the addendum's 16-over-14 step. */
const itemTitle = "text-bodyMd font-semibold text-primary";
const itemBody = "mt-1.5 text-bodySm text-secondary";

const STEP_ICONS = {
  userPlus: UserPlusIcon,
  idCard: IdCardIcon,
  home: WholeHomeIcon,
} as const;

const CONTROL_ICONS = {
  rules: HouseRulesIcon,
  qibla: QiblaIcon,
  noAlcohol: NoAlcoholIcon,
  person: PersonIcon,
} as const;

const TRUST_ICONS = {
  shield: ShieldCheckIcon,
  document: DocumentDateIcon,
  chat: ChatIcon,
} as const;

/**
 * How hosting works — the card's three steps, as an `<ol>` because they are
 * genuinely ordered.
 *
 * The step numeral rides in the subhead the way the card writes it, separated
 * by a single `·` with a space either side (§7: one per gap, never chained,
 * never decorative). It carries `.num` so a numeral run in the Urdu build
 * cannot be reordered by the bidi algorithm.
 *
 * The card puts each glyph in a 40px brand-tinted disc. That disc is a fifth
 * green on a page whose budget is four roles, and a filled container behind a
 * 24px mark on a content block is exactly what §1 says content does not carry,
 * so the glyph stands on its own in gray — the same treatment the two grids
 * below and the shipped homepage trust grid use. Four icon grids on one page
 * reading as one family is worth more than three discs.
 */
export function HostSteps() {
  return (
    <section aria-labelledby="how-h" className={section}>
      <h2 id="how-h" className={sectionH2}>
        How hosting works
      </h2>
      <p className={sectionSub}>
        Three steps, no signup wall to see what you could earn first — try the earnings
        estimator before you create an account.
      </p>

      <ol className={`${headingGap} grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-3`}>
        {HOST_STEPS.map(({ number, title, body, icon }) => {
          const Icon = STEP_ICONS[icon];
          return (
            <li key={number}>
              <Icon className="size-6 text-secondary" />
              <h3 className={`mt-3 ${itemTitle}`}>
                <span className="num">{number}</span> · {title}
              </h3>
              <p className={itemBody}>{body}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/**
 * What you control as a host — the card's four settings, claims 4, 5 and 6
 * among them, verbatim.
 *
 * Two columns from `md`, and the items are `<li>` with a bold subhead rather
 * than `<h3>`: the card sets them as spans, and four headings here would put
 * eight h3s in the page outline for what is a settings list, not a set of
 * sub-topics.
 */
export function HostControl() {
  return (
    <section aria-labelledby="control-h" className={section}>
      <h2 id="control-h" className={sectionH2}>
        What you control as a host
      </h2>
      <p className={sectionSub}>
        Cultural and practical preferences sit beside the everyday settings, stated
        plainly and given equal weight — you decide, we never assume.
      </p>

      <ul className={`${headingGap} grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2`}>
        {HOST_CONTROLS.map(({ title, body, icon }) => {
          const Icon = CONTROL_ICONS[icon];
          return (
            <li key={title} className="flex items-start gap-3.5">
              <Icon className="mt-0.5 size-6 shrink-0 text-secondary" />
              <span className="min-w-0">
                <span className={`block ${itemTitle}`}>{title}</span>
                <span className={`block ${itemBody}`}>{body}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Fees and earnings — the honest half of the page, and the one §12 governs
 * line by line.
 *
 * Left: where the money sits (amanah with Meezan Bank), then the three items
 * that come off a booking, then a link to the arithmetic in full. The fee rows
 * are hairline-divided and nothing else — no outer box, no fill, no rule above
 * the first row or below the last. §9 of the anti-slop pass and §11.9 both say
 * the same thing from different directions: a rule per row is a hatch pattern,
 * a rule per GAP is a list.
 *
 * Right: the illustrative multiplication. Every figure is the card's, the
 * "not a market average or a promise" sentence is attached to them in the
 * content module so it cannot be edited away separately, and the digits carry
 * `.num`. There is no market average, no "hosts earn up to", and no statistic
 * drawn from a real listing anywhere in this block — HA-002 continues the
 * exploration and it does not carry one either.
 *
 * The card plates this column in brand tint at `radius.xl`. It ships open
 * instead: brand tint is a fifth green (§2) and a plate is a box on content
 * (§1). What separates the two columns is the `lg:gap-12` between them and the
 * 18/600 heading on top of this one, which is enough.
 */
export function HostFees() {
  return (
    <section aria-labelledby="fees-h" className={section}>
      <h2 id="fees-h" className={sectionH2}>
        Fees and earnings
      </h2>
      <p className={sectionSub}>
        Hosting income is rent for the use of your home — paid to you, never lent out,
        and never interest.
      </p>

      <div
        className={`${headingGap} grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-12`}
      >
        <div className="min-w-0">
          <p className="max-w-[62ch] text-bodyMd text-secondary">
            Guest payments are held in{" "}
            {/* §7: bold the payload word only. */}
            <strong className="font-semibold text-primary">amanah</strong> — a trust —
            with Meezan Bank, and released to you once your guest checks in. It isn&apos;t
            spent, lent out, or used to earn interest while it waits.
          </p>
          <p className="mt-4 max-w-[62ch] text-bodyMd text-secondary">
            {/* Registry claim 9, byte-exact. */}
            <strong className="font-semibold text-primary">
              Transparent fees and tax — every rupee shown before you book or earn.
            </strong>{" "}
            Three items come off each booking before your payout:
          </p>

          <ul className="mt-6 divide-y divide-hairline">
            {HOST_FEES.map(({ name, detail, rate, numeric }) => (
              <li
                key={name}
                className="flex items-start justify-between gap-6 py-3.5 first:pt-0 last:pb-0"
              >
                <span className="min-w-0">
                  <span className={`block ${itemTitle}`}>{name}</span>
                  <span className="mt-0.5 block text-label font-regular text-tertiary">
                    {detail}
                  </span>
                </span>
                <span
                  className={`shrink-0 text-bodySm font-semibold text-secondary ${
                    numeric ? "num" : ""
                  }`}
                >
                  {rate}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-5">
            <Link
              href="/host/help/fees#wakala"
              className={`${inlineAction} text-bodySm ${focusRing}`}
            >
              See exactly how each payout is calculated
            </Link>
          </p>
        </div>

        <div className="min-w-0">
          <h3 className="text-h6 text-primary">{EARNINGS.heading}</h3>

          {/* One measure for all three paragraphs in this column: the figures,
              the assumption and the riba line share a right edge, because a
              disclaimer that sets wider than the claim it qualifies reads as an
              afterthought pinned underneath rather than as part of the same
              statement. */}
          <p className="mt-3 max-w-[52ch] text-bodyMd text-primary">
            If you host at{" "}
            <span className="num font-semibold">{EARNINGS.rate}</span> a night for{" "}
            <span className="num font-semibold">{EARNINGS.nights}</span> nights a month,
            that&apos;s <span className="num font-semibold">{EARNINGS.total}</span> a
            month — before the service fee, payment processing, and withholding tax.
          </p>

          {/* §12: the assumption never ships apart from the figures, and it is
              set at body size rather than in fine print — a disclaimer nobody
              can read is a disclaimer that is not there. */}
          <p className="mt-3 max-w-[52ch] text-bodySm text-secondary">
            {EARNINGS.assumption}
          </p>

          <p className="mt-4 max-w-[52ch] border-t border-hairline pt-4 text-bodySm text-secondary">
            {EARNINGS.halal}
          </p>

          <Link
            href="/become-a-host/earnings-estimator"
            className={`${btnSecondary} mt-6`}
          >
            {EARNINGS.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Verification & trust — claims 1, 2, 3 and 8, verbatim, in the card's grouping
 * (2 and 3 share a cell there and share one here).
 *
 * The two links out are ink and underlined at rest (§8), not green with an
 * arrow as the card draws them: §2 keeps green off links everywhere, and the
 * underline is the affordance.
 */
export function HostTrust() {
  return (
    <section aria-labelledby="trust-h" className={section}>
      <h2 id="trust-h" className={sectionH2}>
        Verification &amp; trust
      </h2>
      <p className={sectionSub}>
        Verification is a mutual formality between people trusted by default — you
        verify, and so does every guest who books with you.
      </p>

      <ul className={`${headingGap} grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-3`}>
        {HOST_TRUST.map(({ claim, body, icon }) => {
          const Icon = TRUST_ICONS[icon];
          return (
            <li key={claim}>
              <Icon className="size-6 text-secondary" />
              <p className={`mt-3 ${itemTitle}`}>{claim}</p>
              <p className={itemBody}>{body}</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
        <Link href="/trust-and-safety" className={`${inlineAction} text-bodySm ${focusRing}`}>
          Read how we keep stays safe
        </Link>
        <Link href="/shariah-policy" className={`${inlineAction} text-bodySm ${focusRing}`}>
          Our Shariah-respectful approach
        </Link>
      </div>
    </section>
  );
}

/**
 * The closing call.
 *
 * The card plates this in `bg.raised` and ends it with a second green button.
 * Both go: §2 allows exactly ONE primary CTA per surface and the hero pill is
 * it, so this is the §5 gray-fill secondary — the single component that carries
 * every non-primary action on the site. Which is also why the plate had to go:
 * a `bg.raised` button on a `bg.raised` plate is an invisible button.
 *
 * One hairline above it, and it is the only rule on the page that separates
 * blocks rather than rows. A closing ask that arrives with no edge at all after
 * an FAQ reads as a fifth FAQ answer.
 */
export function HostClosing() {
  return (
    <section aria-labelledby="closing-h" className={`${shell} pb-14 md:pb-20`}>
      <div className="flex flex-col gap-6 border-t border-hairline pt-8 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="min-w-0">
          <h2 id="closing-h" className={sectionH2}>
            Ready to list your home?
          </h2>
          <p className="mt-2 max-w-[62ch] text-bodySm text-secondary">
            Read the{" "}
            <Link href="/legal/host-terms" className={`${inlineAction} ${focusRing}`}>
              host terms
            </Link>
            , or visit the{" "}
            <Link href="/help" className={`${inlineAction} ${focusRing}`}>
              help center
            </Link>{" "}
            if you have questions first.
          </p>
        </div>

        <Link href="/signup" className={`${btnSecondary} shrink-0`}>
          Start hosting
        </Link>
      </div>
    </section>
  );
}
