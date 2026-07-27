"use client";

import { useState } from "react";

import { InfoIcon } from "@/components/icons";
import { btnSecondary } from "@/components/ui";
import { TextField } from "@/components/ui/text-field";
import { SESSION_ACCOUNT } from "@/lib/mode";

import {
  AccountBackLink,
  AccountPageHead,
  AccountSection,
  ExampleAccountStrip,
} from "../../account-chrome";

/**
 * GA-047's field list, as a web form — `GUEST-SHELL.md` §4c's form frame.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE CARD DRAWS A FILLED RECORD. THERE IS NO RECORD. SO THE FORM IS EMPTY.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `ga-047` draws a date of birth (`14 March 1994`), a masked phone (`+92 300 •••
 * ••67`), two email addresses and a verify-pending chip. Every one of those is a
 * fact about a person, and §14 rules facts about a person's record fabrications
 * until the record exists. `lib/mode.ts` is explicit that it does not: *"there is
 * no stored user, no stored token and no stored expiry, because none of those
 * exist."*
 *
 * One field is seeded and only one — the display name, from `SESSION_ACCOUNT`,
 * which is the same record the header's avatar and the account menu draw from.
 * The other three start empty, which §12 says is not an edge case but the
 * first-run truth: *"Empty is what every one of these surfaces renders on day
 * one, so it is specified first and built first."*
 *
 * WHAT ELSE THE CARD DRAWS THAT IS NOT BUILT
 * -------------------------------------------
 *  · **Per-row inline editing** — tap a row, it becomes an input, Save/Cancel
 *    appear beneath it. That is a phone affordance for a 300px column where four
 *    open fields will not fit. At 640 they all fit, and a form that hides its
 *    own fields behind a tap is a form that has to be discovered. The fields are
 *    open; §4c's field anatomy is the whole layout.
 *  · **The WhatsApp-first OTP re-verify screen** (`/account/settings/personal/
 *    verify-phone`). It is a real flow in the corpus and it is not built here —
 *    there is nothing to send a code about, and a six-box OTP that accepts any
 *    digits is worse than no screen. Its *guarantee* survives as the phone
 *    field's hint, because that guarantee is the point of the screen: the number
 *    you have keeps working until the new one is confirmed.
 *  · **A second email in verify-pending**, and the never-silent-merge banner
 *    beside it. Same reason. The promise survives as the email field's hint.
 *
 * SAVE IS NOT THE SURFACE'S PRIMARY CTA, AND THAT IS ON PURPOSE (§8, TASTE §2).
 * Brand green is budgeted at three roles on a signed-in guest surface, two of
 * which — the wordmark dot and the header avatar — arrive with the chrome. This
 * tree spends the third nowhere: TASTE §5 lists *"Edit, Done, Save & exit"*
 * among the actions the gray-fill secondary button carries, and a settings page
 * that saves per section is exactly that case. It also means the header's
 * `Sign up` never has to yield on any `/account` route (`components/header-cta.ts`
 * needs no entry), so the budget holds without an exception.
 *
 * NO STICKY ACTION BAR. §4c: *"a settings page saves per control or per section,
 * it is not a wizard step, and there is no nine-bar progress to anchor a bar
 * with."*
 *
 * MOTION. Press feedback only, inherited from `btnSecondary`'s `pressable`
 * (`scale(.97)`, `duration.instant`, `easing.decelerate`, collapsing under
 * `prefers-reduced-motion`). The confirmation line appears without a transition:
 * it is announced by `role="status"`, and animating a message a screen reader
 * has already spoken adds a delay for the readers who can see it and nothing for
 * the readers who cannot.
 */

/** The four fields, and the single place their ids are written. */
const FIELD = {
  name: "personal-name",
  dob: "personal-dob",
  phone: "personal-phone",
  email: "personal-email",
} as const;

export function PersonalInfoForm() {
  const [name, setName] = useState(SESSION_ACCOUNT.name);
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  /*
    The button answers only when there is something to answer about. TASTE
    §11.7: a disabled control stays visible and in place — it loses its label
    weight, not its position, so nothing reflows when it becomes available.
  */
  const dirty = name !== SESSION_ACCOUNT.name || dob !== "" || phone !== "" || email !== "";

  return (
    <>
      <AccountBackLink href="/account/settings">Settings</AccountBackLink>

      <AccountPageHead
        className="mt-5"
        title="Personal info"
        sub="Your details, and how SalamStay confirms a change to the sensitive ones."
      />

      <ExampleAccountStrip className="mt-6">
        The name is written into the site; nothing you type here is saved, and no code is sent to any number or address.
      </ExampleAccountStrip>

      <AccountSection id="details" heading="Your details" className="mt-8">
        <div className="mt-5 flex flex-col gap-6">
          <TextField
            id={FIELD.name}
            label="Full name"
            value={name}
            onChange={setName}
            name="full-name"
            autoComplete="name"
            hint="As it appears on your CNIC, so verification can match it."
          />

          {/*
            A text field with a stated format, not a date picker. The corpus
            answers this with a native phone picker (`ga-047` opens the OS
            wheel); the web equivalent is undrawn, `components/ui/` carries no
            date control that is not the stay-dates calendar, and a calendar
            built for choosing check-in is the wrong instrument for a year of
            birth. Flagged rather than improvised.

            `dir="ltr"` so the caret and the separators behave in the format
            being written even when the document is RTL — the same rule
            `TextField` documents for its own prose fields.
          */}
          <TextField
            id={FIELD.dob}
            label="Date of birth"
            value={dob}
            onChange={setDob}
            name="date-of-birth"
            dir="ltr"
            placeholder="DD / MM / YYYY"
            autoComplete="bday"
            /* §13: a field this personal states its practical basis. `ga-047`'s
               own note, kept verbatim in meaning. */
            hint="Confirms you are old enough to book, and helps verification. It is never shown on your profile."
          />
        </div>
      </AccountSection>

      <AccountSection
        id="reach"
        heading="How SalamStay reaches you"
        sub="Booking confirmations, verification codes and messages from your host go to these."
        className="mt-8"
      >
        <div className="mt-5 flex flex-col gap-6">
          <TextField
            id={FIELD.phone}
            label="Phone"
            value={phone}
            onChange={setPhone}
            name="phone"
            dir="ltr"
            autoComplete="tel"
            /* The load-bearing half of `ga-047`: the guarantee, not the OTP
               screen. Nobody can be locked out by a mistyped change. */
            hint="A new number is confirmed with a code before it replaces the one you have."
          />

          <TextField
            id={FIELD.email}
            label="Email"
            value={email}
            onChange={setEmail}
            name="email"
            dir="ltr"
            autoComplete="email"
            /* `ga-006`/`ga-047`'s never-silent-merge rule, in one sentence. */
            hint="A new address is confirmed from its own inbox first. Nothing is merged or moved without you."
          />
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled={!dirty}
            onClick={() => setSubmitted(true)}
            className={`${btnSecondary} disabled:cursor-default disabled:text-disabled disabled:hover:bg-raised`}
          >
            Save changes
          </button>

          {!dirty && !submitted ? (
            <span className="text-label font-regular text-tertiary">
              Nothing has changed yet.
            </span>
          ) : null}
        </div>

        {/*
          Not the success register. `ga-047` ships this as a green `success`
          banner ("Name updated"), and nothing was updated — a success colour
          here would be the screen agreeing with itself that something happened.
          TASTE §6's `bg.raised` info strip instead, payload word bolded, which
          is the same register the example strip above uses because it is the
          same kind of statement.

          `role="status"` announces it once, politely, without moving focus off
          the button the reader just pressed (§11: a skeleton or status announces
          itself once, never on a loop).
        */}
        {submitted ? (
          <p
            role="status"
            className="mt-5 flex max-w-[62ch] items-start gap-3 rounded-md bg-raised px-4 py-3 text-bodySm font-regular leading-relaxed text-secondary"
          >
            <InfoIcon className="mt-0.5 size-5 shrink-0 text-secondary" />
            <span>
              <b className="font-semibold text-primary">Nothing was saved.</b> There is no account
              to save it to yet. Your changes are still on screen, and leaving the page loses them.
            </span>
          </p>
        ) : null}
      </AccountSection>
    </>
  );
}

export default PersonalInfoForm;
