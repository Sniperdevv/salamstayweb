"use client";

import { useState } from "react";

import { WizardStep } from "@/components/host/wizard-step";
import { InfoIcon } from "@/components/icons";
import { TextField } from "@/components/ui/text-field";
import { Textarea, countUnits } from "@/components/ui/textarea";

/**
 * `/host/listings/new/title-description` — the create-listing wizard, step 7 of
 * 9. `hw-004-wizard-form.html` panels B and C, under `HOST-SHELL.md` and its
 * §16 amendments.
 *
 * TWO FIELDS, TWO COUNTERS, ONE RULE ABOUT COUNTERS
 * -------------------------------------------------
 * §16.2 states it as a shape the contract had omitted, and `hw-004` DECISION 2
 * gives the reasoning: **no denominator, and the colour never changes.** Not to
 * red, and — the part that is easy to get wrong — not to green either. A counter
 * that recolours has appointed itself a judge of the host's writing, and the
 * range here was never a gate: `Continue` opens on a non-empty title and on
 * nothing else. What the settled state changes is the WORD, beside a check whose
 * box is reserved at `opacity-0` from the first render, so earning it moves
 * nothing on the page.
 *
 * `Textarea` already ships that counter, so the description simply uses it. The
 * title cannot BE a textarea: a title is one line, and a `<textarea rows={1}>`
 * would let Enter put a newline inside a listing name. It is `TextField` — §5's
 * single-line `.fwrap` shell, carrying the SAME `TextareaCounter` contract, so a
 * counted single-line field and a counted multi-line field are one idea rather
 * than two counters that can drift apart. (Both the field and the counter row
 * were written out longhand in this file until 2026-07-26, with a note asking
 * for exactly that component; this is that note being paid off.)
 *
 * The gate still reads `countUnits` directly, the same exported function both
 * fields' counters call, so the number the step gates on and the number the host
 * is reading can never be two different numbers.
 *
 * THE TWO UNITS DIFFER ON PURPOSE
 * -------------------------------
 * The title counts CHARACTERS, because a title is truncated by layout at a
 * width and characters are what the host is actually spending. The description
 * counts WORDS, because a character count on prose is a number no writer can
 * act on. Both are `hw-004`'s, from `ha-028` / `ha-029`.
 *
 * WHAT COULD NOT BE TAKEN FROM THE CARD, AND WHAT WAS PICKED INSTEAD
 * ------------------------------------------------------------------
 * The description's settle threshold. The card prints the title's range in
 * words ("Aim for 30 to 60") but the description's guidance is qualitative
 * ("Enough to picture the stay"), so no number is stated anywhere for it and
 * none can be lifted. `DESCRIPTION_SETTLES_AT` is a build pick, and it is a safe
 * one to make rather than escalate for exactly the reason `TextareaCounter`
 * documents: the threshold is NEVER RENDERED and gates NOTHING. It swaps one
 * word of encouragement. If it is wrong, it is wrong by a few words of prose and
 * nothing else moves.
 */

/**
 * `hw-004`'s stated range for a title. Both figures are rendered — `.num`
 * isolated, because these two run inside an Urdu sentence on the mirrored route.
 */
const TITLE_SETTLES_AT = 30;
const TITLE_RANGE_TOP = 60;

/** See the header note. Never rendered, gates nothing, swaps one word. */
const DESCRIPTION_SETTLES_AT = 40;

/* ——— Recipes ————————————————————————————————————————————————————————————— */

/**
 * `.fsec` — HOST-SHELL §5's section: hairline rule, then the heading.
 *
 * The card writes `padding:28px 0; margin-top:28px`, and 28 is not a rung on the
 * spacing scale. One rung used twice — 32 above the rule, 32 below — keeps the
 * air/rule/heading rhythm the card is describing without shipping a raw number.
 */
const section = "mt-8 border-t border-hairline pt-8";
const sectionTitle = "text-h5 font-semibold text-primary";
const sectionSub = "mt-2 max-w-[62ch] text-bodySm font-regular leading-normal text-secondary";

/** `.ghint` — the step's one explainer. Icon and text in open space, no box. */
const hintRow =
  "mt-6 flex items-start gap-3 text-bodySm font-regular leading-relaxed text-secondary";

/* ——— Page ———————————————————————————————————————————————————————————————— */

export default function TitleDescriptionStepPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  /**
   * The same function both fields' own counters call.
   *
   * The GATE reads the TRIMMED value and each counter reads the raw one, which
   * is the only place the two numbers can differ: a title of three spaces is
   * three characters and is not a title. Everywhere else they are the same
   * count, because they are the same count.
   */
  const hasTitle = countUnits(title.trim(), "characters") > 0;

  const descriptionSettled =
    countUnits(description, "words") >= DESCRIPTION_SETTLES_AT;

  /**
   * `.capnote`, the caption's always-populated second line.
   *
   * The title gates and the description does not — `ha-028`'s ruling, which
   * `hw-004` panel B carries as "Add a title to continue." while the description
   * beside it is also empty. A host who has a name for their place and nothing
   * else to say today can still move on.
   */
  const note = hasTitle ? "Nothing you enter is saved yet." : "Add a title to continue.";

  return (
    <WizardStep
      step={7}
      stepName="Title & description"
      note={note}
      backHref="/host/listings/new/photos"
      nextHref="/host/listings/new/house-rules"
      nextDisabled={!hasTitle}
    >
      <div className="pt-11">
        <h1 className="text-h3 font-semibold text-primary">Name your place, then describe it</h1>
        <p className="mt-2 max-w-[56ch] text-bodyMd font-regular text-secondary">
          Both are yours to write. Nothing on this page is generated for you, and nothing is
          rewritten after you save it.
        </p>
      </div>

      {/*
        A real `<form>` (HOST-SHELL §11.1), and a submit that is stopped rather
        than pointed at a route. The action bar's primary is a link owned by
        `WizardStep`, and this step is exactly the shape where a browser fires
        implicit submission on Enter — one text input, since a `<textarea>` does
        not count towards the field tally that suppresses it. Letting it through
        would reload the page and drop everything the host had written. The `id`
        is here so the shell can adopt the form the day a submit target exists.
      */}
      <form id="title-description-form" onSubmit={(event) => event.preventDefault()}>
        <section className={section} aria-labelledby="listing-title-h">
          <h2 id="listing-title-h" className={sectionTitle}>
            Title
          </h2>
          <p className={sectionSub}>
            Say what the place is. A plain, specific title finds the right guest faster than a
            flattering one.
          </p>

          {/*
            HOST-SHELL §5's text field: `ha-017`'s shell at 48px minimum,
            `radius.md`, `border.default`, `bg.sunken`, with the value at 16/400
            — a form value is content, not a label. The label sits ABOVE it in
            13/600 ink, which is the host shell's own label role and deliberately
            not the checkout's `overline`: a host answering nine screens of
            questions is not reading captions on someone else's data. That is
            also why this is not `components/ui/text-input.tsx`, which is
            `gw-024`'s promo cell — a different shell for a different flow.

            NO `maxLength`, on purpose, and none available: `TextField` does not
            expose one. A hard cap would be the gate `ha-028` refused; the range
            below is encouragement and nothing here can be overspent, which is
            the same reason its counter carries no denominator.

            `dir="ltr"` is `hw-004` DECISION 3: a prose field the host types into
            carries an explicit direction so the caret and the first character
            behave in the language being written. The `/ur/` mirror sets `rtl` in
            the same slot. No `numeric` — that would force a prose field LTR and
            put `.num` on a listing name.

            The guide is wrapped in ONE `<span>` rather than handed over as a
            fragment. The row it lands in is an `inline-flex` with a `gap-2`, and
            a fragment would make every text run and every `.num` span its own
            flex item with 8px between them.
          */}
          <TextField
            id="listing-title"
            name="title"
            className="mt-5"
            label="Listing title"
            dir="ltr"
            value={title}
            onChange={setTitle}
            placeholder="A short, plain name for your place"
            counter={{
              unit: "characters",
              countLabel: (count) => <>{count} characters</>,
              guide: (
                <span>
                  Aim for <span className="num">{TITLE_SETTLES_AT}</span> to{" "}
                  <span className="num">{TITLE_RANGE_TOP}</span>
                </span>
              ),
              guideSettled: "Good length",
              settledFrom: TITLE_SETTLES_AT,
            }}
            hint="A range to aim for, not a hard limit — long enough to be specific, short enough to read at a glance."
          />
        </section>

        <section className={section} aria-labelledby="listing-description-h">
          <h2 id="listing-description-h" className={sectionTitle}>
            Description
          </h2>
          <p className={sectionSub}>
            Help a guest picture the stay and plan their trip around what is true.
          </p>

          <Textarea
            id="listing-description"
            name="description"
            className="mt-5"
            label="Listing description"
            dir="ltr"
            value={description}
            onChange={setDescription}
            placeholder="Describe the space, the area, how guests get around, and what is nearby."
            counter={{
              unit: "words",
              countLabel: (count) => <>{count} words</>,
              guide: "Enough to picture the stay",
              guideSettled: "Good detail",
              settledFrom: DESCRIPTION_SETTLES_AT,
            }}
          />

          {/*
            The card ships two explainers here — guidance while the box is
            empty, and a promise about what happens to the words once they
            exist. They swap on the description's own settle threshold rather
            than on the first keystroke, so the paragraph changes ONCE, at the
            same moment the counter beside it changes its word: one state
            change, two signals of it, and nothing flickering under a host who
            is mid-sentence.
          */}
          <p className={hintRow}>
            <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
            {descriptionSettled ? (
              <span>
                <b className="font-semibold text-primary">
                  Whatever you write here is what guests read.
                </b>{" "}
                We do not edit it, shorten it, or add a sentence to it.
              </span>
            ) : (
              <span>
                <b className="font-semibold text-primary">
                  Guests plan around what is true, not what is hoped for.
                </b>{" "}
                The load-shedding pattern, what is an easy walk and what needs a rickshaw, which
                rooms get the afternoon sun — those are the sentences people book on.
              </span>
            )}
          </p>
        </section>
      </form>
    </WizardStep>
  );
}
