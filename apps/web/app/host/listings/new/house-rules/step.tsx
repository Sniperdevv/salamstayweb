"use client";

import { useState } from "react";

import { InfoIcon } from "@/components/icons";
import { WizardStep } from "@/components/host/wizard-step";
import { Select } from "@/components/ui/select";
import { SwitchRow } from "@/components/ui/switch-row";
import { Textarea } from "@/components/ui/textarea";

/**
 * Step 8 of 9 — `/host/listings/new/house-rules`.
 *
 * Card: `hw-003-wizard-multi.html`, panel A (the authoritative page) and panel E
 * (the error register). Contract: `HOST-SHELL.md`, §15 for the step's place in
 * the flow and §16 for the amendments that override the sections above it.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * THE FRAMING IS THE STEP. READ THIS BEFORE CHANGING A SENTENCE.
 * ───────────────────────────────────────────────────────────────────────────
 * `SEO-RULES.md` §3.6: **"Host control is described as control, never as moral
 * endorsement."** A host restricting bookings to families is exercising a house
 * rule on their own listing. It is never the platform judging who should travel
 * with whom, and there is no sentence anywhere on this page that recommends,
 * approves, discourages or explains why a host might want one — because the
 * platform has no view, and any sentence that supplied one would be that
 * judgement.
 *
 * Founder ruling, 2026-07-26 (`HOST-SHELL.md` §16.3): **anyone books.** Men and
 * women, together or alone. The marriage certificate at booking time is the ONLY
 * document requirement SalamStay imposes — **hosts do not set document
 * requirements, and nothing on this step may imply they can.** There is no
 * document control here and none is to be added. (§3.6's own "or requiring a
 * document" clause predates that ruling and is superseded by it.)
 *
 * `No alcohol` ships **by placement, not by explanation**. `REPOSITIONING.md`
 * keeps it "at the exact weight of no smoking or no parties", and the way to
 * build that sentence is to put the row literally between `No smoking inside`
 * and `No parties or events`, at the same anatomy and the same type size, and
 * then say nothing further about it anywhere on the page. Default on; a host who
 * allows alcohol turns it off, and the row's own second line becomes the
 * disclosure a guest reads. No icon flourish, no note, no section of its own.
 *
 * `Families only` and `Women guests only` sit in `Who can book`, both **off** by
 * default, and every line in that section is mechanical: what the switch does,
 * and what a guest reads. Their off-state sentences are founder-fixed strings.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * FOUR BUILD DECISIONS, STATED
 * ───────────────────────────────────────────────────────────────────────────
 * 1. **THE SECOND LINE OF EVERY ROW IS THE GUEST'S SENTENCE, NOT THE CONTROL'S
 *    DESCRIPTION.** `hw-003` DECISION 2's third signal, and the one that
 *    actually matters: a host never has to work out what a toggle means, because
 *    the row already says what the guest will read. `SwitchRow` requires
 *    `descriptionOn` AND `descriptionOff` for exactly this reason, so both are
 *    written here rather than one being left to inference. The card draws only
 *    the live sentence per state; the opposite sentences below are new text in
 *    the card's own grammar — `Guests see: …` when on, `Off — …` when off — and
 *    they are the most carefully chosen strings on this page.
 *
 * 2. **QUIET HOURS MOVED TO THE END OF `Standard rules`.** The card draws the
 *    order smoking · alcohol · parties · quiet · [time pair] · shoes, splitting
 *    one list in two so the revealed sub-field can sit directly under the row
 *    that reveals it. In a build the split is a defect: `SwitchRow` carries
 *    `first:border-t-0`, so when quiet hours is OFF and the sub-field is not
 *    rendered, the second list's first row (`Shoes off inside`) loses the
 *    hairline that separates it from the row above. Putting quiet hours last
 *    keeps ONE continuous list at every state, and the sub-field still sits
 *    directly under its own row. **`No alcohol`'s placement between
 *    `No smoking inside` and `No parties or events` is untouched** — that is the
 *    ruling; the relative order of `Quiet hours` and `Shoes off inside` is not.
 *
 * 3. **NO `.swic` GLYPHS.** The card gives every switch row a 36px `bg.raised`
 *    icon disc. Seven of those glyphs (smoking, alcohol, parties, shoes, quiet,
 *    families, women) exist in no icon module in this app, and icons in this
 *    repo live in `components/icons.tsx` / `components/host/host-icons.tsx` and
 *    are never hand-rolled into a page. Rows therefore ship as name + sentence +
 *    track, which is the same anatomy minus one decorative column. Flagged for
 *    whoever owns the icon modules; not worked around with inline paths.
 *
 * 4. **THE GATE, AND THAT IT IS INVENTED.** Nothing in the corpus states what
 *    gates step 8, and `hw-003` DECISION 4 sets the precedent of inventing one
 *    and saying so. Every rule row has a default, so no rule can block. What can
 *    is a time a guest plans a travel day around being unanswered, and a quiet
 *    window with one end missing — a start with no end is a rule a guest cannot
 *    read. The primary stays **visible and in place** and the blocking reason is
 *    written into the caption's second line (`HOST-SHELL.md` §3), which is a
 *    fixed slot, so nothing on the page moves when the host answers.
 *
 * WHY THIS PAGE IS A CLIENT COMPONENT, AND WHAT IT COSTS
 * -----------------------------------------------------
 * Every control on it is controlled (`SwitchRow`, `Select` and `Textarea` all
 * are, deliberately — nothing may seed a policy to `true` in a props default),
 * and the footer's `nextDisabled` / `note` are derived from that same state, so
 * the state and `<WizardStep>` have to live in one component. The cost is that
 * this module cannot export `metadata`: `app/host/layout.tsx` already supplies
 * `noindex, follow` to every route under `/host/*`, so the route contract holds,
 * but the `<title>` falls back to the root layout's. Flagged rather than worked
 * around, because the fix is a shell-level `title` prop and the shell's API is
 * fixed for this wave.
 */

/* ————— the step's own section recipe — `HOST-SHELL.md` §5 ————————————————— */

/**
 * `.fsec` — a hairline rule with air on both sides.
 *
 * The card writes `padding:28px 0; margin-top:28px`. 28 is not a rung on the
 * `space` scale (it jumps 6 → 8), and a raw `[28px]` is off-token, so this
 * rounds to `space-8` in both directions. Flagged, in the same spirit as
 * `wizard-progress.tsx`'s 3px → `gap-1`.
 */
const stepSection = "mt-8 border-t border-hairline pt-8";

/** `.fsec h2` — 22/600 in the card; `text-h5` (20/600) is the rung below it. */
const stepSectionTitle = "text-h5 font-semibold text-primary";

/** `.sec-sub` — 14/400 secondary, held to a reading measure. */
const stepSectionSub = "mt-2 max-w-[62ch] text-bodySm text-secondary";

/** `.ghint` — icon + text in open space. TASTE §1: a content block casts and bounds nothing. */
const stepHint =
  "mt-6 flex max-w-[62ch] items-start gap-3 text-label font-regular leading-relaxed text-secondary";

/** The payload word inside a hint or a sub-line. TASTE §7: never a whole sentence. */
const payload = "font-semibold text-primary";

/* ————— option lists ——————————————————————————————————————————————————————
 *
 * Times, not claims. Every list is deliberately short: a wizard step is a
 * question, and a 24-entry hour picker is a question asked badly.
 *
 * None carries `numeric` on its `Select`. That prop forces the whole control to
 * `direction: ltr`, which is right for a field whose every option is a bare
 * number and wrong for these, whose options are prose with a digit run inside
 * them. `select.tsx` states the limitation it inherits from `<option>` holding
 * text: a per-run `.num` span cannot go inside one, in any language.
 */

const CHECK_IN_WINDOWS = [
  { value: "12-18", label: "12:00 PM to 6:00 PM" },
  { value: "13-19", label: "1:00 PM to 7:00 PM" },
  { value: "14-20", label: "2:00 PM to 8:00 PM" },
  { value: "15-21", label: "3:00 PM to 9:00 PM" },
  { value: "16-22", label: "4:00 PM to 10:00 PM" },
  { value: "any", label: "Any time after 12:00 PM" },
] as const;

const CHECK_OUT_TIMES = [
  { value: "09", label: "9:00 AM" },
  { value: "10", label: "10:00 AM" },
  { value: "11", label: "11:00 AM" },
  { value: "12", label: "12:00 PM" },
  { value: "13", label: "1:00 PM" },
] as const;

const QUIET_START = [
  { value: "21", label: "From 9:00 PM" },
  { value: "22", label: "From 10:00 PM" },
  { value: "23", label: "From 11:00 PM" },
  { value: "00", label: "From 12:00 AM" },
] as const;

const QUIET_END = [
  { value: "05", label: "To 5:00 AM" },
  { value: "06", label: "To 6:00 AM" },
  { value: "07", label: "To 7:00 AM" },
  { value: "08", label: "To 8:00 AM" },
] as const;

export default function HouseRulesStep() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // The three standard rules the corpus ships ON, and the one it ships OFF.
  const [noSmoking, setNoSmoking] = useState(true);
  const [noAlcohol, setNoAlcohol] = useState(true);
  const [noParties, setNoParties] = useState(true);
  const [shoesOff, setShoesOff] = useState(false);
  const [quietHours, setQuietHours] = useState(false);
  const [quietFrom, setQuietFrom] = useState("");
  const [quietTo, setQuietTo] = useState("");

  // Both OFF, and there is no branch in this file that can start them otherwise.
  const [familiesOnly, setFamiliesOnly] = useState(false);
  const [womenOnly, setWomenOnly] = useState(false);

  const [ownRule, setOwnRule] = useState("");

  /**
   * The one blocking reason, or `null`. Ordered top-down so the sentence always
   * names the first unanswered thing the host will meet on the way back up the
   * page, rather than the last one this file happens to check.
   */
  const blocked =
    checkIn === ""
      ? "Choose your check-in window to continue."
      : checkOut === ""
        ? "Choose a check-out time to continue."
        : quietHours && quietFrom === ""
          ? "Set when quiet hours start to continue."
          : quietHours && quietTo === ""
            ? "Set when quiet hours end to continue."
            : null;

  return (
    <WizardStep
      step={8}
      stepName="House rules"
      note={blocked ?? "Nothing you enter is saved yet."}
      backHref="/host/listings/new/title-description"
      nextHref="/host/listings/new/pricing"
      nextDisabled={blocked !== null}
      nextLabel="Continue"
    >
      <div className="pt-11">
        <h1 className="text-h3 font-semibold text-primary">Your house rules</h1>
        <p className="mt-3 max-w-[56ch] text-bodyMd text-secondary">
          Guests read these before they book, and agree to them once at checkout. Keep
          them plain — the way you would say them at the gate.
        </p>
      </div>

      <p className={stepHint}>
        <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
        <span>
          <b className={payload}>These rules are yours.</b> Guests see exactly what you
          set here, and SalamStay adds nothing of its own to the list.
        </span>
      </p>

      {/*
        A real `<form>` — `HOST-SHELL.md` §11.1. It has no submit control of its
        own: the footer's primary is the shell's link to the next step, not a
        submit button, so `onSubmit` exists only to stop Enter in the textarea
        reloading the page. That is a real bug it prevents, not ceremony.
      */}
      <form id="house-rules-form" onSubmit={(event) => event.preventDefault()}>
        <section className={stepSection} aria-labelledby="times-h">
          <h2 id="times-h" className={stepSectionTitle}>
            Checking in and out
          </h2>
          <p className={stepSectionSub}>Two times a guest plans a whole travel day around.</p>

          {/* `.fld2` — two up, one column below the breakpoint. */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              id="check-in-window"
              name="check-in-window"
              label="Check-in window"
              placeholder="Choose a window"
              value={checkIn}
              onChange={setCheckIn}
              options={CHECK_IN_WINDOWS}
            />
            <Select
              id="check-out-time"
              name="check-out-time"
              label="Check-out by"
              placeholder="Choose a time"
              value={checkOut}
              onChange={setCheckOut}
              options={CHECK_OUT_TIMES}
            />
          </div>
        </section>

        <section className={stepSection} aria-labelledby="standard-h">
          <h2 id="standard-h" className={stepSectionTitle}>
            Standard rules
          </h2>
          <p className={stepSectionSub}>
            Each one is on or off. The line under it is what a guest will read.
          </p>

          {/*
            ONE list, five rows, at every state — see DECISION 2 above.

            `No alcohol` is SECOND, between `No smoking inside` and `No parties
            or events`, at the same anatomy and the same type size, and nothing
            else on this page mentions it. That placement IS the framing.
          */}
          <div className="mt-4 flex flex-col">
            <SwitchRow
              name="rule-smoking"
              checked={noSmoking}
              onChange={setNoSmoking}
              label="No smoking inside"
              descriptionOn="Guests see: smoking is not permitted indoors."
              descriptionOff="Off — guests may smoke indoors."
            />
            <SwitchRow
              name="rule-alcohol"
              checked={noAlcohol}
              onChange={setNoAlcohol}
              label="No alcohol"
              descriptionOn="Guests see: alcohol is not permitted in the home."
              descriptionOff="Off — guests may bring alcohol into the home."
            />
            <SwitchRow
              name="rule-parties"
              checked={noParties}
              onChange={setNoParties}
              label="No parties or events"
              descriptionOn="Guests see: the home does not allow large gatherings."
              descriptionOff="Off — guests may hold gatherings here."
            />
            <SwitchRow
              name="rule-shoes"
              checked={shoesOff}
              onChange={setShoesOff}
              label="Shoes off inside"
              descriptionOn="Guests see: please leave shoes at the door."
              descriptionOff="Off — guests may keep their shoes on."
            />
            <SwitchRow
              name="rule-quiet"
              checked={quietHours}
              onChange={setQuietHours}
              label="Quiet hours"
              descriptionOn="Guests see the window you set below."
              descriptionOff="Off — no quiet hours appear on your listing."
            />
          </div>

          {/*
            The sub-field a switch reveals. The card indents it to the row's text
            column, which starts after a 36px icon disc; these rows carry no disc
            (DECISION 3), so the text column starts at the row's own edge and the
            pair aligns with the sentences above it without an indent to invent.

            Both labels are `sr-only`: the switch directly above already names
            what the pair is for, and a second visible label would be noise. They
            are still real `<label for>` elements rather than `aria-label`
            strings, so the accessible name and the visible copy cannot drift
            apart in translation.
          */}
          {quietHours ? (
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <Select
                id="quiet-hours-start"
                name="quiet-hours-start"
                label="Quiet hours start"
                labelHidden
                placeholder="Start"
                value={quietFrom}
                onChange={setQuietFrom}
                options={QUIET_START}
              />
              <Select
                id="quiet-hours-end"
                name="quiet-hours-end"
                label="Quiet hours end"
                labelHidden
                placeholder="End"
                value={quietTo}
                onChange={setQuietTo}
                options={QUIET_END}
              />
            </div>
          ) : null}
        </section>

        {/*
          `Who can book`. Every line here is mechanical — what the switch does,
          and what a guest reads. The section's sub-line does §3.6's work in two
          clauses: these are restrictions YOU set, and a guest reads them in the
          SAME list as every other rule on the page. Nothing recommends,
          approves or discourages either one, and there is no document control
          anywhere on this step (§16.3).
        */}
        <section className={stepSection} aria-labelledby="who-h">
          <h2 id="who-h" className={stepSectionTitle}>
            Who can book
          </h2>
          <p className={stepSectionSub}>
            Restrictions you set on your own listing. Both are off unless you turn them
            on, and a guest reads them in the same list as every other rule on this page.
          </p>

          <div className="mt-4 flex flex-col">
            <SwitchRow
              name="rule-families"
              checked={familiesOnly}
              onChange={setFamiliesOnly}
              label="Families only"
              descriptionOn="Guests see: this listing takes bookings from families only."
              descriptionOff="Off — any verified guest can book."
            />
            <SwitchRow
              name="rule-women"
              checked={womenOnly}
              onChange={setWomenOnly}
              label="Women guests only"
              descriptionOn="Guests see: this listing takes bookings from women guests only."
              descriptionOff="Off — guests of any gender can book."
            />
          </div>
        </section>

        <section className={stepSection} aria-labelledby="own-h">
          <h2 id="own-h" className={stepSectionTitle}>
            A rule in your own words
          </h2>
          <p className={stepSectionSub}>One thing the list above does not cover. Optional.</p>

          {/*
            No counter. `hw-004` DECISION 2's counter belongs to the fields whose
            length a host is actually spending — the listing title and its
            description — and counting a one-line house rule would turn an
            optional sentence into something to get right.

            `dir="ltr"` is `hw-004` DECISION 3: a prose field the host types into
            gets an explicit direction so the caret and the first character
            behave in the language being written. The Urdu route passes `rtl`.
          */}
          <div className="mt-6">
            <Textarea
              id="own-rule"
              name="own-rule"
              label="Your rule"
              dir="ltr"
              rows={3}
              value={ownRule}
              onChange={setOwnRule}
              placeholder="For example, how to reach you if you arrive late at night."
              hint="Rules here are practical instructions, not a checklist of suspicion — a guest reads yours the same way they read your check-in time."
            />
          </div>
        </section>
      </form>
    </WizardStep>
  );
}
