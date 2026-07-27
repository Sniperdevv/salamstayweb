"use client";

import { useId, useState } from "react";
import Link from "next/link";

import { iconStroke } from "@salamstay/design-tokens/icons";

import { ChevronLeftIcon, InfoIcon } from "@/components/icons";
import { OptionCard } from "@/components/host/option-card";
import { TextField } from "@/components/ui/text-field";
import { inlineAction } from "@/components/ui";

/**
 * `/host/payout-settings`, everything from the first question down — HA-016
 * translated to the web shell, with one rule deciding most of it.
 *
 * ══ THE RULE ══════════════════════════════════════════════════════════════
 * **No account number is rendered, and none is collected.** Not an IBAN, not a
 * bank account number, not a mobile-wallet number, and — the part that is easy
 * to get wrong — not a masked one either.
 *
 * `ga-062` drew a named bank beside four dots and four trailing digits, and it
 * was refused on the guest side for the right reason: a mask is not a redaction
 * of real data. There is no real datum behind it. It is an invented instrument
 * asserting that a stranger's money is reachable, and the dots make the
 * assertion *more* credible rather than less. `ha-016` does the same thing three
 * times over — in the test-deposit lead, again in the done state's headline, and
 * again in the hub row it flips — and this is the host's own money, so the rule
 * is harder here, not softer. (The literal strings are deliberately not
 * reproduced in this file, so a grep for a masked instrument across `apps/web`
 * stays clean.)
 *
 * ══ HOW A DESTINATION IS COLLECTED WITHOUT AN INSTRUMENT ══════════════════
 * Three parts, in order of how much they can do:
 *
 *  1. **The KIND of destination** — a bank account or a mobile wallet. A
 *     category is not an instrument: neither answer identifies an account, and
 *     neither can receive anything. `ha-016` lists JazzCash and EasyPaisa by
 *     name; those are real payment adapters in `ARCHITECTURE.md`, but naming
 *     them *as payout rails* would publish a supported-provider list nothing in
 *     this build supports, so the rows are the two categories and no provider is
 *     named. The card's own rule about the glyphs is kept exactly — "plain text
 *     rows with a neutral generic glyph, no invented logos and no wallet/bank
 *     brand colors".
 *  2. **The name on the account** — a name cannot move money and is not a
 *     secret. It is also the one detail with a real constraint worth stating
 *     (it has to be the host's own), so it is asked for and the constraint is
 *     stated in the calm `info` register, never as suspicion (`DESIGN.md` §10.6).
 *  3. **The number is not asked for at all**, and the page says so in its own
 *     section rather than leaving a gap. That section is the design decision,
 *     not an apology for a missing field — see the copy, which states the
 *     reasoning where the host can read it.
 *
 * ══ WHAT ELSE `ha-016` SHIPS THAT CANNOT ══════════════════════════════════
 *  · **The IBAN field and its formatted placeholder.** Both go with the rule
 *    above. The placeholder is a masked instrument in format, and a
 *    placeholder-as-format-hint is bad practice besides — it vanishes the moment
 *    the host types, which is when they most need it.
 *  · **The payout-frequency Select — "After each stay / weekly / monthly".**
 *    Offering three schedules asserts that SalamStay operates three schedules.
 *    Nothing in this build states when a payout is released or how often, so the
 *    control is absent rather than defaulted.
 *  · **The test-deposit verification panel** — "a small test deposit", "up to
 *    one business day", the two paisa boxes. It is a mechanism nothing performs
 *    and a turnaround nobody published.
 *  · **The done state that flips the HA-004 Payout row to `Done`.** Nothing can
 *    complete here, so nothing flips; `/host/onboarding` draws no `done` state
 *    at all and this page cannot hand it one.
 *  · **`amanah`, `wakala`, `riba`, and "held in amanah — a trust".**
 *    `REPOSITIONING.md` replaces them with **"Service fee"** and **"held in
 *    trust"**, and `HOST-SHELL.md` §0.2 forbids carrying `ha-*` content forward
 *    unchecked. As it happens neither replacement appears here either: this page
 *    states no fee and no custody arrangement, because it states nothing about
 *    money movement at all.
 *  · **Any percentage.** No fee rate, no withholding rate, no filer/non-filer
 *    distinction. `GO-LIVE.md` A16 records that `/become-a-host` publishes `3%`
 *    and that whether that figure is authoritative is **undeclared**, so nothing
 *    here derives from it or restates it.
 *  · **NTN / STRN.** `ha-004`'s Payout row says "plus NTN/STRN if you file
 *    taxes". A tax number is a regulatory identifier, and asking for one asserts
 *    a withholding position this build has not settled. The closing section says
 *    plainly that it is not asked for, rather than dropping it silently.
 *
 * ══ GREEN, ELEVATION, MOTION ══════════════════════════════════════════════
 * **No green.** `HOST-SHELL.md` §7 rules the host app surface already over TASTE
 * §2's four-role budget through `ha-046`'s inherited chip, nav underline and
 * avatar, and says exactly what to do: "Add nothing to it." The nav's own
 * `Create a listing` keeps the surface's one green; the disabled primary here
 * spends nothing, and §7 says so in those words.
 *
 * **Elevation**: option cards and the account-name note carry a border and cast
 * nothing (TASTE §1, `HOST-SHELL.md` §8 — no border-and-shadow element exists on
 * a host surface). The prose sections carry neither.
 *
 * **Motion**: whatever `OptionCard` and `TextField` already carry, and nothing
 * added. §10 bans an entrance animation on a surface the host will revisit, and
 * this is one.
 */

/* ───────────────────────────── glyphs ───────────────────────────────────── */

/**
 * Two neutral generic marks for the destination rows — the card's own
 * requirement, restated: no bank or wallet logo, no brand colour, nothing that
 * could be read as an endorsement of a provider.
 *
 * Drawn here rather than imported for the reason `/host/insights` records: the
 * three shared glyph modules are each a closed set with a stated scope, and a
 * mark used on one surface belongs on that surface until a second one needs it.
 * Decorative — each sits beside its option's title — so both are `aria-hidden`,
 * and the stroke is `iconStroke`, never a literal.
 *
 * `thin`, because they render at `size-5` inside `OptionCard`'s 40px disc and
 * the token set pairs the two by name: "thin — used at sm to avoid a heavy look
 * at 20px". Every other `OptionCard` glyph in the wizard is drawn the same way.
 */

/** A columned building. `ha-016`'s own bank path. */
function BankIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.thin}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M3 21h18" />
      <path d="M4 21V10l8-5 8 5v11" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

/** A handset. Says "mobile wallet" without naming one. */
function WalletIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.thin}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </svg>
  );
}

/* ───────────────────────────── the two ──────────────────────────────────── */

interface Destination {
  readonly value: string;
  readonly title: string;
  readonly description: string;
  readonly icon: React.ReactNode;
}

const DESTINATIONS: readonly Destination[] = [
  {
    value: "bank",
    title: "A bank account in Pakistan",
    description: "A current or savings account at a Pakistani bank.",
    icon: <BankIcon className="size-5" />,
  },
  {
    value: "wallet",
    title: "A mobile wallet",
    description: "An account held with a Pakistani mobile-wallet provider.",
    icon: <WalletIcon className="size-5" />,
  },
];

/* ───────────────────────────── recipes ──────────────────────────────────── */

/** `hw-001`'s `.fsec` — a hairline rule with `space-7` above and below it. */
const section = "mt-7 border-t border-hairline pt-7";
const sectionHeading = "text-h5 font-semibold text-primary";
const sectionBody = "mt-3 text-bodySm font-regular leading-relaxed text-secondary";

/**
 * The disabled primary — `HOST-SHELL.md` §5: "Disabled = `bg.raised` fill +
 * `text.disabled`, **same size, same place, same label**", on §5's `radius.full`
 * and TASTE §11.7's "visible, in place, shadow-less".
 *
 * It is the enabled pill's geometry with the fill and the ink swapped, and it
 * carries no `pressable` and no `focusRing`: a genuinely `disabled` button never
 * presses and never takes focus, so both would be dead classes rather than
 * restraint.
 *
 * WHY IT IS A REAL `disabled` AND NOT `aria-disabled`. `ha-016` uses
 * `aria-disabled` on its CTA, which is right for a button that will enable once
 * the host finishes the form. This one cannot ever enable — there is nothing on
 * the other side of it — so keeping it focusable would put a keyboard user on a
 * control that answers nothing. It stays in the layout, in its place, with its
 * real label, and the line underneath says why. That line is `aria-describedby`
 * from the button, so the reason travels with it wherever it is announced.
 */
const savePillDisabled =
  "inline-flex h-12 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full " +
  "border border-transparent bg-raised px-6 text-bodyMd font-semibold text-disabled";

export function PayoutForm() {
  /*
   * `null` until the host chooses. `radio-group.tsx` states the rule this
   * follows — "never seed a plausible default" — and it matters more here than
   * anywhere: a pre-selected destination is the product answering a question
   * about the host's money on their behalf.
   */
  const [destination, setDestination] = useState<string | null>(null);
  const [accountName, setAccountName] = useState("");

  const baseId = useId();
  const nameFieldId = `${baseId}-account-name`;
  const saveReasonId = `${baseId}-save-reason`;

  return (
    <form
      /*
       * A real `<form>`, because the fields inside it are a real form and the
       * shape the eventual mutation takes should not have to be invented later.
       * It submits nowhere: the only submit control is `disabled`, and this
       * stops implicit submission from an Enter press in the text field, which a
       * disabled button does not prevent on its own.
       */
      onSubmit={(event) => event.preventDefault()}
    >
      {/* ───────────────────── where payouts go ──────────────────────────── */}
      {/*
        The rule sits on a wrapping `<div>` and not on the `<fieldset>`, for the
        geometry `app/host/listings/new/property-type/step.tsx` measured: a
        `<legend>` is laid out inside its fieldset's block-start BORDER area, so
        a border on the fieldset itself renders with a notch cut through it by
        the heading. Same rule, box moved one element out.
      */}
      <div className={section}>
        <fieldset className="min-w-0">
          {/*
            A `<legend>` and not an `<h2>`: it names the group its radios belong
            to, which is what a screen reader announces alongside each one. §5's
            section rung is `h5` (TASTE §7 maps "sections ≈ 22" there).
          */}
          <legend className={sectionHeading}>Where payouts go</legend>
          <p className={sectionBody}>
            Pick the kind of destination. Which bank, or which provider, is not asked for here.
          </p>

          {/*
            A column rather than a 2-up grid — `option-card.tsx`'s own rule:
            options chosen by RECOGNISING an icon grid; options chosen by READING
            a sentence run full width. These two are read.
          */}
          <div className="mt-4 grid gap-2.5">
            {DESTINATIONS.map((option) => (
              <OptionCard
                key={option.value}
                mark="radio"
                name="payout-destination"
                value={option.value}
                checked={destination === option.value}
                /*
                 * A radio only ever reports `true` — the browser clears its
                 * siblings — so the guard is about types, not behaviour.
                 */
                onChange={(checked) => {
                  if (checked) setDestination(option.value);
                }}
                icon={option.icon}
                title={option.title}
                description={option.description}
              />
            ))}
          </div>
        </fieldset>
      </div>

      {/* ───────────────────── the name on the account ───────────────────── */}
      <section className={section} aria-labelledby={`${baseId}-name-h`}>
        <h2 id={`${baseId}-name-h`} className={sectionHeading}>
          The name on the account
        </h2>

        {/*
          The label is "Your full name" and NOT the section's own words. The
          heading above already asks for the name on the account; a 13/600 label
          repeating it two lines lower is the page asking the same question
          twice, which is the collision
          `app/host/listings/new/property-type/step.tsx` resolves by making its
          group name `sr-only`. Here both are visible and doing different jobs —
          the heading names the section, the label names the thing being typed —
          so they get different words instead.
        */}
        <TextField
          className="mt-4"
          id={nameFieldId}
          label="Your full name"
          value={accountName}
          onChange={setAccountName}
          /*
           * `autoComplete="name"` and not `cc-name` or anything payment-shaped:
           * this is the host's own name, and the browser's name autofill is the
           * difference between one tap and a typed line on the phones this
           * market runs.
           */
          autoComplete="name"
          hint="Spelled the way your bank or wallet provider has it."
        />

        {/*
          `ha-016`'s `.matchnote` — the calm `info` register, never `warning` and
          never `error`. §10.6: it states a safety fact, not a suspicion, and
          there is never a red mark on a person. Border, no shadow, `radius.lg`
          (§5's shape system puts banners there).

          Colour is not the only signal: the glyph and the bolded payload carry
          it in monochrome.
        */}
        <p className="mt-5 flex items-start gap-3 rounded-lg border border-info-border bg-info-bg px-4 py-3 text-bodySm font-regular leading-relaxed text-secondary">
          <InfoIcon className="mt-0.5 size-5 flex-none text-info" />
          <span>
            <b className="font-semibold text-primary">The account has to be in your own name.</b> A
            payout is what a guest paid to stay in your home, so it goes to you and not to somebody
            else.
          </span>
        </p>
      </section>

      {/* ───────────────────── the account number ────────────────────────── */}
      {/*
        The section the whole page is built around, and it is prose in open space
        rather than a banner: TASTE §1 gives a content block neither a border nor
        a shadow, and plating this would make it read as a warning about a defect
        instead of a statement about a decision.
      */}
      <section className={section} aria-labelledby={`${baseId}-number-h`}>
        <h2 id={`${baseId}-number-h`} className={sectionHeading}>
          The account number
        </h2>

        <p className={sectionBody}>
          This page does not ask for one, and that is a decision rather than an unfinished field.
        </p>
        <p className={sectionBody}>
          An account number is the one detail on this form that can move money, and SalamStay has
          nowhere to keep it — no payout record, no host account, nothing stored and nothing
          encrypted. A box that took your account number and dropped it on the next click would be
          worse than a box that is not there.
        </p>
        <p className={sectionBody}>
          It is the last thing this form will collect, and it needs somewhere real to live first.
        </p>
      </section>

      {/* ───────────────────── what is not said here ─────────────────────── */}
      <section className={section} aria-labelledby={`${baseId}-silent-h`}>
        <h2 id={`${baseId}-silent-h`} className={sectionHeading}>
          What this page does not say
        </h2>
        <p className={sectionBody}>
          Nothing in this build states when a payout is released, how often, what comes off it, or
          how long any check takes — so this page states none of them. It does not ask for a tax
          number either. Each of those is a fact about SalamStay that has not been settled, and a
          form that asked would imply it had.
        </p>
      </section>

      {/* ───────────────────── actions ───────────────────────────────────── */}
      <div className={section}>
        {/*
          `HOST-SHELL.md` §4's row, minus the sticky bar this page does not have:
          **Back on the leading edge, the primary on the trailing edge.** Grid
          rather than flex would buy a centred caption; there is no caption in
          the middle here, so `justify-between` is the whole rule and it mirrors
          under RTL for free.

          BACK IS AN INLINE TEXT ACTION, NOT THE §5 GRAY-FILL BUTTON — and the
          reason is a collision the shell's own contract creates. §5 puts the
          gray-fill secondary on `bg.raised`, and §5 ALSO puts a disabled primary
          on `bg.raised`. In the wizard the two never meet, because §4 already
          makes Back "an inline text action: ink, underlined at rest, chevron
          leading, mirrored under RTL". Drawn as a button here they were two
          plates of the same fill differing only in radius and label colour,
          which reads as two disabled controls. §4's own answer removes the
          collision instead of inventing a third fill.

          It is also the surface's real next step, so this is not a dead end
          (`HOST-SHELL.md` §11.2), and it returns to the hub the context line at
          the top of the page names.
        */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/host/onboarding"
            className={`inline-flex items-center gap-1 ${inlineAction} text-bodySm`}
          >
            <ChevronLeftIcon className="size-4 rtl:-scale-x-100" />
            Back to Host setup
          </Link>

          <button
            type="submit"
            disabled
            aria-describedby={saveReasonId}
            className={savePillDisabled}
          >
            Save payout details
          </button>
        </div>

        {/*
          `HOST-SHELL.md` §3's fixed `.capnote` slot, in prose: "this is how a
          disabled primary explains itself here". `text.secondary` and not
          tertiary — GO-LIVE C7 has the tertiary ramp under AA review at body
          sizes, and this is a sentence the host is expected to read.
        */}
        <p
          id={saveReasonId}
          className="mt-3 text-bodySm font-regular leading-relaxed text-secondary"
        >
          Disabled because there is nothing to save to. SalamStay has no payout record, and this
          form does not create one.
        </p>
      </div>
    </form>
  );
}

export default PayoutForm;
