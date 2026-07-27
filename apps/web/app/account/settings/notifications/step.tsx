"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { CalendarIcon, LockIcon, MessageIcon } from "@/components/icons";
import { inlineAction } from "@/components/ui";
import { SwitchRow } from "@/components/ui/switch-row";

import {
  AccountBackLink,
  AccountPageHead,
  AccountSection,
  ExampleAccountStrip,
  OffersIcon,
} from "../../account-chrome";
import {
  MARKETING_OPT_IN_DEFAULT,
  TRANSACTIONAL_CHANNELS,
  TRANSACTIONAL_KINDS,
  type TransactionalGlyph,
} from "../settings-model";

/** The model carries glyph ids so it can stay JSX-free; this is the map. */
const GLYPH: Readonly<Record<TransactionalGlyph, ReactNode>> = {
  booking: <CalendarIcon className="size-5" />,
  message: <MessageIcon className="size-5" />,
  code: <LockIcon className="size-5" />,
};

/**
 * GA-069 — notification preferences, in `GUEST-SHELL.md` §4c's form frame.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THIS PAGE IS NOT A COSMETIC TOGGLE SCREEN. IT IS A CONSENT SURFACE, AND THE
 *  SHIPPED PRIVACY POLICY ALREADY SAYS WHAT IT HAS TO SAY.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `lib/content/legal/privacy.ts` — the indexable Privacy Policy this site
 * serves at `/legal/privacy` — carries a section called *"Messages: what's
 * needed, and what's optional"*, written against `ga-076`, and closes it with a
 * callout naming PECA:
 *
 *   > This meets Pakistan's Electronic Crime Act (PECA) rules for consent:
 *   > transactional messages are disclosed plainly, and marketing is opt-in
 *   > only. Change this anytime in **Notification & channel preferences**.
 *
 * That last sentence names *this screen* as where the choice is made. So the
 * screen is not free to invent its own model; it has to be the shape the policy
 * promises, or a guest reads one contract on a public page and meets a different
 * one behind their login. The two divergences from `ga-069` both follow from it
 * and are argued in full in `../settings-model.ts`:
 *
 *  1. **The transactional channels carry no switch.** The policy marks WhatsApp
 *     and SMS `locked: true` — *"These two **stay on** — they carry the messages
 *     every booking needs."* A control that cannot be turned off is a lie about
 *     who decides, and three immovable switches would also invite the read that
 *     the reader had consented to something. They are stated as a fact with the
 *     reason attached, which is what "disclosed plainly" means.
 *  2. **One control, marketing, OFF.** *"Off unless you turn it on. Turning it
 *     on is entirely your choice, and never needed to book or host."* Opt-in
 *     means an affirmative act, so nothing on this page arrives pre-ticked —
 *     `MARKETING_OPT_IN_DEFAULT` is a constant, not a seedable default.
 *
 * `Push` is absent entirely. `ga-069` offers it because it is drawn inside a
 * phone frame with an app around it; there is no SalamStay app to receive a push
 * and no web-push registration on this site, so listing it would be offering a
 * delivery route that does not exist.
 *
 * **Quiet hours is not built, and that is a deferral rather than a cut.** The
 * only definition the corpus gives it is `ga-069`'s *"Prayer-time quiet
 * hours … hold non-urgent notifications during prayer times"*, and
 * `REPOSITIONING.md` retires prayer times from the product outright — they are
 * not modelled, not filtered on, not badged. A replacement window (10pm to 7am,
 * or anything else) is undrawn, and picking one here would be inventing a
 * product default on a legal surface. Reported, not improvised.
 *
 * SHAPE (§4c / TASTE §1). Two labelled sections separated by a hairline, no
 * cards, no plates: the three always-on kinds are icon + title + body in open
 * space, which §1 puts in the "carries NEITHER" column and calls *"most of the
 * premium read"*. The one switch is `SwitchRow` — imported, not rebuilt (§15) —
 * whose on-state is INK, never brand green, and whose three signals are the
 * knob's position, the track's weight and a second line that is rewritten by
 * state. Colour is never the only signal.
 *
 * GREEN (§8): none in the body. Two roles, both chrome.
 */
export function NotificationPreferences() {
  const [offers, setOffers] = useState(MARKETING_OPT_IN_DEFAULT);

  return (
    <>
      <AccountBackLink href="/account/settings">Settings</AccountBackLink>

      <AccountPageHead
        className="mt-5"
        title="Notifications"
        sub="What SalamStay sends you, why it sends it, and the one thing that is yours to choose."
      />

      <ExampleAccountStrip className="mt-6">
        The switch below moves but records nothing — there is no account to record a choice
        against, and no message is sent either way.
      </ExampleAccountStrip>

      <AccountSection
        id="needed"
        heading="Messages your bookings need"
        sub={
          <>
            These go out on {TRANSACTIONAL_CHANNELS} if WhatsApp cannot reach you. They carry the
            messages every booking needs, so they stay on — and you are always told why before one
            arrives.
          </>
        }
        className="mt-8"
      >
        {/*
          Content blocks, not rows in a bordered group: nothing here is a
          control, so a form-group container would draw a boundary round a
          statement. TASTE §1 — icon, title, body, open space.
        */}
        <ul className="mt-6 flex flex-col gap-5">
          {TRANSACTIONAL_KINDS.map((kind) => (
            <li key={kind.title} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="flex size-10 flex-none items-center justify-center rounded-full border border-hairline bg-raised text-secondary"
              >
                {GLYPH[kind.glyph]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-bodyMd font-medium text-primary">{kind.title}</span>
                <span className="mt-1 block max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
                  {kind.body}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </AccountSection>

      <AccountSection
        id="offers"
        heading="Offers and tips"
        sub="Occasional deals and travel ideas, by WhatsApp or SMS. This is marketing, and it is the only thing on this page you turn on."
        className="mt-8"
      >
        {/*
          One switch, off, in a bordered form group — this one IS a control, so
          §6's grouped-row idiom applies where it did not above. `SwitchRow`
          draws its own top hairline via `first:border-t-0`, so the group is a
          plain bordered box round a single row.
        */}
        <div className="mt-6 overflow-hidden rounded-lg border border-hairline bg-canvas px-4">
          <SwitchRow
            checked={offers}
            onChange={setOffers}
            name="offers-and-tips"
            icon={<OffersIcon className="size-5" />}
            label="Send me offers and tips"
            descriptionOn="On. Deals and travel ideas will come by WhatsApp or SMS. Turn it off here whenever you like."
            descriptionOff="Off. Nothing about deals or travel ideas is sent until you turn this on."
            describedBy="offers-consent"
          />
        </div>

        <p
          id="offers-consent"
          className="mt-5 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary"
        >
          Turning this on is entirely your choice, and it is never needed to book or host. It is
          built this way to meet Pakistan&rsquo;s Electronic Crime Act (PECA) rules for consent:
          the messages your bookings need are disclosed plainly, and marketing is opt-in only.{" "}
          <Link href="/legal/privacy" className={`${inlineAction} font-medium`}>
            Read the same rule in the Privacy Policy
          </Link>
          .
        </p>
      </AccountSection>
    </>
  );
}

export default NotificationPreferences;
