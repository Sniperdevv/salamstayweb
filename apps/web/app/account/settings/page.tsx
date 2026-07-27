import type { Metadata } from "next";

import { CardIcon } from "@/components/booking/pay-glyphs";
import { PersonIcon } from "@/components/home-icons";
import { HelpIcon, LockIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/seo/metadata";

import {
  AccountBackLink,
  AccountPageHead,
  BellIcon,
  DocumentIcon,
  ExampleAccountStrip,
  FlagIcon,
  GlobeIcon,
  RowGroup,
  RowGroupLabel,
  SettingsRow,
  ShieldIcon,
} from "../account-chrome";
import { AccountIdentity } from "../account-identity";
import { SignOutButton } from "./sign-out-button";
import {
  INTERFACE_LANGUAGE,
  notificationHint,
  paymentHint,
  personalHint,
  privacyHint,
} from "./settings-model";

/**
 * `/account/settings` — GA-123 at web width, in `GUEST-SHELL.md` §5's sub-shell.
 *
 * §5 IS THE SPEC AND IT IS SHORT: *"A hub of sectioned rows, plus a back link on
 * every child. No sidebar."* Its three reasons are worth keeping in view while
 * reading this file, because each one is a thing that is absent below rather
 * than present: (a) no card on either side of the product draws a settings
 * sidebar, and inventing one is inventing chrome; (b) the only precedent for
 * in-app section navigation is `HOST-SHELL.md` §2b's horizontal strip, which
 * caps at six items on one line while this hub has nine; (c) **the hub already
 * is the navigation**, and a hub plus a sidebar is the same list twice.
 *
 * THE HINTS ARE THE HUB'S WHOLE JOB, AND THE TRAP IN IT
 * -----------------------------------------------------
 * §5 again: *"Every row spells out its current value as a hint … the hint must
 * be read from the same source of truth as the child page, or the hub
 * contradicts the screen it opens. **Never hard-code a hint.**"* Every stateful
 * hint below is imported from `./settings-model.ts`, which is the module the
 * children read too. `ga-123` hard-codes three of them and all three are wrong
 * here — the reasons are written out in that file, not repeated in this one.
 *
 * The rows that carry no state (Support, Legal, Privacy) carry a plain
 * description instead, which is what `ga-123` does for the same rows.
 *
 * WHAT IS ABSENT FROM `ga-123`, AND WHY
 * --------------------------------------
 *  · **Data saver.** §5: *"Data saver (`ga-081`) is app-only (`SCREENS.md` row:
 *    `app`, no web rendering) and does not appear in the web hub."*
 *  · **The version footer** (`Version 1.4.0 · Android`). §13: app chrome, and
 *    TASTE §11.20 bans version stamps outright.
 *  · **Uppercase group captions.** `ga-123`'s `.scap` is the `overline` token,
 *    which TASTE §7 rules is a form-label and *"NEVER a section eyebrow. Zero
 *    eyebrows, everywhere."* See `RowGroupLabel`.
 *  · **Security and Data & privacy rows.** §5 records that `ga-079`/`ga-080`
 *    have web routes in `SCREENS.md` but no row in `ga-123`, and that which
 *    group they join is undrawn — it is one of the file's own Unresolved items.
 *    Adding them here would be answering it silently.
 *
 * GREEN (§8). Two roles, both chrome: the wordmark dot and the header avatar.
 * The hub spends none — every row is ink, every chevron is `text.tertiary`, and
 * `Sign out` is an outline. Role 3 is structurally unspent.
 *
 * ROUTE CONTRACT (§2): `noindex, follow` from `../layout.tsx` and the registry
 * row; no canonical, no hreflang, no JSON-LD, no breadcrumb; `<main
 * class="co-main">` from the layout; one `<h1>` — title `Settings —
 * SalamStay`, `<h1>` `Settings` (G43).
 */
export const metadata: Metadata = pageMetadata("/account/settings");

export default function AccountSettingsPage() {
  return (
    <>
      {/* §5: *"Back is the hub."* One level up from the hub is the account root
          — `HOST-SHELL.md` §15's general form: back returns to the last state
          that still exists. */}
      <AccountBackLink href="/account">Your account</AccountBackLink>

      <AccountPageHead
        className="mt-5"
        title="Settings"
        sub="Your details, how SalamStay reaches you, and where the rules are written down."
      />

      <ExampleAccountStrip className="mt-6">
        The name below is written into the site, and every setting is showing its starting state — nothing you change here is saved.
      </ExampleAccountStrip>

      {/* §5's identity summary row, and the one link to `/account/profile` in
          the tree — `/account` deliberately does not double it while the
          question of what that route is stays open (see `app/account/page.tsx`). */}
      <AccountIdentity
        className="mt-6"
        href="/account/profile"
        sub="See your profile and how others see you"
      />

      <RowGroupLabel id="group-account" className="mt-8">
        Account
      </RowGroupLabel>
      <RowGroup labelledBy="group-account" className="mt-3">
        <SettingsRow
          href="/account/settings/personal"
          icon={<PersonIcon className="size-5" />}
          title="Personal info"
          hint={personalHint}
        />
        <SettingsRow
          href="/account/settings/payment"
          icon={<CardIcon className="size-5" />}
          title="Payment methods"
          /* `ga-123` puts `HBL •••• 8842 · 2 more saved` here. A masked tail is
             still an instrument, and §14 rules account data a fabrication until
             a record exists. Derived from an empty list instead. */
          hint={paymentHint}
        />
        <SettingsRow
          href="/account/settings/notifications"
          icon={<BellIcon className="size-5" />}
          title="Notifications"
          hint={notificationHint}
        />
      </RowGroup>

      <RowGroupLabel id="group-preferences" className="mt-8">
        Preferences
      </RowGroupLabel>
      <RowGroup labelledBy="group-preferences" className="mt-3">
        <SettingsRow
          href="/account/settings/accessibility"
          icon={<GlobeIcon className="size-5" />}
          title="Language and accessibility"
          hint={INTERFACE_LANGUAGE}
        />
        <SettingsRow
          href="/account/settings/privacy"
          icon={<ShieldIcon className="size-5" />}
          title="Privacy"
          /* The row carried a plain description while the page was unbuilt,
             which §5 permits for a row with no state to read. The page now ships
             two real defaults, so the hint states them — derived in
             `./settings-model.ts` from the same two constants the page seeds its
             radiogroups with, never retyped. `ga-125`'s own hint ("Messaging
             limited to your hosts · Trip safety on") is still not copied: half
             of it names a surface that does not exist. */
          hint={privacyHint}
        />
      </RowGroup>

      <RowGroupLabel id="group-support" className="mt-8">
        Support
      </RowGroupLabel>
      <RowGroup labelledBy="group-support" className="mt-3">
        <SettingsRow
          href="/help"
          icon={<HelpIcon className="size-5" />}
          title="Help centre"
          /* `ga-123` writes "Guides & support in Urdu and English". §13 makes
             claim 8 the only permitted statement about support, byte-exact, so
             this describes the destination instead of characterising the
             service. */
          hint="Guides and answers about booking, paying and hosting"
        />
        <SettingsRow
          href="/help/report"
          icon={<FlagIcon className="size-5" />}
          title="Report a problem"
          hint="Tell us what happened"
        />
      </RowGroup>

      <RowGroupLabel id="group-legal" className="mt-8">
        Legal
      </RowGroupLabel>
      <RowGroup labelledBy="group-legal" className="mt-3">
        <SettingsRow
          href="/legal/terms"
          icon={<DocumentIcon className="size-5" />}
          title="Terms of Service"
          hint="The agreement for using SalamStay"
        />
        <SettingsRow
          href="/legal/privacy"
          icon={<LockIcon className="size-5" />}
          title="Privacy Policy"
          hint="What we collect, why, and who it goes to"
        />
      </RowGroup>

      <SignOutButton className="mt-8" />
    </>
  );
}
