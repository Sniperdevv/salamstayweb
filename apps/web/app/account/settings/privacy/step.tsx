"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { LockIcon, MessageIcon, PinIcon } from "@/components/icons";
import { inlineAction } from "@/components/ui";
import { RadioGroup, RadioRow } from "@/components/ui/radio-group";

import {
  AccountBackLink,
  AccountPageHead,
  AccountSection,
  ExampleAccountStrip,
} from "../../account-chrome";
import {
  MESSAGING_SCOPE_DEFAULT,
  PROFILE_VISIBILITY_DEFAULT,
  type MessagingScope,
  type ProfileVisibility,
} from "../settings-model";

/**
 * GA-125 — privacy settings, in `GUEST-SHELL.md` §4c's form frame.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE SHIPPED PRIVACY POLICY IS THE SOURCE. WHERE IT STATES A RULE, THE PAGE
 *  REFLECTS IT; WHERE IT DOES NOT, NOTHING IS INVENTED TO FILL THE GAP.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `/legal/privacy` is an indexable document this site already serves, and it has
 * two sections that describe exactly this screen: **"Your privacy defaults"**
 * (`#defaults`) and **"What we never share"** (`#never`). `../notifications/` was
 * built against the same file rather than against `ga-069`'s switch matrix, and
 * this page is built the same way, for the same reason: a guest who reads a
 * public page and then meets a different contract behind their login has been
 * told two things.
 *
 * The decisive sentence is the one that opens `#never`:
 *
 *   > Three things are kept private, always — **not as a setting you have to
 *   > find, but as a rule of the product.**
 *
 * THE FOUR CONTROLS `ga-125` DRAWS, AND WHAT EACH BECAME
 * ------------------------------------------------------
 *  1. **Profile visibility → a radiogroup, unchanged.** `#defaults` names the
 *     starting position ("hosts you book with") and says *"We start you on the
 *     more private choice"*, which is a default and therefore a choice.
 *  2. **Messaging scope → a radiogroup, unchanged.** Same section, same shape.
 *  3. **Approximate location → NOT a switch.** `ga-125` draws it as a Switch, on
 *     by default. The policy files the same fact under `#never`, under the
 *     sentence above: *"Your exact location is never shown before a booking is
 *     confirmed."* A control that cannot be turned off is a lie about who
 *     decides — the argument `../settings-model.ts` already makes for the locked
 *     WhatsApp and SMS channels — so it is stated as a rule in "Kept private,
 *     always" instead, which is where the policy puts it.
 *  4. **Blocked people → NOT a row.** Three separate reasons, any one of them
 *     enough. `/account/settings/blocked` **is not in the route registry**, and
 *     G37 fails the build on an internal href that does not resolve — the same
 *     wall `app/messages/[threadId]/page.tsx` hit for its `⋯` sheet, which
 *     records that *"blocking and reporting are boundaries that matter and they
 *     are unbuilt, not dropped."* The card's hint ("2 people") is a count of a
 *     list nobody holds. And §14 rules facts about a person's record fabrications
 *     until the record exists. What survives is the load-bearing half — the rule
 *     the policy commits to — as a statement with no list, no count and no link.
 *
 * WHAT ELSE IS DELIBERATELY ABSENT
 * ---------------------------------
 *  · **Trip safety.** `ga-125` routes a row to `/account/settings/privacy/trip-safety`.
 *    Unregistered (G37), and `GUEST-SHELL.md`'s own Unresolved list says *"What
 *    the web half of trip safety actually contains is undrawn."* Building it here
 *    would answer a founder question sideways from a settings page.
 *  · **Export and delete.** Real, and not this route's: the policy carries them
 *    at `#rights`, `ga-125` draws neither, and Unresolved records that *"whether
 *    export lives under `settings` or `privacy` is undrawn"* with
 *    `/account/privacy/export` and `/account/settings/delete` both unregistered.
 *    Shipping a download button here would also mean shipping a turnaround and a
 *    grace period, which are two of the things this build must never invent.
 *  · **The `semantic.info` reassurance panel.** `ga-125` tints "What we never
 *    share" with `info.bg`/`info.border`. TASTE §6 gives `bg.raised` five jobs
 *    and closes the list — *"One tint, five jobs … No other section-tinting
 *    exists (theme lock)"* — and a calm statement is not one of the info
 *    register's jobs either (§6's register table spends `info` on `Refunding`).
 *    So the three facts ship as content blocks in open space, which TASTE §1 puts
 *    in the "carries NEITHER" column and calls *"most of the premium read"*.
 *  · **A login history, a device list, a "last active" date, a privacy score.**
 *    None is drawn by `ga-125` and none exists; §14 by name.
 *
 * THE "SAFER DEFAULT" CHIP IS INK, NOT GREEN. `ga-125` draws `.safechip` as
 * `int-primary` on `int-subtle` inside a `border-brand` pill. §8 budgets the
 * signed-in guest web three brand roles and a chip is none of them, so the marker
 * ships through `RadioRow`'s own `aside` slot — 13/500 ink, no container, no
 * second component. It also lands inside the row's accessible name, so the fact
 * that one option is the safer one is spoken, not only coloured.
 *
 * SEEDING THE GROUPS IS THE ONE PLACE `RadioGroup`'S OWN RULE IS OVERRIDDEN, ON
 * PURPOSE. That component's props say *"`null` until the guest chooses. Never
 * seed a plausible default."* — a rule about the checkout, where a pre-picked
 * party type or payment rail is the build guessing on a guest's behalf. Here the
 * starting position is not a guess: it is published at `/legal/privacy#defaults`,
 * and rendering both groups unselected would make this screen contradict a page
 * the same site serves. The two values come from `../settings-model.ts` so the
 * hub row and this page cannot disagree (§5).
 *
 * SHAPE (§4c / TASTE §1). Four labelled sections separated by a hairline, no
 * cards. The two radiogroups are `fieldGroup` — bordered, no shadow, square
 * interior corners — because those ARE controls; everything below them is a
 * statement and carries neither.
 *
 * MOTION (§11). None beyond what the primitives carry: `RadioRow` ships
 * `tintTransition` (colour only, 120ms, no transform) and every link carries
 * `inlineAction`'s. Nothing on this page enters, reveals or staggers.
 *
 * GREEN (§8): none in the body. Two roles, both chrome. Selection is ink, links
 * are ink and underlined at rest, the glyphs are `text.secondary`.
 */

/** The three facts `#never` states, in the policy's own words. */
const NEVER_SHARED: readonly {
  readonly glyph: ReactNode;
  readonly title: string;
  readonly body: string;
}[] = [
  {
    glyph: <PinIcon className="size-5" />,
    title: "Your exact location is never shown before a booking is confirmed",
    body: "Until then, a home shows as a general neighbourhood.",
  },
  {
    glyph: <MessageIcon className="size-5" />,
    title: "Your phone and email are never shown to other members",
    body: "Messages go through SalamStay, so your contact details stay yours.",
  },
  {
    glyph: <LockIcon className="size-5" />,
    title: "Your personal information is never sold",
    body: "Not to advertisers, not to data brokers, not to anyone.",
  },
];

export function PrivacySettings() {
  const [visibility, setVisibility] = useState<ProfileVisibility>(PROFILE_VISIBILITY_DEFAULT);
  const [messaging, setMessaging] = useState<MessagingScope>(MESSAGING_SCOPE_DEFAULT);

  return (
    <>
      <AccountBackLink href="/account/settings">Settings</AccountBackLink>

      <AccountPageHead
        className="mt-5"
        title="Privacy"
        sub="Who can see you, who can reach you, and the three things SalamStay never shares."
      />

      <ExampleAccountStrip className="mt-6">
        Both choices below move and record nothing, and nobody can see a profile either way — there
        is no profile yet for them to see.
      </ExampleAccountStrip>

      <AccountSection
        id="visibility"
        heading="Who can see your profile"
        sub="You start on the more private choice, so you never have to go hunting through settings to be safe by default."
        className="mt-8"
      >
        <RadioGroup
          className="mt-5"
          name="profile-visibility"
          labelledBy="visibility-h"
          value={visibility}
          onChange={(next) => setVisibility(next as ProfileVisibility)}
        >
          <RadioRow
            value="hosts-you-book-with"
            label="Hosts you book with"
            hint="Only hosts of a stay you request or book can see your profile."
            aside="Safer default"
          />
          <RadioRow
            value="everyone"
            label="Everyone on SalamStay"
            hint="Any member can view your public profile — your name and photo."
          />
        </RadioGroup>
      </AccountSection>

      <AccountSection
        id="messaging"
        heading="Who can message you"
        sub="The same rule, applied to conversations: the narrower option is where you start."
        className="mt-8"
      >
        <RadioGroup
          className="mt-5"
          name="messaging-scope"
          labelledBy="messaging-h"
          value={messaging}
          onChange={(next) => setMessaging(next as MessagingScope)}
        >
          <RadioRow
            value="hosts-with-a-booking"
            label="Hosts with a booking"
            hint="Only a host you've requested or booked with can start a chat."
            aside="Safer default"
          />
          <RadioRow
            value="anyone"
            label="Anyone on SalamStay"
            hint="Any member can message you first."
          />
        </RadioGroup>

        {/*
          The sentence the policy attaches to BOTH options, lifted out of the
          rows so it is not read as a property of the wider one. §13: blocking is
          a boundary, not a verdict, and it is never styled as a warning.
        */}
        <p className="mt-4 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
          Either way, you can block anyone.
        </p>
      </AccountSection>

      <AccountSection
        id="blocking"
        heading="Blocking someone"
        sub="A boundary, not a verdict — it hides, it doesn't accuse."
        className="mt-8"
      >
        <p className="mt-5 max-w-[62ch] text-bodyMd font-regular leading-relaxed text-secondary">
          Someone you block cannot message you or book with you, they are{" "}
          <b className="font-semibold text-primary">never told</b> they were blocked, and you can
          unblock them whenever you like.
        </p>

        {/*
          The honest gap, in the shape `composer.tsx` uses for its Send: the
          reason, then the real next step. There is no `aria-disabled` control
          here to attach it to, because §12's other half applies — a row that
          lifts under the pointer and then does nothing is worse than one that
          never offered, so no row is offered. `/legal/privacy` is a built,
          indexable page and `#defaults` is a real anchor (`legal-page.tsx`
          renders `id={section.id}`), so the way onward actually goes somewhere.
        */}
        <p className="mt-4 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
          Blocking is not connected yet — there is no conversation to block from and no list being
          kept, so this page shows you no names and no count. The rule above is the one already
          written down.{" "}
          <Link href="/legal/privacy#defaults" className={`${inlineAction} font-medium`}>
            Read it in the Privacy Policy
          </Link>
          .
        </p>
      </AccountSection>

      <AccountSection
        id="never"
        heading="Kept private, always"
        sub="Three things are not settings you have to find. They are rules of the product, and they hold whichever choices you made above."
        className="mt-8"
      >
        {/*
          Content blocks, not rows in a bordered group and not a tinted panel:
          nothing here is a control, so a boundary drawn around them would be a
          boundary drawn around a statement. TASTE §1 — icon, title, body, open
          space. This is `../notifications/step.tsx`'s "Messages your bookings
          need" list, deliberately identical, because it is the same kind of
          block doing the same job one route over.
        */}
        <ul className="mt-6 flex flex-col gap-5">
          {NEVER_SHARED.map((fact) => (
            <li key={fact.title} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="flex size-10 flex-none items-center justify-center rounded-full border border-hairline bg-raised text-secondary"
              >
                {fact.glyph}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-bodyMd font-medium text-primary">{fact.title}</span>
                <span className="mt-1 block max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
                  {fact.body}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
          These three are written into the Privacy Policy in the same words, so they are not ours to
          quietly change.{" "}
          <Link href="/legal/privacy#never" className={`${inlineAction} font-medium`}>
            What we never share
          </Link>
          .
        </p>
      </AccountSection>
    </>
  );
}

export default PrivacySettings;
