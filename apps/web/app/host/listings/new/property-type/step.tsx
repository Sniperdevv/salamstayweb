"use client";

import { useState, type ReactNode } from "react";
import { iconStroke } from "@salamstay/design-tokens/icons";

import { WizardStep } from "@/components/host/wizard-step";
import { InfoIcon } from "@/components/icons";
import { controlRing, controlRingSelected, fieldHint, pressableSurface, tintTransition } from "@/components/ui";
import { CheckMark } from "@/components/ui/marks";

/**
 * Step 1 of 9 — `/host/listings/new/property-type`,
 * `hw-002-wizard-select.html` panel A, inside `hw-001`'s wizard chrome.
 *
 * TWO SHAPES, ONE ANATOMY (`hw-002` DECISION 1)
 * ---------------------------------------------
 * `HOST-SHELL.md` §5 gives exactly one option-card anatomy — 36px icon disc,
 * title, description, mark trailing, 1px border, no shadow — and both questions
 * on this step are that anatomy. Only the container changes:
 *
 *  · the seven types sit in a 2-up GRID. They are PEERS, answered by
 *    recognising an icon, and their descriptions are three to five words. Seven
 *    full-width rows would be 560px of scroll for a question nobody reads.
 *  · the two privacy options sit as FULL-WIDTH ROWS, because their descriptions
 *    are the actual work: "nobody else stays there while they are booked in" is
 *    the sentence that makes the choice legible, and it is why this is not the
 *    `Segmented` control (§5 caps a segment label at one line, and a control
 *    that has to drop its own explanation to fit is the wrong control).
 *
 * The test is not how many options there are. It is whether the description
 * carries weight.
 *
 * SELECTION IS INK, AND THE CHECK IS THE NON-COLOUR SIGNAL
 * --------------------------------------------------------
 * A 2px INSET ink ring over the resting border, **no fill change**, plus the
 * mark filling to ink with a white check (TASTE §3 / §11.18, §5,
 * BUILD-DECISIONS #20). Inset and not a real 2px border because a real border
 * would shift the card's contents by 1px on every selection. `ha-019`'s brand
 * border and `int-subtle` tint predate all three rulings and are not copied
 * forward — green on this surface is the wordmark dot, the bar state and the one
 * enabled primary, and nothing else.
 *
 * WHAT GATES THE PRIMARY — ONE DIVERGENCE FROM THE CARD, STATED
 * -------------------------------------------------------------
 * `hw-002` DECISION 3 enables the primary on the property type ALONE and
 * catches the privacy question at submit, with a page-level error banner and an
 * inline `.errline`. That register is unreachable here: the wizard frame's
 * primary is a `Link` to `nextHref`, so there is no submit for a step to
 * intercept, and following the card literally would mean `Continue` silently
 * advancing to step 2 with the whole-place/private-room answer missing.
 *
 * So the primary gates on BOTH answers and the caption names **whichever one is
 * still missing** — never a conjunction. DECISION 3's actual objection was to
 * the sentence "Pick a property type and say whether guests get the whole
 * place", which "is a worse sentence than either half"; naming one blocker at a
 * time is the constraint it was protecting, and it holds here. §11.2's contract
 * is met exactly — primary disabled but visible and in place, `.capnote` naming
 * the blocking action, no dead ends — and panel D's situation can no longer
 * arise. The card flags DECISION 3 as invented and asks `HOST-SHELL.md`'s
 * "Unresolved" list to gain it; this is that ruling being taken.
 *
 * THE ICONS ARE `hw-002`'s OWN PATHS, INLINE — FLAGGED
 * ----------------------------------------------------
 * None of the seven match the `gw-001` set in `components/home-icons.tsx`: that
 * `ApartmentIcon` has different window ticks and no door, that `WholeHomeIcon`
 * is a different roof. Reusing a near-miss would be worse than drawing the
 * card's path, and the card's path is what a reviewer diffs. They sit in this
 * file rather than in a glyph module only because this wave's file boundary is
 * three files; they belong beside `host-icons.tsx` as a `hw-002` set, with the
 * fourth copy of the `<Glyph>` wrapper folded into the consolidation
 * `components/ui/marks.tsx` already names.
 *
 * CLAIMS: none. SEO-RULES §5 claim 7 belongs to step 5 and stays there — a
 * claim is verbatim or absent, never stretched to fit a step that does not
 * collect the fact.
 *
 * `noindex, follow` and the page title are inherited from the wizard layout;
 * §1: no canonical, no hreflang, no JSON-LD, no breadcrumb. One `<h1>`, the
 * page's accessible title.
 */

/* ── `hw-002` panel A's glyph set, paths byte-for-byte ─────────────────────── */

function Glyph({ className, children }: { readonly className?: string; readonly children: ReactNode }) {
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

function ApartmentGlyph() {
  return (
    <Glyph className="size-5">
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" />
      <path d="M10 21v-3h4v3" />
    </Glyph>
  );
}

function HouseGlyph() {
  return (
    <Glyph className="size-5">
      <path d="M4 11l7.3-6.2a1 1 0 0 1 1.4 0L20 11" />
      <path d="M6 9.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9.5" />
      <path d="M10 20v-5h4v5" />
    </Glyph>
  );
}

function PortionGlyph() {
  return (
    <Glyph className="size-5">
      <path d="M4 11l7.3-6.2a1 1 0 0 1 1.4 0L20 11" />
      <path d="M6 9.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9.5" />
      <path d="M12 5v15" />
      <path d="M9 15.5h1.5" />
    </Glyph>
  );
}

function RoomGlyph() {
  return (
    <Glyph className="size-5">
      <path d="M3 18v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M15 12v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" />
      <path d="M3 15h18" />
      <path d="M3 18v2M21 18v2" />
    </Glyph>
  );
}

function GuesthouseGlyph() {
  return (
    <Glyph className="size-5">
      <path d="M9 20V10.5l5-4 5 4V20a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1z" />
      <path d="M12 21v-4h2v4" />
      <path d="M3 21V14l3-2.4" />
    </Glyph>
  );
}

function FarmhouseGlyph() {
  return (
    <Glyph className="size-5">
      <path d="M3 20V12l4-3 4 3v8" />
      <path d="M5 20v-3h4v3" />
      <circle cx="17" cy="9" r="3" />
      <path d="M17 12v8" />
    </Glyph>
  );
}

function HujraGlyph() {
  return (
    <Glyph className="size-5">
      <rect x="4" y="6" width="16" height="14" rx="1" />
      <path d="M4 13h16" />
      <rect x="7" y="15.5" width="4" height="3" rx="0.5" />
      <rect x="13" y="15.5" width="4" height="3" rx="0.5" />
      <path d="M9 6V3h6v3" />
    </Glyph>
  );
}

function WholePlaceGlyph() {
  return (
    <Glyph className="size-5">
      <path d="M3.5 10.5l8.5-7 8.5 7" />
      <path d="M5.8 9.2V20h12.4V9.2" />
    </Glyph>
  );
}

function PrivateRoomGlyph() {
  return (
    <Glyph className="size-5">
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M13 4.5v15" />
      <path d="M16 12h1.6" />
    </Glyph>
  );
}

/* ── The option card — `HOST-SHELL.md` §5's `.ocard` ─────────────────────────
 *
 * WHY THIS IS STILL LOCAL WHEN `components/host/option-card.tsx` EXISTS
 * ---------------------------------------------------------------------
 * Steps 4 and 5 folded their two private copies into that component on
 * 2026-07-26. This one did not, and the reason is a real disagreement about §5
 * rather than an oversight, so it is written down instead of quietly resolved.
 *
 * §5's `.ocard` is `padding:14px 15px` with a 36px icon disc, and `hw-001`,
 * `hw-002` and `hw-003` all draw it byte-identically. None of 14, 15 or 36 is a
 * rung on the `space` scale, which runs 12 → 16 → 20 and 32 → 40. **Two honest
 * readings follow.** This file takes the card's own px through Tailwind's default
 * rungs (`py-3.5` = 14, `size-9` = 36) — a named rung of the same value, never an
 * arbitrary bracket, the precedent `host-chrome.tsx` and `wizard-step.tsx` set
 * with `pt-7` for the same 28. Steps 4 and 5 take the nearest SalamStay token
 * rungs instead (`p-4` = 16, `size-10` = 40) and say so, which is the letter of
 * "consume the tokens by role".
 *
 * They differ by 4px on the disc and ~5px on the card's height. Folding this page
 * in would therefore MOVE it, and a refactor that moves a shipped page is a
 * redesign wearing a refactor's clothes. So the page that would move is the page
 * that stays put until the reading is ruled on. Once it is, this block deletes
 * and the two `<OptionCard mark="radio">` grids below take its place — nothing
 * else in this file has to change, which is the test that this really is one
 * decision and not two components.
 */

interface OptionCardProps {
  /** The shared `name` the browser groups the radios by. */
  readonly name: string;
  readonly value: string;
  readonly checked: boolean;
  readonly onChange: (value: string) => void;
  /** Decorative — the title is already the option's accessible name. */
  readonly icon: ReactNode;
  /** 16/600 ink. §5 draws 15; TASTE §7 puts card titles at 16, which is the rung. */
  readonly title: string;
  readonly description: string;
}

function OptionCard({ name, value, checked, onChange, icon, title, description }: OptionCardProps) {
  return (
    /*
      NATIVE RADIOS, HIDDEN, NOT REBUILT — the same call `radio-group.tsx` and
      `segmented.tsx` made and stated. One shared `name` buys arrow-key
      navigation, Home/End, the single tab stop, the wrap-around, the correct
      announcement ("House, radio button, 2 of 7") and RTL-correct arrow
      direction, all from the browser. `sr-only` rather than an `opacity-0` input
      stretched over the card, which would be hit-testable and swallow clicks
      meant for the label.

      `pressableSurface` is §10's `.ocard:active {scale(.995)}` — the shallowest
      of the three press depths, because 0.97 on a card this wide reads as the
      grid lurching rather than as a press.
    */
    <label
      className={`relative flex min-h-16 cursor-pointer items-start gap-3 rounded-lg border border-border-default bg-canvas px-4 py-3.5 hover:border-border-strong ${pressableSurface}`}
    >
      <input
        type="radio"
        className="peer sr-only"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
      />

      {/*
        The ring — selection AND focus in one overlay, drawn as a later sibling
        of the `peer` input (see `controlRing`). 2px INSET, so it lands over the
        resting border rather than outside it and the card's contents never
        shift. `rounded-lg` because the recipe carries no radius of its own.
      */}
      <span
        aria-hidden="true"
        className={`${controlRing} rounded-lg ${checked ? controlRingSelected : ""}`}
      />

      <span
        aria-hidden="true"
        className="grid size-9 flex-none place-items-center rounded-full bg-raised text-secondary"
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-bodyMd font-semibold text-primary">{title}</span>
        <span className={fieldHint}>{description}</span>
      </span>

      {/*
        The mark sits in a 24px box — the title's own line box at 16/1.5 — so it
        centres on the FIRST line rather than floating beside the middle of a
        two-line description.
      */}
      <span aria-hidden="true" className="flex h-6 flex-none items-center">
        <span
          className={`flex size-5 items-center justify-center rounded-full border text-selected-fg ${tintTransition} ${
            checked ? "border-selected bg-selected" : "border-border-default bg-canvas"
          }`}
        >
          {/*
            §10: the mark "fades and scales in from `.7`, never from `0` —
            nothing in the real world appears from nothing", and reduced motion
            "drops the transform and keeps the fade". It is present in the DOM at
            rest and simply not painted, so choosing something reflows nothing.
          */}
          <CheckMark
            className={`size-3 transition-[opacity,transform] duration-instant ease-decelerate motion-reduce:scale-100 motion-reduce:transition-opacity ${
              checked ? "scale-100 opacity-100" : "scale-[0.7] opacity-0"
            }`}
          />
        </span>
      </span>
    </label>
  );
}

/* ── The step ─────────────────────────────────────────────────────────────── */

interface OptionSpec {
  readonly value: string;
  readonly title: string;
  readonly description: string;
  readonly icon: ReactNode;
}

/** `hw-002` panel A's seven, in its order, with its peer-length descriptions. */
const PROPERTY_TYPES: readonly OptionSpec[] = [
  { value: "apartment", title: "Apartment", description: "A unit in a shared building", icon: <ApartmentGlyph /> },
  { value: "house", title: "House", description: "A standalone home", icon: <HouseGlyph /> },
  { value: "portion", title: "Portion", description: "Part of a house, own entrance", icon: <PortionGlyph /> },
  { value: "room", title: "Room", description: "One room in a shared home", icon: <RoomGlyph /> },
  { value: "guesthouse", title: "Guesthouse", description: "A separate guest building", icon: <GuesthouseGlyph /> },
  { value: "farmhouse", title: "Farmhouse", description: "Open land, outside the city", icon: <FarmhouseGlyph /> },
  {
    value: "hujra",
    /*
      Kept from `hw-001` unchanged. `REPOSITIONING.md` retires the observance
      framing, not a building type: a hujra is rural and northern architecture,
      and the card says so in as many words.
    */
    title: "Hujra / guest-annexe",
    description: "A guest room apart from the home",
    icon: <HujraGlyph />,
  },
];

const PRIVACY_OPTIONS: readonly OptionSpec[] = [
  {
    value: "whole-place",
    title: "The whole place",
    description:
      "Guests have the property to themselves. Nobody else stays there while they are booked in.",
    icon: <WholePlaceGlyph />,
  },
  {
    value: "private-room",
    title: "A private room",
    description:
      "Guests have their own room. You, your family or other guests use the rest of the home.",
    icon: <PrivateRoomGlyph />,
  },
];

export default function PropertyTypePage() {
  /*
    `null` until the host answers. Never seed a plausible default — the same
    rule `radio-group.tsx` states, and the reason panel C draws neither option
    checked while panel A draws one.
  */
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<string | null>(null);

  /* ONE blocking action at a time, never a conjunction. See the file note. */
  const blocking =
    propertyType === null
      ? "Pick a property type to continue."
      : privacy === null
        ? "Pick whether guests get the whole place or a private room."
        : null;

  return (
    <WizardStep
      step={1}
      stepName="Property type"
      note={blocking ?? "Your progress saves as you go."}
      /* HOST-SHELL §4: at step 1 Back LEAVES the wizard rather than going
         nowhere, and `hw-001` panel B plus `hw-002` panels A/C/D all draw
         `/host/listings`. The API spec this step was handed said `null`; that
         was my error, and its author flagged it rather than silently diverging
         from the brief — which is why it is a one-word fix and not a rebuild. */
      backHref="/host/listings"
      nextHref="/host/listings/new/location"
      nextDisabled={blocking !== null}
    >
      {/* §5: `.pagehead` — 26/600 with no letter-spacing. `h4` (24) is the rung
          the ladder carries and the one TASTE §7 points at; `display` stays what
          it is, a funnel hero once per journey. A wizard step is a question. */}
      <div className="pt-11">
        <h1 className="text-h3 font-semibold text-primary">What kind of place is it?</h1>
        <p className="mt-2.5 max-w-[56ch] text-bodyMd text-secondary">
          Pick the type that best describes it. Whatever you choose, the rest of these steps are the
          same.
        </p>
      </div>

      {/* The step's one explainer — icon and text in open space, no box, no
          plate (TASTE §1: things that neither float nor bound a form carry
          neither shadow nor border). */}
      <p className="mt-6 flex items-start gap-3 text-label font-regular leading-relaxed text-secondary">
        <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
        <span>
          <b className="font-semibold text-primary">Every option here carries the same weight.</b>{" "}
          A portion or a hujra takes the same fields, the same photos and the same nine steps as a
          house.
        </span>
      </p>

      {/*
        A real `<form>` (§11.1) grouping two `<fieldset>`s. It has no action and
        no submit control: the frame's primary is a link to the next step, so
        this form is never submitted, and the guard is there so a stray implicit
        submission cannot reload the step and drop both answers.
      */}
      <form id="property-type-form" onSubmit={(event) => event.preventDefault()}>
        {/*
          §5's `.fsec` — 28px padding, a hairline rule, 28px above it — sits on a
          WRAPPER, and the `<fieldset>` inside carries no box of its own.

          Not a preference. A `<legend>` is laid out in its fieldset's
          block-start BORDER area: give the fieldset the rule directly and the
          heading renders on top of it, cutting a notch in the hairline and
          ignoring the 28px of padding underneath (measured: `gapAboveLegend` 0).
          The cards draw `<fieldset class="fsec">` and inherit the same quirk;
          this is the same geometry with the box moved one element out, which is
          the only version that puts an unbroken rule above the heading.
          `min-w-0` because a fieldset's default `min-width: min-content` will
          otherwise refuse to let the grid inside it shrink.
        */}
        <div className="mt-7 border-t border-hairline py-7">
          <fieldset className="min-w-0">
            {/*
              The `<h1>` above already asks this question in full, so the group's
              name is for assistive tech only — a visible second heading saying
              "Property type" over the same seven cards would be the page asking
              twice.
            */}
            <legend className="sr-only">Property type</legend>
            <div className="mt-3.5 grid gap-2.5 md:grid-cols-2">
              {PROPERTY_TYPES.map((option) => (
                <OptionCard
                  key={option.value}
                  name="property-type"
                  value={option.value}
                  checked={propertyType === option.value}
                  onChange={setPropertyType}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                />
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-7 border-t border-hairline py-7">
          <fieldset className="min-w-0">
            {/* §5's section heading at the `h5` rung — TASTE §7 maps "sections ≈
                22" there. A `<legend>` and not an `<h2>`: it names the group its
                radios belong to, which is what a screen reader announces with
                each of them, and §1 wants exactly one heading on this page. */}
            <legend className="text-h5 font-semibold text-primary">What do guests get?</legend>
            <p className="mt-2 max-w-[62ch] text-bodySm text-secondary">
              Independent of the type — any of the seven can be listed either way.
            </p>
            <div className="mt-3.5 grid gap-2.5">
              {PRIVACY_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  name="privacy"
                  value={option.value}
                  checked={privacy === option.value}
                  onChange={setPrivacy}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                />
              ))}
            </div>
          </fieldset>
        </div>
      </form>
    </WizardStep>
  );
}
