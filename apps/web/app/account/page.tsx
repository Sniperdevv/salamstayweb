import type { Metadata } from "next";

import { iconStroke } from "@salamstay/design-tokens/icons";
import { ShieldCheckIcon } from "@/components/home-icons";
import { CalendarIcon, HeartIcon, MessageIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/seo/metadata";

import {
  AccountPageHead,
  ExampleAccountStrip,
  RowGroup,
  RowGroupLabel,
  SettingsRow,
  SlidersIcon,
} from "./account-chrome";
import { AccountIdentity } from "./account-identity";

/**
 * `/account` — the account-menu's target, and the one surface in this tree the
 * corpus never drew.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT THIS PAGE IS *NOT*, AND WHY THAT IS THE WHOLE DESIGN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `GUEST-SHELL.md` closes with an explicit Unresolved item about this route:
 *
 *   > **Whether `/account` and `/account/profile` are the same page.**
 *   > `web-header-footer.html` and `account-menu.tsx` send the account control
 *   > to `/account`; `ga-122` draws the profile hub at `/account/profile`. Both
 *   > are registered. Either `/account` redirects to `/account/profile`, or it
 *   > is a distinct landing the corpus never drew. **Nothing in the corpus
 *   > says**, and picking one silently would strand whichever card is wrong.
 *
 * So this page does not answer it. It does not `redirect()` to
 * `/account/profile` — that decides the question by shipping it — and it does
 * not reproduce `ga-122`, which would build the profile hub at the wrong route.
 * What it does is the only thing that is true either way: **name the person from
 * the one record that exists, and route to the parts of the account that do.**
 * If the question is later settled as "redirect", this file becomes three lines;
 * if it is settled as "a distinct landing", this is it.
 *
 * WHAT `ga-122` DRAWS THAT IS DELIBERATELY ABSENT
 * -----------------------------------------------
 *  · **The stat pair** — "Since <span class=num>2026</span> · On SalamStay" and
 *    "<span class=num>3</span> trips · Completed". §14: *"'Since 2026', '3
 *    trips', travel stamps, years on SalamStay. Facts about a person's record,
 *    honest only when read from one."* There is no record. Suppressed, not
 *    zeroed and not dashed (TASTE §12).
 *  · **"<span class=num>3</span> completed" as the Trips row's hint** — the same
 *    fabrication one level down. The hint says what the surface holds instead.
 *  · **The five-tab bar.** §3: it is a phone component and does not cross to
 *    web; its five destinations are already reachable from the header's account
 *    menu, and a second persistent nav would put two navigations on one page for
 *    one set of destinations.
 *  · **The version line** (`Version 1.4.0 · Android`). §13 and TASTE §11.20 —
 *    zero version stamps; it is app chrome and does not cross.
 *  · **`Sign out`.** `ga-122` draws it here and `ga-123` draws it on the hub.
 *    §5 puts it on the hub, so it lives there and only there — one sign-out in
 *    the product body, plus the account menu's own `Log out`.
 *  · **`/account/profile{,/view,/edit}` links.** Three hrefs to three unbuilt
 *    surfaces, in service of the undecided question above. §5 requires the hub's
 *    identity row to route to `/account/profile`, so that one link exists — once
 *    — on `/account/settings`. It is not doubled here.
 *
 * GREEN (§8). Two roles on this page and no more: the wordmark dot and the
 * header avatar's fill, both of them chrome. The body spends none — there is no
 * primary CTA, because a landing whose job is to route somewhere has no single
 * call. Role 3 is left structurally unspent rather than excepted, exactly as §3
 * leaves role 2 unspent by removing the search pill.
 *
 * ROUTE CONTRACT (§2): `noindex, follow` from `./layout.tsx` and again off the
 * registry row here; no canonical, no hreflang, no JSON-LD, no breadcrumb;
 * `<main class="co-main">` from the layout; one `<h1>`, paired with the
 * registered title for G43 — title `Your account — SalamStay`, `<h1>` `Your
 * account`.
 */
export const metadata: Metadata = pageMetadata("/account");

export default function AccountPage() {
  return (
    <>
      <AccountPageHead
        title="Your account"
        sub="Your details and settings, and the way in to everything you have on SalamStay."
      />

      <ExampleAccountStrip className="mt-6">
        The name and mark below are written into the site, and nothing here signs anyone in or out.
      </ExampleAccountStrip>

      {/*
        A statement, not a control. The hub's identity row is the one that routes
        to `/account/profile` (§5); this one has nowhere to go that is decided,
        so it does not pretend to.
      */}
      <AccountIdentity className="mt-6" sub="The name and verification on this account." />

      <RowGroupLabel id="account-rows" className="mt-8">
        Account
      </RowGroupLabel>
      <RowGroup labelledBy="account-rows" className="mt-3">
        <SettingsRow
          href="/account/settings"
          icon={<SlidersIcon className="size-5" />}
          title="Settings"
          /* What the hub contains, not what is set in it. §5's "spell out the
             current value" rule belongs to the hub's own rows, where each hint
             has exactly one child page to agree with; a summary of nine rows
             would either chain `·` separators (TASTE §7 allows one per gap) or
             pick a favourite. */
          hint="Personal info, payments, notifications, privacy and the legal pages"
        />
        <SettingsRow
          href="/account/verification"
          icon={<ShieldCheckIcon className="size-5" />}
          title="Verification"
          /* The one real fact about this person, read from `SESSION_ACCOUNT`
             through the identity block above rather than retyped — see
             `AccountIdentity`. No date, no expiry, no document list (§14). */
          hint="What SalamStay has confirmed, and what a host is shown"
        />
      </RowGroup>

      <RowGroupLabel id="travelling-rows" className="mt-8">
        Travelling
      </RowGroupLabel>
      <RowGroup labelledBy="travelling-rows" className="mt-3">
        <SettingsRow
          href="/trips"
          icon={<CalendarIcon className="size-5" />}
          title="Trips"
          hint="Stays you have booked, with your dates and receipts"
        />
        <SettingsRow
          href="/messages"
          icon={<MessageIcon className="size-5" />}
          title="Messages"
          hint="Conversations with the hosts you booked with"
        />
        <SettingsRow
          href="/wishlists"
          icon={<HeartIcon stroke={iconStroke.regular} className="size-5" />}
          title="Wishlists"
          hint="Stays you saved while looking"
        />
      </RowGroup>
    </>
  );
}
