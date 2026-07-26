"use client";

import { useState, type ReactNode } from "react";

import { InfoIcon } from "@/components/icons";
import { WizardStep } from "@/components/host/wizard-step";
import { GuestStepper } from "@/components/ui/guest-stepper";
import { Checkbox } from "@/components/ui/checkbox";
import { controlRing, hostFieldLabel, hostFieldSub, tintTransition } from "@/components/ui";
import { formatPkr } from "@/lib/money";

/**
 * Step 9 of 9 — `/host/listings/new/pricing`. The last numbered step; what
 * follows is the publish preview, which carries no stepper (`HOST-SHELL.md` §15).
 *
 * Cards: `hw-004-wizard-form.html` panels D (priced), E (rate empty) and F (a
 * second price set, weekend rate on), with `ha-031` behind them for the money
 * and `ha-032` behind the availability section. Contract: `HOST-SHELL.md`, §6
 * for money and §16 for the amendments that override the sections above it.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * MONEY — THE WHOLE RULE, IN ONE PLACE
 * ───────────────────────────────────────────────────────────────────────────
 * Format is always **`PKR 12,500`**: three-letter code, one space, thousands
 * separator, every run `.num`-isolated, ink, never brand-coloured, never
 * underlined — nothing on this page opens a breakdown, so TASTE §8's price
 * underline does not apply.
 *
 * **The input's prefix is the code, not the rupee glyph.** `HOST-SHELL.md` §16.1
 * settles the contract's own split: §2b called the glyph "a numeric input's
 * prefix and nothing else"; §6 said it ships in no file; §6 wins and §2b is
 * struck. `ha-031` draws the glyph and is the older rung. It appears nowhere in
 * this file, including in this comment.
 *
 * Every rendered amount goes through `formatPkr` — `BUILD-DECISIONS` ruling 14
 * makes it the single implementation on the web app, so a second grouping rule
 * cannot appear here. `groupedDigits` below is that same function with its own
 * prefix removed, rather than a second `Intl.NumberFormat`, for exactly that
 * reason: the field's currency lives in the visible `PKR` prefix, so the input
 * holds the digits half of the string and nothing else.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * THE BREAKDOWN CARRIES NO PERCENTAGE, AND — ON A LIVE PAGE — NO SERVICE FEE
 * ───────────────────────────────────────────────────────────────────────────
 * `hw-004` DECISION 4 draws five rows against ONE worked property: nightly
 * 12,000 × 3 = 36,000 · cleaning 3,000 · service 2,340 · Punjab sales tax 1,950
 * · total 43,290. Those are `ha-031`'s literal amounts for that home. They are
 * content, not a formula, and no rate is published in any file — which is
 * exactly why the card carries **no percentage**, and why the service-fee line
 * reads `Service fee` and not the parenthetical `REPOSITIONING.md` drops.
 *
 * A live page cannot print those two lines. The host types their own nightly
 * rate here, and deriving a service fee or a sales tax from it would mean
 * inventing a multiplier — `lib/money.ts` refuses to hold one and says why: "an
 * invented multiplier prints an invented number at a guest who is about to pay
 * it." Rendering the card's 2,340 beside a host who just typed 8,000 would be
 * worse still: a figure about somebody else's home, presented as theirs.
 *
 * So the section ships the lines this page genuinely owns — the host's nightly
 * rate times the example's nights, their cleaning fee, and the total of those
 * two, all closed arithmetic on the host's own numbers — and states the other
 * two in plain words instead of a figure. TASTE §12: null money is suppressed,
 * never rendered as a dash and never as a zero. The section heading is
 * `What a guest pays you` rather than the card's `What guests will see`, because
 * a heading that promised the whole guest breakdown and then showed part of it
 * would be the dishonest version of the same restraint.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * AVAILABILITY — WHAT THIS PRODUCT ACTUALLY MODELS
 * ───────────────────────────────────────────────────────────────────────────
 * `ha-032` draws four availability controls on the phone: minimum stay, maximum
 * stay, advance notice, preparation time between stays — plus a month grid for
 * blocking dates. This page ships **minimum stay** and nothing else, and the
 * omissions are deliberate:
 *
 *  · **Maximum stay** — `date-range-picker.tsx` states it outright: "There is no
 *    booking horizon and no maximum stay. Neither exists anywhere in the corpus
 *    and `BUILD-DECISIONS` §16 names both as product decisions nobody may
 *    invent." Collecting one here would create a setting the booking rules
 *    cannot honour and a limit no ruling has made.
 *  · **Advance notice** and **preparation time** — the listing model holds
 *    `capacity.minNights` and `availability.blockedNights` and nothing else.
 *    Same objection, same answer.
 *  · **The block-dates month grid** — no `HW-` card draws one at web width, and
 *    `ha-032`'s grid is the Hijri-aware month grid the founder's 2026-07-26
 *    ruling removes. The guest `DateRangePicker` cannot stand in: it is a
 *    two-tap check-in/check-out range bound to a `ListingContent`, which a draft
 *    does not have, and open/blocked is not a range. Drawing a second calendar
 *    rendering here would be inventing a screen.
 *
 * What survives is true and complete on its own terms: blocked nights start
 * empty, so every date is open the day the listing goes live, and the minimum
 * stay is the one length rule `lib/booking` enforces.
 *
 * WHY THIS PAGE IS A CLIENT COMPONENT — see the same note on step 8. Every
 * control is controlled and the footer's `nextDisabled` / `note` derive from
 * that state, so no `metadata` export is possible from this module.
 * `app/host/layout.tsx` supplies `noindex, follow` to the whole `/host/*` tree,
 * so the route contract holds; the `<title>` falls back to the root layout's.
 */

/* ————— section recipe — `HOST-SHELL.md` §5 ———————————————————————————————
 *
 * Duplicated from the house-rules step rather than shared. Five wizard steps are
 * being authored in parallel this wave and a shared `wizard-section.ts` written
 * by any one of them would be a file five agents edit at once. Merge candidate,
 * flagged, not a design decision.
 */

/** `.fsec`. The card's 28px is not a `space` rung (it jumps 6 → 8); this rounds to 8. */
const stepSection = "mt-8 border-t border-hairline pt-8";

/** `.fsec h2` — 22/600 in the card; `text-h5` (20/600) is the rung below it. */
const stepSectionTitle = "text-h5 font-semibold text-primary";

/** `.sec-sub` — 14/400 secondary, held to a reading measure. */
const stepSectionSub = "mt-2 max-w-[62ch] text-bodySm text-secondary";

/** `.ghint` — icon + text in open space. TASTE §1: a content block casts and bounds nothing. */
const stepHint =
  "mt-6 flex max-w-[62ch] items-start gap-3 text-label font-regular leading-relaxed text-secondary";

/**
 * `.strip` — TASTE §6's info strip: one tint, `radius.md`, payload-only bold.
 *
 * No `max-w`, matching step 3's `previewStrip` byte for byte on that point: the
 * strip is a tinted plate, and a plate that stops short of the section rule
 * above it reads as a misaligned box rather than as a measure. The 62ch reading
 * measure belongs to the untinted prose — `.psub` and `.sec-sub` — which is
 * where every step already spends it.
 */
const stepStrip = "mt-4 rounded-md bg-raised px-4 py-3 text-bodySm leading-relaxed text-secondary";

/**
 * The stepper's form group — `fieldGroup` spelled out without its `max-w-lg`.
 *
 * Every other property is byte-identical to `components/ui.ts`'s `fieldGroup`;
 * only the clamp is dropped, so this row is the same width as the four steppers
 * on step 3 rather than 128px narrower than them for no reason a host can see.
 * Appending an override would not work — both set `max-width`, and which wins is
 * Tailwind's emission order rather than the order they are written.
 */
const counterGroup = "mt-6 overflow-hidden rounded-md border border-border-default bg-canvas";

/** The payload word inside a hint, a strip or a sub-line. TASTE §7: never a whole sentence. */
const payload = "font-semibold text-primary";

/* ————— money ————————————————————————————————————————————————————————————— */

/** `"PKR "`, measured rather than counted. `formatPkr` is the only thing that emits it. */
const CODE_PREFIX_LENGTH = "PKR ".length;

/**
 * The digits half of a money string — `12500` → `12,500`.
 *
 * Derived from `formatPkr` rather than written as a second `Intl.NumberFormat`,
 * so the field and the breakdown can never disagree about grouping: `en-PK` is
 * pinned in that module precisely to rule out `en-IN` lakh grouping, and a
 * second formatter here would be one CLDR neighbour away from printing
 * `1,25,000` in a field whose breakdown says `125,000`.
 *
 * A non-finite value falls back to the raw digits rather than throwing. There is
 * no `maxLength` on these fields — a price ceiling is a product decision nobody
 * has made — so a host who holds a key down must get their own digits back, not
 * an error boundary.
 */
function groupedDigits(digits: string): string {
  if (digits === "") return "";
  const amount = Number(digits);
  return Number.isFinite(amount) ? formatPkr(amount).slice(CODE_PREFIX_LENGTH) : digits;
}

/** `""` when the field is empty or unusable. Never coerced to `0` — TASTE §12. */
function amountOf(digits: string): number | null {
  if (digits === "") return null;
  const amount = Number(digits);
  return Number.isFinite(amount) ? amount : null;
}

/**
 * `HOST-SHELL.md` §5's `.fwrap` with a currency prefix and a unit suffix — the
 * one field shape the shared primitives do not carry.
 *
 * `TextInput` is the checkout's `gw-024` promo cell: an `overline` label INSIDE
 * a bordered box, and no slot on either side of the value. This needs the host
 * shell's own anatomy — `hostFieldLabel` above, `bg.sunken` shell, the code
 * leading and the unit trailing, both `14/400 secondary` and neither a second
 * control (§5: "Never a second control").
 *
 * It lives here rather than in `components/ui/` because pricing is the only step
 * that spends money. If a second one appears, this is the thing to lift.
 */
function MoneyField({
  id,
  name,
  label,
  value,
  onChange,
  unit,
  placeholder,
  hint,
}: {
  readonly id: string;
  readonly name: string;
  readonly label: ReactNode;
  readonly value: string;
  readonly onChange: (digits: string) => void;
  /** `.funit` — "a night", "per stay". Omitted where the label already says it. */
  readonly unit?: string;
  readonly placeholder?: string;
  readonly hint?: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={hostFieldLabel}>
        {label}
      </label>

      <div
        className={`relative mt-2 flex min-h-12 items-center gap-3 rounded-md border border-border-default bg-sunken px-4 hover:border-border-strong ${tintTransition}`}
      >
        {/*
          Not `aria-hidden`. The code and the unit are the two facts that make
          the digits mean something, and a sibling span is not part of the
          input's accessible name — so both are named by `aria-describedby`
          instead, and a screen reader hears "Nightly rate, edit text, PKR, a
          night" rather than a bare number.
        */}
        <span id={`${id}-code`} className="flex-none text-bodySm text-secondary">
          PKR
        </span>

        {/*
          `.num` on the ELEMENT — `hw-001`'s `class="finput num"` pattern, and the
          only way the rule can reach a value the host typed: an `<input value>`
          holds text, so a per-run `.num` span cannot go inside one (`hw-004`
          DECISION 3). It also buys tabular figures, so the unit suffix does not
          shuffle sideways as the digits change.
        */}
        <input
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={groupedDigits(value)}
          placeholder={placeholder}
          aria-describedby={unit === undefined ? `${id}-code` : `${id}-code ${id}-unit`}
          onChange={(event) => onChange(event.target.value.replace(/[^0-9]/g, ""))}
          className="peer num min-w-0 flex-1 border-none bg-transparent p-0 text-bodyMd text-primary outline-none placeholder:text-secondary"
        />

        {unit === undefined ? null : (
          <span id={`${id}-unit`} className="flex-none text-bodySm text-secondary">
            {unit}
          </span>
        )}

        {/* Ring overlay — later sibling of the `peer` input, see `controlRing`.
            It goes on the CELL because the input is borderless inside it, and a
            2px ring hugging a bare text line reads as a second, smaller field. */}
        <span aria-hidden="true" className={controlRing} />
      </div>

      {hint === undefined ? null : <span className={hostFieldSub}>{hint}</span>}
    </div>
  );
}

/* ————— the guest-facing rows ————————————————————————————————————————————
 *
 * Hairline-divided rows in OPEN SPACE — no box, no shadow, no rail (`hw-004`
 * DECISION 5; TASTE §1's "carries NEITHER"; `HOST-SHELL.md` §8: a host wizard
 * has nothing to summarise and no host card draws a rail).
 */

const bdRow = "flex items-baseline justify-between gap-4 py-3";
const bdLabel = "text-bodySm text-secondary";
const bdValue = "num whitespace-nowrap text-bodySm text-primary";

/**
 * The example's length, and the one number on this page that is neither the
 * host's nor the corpus's.
 *
 * `hw-004` panel D writes "A worked example for three nights", so three is the
 * card's own framing rather than an invention here. It is spelled in prose and
 * printed as a digit only inside the row it multiplies, where it is arithmetic.
 */
const EXAMPLE_NIGHTS = 3;

export default function PricingStep() {
  const [nightly, setNightly] = useState("");
  const [weekendPricing, setWeekendPricing] = useState(false);
  const [weekendRate, setWeekendRate] = useState("");
  const [cleaning, setCleaning] = useState("");

  /**
   * `1` is the floor a stay cannot go below, not a default somebody chose — the
   * shortest bookable stay is one night by arithmetic. `−` disables there and
   * keeps its box, its position and the row's height (TASTE §11.7).
   */
  const [minNights, setMinNights] = useState(1);

  const nightlyAmount = amountOf(nightly);
  const cleaningAmount = amountOf(cleaning);
  const nightsSubtotal = nightlyAmount === null ? null : nightlyAmount * EXAMPLE_NIGHTS;
  const hostTotal =
    nightsSubtotal === null ? null : nightsSubtotal + (cleaningAmount ?? 0);

  const blocked =
    nightly === ""
      ? "Set a nightly price to continue."
      : weekendPricing && weekendRate === ""
        ? "Set your Friday and Saturday rate to continue."
        : null;

  return (
    <WizardStep
      step={9}
      stepName="Pricing & availability"
      note={blocked ?? "Your progress saves as you go."}
      backHref="/host/listings/new/house-rules"
      nextHref="/host/listings/new/preview"
      nextDisabled={blocked !== null}
      nextLabel="Review and publish"
    >
      <div className="pt-11">
        <h1 className="text-h3 font-semibold text-primary">Set your price</h1>
        <p className="mt-3 max-w-[56ch] text-bodyMd text-secondary">
          Your price, your call. This page shows what a guest pays you, line by line.
        </p>
      </div>

      {/* Same reasoning as step 8: a real `<form>` (§11.1) whose only submit path
          is the shell's footer link, so `onSubmit` exists to stop Enter in a
          price field reloading the page. */}
      <form id="pricing-form" onSubmit={(event) => event.preventDefault()}>
        <section className={stepSection} aria-labelledby="rates-h">
          <h2 id="rates-h" className={stepSectionTitle}>
            Your rates
          </h2>
          <p className={stepSectionSub}>
            You can change any of these from your listing page whenever you like,
            including after it goes live.
          </p>

          {/*
            One field, or two. `hw-004` panel D draws the nightly rate alone with
            an "a night" suffix; panel F draws the two-up the moment a weekend
            rate exists, and the weekday field's unit becomes the days it covers.
            The suffix moves into the sub-line there because "a night" is true of
            both columns and would say nothing about either.
          */}
          <div className="mt-6">
            {weekendPricing ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <MoneyField
                  id="nightly-rate"
                  name="nightly-rate"
                  label="Nightly rate"
                  value={nightly}
                  onChange={setNightly}
                  placeholder="Amount per night"
                  hint="Sunday to Thursday."
                />
                <MoneyField
                  id="weekend-rate"
                  name="weekend-rate"
                  label="Friday and Saturday"
                  value={weekendRate}
                  onChange={setWeekendRate}
                  placeholder="Amount per night"
                  hint="Applies to those two nights only."
                />
              </div>
            ) : (
              <MoneyField
                id="nightly-rate"
                name="nightly-rate"
                label="Nightly rate"
                value={nightly}
                onChange={setNightly}
                unit="a night"
                placeholder="Amount per night"
                hint="You set your price. This is not a suggested market rate, and nothing adjusts it for you."
              />
            )}
          </div>

          {/*
            The checkbox's whole label — the sentence AND the state line under it
            — is the input's accessible name, exactly as `SwitchRow` composes its
            rows. That is verbose and it is the point: the second line says what
            a guest is charged, not what the control does.
          */}
          <div className="mt-4">
            <Checkbox
              name="weekend-pricing"
              checked={weekendPricing}
              onChange={setWeekendPricing}
            >
              Charge a different rate on Friday and Saturday
              <span className={hostFieldSub}>
                {weekendPricing
                  ? "On — those two nights use the rate above."
                  : "Off — Friday and Saturday nights cost the same as every other night."}
              </span>
            </Checkbox>
          </div>

          <div className="mt-6">
            <MoneyField
              id="cleaning-fee"
              name="cleaning-fee"
              label="Cleaning fee"
              value={cleaning}
              onChange={setCleaning}
              unit="per stay"
              placeholder="Leave blank for none"
              hint="A one-time fee for the whole stay, not per night. Guests see it on its own line, never folded into the nightly rate."
            />
          </div>

          <p className={stepHint}>
            <InfoIcon className="mt-0.5 size-5 flex-none text-tertiary" />
            <span>
              <b className={payload}>There is no automatic price adjustment.</b> Your
              nightly rate changes when you change it, and at no other time.
            </span>
          </p>
        </section>

        <section className={stepSection} aria-labelledby="guest-h">
          <h2 id="guest-h" className={stepSectionTitle}>
            What a guest pays you
          </h2>
          <p className={stepSectionSub}>
            {weekendPricing ? (
              <>
                A worked example for <b className={payload}>three weekday nights</b>.
                Friday and Saturday nights use your weekend rate.
              </>
            ) : (
              <>
                A worked example for <b className={payload}>three nights</b>, from the
                numbers above. It updates as you change them.
              </>
            )}
          </p>

          {nightlyAmount === null || nightsSubtotal === null || hostTotal === null ? (
            /* Panel E's empty register: no dash, no zero, no skeleton over a
               figure nobody has typed — a sentence saying what will appear and
               what has to happen first. */
            <p className={stepStrip}>
              Nothing to show yet. Your lines appear here as soon as you set a nightly
              rate.
            </p>
          ) : (
            /* No `max-w` of its own. `.bd` in the card has none either, and it
               should not: a two-column ledger reads by its right edge, and a
               62ch clamp measured against this wrapper's inherited 16px would
               stop the amounts short of the strip and of the section rule below
               them — three different right edges inside one section. */
            <div className="mt-6">
              <div className={bdRow}>
                <span className={bdLabel}>
                  <span className="num">{formatPkr(nightlyAmount)}</span> ×{" "}
                  <span className="num">{EXAMPLE_NIGHTS}</span> nights
                </span>
                <span className={bdValue}>{formatPkr(nightsSubtotal)}</span>
              </div>

              {/* Suppressed, not zeroed, when the host has left it blank. */}
              {cleaningAmount === null ? null : (
                <div className={`${bdRow} border-t border-hairline`}>
                  <span className={bdLabel}>Cleaning fee</span>
                  <span className={bdValue}>{formatPkr(cleaningAmount)}</span>
                </div>
              )}

              {/*
                The total of the host's own lines, and it closes exactly. It
                renders only when there is more than one line to close: with no
                cleaning fee the total IS the row above it, and printing the same
                amount twice, three lines apart, reads as a stutter rather than
                as a sum.
              */}
              {cleaningAmount === null ? null : (
                <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-border-default pt-4">
                  <span className="text-bodyMd font-semibold text-primary">Your total</span>
                  <span className="num whitespace-nowrap text-bodyLg font-semibold text-primary">
                    {formatPkr(hostTotal)}
                  </span>
                </div>
              )}
            </div>
          )}

          <p className={stepStrip}>
            Your price and the SalamStay service fee are always{" "}
            <b className={payload}>separate lines</b>, on your side and on the guest&rsquo;s.
            Neither is ever folded into the other.
          </p>

          <p className={stepHint}>
            <InfoIcon className="mt-0.5 size-5 flex-none text-tertiary" />
            <span>
              A service fee and sales tax are added to what a guest pays, each on its own
              line with its own amount, and a guest sees both in full before they pay.
              Neither is shown here, because both depend on the booking and on the
              province your home is in.
            </span>
          </p>
        </section>

        <section className={stepSection} aria-labelledby="availability-h">
          <h2 id="availability-h" className={stepSectionTitle}>
            Your availability
          </h2>
          <p className={stepSectionSub}>
            What a guest finds on your calendar the day you publish.
          </p>

          <p className={stepStrip}>
            <b className={payload}>Every date is open</b> when your listing goes live.
          </p>

          {/*
            One row in a form group — `radius.md`, one `border.default`, no
            shadow: TASTE §1 makes it a boundary, not a float. The stepper is
            `gw-021`'s guest counter, reused rather than re-coined, which is
            `hw-004` DECISION 1's own instruction: one object, two flows, and a
            reviewer greps one name.
          */}
          <div className={counterGroup}>
            <GuestStepper
              label="Minimum stay"
              hint="The shortest booking a guest can make."
              value={minNights}
              min={1}
              max={null}
              countLabel={
                minNights === 1 ? "1 night minimum" : `${String(minNights)} nights minimum`
              }
              decrementLabel="One night fewer"
              incrementLabel="One night more"
              onChange={setMinNights}
            />
          </div>
        </section>
      </form>
    </WizardStep>
  );
}
