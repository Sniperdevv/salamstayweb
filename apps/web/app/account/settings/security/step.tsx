"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { iconStroke } from "@salamstay/design-tokens/icons";

import { Num } from "@/components/numerals";
import {
  controlRing,
  focusRing,
  hostFieldLabel,
  hostFieldSub,
  inlineAction,
  pressableCircle,
  tintTransition,
} from "@/components/ui";
import { countUnits } from "@/components/ui/textarea";

import {
  AccountBackLink,
  AccountPageHead,
  AccountSection,
  ExampleAccountStrip,
} from "../../account-chrome";

/**
 * GA-079's password screen, as a web form — and **only** its password screen.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE CARD DRAWS FOUR THINGS. THREE OF THEM ARE A LEDGER OF EVENTS NOBODY
 *  RECORDED, SO ONE SHIPS.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `ga-079` draws a security home: a password row, two-step verification with a
 * WhatsApp code and an authenticator app, three signed-in devices with a
 * sign-out on each, a sign-out-everywhere confirm, a recent-activity row and a
 * new-device alert switch. Every one of those except the password is a fact
 * about a session, and `lib/mode.ts` is explicit about what a session is here:
 * one string in `localStorage`, *"no stored user, no stored token and no stored
 * expiry, because none of those exist."* So:
 *
 *  · **Two-step verification.** `SCREENS.md` puts GA-010 at phase 3. There is
 *    no enrolment, no code to send and no number to send it to — `ga-079`'s own
 *    `+92 300 ••• ••67` is a card fixture, and §14 rules account data a
 *    fabrication until a record exists. An "On" chip over nothing is the worst
 *    possible version: a reader would believe their account has a second lock.
 *  · **The device list.** "Android phone · Islamabad · Active now", "iPhone ·
 *    Safari · Lahore · 2 days ago". Three devices, three cities and three
 *    last-actives, none of which anything observed. §14 names response times and
 *    "usually replies within…" as invented SLAs for the same reason: a duration
 *    nobody measured is not a placeholder.
 *  · **Sign out of all other devices.** The confirm reads "The 2 other devices
 *    signed in to your account will be signed out." There are no other devices,
 *    so the button would either lie about what it did or do nothing and say it
 *    did.
 *  · **Recent security activity** and the **new-device alert switch**. A login
 *    history, and a promise to message someone. Neither has a record or a
 *    transport behind it.
 *
 * WHAT IS LEFT IS THE PASSWORD, AND IT CANNOT SAVE EITHER — SO IT SAYS SO.
 * ------------------------------------------------------------------------
 * The button is `aria-disabled`, focusable, permanently inert, and describes
 * itself. That is `app/messages/[threadId]/composer.tsx`'s grammar, imported as
 * a decision rather than as code, and it is the right one here for the reason
 * that file gives about Send: *"a guest would believe their host had been asked
 * about check-in, and would find out at a gate in Islamabad that nobody had."*
 * A password is the same shape of harm one notch higher — a reader who believes
 * they rotated a password after a scare, and did not, is worse off than one who
 * was told plainly that they could not.
 *
 *   · `aria-disabled`, NOT `disabled`. A `disabled` button leaves the tab order,
 *     so a keyboard or screen-reader user reaches the fields, finds no way
 *     forward, and is never told why. `aria-disabled` keeps the control
 *     focusable and announces it as dimmed; `aria-describedby` reads the reason
 *     at the moment it matters, and the same id describes both fields so the
 *     truth arrives whichever one a reader lands on first.
 *   · There is **no `onClick`**: inert by construction, not by an early return
 *     somebody could delete.
 *   · **No `pressable`.** A control that cannot be pressed does not answer a
 *     press. That absence is the signal (TASTE §1: the shadow, and here the
 *     press, is the enabled signal).
 *   · **The fields stay live**, exactly as the composer's textarea does. Typing
 *     costs nothing and shows how the screen would behave; the line under the
 *     button says where the words stop.
 *
 * This is deliberately NOT `../personal/step.tsx`'s disabled-until-dirty Save,
 * and the two are different on purpose: that button becomes pressable and then
 * tells you nothing was stored, which is fine for a name and not for a
 * credential. `../../profile/edit/step.tsx` records the same split from the
 * other side.
 *
 * WHAT IS NOT INVENTED IN THE FORM ITSELF
 * ---------------------------------------
 *  · **No strength meter and no verdict.** `ga-079` writes "Strong — long and
 *    not an easy guess", and the second half of that is a claim: nothing here
 *    checks a password against a breach list, a dictionary or a policy. The one
 *    line under the field is a COUNT of what is in the box, which is a fact
 *    about the box.
 *  · **No minimum length.** A threshold states a rule, and no rule is enforced
 *    anywhere in this build. The count has no denominator for the same reason
 *    `components/ui/textarea.tsx` gives for its own: *"a denominator is a budget
 *    you can overspend"*, and there is nothing here to spend.
 *  · **No "last changed" date.** `ga-079`'s password row carries one. Nothing
 *    holds it.
 *  · **No Cancel.** The card pairs its primary with one; on web the back link at
 *    the top of the page goes to the same place, and two routes to one
 *    destination is the doubling `/account/verification` already refused.
 *
 * GREEN (§8). Two roles on this page, both chrome: the wordmark dot and the
 * header avatar's fill. The body spends none — the one button is disabled and a
 * disabled control spends nothing, and every link is ink and underlined at rest.
 * The `/account` tree stays at zero brand green, which is what lets the route
 * registry say no row of it belongs in `components/header-cta.ts`.
 *
 * ELEVATION (§9). Fields carry a border and no shadow; sections are separated by
 * a hairline and a heading, never by a card.
 *
 * MOTION (§11). Press feedback on the reveal control only (`pressableCircle`,
 * the rung `components/ui.ts` reserves for small circular buttons). Nothing
 * enters, reveals or animates.
 */

/* ── Glyphs ──────────────────────────────────────────────────────────────── */

/**
 * `ga-079`'s own eye, and its struck-through twin.
 *
 * `components/icons.tsx` carries no eye and this wave may not add to it — that
 * module is chrome-shared and owned elsewhere, so a parallel edit into it is a
 * race, not a decision (`account-chrome.tsx` records the same call for its five
 * glyphs). `app/account/profile/page.tsx` draws the open eye a second time for
 * its empty state. Merge candidate for `components/icons.tsx`, flagged.
 *
 * The struck-through form is `ga-129`'s hidden-marker path, so the pair is the
 * corpus's own vocabulary rather than two shapes that happen to rhyme.
 *
 * Decorative: the button carries the accessible name, so both are `aria-hidden`.
 */
function EyeIcon({ className }: { readonly className?: string }) {
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
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { readonly className?: string }) {
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
      <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.8 2.8" />
      <path d="M9.4 5.2A9 9 0 0 1 12 5c5 0 9 5 9 7a12 12 0 0 1-2.2 2.9M6.2 6.2A12 12 0 0 0 3 12c0 2 4 7 9 7a9 9 0 0 0 3-.5" />
    </svg>
  );
}

/* ── The field ───────────────────────────────────────────────────────────── */

/**
 * A password cell — `ga-079`'s `.finput` + `.feye`, built as
 * `components/ui/text-field.tsx`'s anatomy with two things it cannot express.
 *
 * WHY IT IS NOT `TextField`
 * -------------------------
 * That primitive hard-codes `type="text"`, and a password field that renders its
 * value in plain text is not a variant of anything — it is the bug. Its second
 * slot, `unit`, is `aria-hidden` and its own docs say *"Never a second
 * control"*, which is exactly what a reveal toggle is. Both are one prop away
 * (`type`, and a `trailing` slot that may hold a control), and `components/ui/`
 * is outside this wave's folders. **Merge candidate, flagged, not made.**
 *
 * Everything else is `TextField`'s, copied so the two cannot look different on
 * one page: the 13/600 ink label ABOVE the field (`hostFieldLabel`, §5's host
 * form label — not the checkout shell's `overline`, which is a caption over a
 * value a reader is reading back), the 48px `bg.sunken` cell at `radius.md`
 * under `border.default`, the borderless input inside it, and the ring on the
 * CELL rather than on the input — because a 2px ring hugging a bare text line
 * reads as a second, smaller field inside the first.
 *
 * `dir="ltr"` ON THE INPUT, ALWAYS. A password is a byte sequence, not prose:
 * it is typed the way it will be sent, and a caret that mirrors with the
 * document would change where a character lands relative to what the reader
 * sees. This is the opposite call from the profile editor's prose fields one
 * folder over, which deliberately inherit the document direction so a guest
 * writing Urdu gets an Urdu caret.
 *
 * THE REVEAL IS A TOGGLE BUTTON WITH A STATIC NAME. `aria-pressed` carries the
 * state and the label never changes, which is the standard toggle pattern and
 * the one a screen reader reports cleanly ("Show current password, toggle
 * button, pressed"). The label names WHICH password because there are two on the
 * page. `type="button"`, so it can never submit anything.
 */
function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  /** Completes "Show ___". Names which of the two fields, for the two buttons. */
  revealLabel,
  describedBy,
  meta,
  hint,
}: {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly autoComplete: "current-password" | "new-password";
  readonly revealLabel: string;
  readonly describedBy?: string;
  /** A line between the field and its hint — the count, on the new password. */
  readonly meta?: ReactNode;
  readonly hint?: ReactNode;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={hostFieldLabel}>
        {label}
      </label>

      {/* `relative` only so the ring overlay can be pinned. `pe-2` rather than
          `pe-4`: the 40px reveal button carries its own optical padding, so the
          cell's trailing inset is the button's, not a second one under it. */}
      <div
        className={`relative mt-2 flex min-h-12 items-center gap-2 rounded-md border border-border-default bg-sunken ps-4 pe-2 ${tintTransition} hover:border-border-strong`}
      >
        <input
          id={id}
          name={id}
          type={revealed ? "text" : "password"}
          dir="ltr"
          autoComplete={autoComplete}
          aria-describedby={describedBy}
          className="peer min-w-0 flex-1 border-none bg-transparent p-0 text-bodyMd text-primary outline-none placeholder:text-secondary"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />

        <button
          type="button"
          aria-pressed={revealed}
          aria-label={`Show ${revealLabel}`}
          onClick={() => setRevealed((current) => !current)}
          /* The ring offsets against `bg.sunken` rather than `bg.canvas`: this
             button sits INSIDE the field cell, and `focusRing`'s canvas-coloured
             offset would draw a white halo on a tinted ground. Same role, same
             2px ring, one offset colour changed for where it lives. */
          className={`grid size-10 flex-none place-items-center rounded-full text-secondary hover:text-primary ${pressableCircle} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sunken`}
        >
          {revealed ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
        </button>

        {/* The ring must be a LATER SIBLING of the `peer` input — see
            `controlRing`, which compiles to `~` rather than `:has()` so a
            browser without `:has()` still shows a focus state. */}
        <span aria-hidden="true" className={`${controlRing} rounded-md`} />
      </div>

      {meta}
      {hint ? <span className={hostFieldSub}>{hint}</span> : null}
    </div>
  );
}

/* ── The page ────────────────────────────────────────────────────────────── */

const FIELD = {
  current: "security-current-password",
  next: "security-new-password",
} as const;

/** One id, read by the button and by both fields. See the header on `aria-describedby`. */
const REASON_ID = "password-not-connected";

/**
 * `btnSecondary`'s geometry wearing `composer.tsx`'s disabled skin.
 *
 * Spelled out rather than composed, for the reason `components/ui.ts` records
 * against `btnSecondaryMd` and `btnSecondaryOnTint`: Tailwind emits utilities in
 * token order, so appending a colour to a class string that already carries one
 * is decided by the stylesheet, not by the order written here. A state is a
 * whole recipe.
 *
 * THE BORDER IS NOT DECORATION, and `checkout-step.tsx` measured it: `bg.raised`
 * against `bg.canvas` is 1.06:1 in light and 1.08:1 in dark. An enabled
 * `btnSecondary` survives that because its label is ink; a disabled one has a
 * `text.disabled` label, so without an edge it is dim text floating with no
 * shape at all. `text.disabled` is the house token for disabled text everywhere;
 * its own contrast is a system-level question logged at `GO-LIVE` C7.
 *
 * The §5 secondary rather than a pill primary: TASTE §5 carries "Save & exit"
 * and "Done", a settings page saving one control is that case, and a green
 * primary here would be the first brand role the `/account` tree has spent.
 */
const updateDisabled =
  "inline-flex h-12 cursor-default select-none items-center justify-center gap-2 whitespace-nowrap " +
  `rounded-md border border-border-default bg-raised px-6 text-bodyMd font-medium text-disabled ${focusRing}`;

export function SecurityForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");

  return (
    <>
      {/* §5: *"Back is the hub."* Every `/account/settings/*` child ships one
          ink underlined back link to `/account/settings`. */}
      <AccountBackLink href="/account/settings">Settings</AccountBackLink>

      <AccountPageHead
        className="mt-5"
        title="Security"
        /* The scope, in the support line, because the `<h1>` is the hub row's
           word and this page is one control of it. `../personal/step.tsx`'s
           "Your details, and how SalamStay confirms a change to the sensitive
           ones" is the same sentence shape one folder over. */
        sub="The password you sign in with, and what this page does not cover yet."
      />

      <ExampleAccountStrip className="mt-6">
        There is no account to hold a password, so nothing you type here is checked, changed or kept.
      </ExampleAccountStrip>

      <AccountSection
        id="password"
        heading="Change your password"
        /* `ga-079`'s own lead, kept because it is advice rather than a claim:
           it says nothing about what this build checks, and nothing here checks
           anything. */
        sub={<>A longer phrase you&rsquo;ll remember beats a short jumble you won&rsquo;t.</>}
        className="mt-8"
      >
        {/* No width of its own: `../personal/step.tsx` lets its four fields span
            the 640 column §4c fixes for every settings child, and two account
            forms measuring differently is the drift, not the fix. */}
        <div className="mt-5 flex flex-col gap-6">
          <PasswordField
            id={FIELD.current}
            label="Current password"
            value={current}
            onChange={setCurrent}
            autoComplete="current-password"
            revealLabel="current password"
            describedBy={REASON_ID}
          />

          <PasswordField
            id={FIELD.next}
            label="New password"
            value={next}
            onChange={setNext}
            autoComplete="new-password"
            revealLabel="new password"
            describedBy={REASON_ID}
            /*
              A COUNT, NOT A VERDICT, and the row exists at zero.

              `components/ui/textarea.tsx` argues both halves for its own
              counter and the argument transfers: the row renders before there
              is anything to count, so typing the first character does not push
              the button and everything under it down the page; and there is no
              denominator, no colour change and no judgement, because a
              threshold would state a rule nothing enforces.

              `Num` rather than a bare number: it wraps the digit run in `.num`
              AND isolates the whole PHRASE, which is `GO-LIVE` A17's fix. The
              half-right version — isolating "14" and leaving "characters"
              loose — renders "characters 14" inside an RTL paragraph. `Num`
              takes a string precisely so the isolate cannot be drawn any
              narrower than the sentence.

              Not announced: no `aria-live`, because a count that spoke on every
              keystroke would talk over the reader typing.
            */
            meta={
              <p className="mt-2 text-label font-regular text-tertiary">
                <Num>{`${countUnits(next, "characters")} characters`}</Num>
              </p>
            }
            /* NO HINT. The section's lead already carries the only advice this
               page is entitled to give, and a second sentence saying the same
               thing 200px lower is the kind of padding TASTE §7 means by
               "bold the payload word only" applied to prose: say it once, where
               it lands first. */
          />
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            type="button"
            aria-disabled="true"
            aria-describedby={REASON_ID}
            className={updateDisabled}
          >
            Update password
          </button>

          {/*
            The reason, and the next step, in one line — §12's "never a dead
            end". `/help` is a built page, not a stub, so the way onward actually
            goes somewhere. Nothing here says how fast anyone answers: §13 makes
            claim 8 the only permitted statement about support availability, and
            anything else is an invented SLA (§14).

            Underlined at rest, in ink (TASTE §8), and not green — §8 keeps links
            ink on every signed-in guest surface.
          */}
          <p id={REASON_ID} className="text-bodySm font-regular leading-relaxed text-secondary">
            Changing a password is not connected yet, so nothing you type here leaves this page.{" "}
            <Link className={inlineAction} href="/help">
              Reach the SalamStay team through the help centre
            </Link>
            .
          </p>
        </div>
      </AccountSection>

      {/*
        The boundary, restated in plain words rather than left to inference —
        §12's rule for exactly this, and the shape `privacy/step.tsx` uses for
        blocking one folder over. A reader who opened a page called Security was
        looking for at least one of these three things, and silence would read as
        "SalamStay has none" or "it is hidden somewhere".

        No control and no disabled control: there is nothing for one to name.
        The one real session action that DOES exist is the hub's own Sign out,
        so that is what is pointed at. It doubles the back link's destination,
        which `/account/verification` avoids as a rule; the rule is about two
        routes to one UNDECIDED place, and this is a specific control on a
        specific page a reader has a reason to want right now.
      */}
      <AccountSection id="not-here" heading="Devices and two-step verification" className="mt-8">
        <p className="mt-3 max-w-[62ch] text-bodyMd font-regular leading-relaxed text-secondary">
          There is no list of the devices you are signed in on, no way to sign out of the others, and
          no second check when you sign in somewhere new. None of it is built yet, so none of it is
          shown here rather than shown empty.
        </p>
        <p className="mt-3 max-w-[62ch] text-bodyMd font-regular leading-relaxed text-secondary">
          Signing out of this browser is the one thing that does work, and it is on the settings
          page.{" "}
          <Link href="/account/settings" className={`${inlineAction} font-medium`}>
            Go to settings
          </Link>
        </p>
      </AccountSection>
    </>
  );
}

export default SecurityForm;
