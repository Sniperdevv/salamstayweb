import type { Metadata } from "next";
import Link from "next/link";

import { iconStroke } from "@salamstay/design-tokens/icons";

import { btnSecondary, inlineAction } from "@/components/ui";
import { EmptyState } from "@/components/ui/empty-state";
import { pageMetadata } from "@/lib/seo/metadata";

import {
  AccountBackLink,
  AccountPageHead,
  AccountSection,
  ExampleAccountStrip,
} from "../account-chrome";
import { AccountIdentity } from "../account-identity";
import {
  PROFILE_VISIBILITY_DEFAULT,
  type ProfileVisibility,
} from "../settings/settings-model";

/**
 * `/account/profile` — `GA-122` and `GA-128`, as ONE page.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE PROFILE IS THE VIEW. IT IS NOT A SECOND HUB, AND THAT IS THE DECISION.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `GUEST-SHELL.md` §1a lists three routes here: `/account/profile` (the `ga-122`
 * hub), `/account/profile/view` (the `ga-128` public preview) and
 * `/account/profile/edit` (the `ga-129` editor). Two of those three ship as one
 * page, and the reason is that the first one has nothing left to do on web.
 *
 * `ga-122` is a PHONE TAB DESTINATION. Its whole content is a routing shell —
 * an identity card, five chevron rows (View profile · Edit profile · Settings ·
 * Trips · Reviews), a language segmented control and Sign out — because on a
 * phone the Profile tab is the only door to any of it. On web every one of those
 * doors already exists somewhere else and is already built:
 *
 *   · Settings, Trips, Messages, Wishlists, Verification → `/account`'s own row
 *     groups, plus the header's account menu, which carries the same set.
 *   · Sign out → `/account/settings` (§5 puts it there), plus the account
 *     menu's own `Log out`. `app/account/page.tsx` already refused to draw a
 *     third one.
 *   · Language → the header's language switch (§3), which arrives with the
 *     chrome on every route.
 *   · "View your profile" → the page you are reading.
 *
 * So a `ga-122` hub at this route would be `/account`'s list a second time, one
 * level down, with one row that is not a duplicate. §5 refuses a settings
 * sidebar in exactly those words — *"the hub already **is** the navigation, and
 * a hub plus a sidebar is the same list twice"* — and the same sentence decides
 * this. What survives from `ga-122` is the one thing that is not a duplicate:
 * its identity card, and its promise that tapping it shows *exactly what hosts
 * see*. That promise is `ga-128`, so `ga-128` is what this route renders.
 *
 * `/account/profile/view` is therefore NOT minted. A route whose content is
 * identical to its parent is a second URL for one document, and the only reason
 * the corpus needs it is the tab bar that does not cross to web (§3). Reported
 * rather than registered: nothing links it, and `SCREENS.md` can retire the row
 * or keep it as an app-only rendering.
 *
 * WHAT THIS PAGE ACTUALLY SHOWS, AND WHAT IT REFUSES TO
 * -----------------------------------------------------
 * Two facts, and both are read rather than typed: the name and the ink
 * verification mark from `SESSION_ACCOUNT`, drawn by `AccountIdentity`. That is
 * the whole of what SalamStay holds about a person (`lib/mode.ts`: *"there is no
 * stored user, no stored token and no stored expiry, because none of those
 * exist"*), so everything `ga-128` draws around them is suppressed:
 *
 *  · **"Since 2026" and "3 trips".** §14 names both by string: *"'Since 2026',
 *    '3 trips', travel stamps, years on SalamStay. Facts about a person's
 *    record, honest only when read from one."* Suppressed, not zeroed and not
 *    dashed (TASTE §12).
 *  · **Travel stamps.** Same list, same sentence. A stamp is a completed stay
 *    and `/trips` is empty.
 *  · **The reviews preview and its star ratings.** §14 again, naming `ga-128`
 *    directly: *"star ratings and review counts. There are zero real reviews."*
 *    `/account/profile/reviews` shipped this morning proving the point at
 *    length; this page links it and renders no card, no count and no star.
 *  · **The about-prompt rows** — intro, interests, lives in, languages, work,
 *    school. Nobody filled them, nothing stores them, and a row rendered from a
 *    field nobody filled is the fabrication with a label on it.
 *  · **A profile-completeness meter, a "profile strength" score, a percentage.**
 *    Drawn by no card and invented by nothing. There is no scale to be a
 *    fraction of.
 *  · **A verification DATE.** `ga-128`'s detail sheet says "Verified since March
 *    2026". The mark is real; the date is not held.
 *  · **A photo.** See `./edit/step.tsx`, which owns that position because the
 *    editor is where a reader goes to act on it.
 *
 * The initials avatar is NOT a missing-photo state and is never drawn as one
 * (§6, `ga-129`, DESIGN §9-J/§10.7): an initials avatar and a set photo are the
 * same first-class treatment.
 *
 * GREEN (§8). Two roles on this page, both chrome: the wordmark dot and the
 * header avatar's fill. The body spends none — the one action is the TASTE §5
 * gray-fill secondary, which is where §5 puts *"Edit"* by name, and every link
 * is ink and underlined at rest. That keeps the whole `/account` tree at zero
 * brand green, which is what lets `lib/seo/route-registry.ts` say no row of it
 * belongs in `components/header-cta.ts` and `Sign up` never has to yield.
 *
 * ELEVATION (§9). The identity block carries a border and no shadow; the empty
 * state carries neither; sections are separated by a hairline and a heading,
 * never by a card (TASTE §1's "carries NEITHER" column).
 *
 * MOTION (§11). None of its own. The identity block and the one button carry
 * press feedback from `pressableSurface` and `pressable`; nothing on this page
 * enters, staggers or reveals.
 *
 * ROUTE CONTRACT (§2): `noindex, follow` from `../layout.tsx` and again off the
 * registry row; no canonical, no hreflang, no JSON-LD, no breadcrumb;
 * `<main class="co-main">` and the 640 column from that layout, so this file
 * returns a fragment. One `<h1>`, paired with the registered title for G43 —
 * title `Your profile — SalamStay`, `<h1>` `Your profile`.
 *
 * The registry row is `stub("/account/profile", "Your profile — SalamStay")`.
 * `pageMetadata` reads the title off a stub row exactly as it does off a
 * `page()` row, so flipping it — a central edit, reported and not made here —
 * changes nothing in this file.
 */
export const metadata: Metadata = pageMetadata("/account/profile");

/**
 * The about-prompts this profile is sharing.
 *
 * Empty, and a **declared constant rather than an assumed absence** — the shape
 * `SAVED_PAYMENT_METHODS` and `DOCUMENTS_IN_REVIEW` already take one and two
 * routes over, for the reason both of them give: the day a profile store
 * arrives, the filled state is a missing `else` rather than a rewrite of the
 * page. What a filled entry would hold is the editor's field set — an intro,
 * interests, where you live, the languages you speak, work, school — each with
 * the per-item visibility `ga-129` gives it, and only the shown ones reaching
 * this list.
 *
 * There is nothing to read it from, so what this buys is one place to point at.
 */
const SHARED_ABOUT_FIELDS: readonly { readonly label: string; readonly value: string }[] = [];

/**
 * The empty state's mark: an eye, and it names the SECTION rather than the
 * missing content.
 *
 * `/host/insights` states the rule this follows — *"It names the SECTION, not
 * the missing content: a bar chart is what 'Insights' is about […] It promises
 * no chart."* This page's subject is what other people can see of you, and an
 * eye is what that is about. It promises no field.
 *
 * The three alternatives were all worse, and each for a specific reason.
 * `PersonIcon` is the obvious reach and is already spent eight lines above, in
 * the avatar disc: two person marks in one column reads as two people.
 * `MessageIcon` is the Messages row's glyph on `/account` and in the account
 * menu. A pencil names the ACTION, which is the button's job, not the disc's.
 *
 * The path is `ga-079`'s own eye, which is the only eye the corpus draws;
 * `ga-129` draws its hidden-stamp marker as the struck-through form of the same
 * shape, so the vocabulary is already the corpus's. `app/account/settings/
 * security/step.tsx` draws it a second time for its reveal control — two
 * folders, no shared module between them, and `account-chrome.tsx` records the
 * same call for `LogOutIcon`. Merge candidate for `components/icons.tsx`,
 * flagged rather than made: that file is chrome-shared and owned elsewhere in
 * this wave.
 *
 * Decorative — it always sits above a real heading — so `aria-hidden`.
 */
function EyeIcon({ className }: { readonly className?: string }) {
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
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/**
 * Who each privacy setting lets in, phrased to complete "It starts limited to
 * ___". A `Record` keyed by the type rather than a sentence with one option
 * written into it: adding a third audience to `ProfileVisibility` fails this
 * file at the type level instead of leaving a stale claim on a live page.
 *
 * The strings are `/account/settings/privacy`'s own row hints, said as prose.
 * That page's `VISIBILITY_HINT` is shaped for a hub row ("Profile: hosts you
 * book with") and does not fit a sentence, which is the only reason this map
 * exists rather than an import.
 */
const VISIBILITY_AUDIENCE: Readonly<Record<ProfileVisibility, string>> = {
  "hosts-you-book-with": "hosts of a stay you book",
  everyone: "any member of SalamStay",
};

const sectionBody = "mt-3 max-w-[62ch] text-bodyMd font-regular leading-relaxed text-secondary";

export default function AccountProfilePage() {
  return (
    <>
      {/*
        `/account`, not `/account/settings`, though the settings hub's identity
        row is currently the only link into this page. §5 and `HOST-SHELL.md`
        §15 state the rule as *"Back returns to the last state that still
        exists"* — the account root is this route's parent, is where the header's
        account menu sends every reader, and is the surface a Profile row belongs
        on now that there is a profile to open. That row is one line in
        `app/account/page.tsx`, which is outside this wave's folders; it is
        reported rather than made.
      */}
      <AccountBackLink href="/account">Your account</AccountBackLink>

      <AccountPageHead
        className="mt-5"
        title="Your profile"
        sub="What a host sees when you book, and the parts of it you choose to share."
      />

      <ExampleAccountStrip className="mt-6">
        The name and mark below are written into the site. Nothing else is stored, so what you write
        in the editor stays on that page.
      </ExampleAccountStrip>

      {/*
        A statement, not a control. `/account/settings`'s identity row is the one
        that routes HERE (§5); this block is the destination, so it has nowhere
        left to go.
      */}
      <AccountIdentity className="mt-6" sub="Shown to a host when you book." />

      {/*
        §12's four-part recipe from the shared component. `ga-128`'s own truth
        line — *"Only what Fatima chose to share is shown here"* — is the shape
        of the body: it says what governs this page rather than apologising for
        it being short.

        `heading="h2"` because the `.pagehead` above already carries the `<h1>`
        (G30). The action is the TASTE §5 gray-fill secondary and NOT a green
        pill; see the file header on the tree's green budget.
      */}
      {SHARED_ABOUT_FIELDS.length === 0 ? (
        <EmptyState
          /*
            THE HAIRLINE IS NOT DECORATION. `/account/verification` found this
            one screen over and wrote it down: with an identity block sitting
            between the `.pagehead` and the empty state, the component's 48px
            `pt-12` reads as a gap in the page rather than as the top of a
            section. §4a/§4b supply the fix — sections are separated by a
            hairline and a heading, never by a card — and the heading this one
            gets is the `h2` inside it.
          */
          className="mt-8 border-t border-hairline"
          glyph={<EyeIcon className="size-7" />}
          title="Nothing shared yet"
          /* §12.3: ONE factual sentence, ≤ 25 words, saying what this surface
             will hold. 21 here, and it names the fields in the editor's own
             order so a reader arrives at that page recognising them. It does
             not restate what a host sees — the section below owns that, and a
             page that says the same thing twice in 200px reads as padding. */
          body="An intro, where you live and the languages you speak would appear here, and none of them has been added yet."
          action={
            <Link href="/account/profile/edit" className={btnSecondary}>
              Edit your profile
            </Link>
          }
        />
      ) : null}

      <AccountSection id="host-sees" heading="What a host sees">
        {/*
          One sentence and one link. `/account/verification` owns the full
          answer — what the CNIC check covers, what is masked, what a document
          does and does not reach — and reproducing any of it here would give the
          site two copies of a §5-claim-bearing statement, which is the drift
          that page was written to prevent one level up.
        */}
        <p className={sectionBody}>
          Your name and the verification mark above, with your CNIC number masked. A host never sees
          a document.{" "}
          <Link href="/account/verification" className={`${inlineAction} font-medium`}>
            What your verification covers
          </Link>
        </p>

        {/*
          The second half of "who sees this", and the one page that answers it.

          THE AUDIENCE IS READ, NOT RETYPED. §5's rule for a hub hint is a
          correctness rule and it generalises: *"the hint must be read from the
          same source of truth as the child page, or the hub contradicts the
          screen it opens. **Never hard-code a hint.**"* This sentence makes the
          same claim a hub row makes, so it takes the same discipline —
          `PROFILE_VISIBILITY_DEFAULT` comes from `settings-model.ts`, which is
          the module `/account/settings` and `/account/settings/privacy` both
          read, and the phrase is selected by it rather than written under it.
          Change the default and this page changes with it.
        */}
        <p className={sectionBody}>
          Who else can open your profile is a setting of its own. It starts limited to{" "}
          {VISIBILITY_AUDIENCE[PROFILE_VISIBILITY_DEFAULT]}.{" "}
          <Link href="/account/settings/privacy" className={`${inlineAction} font-medium`}>
            Choose who can see you
          </Link>
        </p>
      </AccountSection>

      {/*
        Named, and deliberately not previewed. `ga-128` draws two review cards
        with a five-star row on each; §14 lists that card by number for exactly
        this, and `/account/profile/reviews` is the surface that proves there are
        none. A link to a real, built page rather than a section that would have
        to render its own empty state a second time.
      */}
      <AccountSection id="reviews" heading="Reviews" className="mt-8">
        <p className={sectionBody}>
          After a stay ends your host writes about you and you write about the home, and both appear
          on this profile. Neither has happened yet.{" "}
          <Link href="/account/profile/reviews" className={`${inlineAction} font-medium`}>
            Your reviews
          </Link>
        </p>
      </AccountSection>
    </>
  );
}
