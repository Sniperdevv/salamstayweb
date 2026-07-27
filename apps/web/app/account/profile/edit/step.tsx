"use client";

import Link from "next/link";
import { useState } from "react";

import { InfoIcon } from "@/components/icons";
import { btnSecondary, inlineAction } from "@/components/ui";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { SESSION_ACCOUNT } from "@/lib/mode";

import {
  AccountBackLink,
  AccountPageHead,
  AccountSection,
  ExampleAccountStrip,
} from "../../account-chrome";

/**
 * GA-129's field list, as a web form — `GUEST-SHELL.md` §4c's form frame.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE CARD DRAWS A FILLED PROFILE. THERE IS NO PROFILE. SO EVERY FIELD IS
 *  EMPTY, AND THE ONES THAT COULD ONLY BE FILLED FROM A RECORD ARE ABSENT.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `ga-129` draws Fatima's intro, four interest chips, a city, three languages,
 * a job, a university, a locked decade of birth and three travel stamps. Six of
 * those are things a person types, and they ship here as six empty fields —
 * §12's *"Empty is what every one of these surfaces renders on day one"*. Two
 * are not, and they are gone:
 *
 *  · **Decade born.** The value is derived from a date of birth, and the only
 *    field that could hold one is `/account/settings/personal`, which saves
 *    nothing. `ga-129`'s rule for it is *"Set once, then locked"* — a rule
 *    nothing enforces here, on a value nobody supplied. §14 rules facts about a
 *    person's record fabrications until the record exists, and a locked decade
 *    the reader never chose is exactly one. The privacy design behind it — only
 *    the decade is ever shown, never the date, and off by default — is worth
 *    keeping and is reported as owed, not improvised into a `<select>` that
 *    invents a value to lock.
 *  · **The travel-stamp manager.** A stamp is a completed stay. §14 names
 *    "travel stamps" in the same breath as "3 trips", and `/trips` is empty, so
 *    the manager would be a list of switches over nothing.
 *
 * WHAT CHANGED SHAPE, AND WHY
 * ---------------------------
 *  · **Interests are a text field, not a chip editor.** The card's control is
 *    chips with an `Add` button and a per-chip remove. Chips are a PRESENTATION
 *    of a list, and the presentation belongs to the profile that renders it —
 *    which renders nothing, because nothing is stored. A chip editor would be a
 *    new primitive (§15: the first surface that needs one coins it in
 *    `components/ui/`, and this wave may not touch that folder) built to feed a
 *    store that does not exist. The field holds the same content; the chips
 *    land with the store.
 *  · **The visibility switch sits UNDER its field, not on the label row.**
 *    `ga-129` puts it on the label row because a 300px phone column has no room
 *    for a second line. At 640 a line of its own is cheaper than a crowded
 *    header, and — the load-bearing half — it lets `TextField` and `Textarea`
 *    keep drawing their own `<label htmlFor>`. Reaching for the card's layout
 *    would mean either two labels on one input or a hand-rolled copy of a
 *    primitive §15 says to import. The control, its two words and the per-item
 *    model are all the card's.
 *  · **No sticky save bar.** §4c: *"a settings page saves per control or per
 *    section, it is not a wizard step, and there is no nine-bar progress to
 *    anchor a bar with."* `ga-129`'s `.savebar` is a phone affordance for a
 *    screen whose foot is always in view.
 *  · **The name is not a field here.** It lives on `/account/settings/personal`
 *    because verification matches it against a CNIC, and a second input for one
 *    string is how two screens start disagreeing about a person's name. Named
 *    and linked instead.
 *
 * SAVE IS THE §5 GRAY SECONDARY, NOT A GREEN PRIMARY (§8, TASTE §2/§5).
 * TASTE §5 lists *"Edit, Done, Save & exit"* among the actions the gray-fill
 * secondary carries. Keeping it there is what holds the `/account` tree at zero
 * brand green, which is what lets the route registry say no row of it belongs in
 * `components/header-cta.ts` and `Sign up` never has to yield on any account
 * route. `../../settings/personal/step.tsx` made the same call for the same
 * reason and this matches it deliberately.
 *
 * WHY SAVE IS `disabled`-UNTIL-DIRTY AND NOT PERMANENTLY `aria-disabled`.
 * `app/messages/[threadId]/composer.tsx` keeps its Send in the tab order and
 * inert forever, because a message that silently vanishes is a guest believing
 * their host was asked something. Nothing on this page carries that weight: the
 * strip above the fields says nothing is saved BEFORE a key is pressed, and the
 * `role="status"` line says it again after. That is `personal/step.tsx`'s shipped
 * grammar one folder over, and two account forms behaving differently would be
 * the defect. The password form, where the stakes ARE the composer's, uses the
 * composer's shape instead — see `../../settings/security/step.tsx`.
 *
 * MOTION (§11). Press feedback from `btnSecondary`, and the switch knob's own
 * travel, which is the one animation `switch-row.tsx` argues for at length: an
 * in-place state change the reader just caused. The confirmation line appears
 * without a transition — `role="status"` has already spoken it, and animating a
 * message a screen reader has read adds a delay for one audience and nothing for
 * the other.
 */

/* ── The visibility control ──────────────────────────────────────────────── */

/**
 * The per-item visibility switch — `ga-129`'s `.vis`, and the privacy idea the
 * whole editor is built around: every prompt says who can see it, on the same
 * screen where it is written.
 *
 * WHY THIS IS NOT `components/ui/switch-row.tsx`
 * ----------------------------------------------
 * That primitive is the host wizard's POLICY row: a full-width `<label>` with a
 * 16/500 title, a 13/400 sentence that is rewritten by state, and a hairline
 * above it. Its own header explains why the sentence is required — *"a row that
 * goes silent when it is off is a row whose off-state the host has to infer"* —
 * and that is right for eight house rules down one page. Here the row already
 * has a title (the field's label) and a sentence (the field's hint), and eight
 * more of each would double the page to say nothing new. This is the same
 * control at inline scale.
 *
 * THE GEOMETRY IS COPIED FROM THAT FILE ON PURPOSE, INCLUDING THE RTL RULE.
 * `trackBase` / `trackOff` / `trackOn` / `knobBase` / `KNOB_TRAVEL` are private
 * to `switch-row.tsx`, so the 44×24 track, the 20px knob, the 2px optical inset
 * and the `translate-x-5 rtl:-translate-x-5` travel are reproduced rather than
 * imported. That travel is not a free number — it is
 * `track (44) − knob (20) − inset (2) − inset (2)` — and the `rtl:` half was
 * verified in a browser there, not reasoned about: without it the knob renders
 * at `x = track_width` under RTL and is clipped away by the row. Hoist the pair
 * into a shared `Switch` when someone owns `components/ui/`; do not let the two
 * drift.
 *
 * THE ON-STATE IS INK, NEVER BRAND GREEN. `interactive.selectedFill` on the
 * track, `interactive.selectedFg` on the knob (TASTE §3, and §8's three-role
 * budget). Six green switches down one page would be six fourth roles.
 *
 * THREE SIGNALS, ONLY ONE OF THEM COLOUR: the knob's position, the track's
 * weight, and the WORD beside it — "Shown" or "Only you", `ga-129`'s own two
 * strings.
 *
 * THE ACCESSIBLE NAME IS STATIC, WHICH IS A DELIBERATE DIVERGENCE. `ga-129`
 * writes the state into it (`aria-label="Intro — shown on your profile"` /
 * `"Decade born — hidden, only you"`), so the name changes every time the
 * control is used and a screen reader has to re-read it to report a toggle. The
 * name here says what the control DOES — "Show your intro on your profile" — and
 * the state comes from the checkbox, which announces "switch, on" / "off"
 * without a line of JavaScript. Same information, in the two places ARIA has for
 * it.
 *
 * A native `<input type="checkbox" role="switch">` inside the `<label>`, exactly
 * as `SwitchRow`, `Checkbox` and `RadioRow` are built: the whole control is the
 * hit target, Space toggles it, and the browser owns the state.
 */
function VisibilityToggle({
  checked,
  onChange,
  /** What the switch reveals, phrased for a sentence: "your intro", "where you live". */
  reveals,
}: {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly reveals: string;
}) {
  return (
    <label className="group relative mt-3 inline-flex cursor-pointer items-center gap-3 rounded-md px-0.5 py-1">
      <input
        type="checkbox"
        role="switch"
        className="peer sr-only"
        checked={checked}
        aria-label={`Show ${reveals} on your profile`}
        onChange={(event) => onChange(event.target.checked)}
      />

      {/* Ring overlay — a LATER sibling of the `peer` input, because
          `controlRing` compiles to `~` rather than `:has()` so a browser
          without `:has()` still shows a focus state. Written out rather than
          imported for the same reason the geometry is: keeping the whole
          control in one place is what makes the drift visible if it happens. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-md ring-inset peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring"
      />

      <span
        aria-hidden="true"
        className={`relative h-6 w-11 flex-none rounded-full transition-[background-color,box-shadow,transform] duration-fast ease-standard group-active:scale-[0.97] motion-reduce:duration-instant motion-reduce:group-active:scale-100 ${
          checked
            ? "bg-selected"
            : "bg-sunken ring-1 ring-inset ring-border-default group-hover:ring-border-strong"
        }`}
      >
        <span
          className={`absolute start-0.5 top-0.5 block size-5 rounded-full transition-[transform,background-color] duration-fast ease-standard motion-reduce:duration-instant ${
            checked ? "bg-selected-fg translate-x-5 rtl:-translate-x-5" : "bg-border-strong"
          }`}
        />
      </span>

      {/* `aria-hidden` is NOT set: the word is the sighted reader's state
          signal and the input's own `aria-checked` is the other reader's, so
          neither is doing the other's job. It sits outside the accessible name
          because the input carries `aria-label`. */}
      <span className="text-label font-medium text-secondary">
        {checked ? "Shown" : "Only you"}
      </span>
    </label>
  );
}

/* ── The fields ──────────────────────────────────────────────────────────── */

/**
 * The six prompts, and the single place their ids, labels and hints are
 * written. `personal/step.tsx`'s `FIELD` map is the shape; this one carries more
 * because six fields sharing one anatomy is a list, not six blocks of JSX.
 *
 * ORDER IS `ga-129`'s: intro, interests, lives in, languages, work, school. It
 * is not alphabetical and it is not arbitrary — it runs from the thing a reader
 * has most to say about to the thing they are least likely to fill.
 */
const PROMPTS = [
  {
    key: "intro",
    id: "profile-intro",
    label: "Intro",
    /** Phrased to complete "Show ___ on your profile". */
    reveals: "your intro",
    hint: "A few sentences about how you travel.",
  },
  {
    key: "interests",
    id: "profile-interests",
    label: "Interests",
    reveals: "your interests",
    hint: "Separate them with commas.",
  },
  {
    key: "livesIn",
    id: "profile-lives-in",
    label: "Where you live",
    reveals: "where you live",
    hint: "A city is enough. Your address is never shown to anyone.",
  },
  {
    key: "languages",
    id: "profile-languages",
    label: "Languages you speak",
    reveals: "the languages you speak",
    hint: "The ones you could hold a conversation in.",
  },
  { key: "work", id: "profile-work", label: "Work", reveals: "your work", hint: undefined },
  { key: "school", id: "profile-school", label: "School", reveals: "your school", hint: undefined },
] as const;

type PromptKey = (typeof PROMPTS)[number]["key"];

const EMPTY_VALUES: Record<PromptKey, string> = {
  intro: "",
  interests: "",
  livesIn: "",
  languages: "",
  work: "",
  school: "",
};

/**
 * Every prompt starts SHOWN, and the one that is different in the card is the
 * one that is not built (decade born, off by default).
 *
 * This is not a retreat from `/account/settings/privacy`'s *"You start on the
 * more private choice"*. That page governs who may open your profile at all,
 * and it does start narrow: only hosts of a stay you book. This switch governs
 * a prompt you chose to write, on a profile whose audience is already narrowed,
 * and a field that hides itself the moment it is typed is a control fighting the
 * reader. The two defaults are the same principle read at two scales — the
 * audience is narrow by default, and what you deliberately add to it is visible
 * to that audience.
 */
const ALL_SHOWN: Record<PromptKey, boolean> = {
  intro: true,
  interests: true,
  livesIn: true,
  languages: true,
  work: true,
  school: true,
};

export function ProfileEditorForm() {
  const [values, setValues] = useState<Record<PromptKey, string>>(EMPTY_VALUES);
  const [shown, setShown] = useState<Record<PromptKey, boolean>>(ALL_SHOWN);
  const [submitted, setSubmitted] = useState(false);

  /*
    The button answers only when there is something to answer about — a typed
    field or a flipped switch. TASTE §11.7: a disabled control stays visible and
    in place, so it loses its label weight and not its position and nothing
    reflows when it becomes available.
  */
  const dirty =
    PROMPTS.some((prompt) => values[prompt.key] !== "") ||
    PROMPTS.some((prompt) => !shown[prompt.key]);

  const setValue = (key: PromptKey, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  const setShownFor = (key: PromptKey, next: boolean) =>
    setShown((current) => ({ ...current, [key]: next }));

  return (
    <>
      {/* §5's general form, which `HOST-SHELL.md` §15 states: back returns to
          the last state that still exists. The profile is this editor's parent
          and its result. */}
      <AccountBackLink href="/account/profile">Your profile</AccountBackLink>

      <AccountPageHead
        className="mt-5"
        title="Edit your profile"
        sub="Add what you want a host to know, and choose what stays private."
      />

      <ExampleAccountStrip className="mt-6">
        Nothing you type here is saved and none of it reaches your profile, so the page you came from
        will look the same when you go back.
      </ExampleAccountStrip>

      {/*
        THE PHOTO, STATED RATHER THAN FAKED.

        `ga-130` — guided capture and crop — is an `app` row in `SCREENS.md` with
        no web rendering, and on web a photo needs an upload path that does not
        exist. `components/host/photo-upload.tsx` is the nearest thing in the
        build and it is not it: it is the LISTING wizard's photo step, it hands
        its page a `File[]` and stops, and its own header says *"Nothing here
        talks to a server and no API shape is invented."* Pointing a profile at
        it would give a reader a dropzone, a thumbnail from an object URL, and a
        picture that vanishes on the next navigation — a fake uploader, which is
        the one thing this page must not ship.

        SO NO CONTROL IS OFFERED AT ALL, not even a disabled one. §12 requires
        every disabled control to name its next action, and there is no next
        action: no route, no queue, nowhere for a file to go. `privacy/step.tsx`
        made the same call for blocking one folder over — *"a row that lifts
        under the pointer and then does nothing is worse than one that never
        offered, so no row is offered"*.

        The avatar is drawn full size and first, because the corpus is emphatic
        that it is not a placeholder: an initials avatar and a set photo are the
        SAME first-class treatment, and declining a photo is never a lesser state
        (§6, `ga-129`, DESIGN §9-J/§10.7). The first sentence is `ga-129`'s own.
      */}
      <AccountSection id="photo" heading="Your photo" className="mt-8">
        <div className="mt-5 flex items-start gap-4">
          <span
            aria-hidden="true"
            className="grid size-14 flex-none place-items-center rounded-full bg-brand-subtle text-h5 font-semibold text-primary"
          >
            {SESSION_ACCOUNT.initials}
          </span>

          <div className="min-w-0 flex-1">
            <p className="max-w-[62ch] text-bodyMd font-regular leading-relaxed text-secondary">
              You don&rsquo;t need a photo. Your initials are a complete profile, and they are what a
              host sees beside your name.
            </p>
            <p className="mt-3 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
              Adding one is not built on the web yet, so this page asks for no file and there is
              nowhere for a picture to be kept. Nothing else about your profile is waiting on it.
            </p>
          </div>
        </div>
      </AccountSection>

      <AccountSection
        id="about"
        heading="About you"
        sub="Every prompt is optional, and each one carries its own switch for who can see it."
        className="mt-8"
      >
        {/*
          The name, named where a reader will look for it. One link, to the page
          that owns the string — a second input for one name is how two screens
          start disagreeing about a person.
        */}
        <p className="mt-3 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
          Your name is not edited here. It sits with your personal info, so verification can match it
          against your CNIC.{" "}
          <Link href="/account/settings/personal" className={`${inlineAction} font-medium`}>
            Change your name
          </Link>
        </p>

        <div className="mt-6 flex flex-col gap-7">
          {/*
            Intro is the one multi-line prompt, so it is the one field drawn
            outside the map: `Textarea` and `TextField` are different primitives
            and a branch inside the loop to pick between them would read worse
            than five lines of JSX.

            THE COUNTER HAS NO DENOMINATOR. `ga-129` renders "168 / 300";
            `textarea.tsx` rules that out at length and the reasoning is its own:
            a denominator is a budget you can overspend, the range is
            encouragement and never a gate, and the colour never changes — not to
            red and not to green. The settled state swaps a WORD.

            `dir` is deliberately unset, so the field inherits the document's
            direction and a guest writing Urdu on an Urdu page gets an Urdu caret
            — `composer.tsx`'s call, for the case where the document already
            knows.
          */}
          <div>
            <Textarea
              id={PROMPTS[0].id}
              label={PROMPTS[0].label}
              value={values.intro}
              onChange={(value) => setValue("intro", value)}
              rows={5}
              placeholder="Say salam, and how you like to travel"
              hint={PROMPTS[0].hint}
              counter={{
                unit: "characters",
                countLabel: (count) => <>{count} characters</>,
                guide: "Aim for a few sentences",
                guideSettled: "Good length",
                settledFrom: 120,
              }}
            />
            <VisibilityToggle
              checked={shown.intro}
              onChange={(next) => setShownFor("intro", next)}
              reveals={PROMPTS[0].reveals}
            />
          </div>

          {PROMPTS.slice(1).map((prompt) => (
            <div key={prompt.key}>
              <TextField
                id={prompt.id}
                label={prompt.label}
                value={values[prompt.key]}
                onChange={(value) => setValue(prompt.key, value)}
                name={prompt.id}
                hint={prompt.hint}
              />
              <VisibilityToggle
                checked={shown[prompt.key]}
                onChange={(next) => setShownFor(prompt.key, next)}
                reveals={prompt.reveals}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled={!dirty}
            onClick={() => setSubmitted(true)}
            className={`${btnSecondary} disabled:cursor-default disabled:text-disabled disabled:hover:bg-raised`}
          >
            Save changes
          </button>

          {!dirty && !submitted ? (
            <span className="text-label font-regular text-tertiary">Nothing has changed yet.</span>
          ) : null}
        </div>

        {/*
          Not the success register. `ga-129` ships a green "Profile updated"
          toast, and nothing was updated — a success colour here would be the
          screen agreeing with itself that something happened. TASTE §6's
          `bg.raised` info strip instead, payload word bolded, which is the same
          register the example strip above uses because it is the same kind of
          statement. `personal/step.tsx` renders the twin of this block.

          `role="status"` announces it once, politely, without moving focus off
          the button the reader just pressed (§11: a status announces itself
          once, never on a loop).
        */}
        {submitted ? (
          <p
            role="status"
            className="mt-5 flex max-w-[62ch] items-start gap-3 rounded-md bg-raised px-4 py-3 text-bodySm font-regular leading-relaxed text-secondary"
          >
            <InfoIcon className="mt-0.5 size-5 shrink-0 text-secondary" />
            <span>
              <b className="font-semibold text-primary">Nothing was saved.</b> There is no profile to
              save it to yet. Your answers are still on screen, and leaving the page loses them.
            </span>
          </p>
        ) : null}
      </AccountSection>
    </>
  );
}

export default ProfileEditorForm;
